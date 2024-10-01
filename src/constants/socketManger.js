// socketManager.js

let connectedUsers = {}; // { userId: socketId }

const addUser = (userId, socketId, io) => {
  connectedUsers[userId] = socketId;
  io.emit("onlineUsers", connectedUsers);
};

const removeUser = (socketId) => {
  for (const userId in connectedUsers) {
    if (connectedUsers[userId] === socketId) {
      delete connectedUsers[userId];
      break;
    }
  }
};

const getActiveUsers = () => {
  return connectedUsers;
};

module.exports = { addUser, removeUser, getActiveUsers, connectedUsers };
