const { default: mongoose } = require("mongoose");

const channelMessageSchema = new mongoose.Schema({
  chatRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
    required: true,
  },
  type: { type: String, default: "text" },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ChannelMessage = mongoose.model("ChannelMessage", channelMessageSchema);

module.exports = ChannelMessage;
