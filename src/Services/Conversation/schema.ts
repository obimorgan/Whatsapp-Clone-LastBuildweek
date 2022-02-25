import { Schema, model } from 'mongoose'
import { IConversation } from '../../chats'

const messageSchema = new Schema<IConversation>({
	sender: { type: Schema.Types.ObjectId, ref: 'User' },
	image: String,
	text: String
})

const conversationSchema = new Schema({
	members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	chatHistory: [messageSchema],
	name: String
})

const conversationModel = model("Conversation", conversationSchema)
export default conversationModel