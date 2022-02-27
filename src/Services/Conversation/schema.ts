import { Schema, model } from 'mongoose'
import { IConversation } from '../../chats'

const messageSchema = new Schema<IConversation>({
	sender: { type: Schema.Types.ObjectId, ref: 'User' },
	image: String,
	text: String,
	sentAt: Date,
	ticks: { type: Number, default: 1}
})

const conversationSchema = new Schema({
	members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	chatHistory: [messageSchema],
	lastMessage: messageSchema,
	name: String
})

const conversationModel = model("Conversation", conversationSchema)
export default conversationModel