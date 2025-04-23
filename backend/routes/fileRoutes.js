const express = require("express");
const AWS = require("aws-sdk");
const multer = require("multer");
const sharp = require("sharp");
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

// Upload file to S3 (with HEIC to JPEG conversion) and update TimeCapsule document
router.post("/upload/:capsuleId", (req, res) => {
  upload.single("file")(req, res, async (err) => {
    // Multer errors
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ error: "File size exceeds the limit of 2 GB" });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // other upload errors
      return res.status(500).json({ error: err.message });
    }

    try {
      const { capsuleId } = req.params;
      const capsule = await TimeCapsule.findById(capsuleId);
      if (!capsule) {
        return res.status(404).json({ message: "Time Capsule not found" });
      }

      // Prepare for possible HEIC conversion
      let fileBuffer = req.file.buffer;
      let originalName = req.file.originalname;
      let contentType = req.file.mimetype;

      // If it's a HEIC/HEIF image, convert to JPEG
      const isHeicFile =
        /\.heic$/i.test(originalName) || /heic/i.test(contentType);
      if (isHeicFile) {
        try {
          fileBuffer = await sharp(req.file.buffer)
            .jpeg({ quality: 80 })
            .toBuffer();
          originalName = originalName.replace(/\.(heic|heif)$/i, ".jpg");
          contentType = "image/jpeg";
        } catch (convErr) {
          console.error("HEIC conversion error:", convErr);
          return res
            .status(500)
            .json({ message: "Failed to convert HEIC to JPEG" });
        }
      }

      // Upload (possibly converted) buffer to S3
      const key = `timecapsules/${Date.now()}_${originalName}`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
      };

      s3.upload(params, async (s3Err, data) => {
        if (s3Err) {
          console.error("S3 upload error:", s3Err);
          return res
            .status(500)
            .json({ message: "Error uploading file", error: s3Err.message });
        }

        // update TimeCapsule document
        const fileUrl = data.Location;
        const fileType = contentType.split("/")[0]; // e.g. "image", "video"
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
