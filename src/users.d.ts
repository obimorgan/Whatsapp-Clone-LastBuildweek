import { Document, Model, Types } from 'mongoose'

export interface IUser extends Document {
    _id: string,
    username: string
    email: string
    password: string
    firstName: string
    lastName: string
    contacts: Types.ObjectId[]
    conversations: Types.ObjectId[]
    avatar: string
    status: string
    lastSeen: date
    refreshJWT: string
    filename: string
    facebookId: string
}

export interface IConversationPopulate {
    _id: string
    members: Types.ObjectId[]
    chatHistory: strinf[]
}

export interface IUserModel extends Model<IUser> {
    authenticate(email: string, plainPW: string): IUser | null
}

export interface IJWTPayload {
    _id: string,
    email: string
}

export interface IReqUser {
    tokens: {
        accessJWT: string
        refreshJWT: string
    }
}

export interface INewUser {
    id: any;
    name: any;
    firstName: string
    lastName: string
    email: any
    facebookId: string
}