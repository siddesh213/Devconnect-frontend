const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user");

const authRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "DevConnect@2005";

// SIGNUP
authRouter.post("/signup", async (req, res) => {
  try {
    const { FirstName, LastName, EmailId, PassWord } = req.body;

    // Basic required fields
    if (!FirstName || !LastName || !EmailId || !PassWord) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({ EmailId });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(PassWord, 10);

    const newUser = new UserModel({
      FirstName,
      LastName,
      EmailId,
      PassWord: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "Signup successful",
      user: {
        _id: newUser._id,
        FirstName: newUser.FirstName,
        LastName: newUser.LastName,
        EmailId: newUser.EmailId,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Signup failed" });
  }
});

// LOGIN
authRouter.post("/login", async (req, res) => {
  const { EmailId, PassWord } = req.body;

  const user = await UserModel.findOne({ EmailId });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(PassWord, user.PassWord);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user._id },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  // ✅ LOCALHOST COOKIE (IMPORTANT)
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  res.json({
    message: "Login successful",
    user: {
      _id: user._id,
      FirstName: user.FirstName,
      LastName: user.LastName,
      EmailId: user.EmailId,
    },
  });
});

// LOGOUT
authRouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
});

module.exports = { authRouter };
