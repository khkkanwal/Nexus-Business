import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
const authController = {};

// Register a new user
authController.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      console.log("❌ Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "entrepreneur",
    });
    await newUser.save();
    console.log("🟢 USER CREATED:", newUser._id);
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    const userWithoutPassword = await User.findById(newUser._id).select(
      "-password",
    );

    res.status(201).json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Login a user
// Login a user
authController.loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // CHECK EMPTY FIELDS
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Email, password and role are required",
      });
    }

    // FIND USER
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // CHECK ROLE
    if (user.role !== role) {
      return res.status(400).json({
        message: `This account is registered as ${user.role}`,
      });
    }

    // GENERATE TOKEN
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // RESPONSE
    const userWithoutPassword = await User.findById(user._id).select(
      "-password",
    );

    res.json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
// logout a user
authController.logoutUser = async (req, res) => {
  try {
    res.json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//get current user
authController.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
authController.updateProfile = async (req, res) => {
  try {
    const { name, profile, skills, interests } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;

    if (profile) {
      user.profile.avatar = profile.avatar ?? user.profile.avatar;
      user.profile.location = profile.location ?? user.profile.location;
      user.profile.bio = profile.bio ?? user.profile.bio;
    }

    if (skills) user.skills = skills;
    if (interests) user.interests = interests;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// =========================
// CHANGE PASSWORD
// =========================
authController.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // FIND USER
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // CHECK CURRENT PASSWORD
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    // HASH NEW PASSWORD
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
export default authController;
