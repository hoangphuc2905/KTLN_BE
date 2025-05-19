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
      const lastPaper = await ScientificPaper.findOne().sort({ paper_id: -1 });

      let newPaperId;
      if (lastPaper && lastPaper.paper_id) {
        const lastIdNumber = parseInt(lastPaper.paper_id, 10) || 0;
        newPaperId = String(lastIdNumber + 1).padStart(6, "0");
      } else {
        newPaperId = "000001";
      }

      let fileUrl = null;
      if (req.file) {
        const folderName = "scientific_papers";
        fileUrl = await uploadFileToCloudinary(req.file.path, folderName);
      }

      const scientificPaper = new ScientificPaper({
        ...req.body,
        paper_id: newPaperId,
        file_url: fileUrl,
        author: [],
      });

      await scientificPaper.save({ session });
      console.log("Scientific paper saved:", scientificPaper);

      const authorIds = [];
      let senderUserId = null;
      if (Array.isArray(req.body.author)) {
        for (const authorData of req.body.author) {
          const newAuthor = new PaperAuthor({
            ...authorData,
            paper_id: scientificPaper._id,
          });
          const savedAuthor = await newAuthor.save({ session });
          authorIds.push(savedAuthor._id);

          if (!senderUserId) {
            senderUserId = savedAuthor.user_id;
          }
        }
      }

      await ScientificPaper.updateOne(
        { _id: scientificPaper._id },
        { $set: { author: authorIds } },
        { session }
      );

      const departmentId = req.body.department;
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

      senderUserId = senderUserId || authorIds[0];

      for (const lecturer of lecturers) {
        const messageData = {
          message_id: uuidv4(),
          message_type: "Request for Approval",
          status: "Pending Response",
          sender_id: senderUserId,
          sender_model: "Student",
          receiver_id: lecturer.lecturer_id,
          receiver_model: "Lecturer",
          paper_id: scientificPaper._id,
          content: `Có một bài báo mới cần duyệt: ${scientificPaper.title_vn}`,
          isread: false,
          time: new Date(),
        };
        await messagesController.createMessage(
          { body: messageData },
          { status: () => ({ json: () => {} }) }
        );
      }

      const contentToEmbed = `${scientificPaper.title_vn} ${scientificPaper.title_en} ${scientificPaper.summary} ${scientificPaper.keywords}`;
      const embedding = await generateEmbedding(contentToEmbed);

      await ScientificPaper.updateOne(
        { _id: scientificPaper._id },
        { $set: { embedding } },
        { session }
      );

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
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      session.endSession();
      res.status(400).json({ message: error.message });
    }
  },

  getAllScientificPapers: async (req, res) => {
    try {
      const { academicYear } = req.query;

      if (academicYear && !/^\d{4}-\d{4}$/.test(academicYear)) {
        return res.status(400).json({
          message: "Invalid academicYear format. Expected format: YYYY-YYYY",
        });
      }

      let filter = { status: "approved" };

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

      if (!scientificPapers || scientificPapers.length === 0) {
        return res.status(404).json({
          message: academicYear
            ? `No approved scientific papers found for academic year ${academicYear}`
            : "No approved scientific papers found",
        });
      }

      res.status(200).json({
        message: academicYear
          ? `Approved scientific papers for academic year ${academicYear}`
          : "All approved scientific papers retrieved successfully",
        academicYear: academicYear || "All",
        scientificPapers,
      });
    } catch (error) {
      console.error("Error fetching scientific papers:", error);
      res.status(500).json({
        message: "An error occurred while fetching scientific papers",
        error: error.message,
      });
    }
  },

  getAllScientificPapersByAllStatus: async (req, res) => {
    try {
      const { academicYear } = req.query;

      if (academicYear && !/^\d{4}-\d{4}$/.test(academicYear)) {
        return res.status(400).json({
          message: "Invalid academicYear format. Expected format: YYYY-YYYY",
        });
      }
      let filter = {};

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

      if (!scientificPapers || scientificPapers.length === 0) {
        return res.status(404).json({
          message: academicYear
            ? `No approved scientific papers found for academic year ${academicYear}`
            : "No approved scientific papers found",
        });
      }

      res.status(200).json({
        message: academicYear
          ? `Approved scientific papers for academic year ${academicYear}`
          : "All approved scientific papers retrieved successfully",
        academicYear: academicYear || "All",
        scientificPapers,
      });
    } catch (error) {
      console.error("Error fetching scientific papers:", error);
      res.status(500).json({
        message: "An error occurred while fetching scientific papers",
        error: error.message,
      });
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
      const { userId } = req.params;
      const { academicYear } = req.query;

      const authors = await PaperAuthor.find({ user_id: userId });

      if (!authors || authors.length === 0) {
        return res
          .status(404)
          .json({ message: "No authors found with this user_id." });
      }

      const authorIds = authors.map((author) => author._id);

      let filter = { author: { $in: authorIds }, status: "approved" };

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

      const existingPaper = await ScientificPaper.findById(id);
      if (!existingPaper) {
        return res.status(404).json({ message: "ScientificPaper not found" });
      }

      let fileUrl = existingPaper.file_url;
      if (req.file && req.file.path) {
        const folderName = "scientific_papers";
        fileUrl = await uploadFileToCloudinary(req.file.path, folderName);
      }

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
      const { academicYear } = req.query;

      let dateFilter = {};
      if (academicYear) {
        const { startDate, endDate } = getAcademicYearRange(academicYear);
        dateFilter = { $gte: startDate, $lte: endDate };
      }

      const topPapers = await ScientificPaper.aggregate([
        {
          $lookup: {
            from: "paperviews",
            localField: "_id",
            foreignField: "paper_id",
            as: "views",
          },
        },
        {
          $lookup: {
            from: "paperdownloads",
            localField: "_id",
            foreignField: "paper_id",
            as: "downloads",
          },
        },
        {
          $lookup: {
            from: "paperauthors",
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
                    : true,
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
                    : true,
                },
              },
            },
          },
        },
        {
          $match: {
            $or: [{ viewCount: { $gt: 0 } }, { downloadCount: { $gt: 0 } }],
          },
        },
        {
          $sort: { viewCount: -1, downloadCount: -1 },
        },
        {
          $limit: 5,
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

      if (!topPapers || topPapers.length === 0) {
        return res.status(200).json({
          message: "No scientific papers found",
          academicYear: academicYear || "All",
          papers: [],
        });
      }

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

  getScientificPapersByTitle: async (req, res) => {
    try {
      const { title } = req.query;

      if (!title) {
        return res.status(400).json({ message: "Title is required" });
      }

      const scientificPapers = await ScientificPaper.find({
        $or: [
          { title_vn: { $regex: `^${title}$`, $options: "i" } },
          { title_en: { $regex: `^${title}$`, $options: "i" } },
        ],
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
        .populate("downloads")
        .populate({
          path: "department",
          select: "department_name",
        });

      if (!scientificPapers || scientificPapers.length === 0) {
        return res.status(404).json({
          message: `No scientific papers found with the title "${title}"`,
        });
      }

      res.status(200).json({
        message: `Scientific papers with the title "${title}" retrieved successfully`,
        scientificPapers,
      });
    } catch (error) {
      console.error("Error in getScientificPapersByTitle:", error.message);
      res.status(500).json({ message: error.message });
    }
  },
};
module.exports = scientificPaperController;
