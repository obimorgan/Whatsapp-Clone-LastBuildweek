"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
process.env.TS_NODE_DEV && require("dotenv").config();
const { MONGO_CONNECTION, PORT } = process.env;
const httpServer = (0, http_1.createServer)(server_1.default);
const io = new socket_io_1.Server(httpServer, {});
io.on('connection', socket => {
    socket.on('newConnection', ({ room }) => {
        socket.join(room);
    });
    socket.on('sendMessage', ({ messageContent, conversationId, senderId, sentAt }) => {
        console.log(`Server sending message to ${conversationId}`);
        socket.to(conversationId).emit('receiveMessage', ({ messageContent, senderId, sentAt }));
    });
    socket.on('disconnect', () => console.log('disconnected'));
});
mongoose_1.default.connect(MONGO_CONNECTION);
mongoose_1.default.connection.on("connected", () => {
    console.log("Connected to Mongo");
    httpServer.listen(PORT, () => {
        console.log("Server listens to port:", PORT);
    });
});
mongoose_1.default.connection.on("error", (err) => {
    console.log(err);
});
