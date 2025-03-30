require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connecté"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
