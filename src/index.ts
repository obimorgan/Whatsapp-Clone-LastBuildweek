import server from "./server";
import mongoose from "mongoose";
import { createServer } from 'http'
import { Server } from 'socket.io'
import conversationModel from "./services/conversation/schema";

process.env.TS_NODE_DEV && require("dotenv").config()
const { MONGO_CONNECTION, PORT } = process.env

const httpServer = createServer(server)
const io = new Server(httpServer, {})

io.on('connection', socket => {

  socket.on('newConnection', ({ room }) => {
    socket.join(room)
  })

  socket.on('sendMessage', async ({ messageContent, conversationId, senderId, sentAt }) => {
    try {
      const conversations = await conversationModel.findByIdAndUpdate({ _id: conversationId }, {
        $push: {
          chatHistory: {
            sender: senderId,
            text: messageContent,
            sentAt
          }
        }
      })
      console.log(conversations)
      socket.to(conversationId).emit('receiveMessage', ({ messageContent, senderId, sentAt }))
    } catch (error) {
      console.log(error)
    }
  })

  socket.on('disconnect', () => console.log('disconnected'))

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