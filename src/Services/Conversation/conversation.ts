import { Schema, model } from 'mongoose'
import { IConversation } from '../../chats'

const conversationSchema = new Schema<IConversation>({
	image: String,
	content: String
})


const conversationModel = model("Conversation", conversationSchema)
export default conversationModel
