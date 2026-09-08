const express = require("express");
const User = require("../models/User");
const Task = require("../models/Task");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// GET /api/admin/stats -> counts for dashboard (admin only)
router.get("/stats", protect, authorize("admin"), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalManagers = await User.countDocuments({ role: "manager" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalRegularUsers = await User.countDocuments({ role: "user" });
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: "completed" });

    res.json({
      totalUsers,
      totalManagers,
      totalAdmins,
      totalRegularUsers,
      totalTasks,
      completedTasks,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/admin/users -> list all users (admin only)
router.get("/users", protect, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PATCH /api/admin/users/:id/role -> change a user's role (admin only)
router.patch("/users/:id/role", protect, authorize("admin"), async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "manager", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE /api/admin/users/:id -> remove a user (admin only)
router.delete("/users/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await Task.deleteMany({ user: user._id });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
