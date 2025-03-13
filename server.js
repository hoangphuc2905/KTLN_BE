const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/user");
const paperTypeRoutes = require("./src/routes/paperType");
const paperGroupRoutes = require("./src/routes/paperGroup");
const scientificPaperRoutes = require("./src/routes/scientificPaper");
const workUnitRoutes = require("./src/routes/workUnit");
const userWorkRoutes = require("./src/routes/userWork");
const paperAuthorRoutes = require("./src/routes/paperAuthor");
const paperViewRoutes = require("./src/routes/paperViews");
const paperDownloadRoutes = require("./src/routes/paperDownloads");
const messagesRoutes = require("./src/routes/messages");
const formulaRoutes = require("./src/routes/formulas");
const attributeRoutes = require("./src/routes/attributes");
const { swaggerUi, specs } = require("./swagger");

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
app.use("/users", userRoutes);
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(
    `API documentation available at http://localhost:${PORT}/api-docs`
  );
});
