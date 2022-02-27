import server from "./server";
import mongoose from "mongoose";
import { createServer } from 'http'
import { Server } from 'socket.io'
import conversationModel from "./services/conversation/schema"
import UserModal from './services/users/schema'
import UserModel from "./services/users/schema";

process.env.TS_NODE_DEV && require("dotenv").config()
const { MONGO_CONNECTION, PORT } = process.env

const httpServer = createServer(server)
const io = new Server(httpServer, {})

io.on('connection', socket => {

  socket.on('newConnection', ({ room }) => {
    socket.join(room)
  })

  socket.on('online', async ({ senderId}) => {
    try {
      const user = await UserModel.findByIdAndUpdate({ _id: senderId}, { lastSeen: 'Online' })
    } catch (error) {
      console.log(error)
    }
  })

  socket.on('sendMessage', async ({ messageContent, conversationId, senderId, sentAt }) => {
    try {
      const conversations = await conversationModel.findByIdAndUpdate({ _id: conversationId }, {
        $push: {
          chatHistory: {
            sender: senderId,
            text: messageContent,
            sentAt,
            ticks: 2
          }
        },
        lastMessage: {
          sender: senderId,
          text: messageContent,
          sentAt,
          ticks: 2
        }
      }, {new: true})
      socket.to(conversationId).emit('receiveMessage', ({ messageContent, senderId, sentAt, ticks: 2 }))
    } catch (error) {
      console.log(error)
    }
  })

  socket.on('delivered', ({ conversationId}) => {
    console.log('here')
    socket.to(conversationId).emit('msg-received', { conversationId })
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