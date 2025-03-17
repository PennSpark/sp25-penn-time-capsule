const express = require("express");
const TimeCapsule = require("../models/TimeCapsule");
require("dotenv").config();

const router = express.Router();

// Create New Time Capsule
router.post("/create", async (req, res) => {
  const { name } = req.body;
  const user = req.user; // Get user from JWT token (assuming you have middleware to verify JWT)

  try {
    const newCapsule = new TimeCapsule({
      name,
      owner: user._id, // Set the user who created it as the owner
      members: [user._id], // The user who created it will be added as a member
    });

    await newCapsule.save();
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

// Join Time Capsule
router.post("/join/:capsuleId", async (req, res) => {
  const { capsuleId } = req.params;
  const user = req.user; // Get the user from JWT token

  try {
    const capsule = await TimeCapsule.findById(capsuleId);
    if (!capsule)
      return res.status(404).json({ message: "Time capsule not found" });

    // Check if the user is already a member
    if (capsule.members.includes(user._id)) {
      return res
        .status(400)
        .json({ message: "Already a member of this time capsule" });
    }

    // Add the user to the capsule's members
    capsule.members.push(user._id);
    await capsule.save();

    res.json({ message: "Joined time capsule successfully", capsule });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error joining time capsule", error: err.message });
  }
});

// Leave Time Capsule
router.delete("/leave/:capsuleId", async (req, res) => {
  const { capsuleId } = req.params;
  const { userId } = req.body; // The user who is leaving the capsule

  try {
    const capsule = await TimeCapsule.findById(capsuleId);
    if (!capsule)
      return res.status(404).json({ message: "Time Capsule not found" });

    // If user is the owner, delete the time capsule and all members
    if (capsule.owner.toString() === userId) {
      // Delete the time capsule (owner is leaving, remove all members)
      await capsule.deleteOne();
      return res.json({
        message: "Time Capsule deleted because the owner left.",
      });
    }

    // If the user is not the owner, just remove them from the members list
    capsule.members = capsule.members.filter(
      (member) => member.toString() !== userId
    );
    await capsule.save();

    res.json({ message: "User left the time capsule." });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
