import server from "./server";
import mongoose from "mongoose";
import { createServer } from 'http'
import { Server } from 'socket.io'

process.env.TS_NODE_DEV && require("dotenv").config()
const { MONGO_CONNECTION, PORT } = process.env

const httpServer = createServer(server)
const io = new Server(httpServer, {})

io.on('connection', (socket) => {
  socket.on('sendMessage', ({ messageContent, conversationId }) => {
    try {
      socket.to(conversationId).emit('message', messageContent)
    } catch (error) {
      console.log(error)
    }
  })
  socket.on('joinGroupChat', ({ groupId }) => {
    socket.join(groupId)
  })
  socket.on('disconnect', () => {
    io.disconnectSockets()
  })
})

mongoose.connect(MONGO_CONNECTION!);

mongoose.connection.on("connected", () => {
  console.log("Connected to Mongo");
  httpServer.listen(PORT, () => {
    console.log("Server listens to port:", PORT);
  });
});
mongoose.connection.on("error", (err) => {
  console.log(err);
});