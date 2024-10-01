const express = require("express");
const User = require("../model/userModel");
const router = express.Router();
const bcrypt = require("bcryptjs");

router.post("/", async (req, res) => {
  const { name, email, password, profileImage } = req.body;

  const user = await User.findOne({ email });

  if (user) return res.status(409).json({ message: "Email already exist" });

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({
      name,
      email,
      password: hashedPassword,
      profileImage,
    });

    await user.save();
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const user = await User.find({});
    return res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
