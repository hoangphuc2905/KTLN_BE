const ScientificPaper = require("../models/ScientificPaper");
const PaperAuthor = require("../models/PaperAuthor");
const PaperViews = require("../models/PaperViews");
const PaperDownloads = require("../models/PaperDownloads");
const { v4: uuidv4 } = require("uuid");
const { default: mongoose } = require("mongoose");
const Role = require("../models/Role");
const Lecturer = require("../models/Lecturer");
const messagesController = require("./messagesController");
const { uploadFileToCloudinary } = require("./fileCloudinaryController");
const { generateEmbedding } = require("../utils/embeddingUtils");
const {
  getAcademicYearRange,
  getDefaultAcademicYear,
} = require("../utils/dateUtils");

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
      console.log("Scientific paper saved:", scientificPaper);

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

      senderUserId = senderUserId || authorIds[0]; // Nếu không có `user_id` của tác giả, sử dụng tác giả đầu tiên

      for (const lecturer of lecturers) {
        const messageData = {
          message_id: uuidv4(), // Tạo ID duy nhất cho thông báo
          message_type: "Request for Approval", // Đặt loại thông báo là "Yêu cầu duyệt"
          status: "Pending Response",
          sender_id: senderUserId,
          sender_model: "Student", // Model của người gửi là `Student`
          receiver_id: lecturer.lecturer_id, // ID của người nhận
          receiver_model: "Lecturer", // Vai trò của người nhận
          paper_id: scientificPaper._id, // ID của bài báo
          content: `Có một bài báo mới cần duyệt: ${scientificPaper.title_vn}`, // Nội dung thông báo
          isread: false,
          time: new Date(),
        };
        // Gọi hàm createMessage từ messagesController
        await messagesController.createMessage(
          { body: messageData }, // Giả lập req.body
          { status: () => ({ json: () => {} }) } // Giả lập res (không cần trả về gì)
        );
      }

      // Tạo nội dung để sinh embedding
      const contentToEmbed = `${scientificPaper.title_vn} ${scientificPaper.title_en} ${scientificPaper.summary} ${scientificPaper.keywords}`;
      const embedding = await generateEmbedding(contentToEmbed);

      // Cập nhật embedding vào bài báo
      await ScientificPaper.updateOne(
        { _id: scientificPaper._id },
        { $set: { embedding } },
        { session }
      );

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        message: "Scientific paper created successfully",
        scientificPaper: {
          ...scientificPaper._doc,
          author: authorIds,
        },
      });
    } catch (error) {
      // Rollback transaction nếu có lỗi và chưa commit
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      session.endSession();
      res.status(400).json({ message: error.message });
    }
  },

  // Backend logic for getAllScientificPapers
  getAllScientificPapers: async (req, res) => {
    try {
      const { academicYear } = req.query; // Get academicYear from query string

      let filter = {}; // Default filter is empty (fetch all papers)

      // If academicYear is provided, calculate the date range and add to the filter
      if (academicYear) {
        const { startDate, endDate } = getAcademicYearRange(academicYear);
        filter.createdAt = { $gte: startDate, $lte: endDate };
      }

      const scientificPapers = await ScientificPaper.find(filter)
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
        .populate("downloads")
        .populate({
          path: "department",
          select: "department_name",
        });

      console.log("Scientific papers retrieved:", scientificPapers);

      res.status(200).json({
        message: academicYear
          ? `Scientific papers for academic year ${academicYear}`
          : "All scientific papers retrieved successfully",
        academicYear: academicYear || "All",
        scientificPapers,
      });
    } catch (error) {
      console.error("Error fetching scientific papers:", error);
      res.status(500).json({ message: error.message });
    }
  },

  getScientificPaperById: async (req, res) => {
    try {
      const scientificPaper = await ScientificPaper.findById(req.params.id)
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
      const { academicYear } = req.query; // Lấy `academicYear` từ query string

      // Tìm tất cả các tác giả có `user_id` khớp
      const authors = await PaperAuthor.find({ user_id: userId });

      if (!authors || authors.length === 0) {
        return res
          .status(404)
          .json({ message: "No authors found with this user_id." });
      }

      const authorIds = authors.map((author) => author._id);

      // Bộ lọc mặc định theo `author`
      let filter = { author: { $in: authorIds } };

      // Nếu có năm học, thêm điều kiện lọc theo khoảng thời gian
      if (academicYear) {
        const { startDate, endDate } = getAcademicYearRange(academicYear);
        filter.createdAt = { $gte: startDate, $lte: endDate };
      }

      // Tìm tất cả bài viết theo bộ lọc
      const scientificPapers = await ScientificPaper.find(filter)
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

      res.status(200).json({
        message: academicYear
          ? `Scientific papers for user ${userId} in academic year ${academicYear}`
          : `All scientific papers for user ${userId}`,
        academicYear: academicYear || "All",
        scientificPapers,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getScientificPapersByDepartment: async (req, res) => {
    try {
      const { department } = req.params;
      const { academicYear } = req.query;

      let filter = { department };

      // Nếu có năm học, tính khoảng thời gian và thêm vào bộ lọc
      if (academicYear) {
        const { startDate, endDate } = getAcademicYearRange(academicYear);
        filter.createdAt = { $gte: startDate, $lte: endDate };
      }

      // Tìm tất cả bài viết theo bộ lọc
      const scientificPapers = await ScientificPaper.find(filter)
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

      res.status(200).json({
        message: academicYear
          ? `Scientific papers for department ${department} in academic year ${academicYear}`
          : `All scientific papers for department ${department}`,
        academicYear: academicYear || "All",
        scientificPapers,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateScientificPaperStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      console.log("Received status:", status);
      console.log("Received id:", id);

      const validStatuses = ["pending", "approved", "refused", "revision"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }

      const scientificPaper = await ScientificPaper.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      )
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

      if (!scientificPaper) {
        return res.status(404).json({ message: "ScientificPaper not found" });
      }

      res.status(200).json({
        message: "Scientific paper status updated successfully",
        scientificPaper,
      });
    } catch (error) {
      console.error("Error in updateScientificPaperStatus:", error.message);
      res.status(500).json({ message: error.message });
    }
  },

  updateScientificPaperById: async (req, res) => {
    const session = await ScientificPaper.startSession();
    session.startTransaction();

    try {
      const { id } = req.params;

      // Tìm bài báo cần cập nhật
      const existingPaper = await ScientificPaper.findById(id);
      if (!existingPaper) {
        return res.status(404).json({ message: "ScientificPaper not found" });
      }

      // Upload file mới lên Cloudinary nếu có
      let fileUrl = existingPaper.file_url;
      if (req.file && req.file.path) {
        const folderName = "scientific_papers";
        fileUrl = await uploadFileToCloudinary(req.file.path, folderName);
      }

      // Xử lý danh sách tác giả
      const authorIds = [];
      let senderUserId = null;
      if (Array.isArray(req.body.author) && req.body.author.length > 0) {
        await PaperAuthor.deleteMany({ paper_id: id }, { session });

        for (const authorData of req.body.author) {
          const newAuthor = new PaperAuthor({
            ...authorData,
            paper_id: id,
          });
          const savedAuthor = await newAuthor.save({ session });
          authorIds.push(savedAuthor._id);

          if (!senderUserId) {
            senderUserId = savedAuthor.user_id;
          }
        }
      }

      // Cập nhật thông tin bài báo
      const updatedPaperData = {
        ...req.body,
        file_url: fileUrl,
        author: authorIds,
      };

      const updatedPaper = await ScientificPaper.findByIdAndUpdate(
        id,
        updatedPaperData,
        { new: true, runValidators: true, session }
      );

      // Gửi thông báo tới các vai trò trong khoa
      const departmentId = req.body.department;
      if (!departmentId) {
        throw new Error("Department ID is required.");
      }

      const roleNames = [
        "head_of_department",
        "deputy_head_of_department",
        "department_in_charge",
      ];
      const roles = await Role.find({ role_name: { $in: roleNames } });
      const lecturers = await Lecturer.find({
        department: departmentId,
        roles: { $in: roles.map((role) => role._id) },
      });

      if (lecturers.length === 0) {
        console.warn("No lecturers found for the specified department.");
      }

      for (const lecturer of lecturers) {
        const messageData = {
          message_id: uuidv4(),
          message_type: "Request for Approval",
          status: "Pending Response",
          sender_id: senderUserId,
          sender_model: "Student",
          receiver_id: lecturer.lecturer_id,
          receiver_model: "Lecturer",
          paper_id: updatedPaper._id,
          content: `Bài báo đã được cập nhật và cần duyệt lại: ${updatedPaper.title_vn}`,
          isread: false,
          time: new Date(),
        };
        await messagesController.createMessage(
          { body: messageData },
          { status: () => ({ json: () => {} }) }
        );
      }

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        message: "Scientific paper updated successfully",
        scientificPaper: updatedPaper,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error in updateScientificPaperById:", error.message);
      res.status(500).json({ message: error.message });
    }
  },
  getTop5NewestScientificPapers: async (req, res) => {
    try {
      const topPapers = await ScientificPaper.find({ status: "approved" })
        .sort({ createdAt: -1 })
        .limit(5)
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

      res.status(200).json({
        message: "Top 5 newest scientific papers retrieved successfully",
        papers: topPapers,
      });
    } catch (error) {
      console.error("Error in getTop5NewestScientificPapers:", error.message);
      res.status(500).json({ message: error.message });
    }
  },

  getTop5MostViewedAndDownloadedPapers: async (req, res) => {
    try {
      const { academicYear } = req.query; // Lấy `academicYear` từ query string

      // Nếu có năm học, tính khoảng thời gian
      let dateFilter = {};
      if (academicYear) {
        const { startDate, endDate } = getAcademicYearRange(academicYear);
        dateFilter = { $gte: startDate, $lte: endDate };
      }

      const topPapers = await ScientificPaper.aggregate([
        {
          $lookup: {
            from: "paperviews", // Tên collection chứa lượt xem
            localField: "_id",
            foreignField: "paper_id",
            as: "views",
          },
        },
        {
          $lookup: {
            from: "paperdownloads", // Tên collection chứa lượt tải xuống
            localField: "_id",
            foreignField: "paper_id",
            as: "downloads",
          },
        },
        {
          $lookup: {
            from: "paperauthors", // Tên collection chứa tác giả
            localField: "author",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $addFields: {
            viewCount: {
              $size: {
                $filter: {
                  input: "$views",
                  as: "view",
                  cond: academicYear
                    ? {
                        $and: [
                          { $gte: ["$$view.createdAt", dateFilter.$gte] },
                          { $lte: ["$$view.createdAt", dateFilter.$lte] },
                        ],
                      }
                    : true, // Không áp dụng bộ lọc nếu không có `academicYear`
                },
              },
            },
            downloadCount: {
              $size: {
                $filter: {
                  input: "$downloads",
                  as: "download",
                  cond: academicYear
                    ? {
                        $and: [
                          { $gte: ["$$download.createdAt", dateFilter.$gte] },
                          { $lte: ["$$download.createdAt", dateFilter.$lte] },
                        ],
                      }
                    : true, // Không áp dụng bộ lọc nếu không có `academicYear`
                },
              },
            },
          },
        },
        {
          $match: {
            $or: [
              { viewCount: { $gt: 0 } }, // Chỉ lấy bài có lượt xem > 0
              { downloadCount: { $gt: 0 } }, // Hoặc lượt tải xuống > 0
            ],
          },
        },
        {
          $sort: { viewCount: -1, downloadCount: -1 }, // Sắp xếp theo lượt xem và tải xuống giảm dần
        },
        {
          $limit: 5, // Giới hạn 5 bài
        },
        {
          $project: {
            paper_id: 1,
            title_vn: 1,
            title_en: 1,
            cover_image: 1,
            department: 1,
            viewCount: 1,
            downloadCount: 1,
            author: {
              author_name_vi: 1,
              author_name_en: 1,
              role: 1,
            },
          },
        },
      ]);

      // Kiểm tra nếu không có bài nghiên cứu nào
      if (!topPapers || topPapers.length === 0) {
        return res.status(200).json({
          message: "No scientific papers found",
          academicYear: academicYear || "All",
          papers: [],
        });
      }

      // Trả về kết quả
      res.status(200).json({
        message:
          "Top 5 most viewed and downloaded scientific papers retrieved successfully",
        academicYear: academicYear || "All",
        papers: topPapers,
      });
    } catch (error) {
      console.error(
        "Error in getTop5MostViewedAndDownloadedPapers:",
        error.message
      );
      res.status(500).json({
        message:
          "An error occurred while retrieving the top 5 most viewed and downloaded scientific papers",
        error: error.message,
      });
    }
  },
};
module.exports = scientificPaperController;
