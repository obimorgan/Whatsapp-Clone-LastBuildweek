"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    image: String,
    text: String,
    sentAt: Date,
    ticks: { type: Number, default: 1 }
});
const conversationSchema = new mongoose_1.Schema({
    members: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    chatHistory: [messageSchema],
    lastMessage: messageSchema,
    name: String
});
const conversationModel = (0, mongoose_1.model)("Conversation", conversationSchema);
exports.default = conversationModel;
