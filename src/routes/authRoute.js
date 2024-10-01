const express = require("express");
const User = require("../model/userModel");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).send("User not found");

  const isMatch = await bcrypt.compare(password, user?.password);
  if (!isMatch) return res.status(401).send({ message: "Invalid password" });

  const JWT_SECRET = "mySuperSecretKey12345";

  const token = jwt.sign({ id: user?._id }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
  });
  return res.json({
    message: "Login successful",
    success: true,
  });
});

//Logout API
router.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: false,
    maxAge: 0,
  });

  return res.json({ message: "Logout successful", success: true });
});

module.exports = router;
