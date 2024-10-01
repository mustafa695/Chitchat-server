const express = require("express");
const User = require("../model/userModel");
const router = express.Router();

router.get("/me", async (req, res) => {
  const _id = req?.id;
  const user = await User.findOne({ _id }).select("-password");
  if (!user) {
    return res.status(401);
  }
  return res.status(201).json({
    data: user,
  });
});

module.exports = router;
