const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const TimeCapsule = require("../models/TimeCapsule");
require("dotenv").config();

const router = express.Router();

// AWS S3 Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

// Multer-S3 Upload Middleware
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read",
    metadata: (req, file, cb) => cb(null, { fieldName: file.fieldname }),
    key: (req, file, cb) =>
      cb(null, `timecapsules/${Date.now()}_${file.originalname}`),
  }),
});

// Upload a file to a capsule
router.post("/upload/:capsuleId", upload.single("file"), async (req, res) => {
  const { capsuleId } = req.params;
  const fileUrl = req.file.location;
  const fileType = req.file.mimetype.split("/")[0]; // e.g., "image", "video"

  try {
    const capsule = await TimeCapsule.findById(capsuleId);
    if (!capsule)
      return res.status(404).json({ message: "Time Capsule not found" });

    capsule.files.push({ url: fileUrl, fileType });
    await capsule.save();

    res.json({ message: "File uploaded successfully", fileUrl });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
