import { Schema, model } from 'mongoose'
import { IConversation } from '../../chats'

const messageSchema = new Schema<IConversation>({
	sender: { type: Schema.Types.ObjectId, ref: 'User' },
	image: String,
	text: String
}, {timestamps: true})

const conversationSchema = new Schema({
	members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	chatHistory: [messageSchema]
})

const conversationModel = model("Conversation", conversationSchema)
export default conversationModel