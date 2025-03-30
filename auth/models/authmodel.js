const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: { type: String, enum: ["admin", "membre", "invité"], default: "membre" },
    isBlocked: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", UserSchema);
