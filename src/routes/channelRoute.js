const express = require("express");
const Channel = require("../model/channelModle");
const ChannelMessage = require("../model/channelMessageModal");
const router = express.Router();

module.exports = (io) => {
  // Create Channel
  router.post("/create", async (req, res) => {
    const { name, users } = req.body;
    try {
      const channel = new Channel({
        name,
        users,
      });
      await channel.save();

      res.status(201).json({
        message: "Channel created successfully",
        data: channel,
      });
    } catch (error) {
      res.status(500).json({ error: error?.message });
    }
  });

  router.post("/message", async (req, res) => {
    const { chatRoom, type, sender, content } = req.body;

    try {
      const channel = new ChannelMessage({
        chatRoom,
        type,
        sender,
        content,
      });
      await channel.save();

      res.status(201).json({
        message: "Messgae send successfully",
        data: channel,
      });
    } catch (error) {
      res.status(500).json({ error: error?.message });
    }
  });

  //Get Channels of users
  router.get("/", async (req, res) => {
    const { userId } = req.query;
    try {
      const channels = await Channel.find({
        users: userId,
      });
      res.status(201).json({
        data: channels,
      });
    } catch (error) {
      res.status(500).json({ error: error?.message });
    }
  });

  //Get Channels messages
  router.get("/channelMessages", async (req, res) => {
    const { channelId } = req.query;
    console.log({channelId});
    
    try {
      const channels = await ChannelMessage.find({
        chatRoom: channelId,
      });
      res.status(201).json({
        data: channels,
      });
    } catch (error) {
      res.status(500).json({ error: error?.message });
    }
  });

  return router;
};
