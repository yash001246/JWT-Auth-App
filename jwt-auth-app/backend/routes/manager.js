const express = require("express");
const User = require("../models/User");
const Task = require("../models/Task");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// GET /api/manager/overview -> team-wide task stats (manager + admin)
router.get("/overview", protect, authorize("manager", "admin"), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalTasks = await Task.countDocuments();
    const pending = await Task.countDocuments({ status: "pending" });
    const inProgress = await Task.countDocuments({ status: "in-progress" });
    const completed = await Task.countDocuments({ status: "completed" });

    // Per-user task breakdown
    const users = await User.find({ role: "user" }).select("-password");
    const breakdown = await Promise.all(
      users.map(async (u) => {
        const taskCount = await Task.countDocuments({ user: u._id });
        const doneCount = await Task.countDocuments({ user: u._id, status: "completed" });
        return { id: u._id, name: u.name, email: u.email, taskCount, doneCount };
      })
    );

    res.json({ totalUsers, totalTasks, pending, inProgress, completed, breakdown });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
