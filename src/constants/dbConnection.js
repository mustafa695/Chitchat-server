const { default: mongoose } = require("mongoose");

const dbConnection = mongoose
  .connect(
    "mongodb+srv://amustufa37:Mus560479@chat-app.fp0ks.mongodb.net/chat-app?retryWrites=true&w=majority"
  )
  .then(() => console.log("connected with server."))
  .catch((err) => console.log(err, "mongoes connection error"));

module.exports = dbConnection;
