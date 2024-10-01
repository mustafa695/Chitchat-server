const express = require("express");
const router = express.Router();
const Message = require("../model/messageModel");
const { getActiveUsers } = require("../constants/socketManger");

module.exports = (io) => {
  // Send Message
  router.post("/send", async (req, res) => {
    const { senderId, receiverId, content } = req.body;

    try {
      const message = new Message({
        sender: senderId,
        receiver: receiverId,
        content,
      });

      await message.save();
      const connectedUsers = getActiveUsers();
      // Check if receiver is connected and send the message
      const receiverSocketId = connectedUsers[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", message);
      }
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get Messages between two users
  router.get("/messages/:recieverId", async (req, res) => {
    const { recieverId } = req.params;
    const { limit = 10, skip = 0 } = req.query;
    const userId = req?.id;

    try {
      const messages = await Message.find({
        $or: [
          { sender: userId, receiver: recieverId },
          { sender: recieverId, receiver: userId },
        ],
      })
        .sort({ createdAt: -1 })
        .skip(Number(skip))
        .limit(Number(limit))
        .populate("sender")
        .populate("receiver")
        .exec();

      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  //Edit Message
  router.put("/message/:id", async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    try {
      // Find the message by ID and update its content
      const message = await Message.findByIdAndUpdate(
        id,
        { content }, // Update only the content field
        { new: true, runValidators: true } // Options to return the updated document and validate
      );
      const receiverId = message?.receiver?.toString();

      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }

      const connectedUsers = getActiveUsers();
      // Check if receiver is connected and send the message
      const receiverSocketId = connectedUsers[receiverId];

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("updateMessage", message);
      }

      return res
        .status(200)
        .json({ message: "Message updated successfully", data: message });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  });

  //Delete Message
  router.delete("/message/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const message = await Message.findByIdAndDelete(id); // Delete the message by ID
      const receiverId = message?.receiver?.toString();

      if (!message) {
        return res.status(404).json({ message: "Message not found" }); // Handle not found case
      }
      const connectedUsers = getActiveUsers();
      // Check if receiver is connected and send the message
      const receiverSocketId = connectedUsers[receiverId];

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("deleteMessage", id);
      }
      return res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
      console.log(error);
    }
  });

  return router;
};

// module.exports = router;
