const express = require("express");
const TimeCapsule = require("../models/TimeCapsule");
const User = require("../models/User");
const authenticateToken = require("../middleware/authenticateToken"); // Middleware for JWT authentication
require("dotenv").config();

const router = express.Router();

// Create New Time Capsule - TESTED AND WORKING
router.post("/create", authenticateToken, async (req, res) => {
  const { name, date } = req.body;
  const userId = req.user.id; // Get user from signed JWT token (authenicateToken middleware)
  console.log(name, date, userId);
  try {
    const newCapsule = new TimeCapsule({
      name,
      owner: userId, // Set the user who created it as the owner
      members: [userId],
      date: date // The user who created it will be added as a member
    });

    await newCapsule.save();

    // update user's timecapsules array
    await User.findByIdAndUpdate(
      userId,
      {
        $push: { timeCapsules: newCapsule._id },
      },
      { new: true }
    );

    res.status(201).json({
      message: "Time capsule created successfully",
      capsule: newCapsule,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating time capsule", error: err.message });
  }
});

// Join Time Capsule - TESTED AND WORKING
router.post("/join/:capsuleId", authenticateToken, async (req, res) => {
  const { capsuleId } = req.params;
  const userId = req.user.id; // Get the user from JWT token

  try {
    const capsule = await TimeCapsule.findById(capsuleId);
    if (!capsule)
      return res.status(404).json({ message: "Time capsule not found" });

    // Check if the user is already a member
    if (capsule.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "Already a member of this time capsule" });
    }

    // add the user to the capsule's members
    capsule.members.push(userId);
    await capsule.save();

    // update user's timecapsules array
    await User.findByIdAndUpdate(
      userId,
      {
        $push: { timeCapsules: capsule._id },
      },
      { new: true }
    );

    res.json({ message: "Joined time capsule successfully", capsule });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error joining time capsule", error: err.message });
  }
});

// Leave Time Capsule - TESTED AND WORKING
router.delete("/leave/:capsuleId", authenticateToken, async (req, res) => {
  const { capsuleId } = req.params;
  const userId = req.user.id; // The user who is leaving the capsule

  try {
    const capsule = await TimeCapsule.findById(capsuleId);
    if (!capsule)
      return res.status(404).json({ message: "Time Capsule not found" });

    // If user is the owner, delete the time capsule and all members
    if (capsule.owner.toString() === userId) {
      // Delete the time capsule (owner is leaving, remove all members)
      await capsule.deleteOne();

      // remove time capsule from all users who are members of the capsule
      await User.updateMany(
        { timeCapsules: capsuleId },
        { $pull: { timeCapsules: capsuleId } },
        { new: true }
      );

      return res.json({
        message: "Time Capsule deleted because the owner left.",
      });
    }

    // If the user is not the owner, just remove them from the members list
    capsule.members = capsule.members.filter(
      (member) => member.toString() !== userId
    );
    await capsule.save();

    // update user's timecapsules array
    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { timeCapsules: capsuleId },
      },
      { new: true }
    );

    res.json({ message: "User left the time capsule." });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Get User's Time Capsules
router.get("/get", authenticateToken, async (req, res) => {
  try {
    // get the user ID from the authenticated token (middleware)
    const userId = req.user.id;

    // find all time capsules where the user is a member
    const capsules = await TimeCapsule.find({ members: userId });
    res.json(capsules);
  } catch (error) {
    console.error("Error retrieving time capsules:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
