import {Types} from 'mongoose'

interface IConversation {
	image?: string
	content?: string
	_id: string
}

interface IContact {
	_id: string
	name: string
	conversation: Types.ObjectId
}