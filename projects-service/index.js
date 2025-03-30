const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const authMiddleware = require("../auth/middleware/auth");


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));


const projectRoutes = require("./routes/projectRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

app.use("/api/projects", authMiddleware(), projectRoutes);
app.use("/api/categories", authMiddleware(), categoryRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
