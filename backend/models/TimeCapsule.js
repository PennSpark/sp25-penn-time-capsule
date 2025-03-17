const mongoose = require("mongoose");

const TimeCapsuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  files: [
    {
      url: { type: String, required: true },
      fileType: { type: String, required: true }, // i.e, image, video, document
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TimeCapsule", TimeCapsuleSchema);
