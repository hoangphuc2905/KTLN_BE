const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoutes = require("./src/routes/authRoutes");
const studentRoutes = require("./src/routes/studentsRoutes");
const lecturerRoutes = require("./src/routes/lecturersRoutes");
const departmentRoutes = require("./src/routes/departmentsRoutes");
const roleRoutes = require("./src/routes/rolesRoutes");
const paperTypeRoutes = require("./src/routes/paperTypeRoutes");
const paperGroupRoutes = require("./src/routes/paperGroupRoutes");
const scientificPaperRoutes = require("./src/routes/scientificPaperRoutes");
const workUnitRoutes = require("./src/routes/workUnitRoutes");
const userWorkRoutes = require("./src/routes/userWorkRoutes");
const paperAuthorRoutes = require("./src/routes/paperAuthorsRoutes");
const paperViewRoutes = require("./src/routes/paperViewsRoutes");
const paperDownloadRoutes = require("./src/routes/paperDownloadsRoutes");
const messagesRoutes = require("./src/routes/messagesRoutes");
const formulaRoutes = require("./src/routes/formulasRoutes");
const attributeRoutes = require("./src/routes/attributesRoutes");
const statisticsRoutes = require("./src/routes/statisticsRoutes");
const swaggerUi = require("swagger-ui-express");
const fileUploadRoutes = require("./src/routes/fileUploadRoutes");
const paperCollectionRoutes = require("./src/routes/paperCollectionRoutes");
const authorScoreRoutes = require("./src/routes/authorScoreRoutes");
const searchAIRoutes = require("./src/routes/searchAIRoutes");
const academicYearRoutes = require("./src/routes/academicYearRoutes");
const articleAIRoutes = require("./src/routes/articleAIRoutes");
const recommendationRoutes = require("./src/routes/recommendationRoutes");
const specs = require("./swagger");

dotenv.config();
const app = express();

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
}

connectDB();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use("/auth", authRoutes);
app.use("/students", studentRoutes);
app.use("/lecturers", lecturerRoutes);
app.use("/departments", departmentRoutes);
app.use("/roles", roleRoutes);
app.use("/papertypes", paperTypeRoutes);
app.use("/papergroups", paperGroupRoutes);
app.use("/workunits", workUnitRoutes);
app.use("/userworks", userWorkRoutes);
app.use("/paperview", paperViewRoutes);
app.use("/paperdownload", paperDownloadRoutes);
app.use("/paperauthor", paperAuthorRoutes);
app.use("/scientificPapers", scientificPaperRoutes);
app.use("/messages", messagesRoutes);
app.use("/formulas", formulaRoutes);
app.use("/attributes", attributeRoutes);
app.use("/files", fileUploadRoutes);
app.use("/papercollections", paperCollectionRoutes);
app.use("/statistics", statisticsRoutes);
app.use("/authorScores", authorScoreRoutes);
app.use("/search", searchAIRoutes);
app.use("/academic-years", academicYearRoutes);
app.use("/articlesAI", articleAIRoutes);
app.use("/recommendations", recommendationRoutes);

const APP_PORT = process.env.APP_PORT || 5000;

if (process.env.BUILD_MODE === "production") {
  app.listen(process.env.PORT, () => {
    console.log(`Production server is running on port ${process.env.PORT}`);
    console.log(
      `Production API documentation available at http://localhost:${process.env.PORT}/api-docs`
    );
  });
} else {
  app.listen(APP_PORT, () => {
    console.log(`Server is running on port ${APP_PORT}`);
    console.log(
      `API documentation available at http://localhost:${APP_PORT}/api-docs`
    );
  });
}
