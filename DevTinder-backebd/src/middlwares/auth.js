const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET || "DevConnect@2005";

const UserAuth = async (req, res, next) => {
  try {
    // 🔍 DEBUG LINE (IMPORTANT)
    console.log("Cookies received:", req.cookies);

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Please login" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.User = user;
    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { UserAuth };
