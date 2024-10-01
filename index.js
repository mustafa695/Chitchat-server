// server.js
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const cookieParser = require("cookie-parser");
const userRoutes = require("./src/routes/userRoutes");
const authRoute = require("./src/routes/authRoute");
const messageRoutes = require("./src/routes/messageRoutes");
const channelRoute = require("./src/routes/channelRoute");
const loggedInRoute = require("./src/routes/loggedInRoute");

const authMiddleware = require("./src/middleware/authMiddleware");
const { addUser, removeUser } = require("./src/constants/socketManger");
require("./src/constants/dbConnection");

const app = express();
app.use(express.json());
app.use(cookieParser());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://chitchat-eight-alpha.vercel.app", // replace with your frontend URL
    // methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors({
  origin: 'https://chitchat-eight-alpha.vercel.app', // Change to your client URL
  credentials: true,
}));

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Store user when they connect
  socket.on("register", (userId) => {
    addUser(userId, socket.id, io);
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Remove user from connectedUsers
    removeUser(socket.id); // Use the removeUser function
  });
});

app.use("/api/auth", authRoute);
app.use("/api", authMiddleware, loggedInRoute);
app.use("/api/users", userRoutes);
app.use("/api/chat", authMiddleware, messageRoutes(io));
app.use("/api/channel", authMiddleware, channelRoute(io));

server.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
