"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const schema_1 = __importDefault(require("./services/conversation/schema"));
process.env.TS_NODE_DEV && require("dotenv").config();
const { MONGO_CONNECTION, PORT } = process.env;
const httpServer = (0, http_1.createServer)(server_1.default);
const io = new socket_io_1.Server(httpServer, {});
io.on('connection', socket => {
    socket.on('newConnection', ({ room }) => {
        socket.join(room);
    });
    socket.on('sendMessage', ({ messageContent, conversationId, senderId, sentAt }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const conversations = yield schema_1.default.findByIdAndUpdate({ _id: conversationId }, {
                $push: {
                    chatHistory: {
                        sender: senderId,
                        text: messageContent,
                        sentAt
                    }
                }
            });
            console.log(conversations);
            socket.to(conversationId).emit('receiveMessage', ({ messageContent, senderId, sentAt }));
        }
        catch (error) {
            console.log(error);
        }
    }));
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
