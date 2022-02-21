import { Schema, model } from 'mongoose'
import { IContact } from '../../chats'

const contactSchema = new Schema<IContact>({
    name: String,
    conversation: {
        type: Schema.Types.ObjectId,
        ref: "Conversation"
    }
})

export default model("Contact", contactSchema)