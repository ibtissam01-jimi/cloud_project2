const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    startDate: { type: String, required: true },
    endDate: { type: String },
    status: {
      type: String,
      enum: ["En cours", "Terminé", "En attente"],
      default: "En attente",
    },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
