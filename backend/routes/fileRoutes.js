const express = require("express");
const AWS = require("aws-sdk");
const multer = require("multer");
const TimeCapsule = require("../models/TimeCapsule");
require("dotenv").config();

const router = express.Router();

// AWS S3 Configuration (using AWS SDK v2)
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

// Multer configuration for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 }, // 2GB file limit
});

// Upload file to S3 and update TimeCapsule document
router.post("/upload/:capsuleId", (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      // handle uploading too big file size
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ error: "File size exceeds the limit of 2MB" });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // handle other errors
      return res.status(500).json({ error: err.message });
    }

    try {
      const { capsuleId } = req.params;
      const capsule = await TimeCapsule.findById(capsuleId);
      if (!capsule) {
        return res.status(404).json({ message: "Time Capsule not found" });
      }

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `timecapsules/${Date.now()}_${req.file.originalname}`, // Unique file key
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      // Upload to S3 bucket
      s3.upload(params, async (err, data) => {
        if (err) {
          console.error("S3 upload error:", err);
          return res
            .status(500)
            .json({ message: "Error uploading file", error: err.message });
        }

        const fileUrl = data.Location;
        const fileType = req.file.mimetype.split("/")[0]; // e.g., "image", "video"

        // Update time capsule with file details
        capsule.files.push({ url: fileUrl, fileType });
        await capsule.save();

        res
          .status(200)
          .json({ message: "File uploaded successfully", fileUrl });
      });
    } catch (error) {
      console.error("Error processing upload:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  });
});

// Get all files from a TimeCapsule (for opening the capsule)
router.get("/get/:capsuleId", async (req, res) => {
  try {
    const { capsuleId } = req.params;
    const capsule = await TimeCapsule.findById(capsuleId);
    if (!capsule) {
      return res.status(404).json({ message: "Time Capsule not found" });
    }

    // Return the list of files stored in the capsule
    res.status(200).json({ files: capsule.files });
  } catch (error) {
    console.error("Error fetching files:", error);
    res
      .status(500)
      .json({ message: "Error retrieving files", error: error.message });
  }
});

module.exports = router;
