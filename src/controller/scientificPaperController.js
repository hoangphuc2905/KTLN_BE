const ScientificPaper = require("../models/ScientificPaper");
const PaperAuthor = require("../models/PaperAuthor");
const PaperViews = require("../models/PaperViews");
const PaperDownloads = require("../models/PaperDownloads");
const { v4: uuidv4 } = require("uuid");
const { default: mongoose } = require("mongoose");
const Role = require("../models/Role");
const Lecturer = require("../models/Lecturer");
const messagesController = require("./messagesController"); // Import messagesController
const { uploadFileToCloudinary } = require("./fileCloudinaryController"); // Import hàm uploadFileToCloudinary

const scientificPaperController = {
  createScientificPaper: async (req, res) => {
    const session = await ScientificPaper.startSession();
    session.startTransaction();

    try {
      // Lấy bài báo gần nhất dựa trên paper_id (chuyển đổi sang số)
      const lastPaper = await ScientificPaper.findOne().sort({ paper_id: -1 });

      // Tạo mã bài báo mới
      let newPaperId;
      if (lastPaper && lastPaper.paper_id) {
        const lastIdNumber = parseInt(lastPaper.paper_id, 10) || 0;
        newPaperId = String(lastIdNumber + 1).padStart(6, "0");
      } else {
        newPaperId = "000001";
      }

      // Upload file lên Cloudinary
      let fileUrl = null;
      if (req.file) {
        const folderName = "scientific_papers"; // Tên thư mục trên Cloudinary
        fileUrl = await uploadFileToCloudinary(req.file.path, folderName); // Upload file và lấy URL
      }

      // Tạo bài báo mới
      const scientificPaper = new ScientificPaper({
        ...req.body,
        paper_id: newPaperId,
        file_url: fileUrl, // Lưu URL của file vào cơ sở dữ liệu
        author: [],
      });

      await scientificPaper.save({ session });

      // Xử lý danh sách tác giả
      const authorIds = [];
      let senderUserId = null; // Biến để lưu `user_id` của người gửi
      if (Array.isArray(req.body.author)) {
        for (const authorData of req.body.author) {
          const newAuthor = new PaperAuthor({
            ...authorData,
            paper_id: scientificPaper._id, // Gán paper_id của bài báo
          });
          const savedAuthor = await newAuthor.save({ session });
          authorIds.push(savedAuthor._id); // Lưu ObjectId của tác giả

          // Lấy `user_id` của tác giả đầu tiên làm người gửi
          if (!senderUserId) {
            senderUserId = savedAuthor.user_id;
          }
        }
      }

      // Cập nhật danh sách tác giả vào bài báo
      await ScientificPaper.updateOne(
        { _id: scientificPaper._id },
        { $set: { author: authorIds } },
        { session }
      );

      // Tạo bản ghi mới cho views
      const newViews = new PaperViews({
        view_id: new mongoose.Types.ObjectId(),
        paper_id: scientificPaper._id,
        view_time: new Date(),
      });
      await newViews.save({ session });

      // Tạo bản ghi mới cho downloads
      const newDownloads = new PaperDownloads({
        download_id: new mongoose.Types.ObjectId(),
        paper_id: scientificPaper._id,
        download_time: new Date(),
      });
      await newDownloads.save({ session });

      // Cập nhật views và downloads vào bài báo
      await ScientificPaper.updateOne(
        { _id: scientificPaper._id },
        { $set: { views: newViews._id, downloads: newDownloads._id } },
        { session }
      );

      // **Gửi thông báo tới các vai trò trong khoa**
      const departmentId = req.body.department; // Lấy khoa từ request body
      const roleNames = [
        "head_of_department",
        "deputy_head_of_department",
        "department_in_charge",
      ]; // Các vai trò cần gửi thông báo

      // Tìm các vai trò tương ứng
      const roles = await Role.find({ role_name: { $in: roleNames } });

      // Tìm giảng viên thuộc khoa và có vai trò phù hợp
      const lecturers = await Lecturer.find({
        department: departmentId,
        roles: { $in: roles.map((role) => role._id) },
      });

      for (const lecturer of lecturers) {
        const messageData = {
          message_id: uuidv4(), // Tạo ID duy nhất cho thông báo
          message_type: "Request for Approval", // Đặt loại thông báo là "Yêu cầu duyệt"
          status: "Pending Response",
          sender_id: senderUserId, // Sử dụng `user_id` của tác giả đầu tiên làm người gửi
          sender_model: "Student", // Model của người gửi là `Student`
          receiver_id: lecturer.lecturer_id, // ID của người nhận
          receiver_model: "Lecturer", // Vai trò của người nhận
          paper_id: scientificPaper._id, // ID của bài báo
          content: `Có một bài báo mới cần duyệt: ${scientificPaper.title}`, // Nội dung thông báo
          time: new Date(),
        };
        // Gọi hàm createMessage từ messagesController
        await messagesController.createMessage(
          { body: messageData }, // Giả lập req.body
          { status: () => ({ json: () => {} }) } // Giả lập res (không cần trả về gì)
        );
      }

      // Commit transaction
      await session.commitTransaction();
      session.endSession();
      console.log("Request body received in backend:", req.body);

      res.status(201).json({
        message: "Scientific paper created successfully",
        scientificPaper: {
          ...scientificPaper._doc,
          author: authorIds,
          views: newViews._id,
          downloads: newDownloads._id,
        },
        views: newViews,
        downloads: newDownloads,
      });
    } catch (error) {
      // Rollback transaction nếu có lỗi
      await session.abortTransaction();
      session.endSession();
      res.status(400).json({ message: error.message });
    }
  },

  getAllScientificPapers: async (req, res) => {
    try {
      const scientificPapers = await ScientificPaper.find()
        .populate("article_type")
        .populate("article_group")
        .populate("author") // Populate thông tin tác giả
        .populate("views")
        .populate("downloads");
      res.status(200).json(scientificPapers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getScientificPaperById: async (req, res) => {
    try {
      const scientificPaper = await ScientificPaper.findById(req.params.id)
        .populate("article_type")
        .populate("article_group")
        .populate("author")
        .populate("views")
        .populate("downloads");
      if (!scientificPaper) {
        return res.status(404).json({ message: "ScientificPaper not found" });
      }
      res.status(200).json(scientificPaper);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getScientificPapersByAuthorId: async (req, res) => {
    try {
      const { userId } = req.params; // Lấy `userId` từ URL params

      // Tìm tất cả các tác giả có `user_id` khớp
      const authors = await PaperAuthor.find({ user_id: userId });

      if (!authors || authors.length === 0) {
        return res
          .status(404)
          .json({ message: "No authors found with this user_id." });
      }

      const authorIds = authors.map((author) => author._id);

      const scientificPapers = await ScientificPaper.find({
        author: { $in: authorIds },
      })
        .populate("article_type")
        .populate("article_group")
        .populate({
          path: "author",
          populate: {
            path: "work_unit_id",
            model: "WorkUnit",
          },
        })
        .populate("views")
        .populate("downloads");

      if (!scientificPapers || scientificPapers.length === 0) {
        return res
          .status(404)
          .json({ message: "No scientific papers found for this user_id." });
      }

      res.status(200).json(scientificPapers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getScientificPapersByDepartment: async (req, res) => {
    try {
      const { department } = req.params; // Lấy `department` từ URL params

      // Tìm tất cả bài viết có `department` khớp
      const scientificPapers = await ScientificPaper.find({ department })
        .populate("article_type")
        .populate("article_group")
        .populate({
          path: "author",
          populate: {
            path: "work_unit_id",
            model: "WorkUnit",
          },
        })
        .populate("views")
        .populate("downloads");

      if (!scientificPapers || scientificPapers.length === 0) {
        return res
          .status(404)
          .json({ message: "No scientific papers found for this department." });
      }

      res.status(200).json(scientificPapers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateScientificPaperById: async (req, res) => {
    try {
      const scientificPaper = await ScientificPaper.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      )
        .populate("article_type")
        .populate("article_group")
        .populate("author")
        .populate("views")
        .populate("downloads");
      if (!scientificPaper) {
        return res.status(404).json({ message: "ScientificPaper not found" });
      }
      res.status(200).json(scientificPaper);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = scientificPaperController;
