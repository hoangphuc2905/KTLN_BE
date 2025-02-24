const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/user");
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(
    `API documentation available at http://localhost:${PORT}/api-docs`
  );
});
