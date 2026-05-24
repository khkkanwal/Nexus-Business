import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import sanitizeHtml from "sanitize-html";

const authController = {};

authController.registerUser = async (req, res) => {
  try {
    const name = sanitizeHtml(req.body.name || "").trim();

    const email = sanitizeHtml(req.body.email || "")
      .trim()
      .toLowerCase();

    const password = sanitizeHtml(req.body.password || "").trim();

    const role = sanitizeHtml(req.body.role || "entrepreneur").trim();

    // VALIDATION
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    const token = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const userWithoutPassword = await User.findById(newUser._id).select(
      "-password",
    );

    res.status(201).json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

authController.loginUser = async (req, res) => {
  try {
    const email = sanitizeHtml(req.body.email || "")
      .trim()
      .toLowerCase();

    const password = sanitizeHtml(req.body.password || "").trim();

    const role = sanitizeHtml(req.body.role || "").trim();

    // VALIDATION
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Email, password and role are required",
      });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    if (user.role !== role) {
      return res.status(400).json({
        message: `This account is registered as ${user.role}`,
      });
    }

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

    const userWithoutPassword = await User.findById(user._id).select(
      "-password",
    );

    res.status(200).json({
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

authController.logoutUser = async (req, res) => {
  try {
    res.json({
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

authController.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

authController.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const name = sanitizeHtml(req.body.name || "").trim();

    const profile = req.body.profile || {};

    const skills = Array.isArray(req.body.skills)
      ? req.body.skills.map((skill) => sanitizeHtml(skill).trim())
      : [];

    const interests = Array.isArray(req.body.interests)
      ? req.body.interests.map((interest) => sanitizeHtml(interest).trim())
      : [];

    if (name) user.name = name;

    if (profile) {
      user.profile.avatar = sanitizeHtml(
        profile.avatar || user.profile.avatar || "",
      );

      user.profile.location = sanitizeHtml(
        profile.location || user.profile.location || "",
      );

      user.profile.bio = sanitizeHtml(profile.bio || user.profile.bio || "");
    }

    if (skills.length > 0) {
      user.skills = skills;
    }

    if (interests.length > 0) {
      user.interests = interests;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

authController.changePassword = async (req, res) => {
  try {
    const currentPassword = sanitizeHtml(req.body.currentPassword || "").trim();

    const newPassword = sanitizeHtml(req.body.newPassword || "").trim();

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

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
