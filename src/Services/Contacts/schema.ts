import { Schema, model } from 'mongoose'
import { IContact } from '../../chats'

const contactSchema = new Schema<IContact>({
    name: String,
    conversation: {
        type: Schema.Types.ObjectId,
        ref: "Conversation"
    }
})
const contactModel = model("Contact", contactSchema)
export default contactModel