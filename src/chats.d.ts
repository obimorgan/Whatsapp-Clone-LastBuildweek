import {Types} from 'mongoose'

interface IConversation {
	sender: Types.ObjectId
	image?: string
	text?: string
	_id: string
}