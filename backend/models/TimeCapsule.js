const mongoose = require("mongoose");

const TimeCapsuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  date: {type: String, required: true},
  files: [
    {
      url: { type: String, required: true },
      fileType: { type: String, required: true }, // "image", "video", etc
      tagline: { type: String, default: "" }, // <--- new
      uploadedBy: { type: String, required: true }, // <--- new (username)
    },

  ],
  createdAt: { type: Date, default: Date.now },
  styles: {type: String, required: true}
});

module.exports = mongoose.model("TimeCapsule", TimeCapsuleSchema);
