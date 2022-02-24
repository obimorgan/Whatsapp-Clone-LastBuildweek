import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { IUser, IUserModel } from '../../users'

const { Schema, model } = mongoose

const UserSchema = new Schema<IUser>(
    {
        username: { type: String, required: true },
        email: { type: String },
        password: { type: String },
        avatar: { type: String },
        firstName: { type: String },
        lastName: { type: String },
        contacts: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        conversations: [{ type: Schema.Types.ObjectId, ref: 'Conversation' }],
        status: { type: String, default: "I'm busy" },
        lastSeen: { type: Date, default: Date.now() },
        refreshJWT: { type: String },
        filename: { type: String },
        facebookId: String
    },
    { timestamps: true }
)

UserSchema.pre('save', async function (next) {
    const newUser = this
    const plainPW = this.password
    if (newUser.isModified('password')) {
        const hashedPW = await bcrypt.hash(plainPW, 12)
        newUser.password = hashedPW
    }
    next()
})

UserSchema.methods.toJSON = function () {
    const userDocument = this
    const userObj = userDocument.toObject()
    delete userObj.password
    delete userObj.__v
    delete userObj.refreshJWTs
    return userObj
}

UserSchema.statics.authenticate = async function (email, plainPW) {
    const user = await this.findOne({ email })
    if (user) {
        const pwMatch = await bcrypt.compare(plainPW, user.password)
        if (pwMatch) {
            return user
        } else {
            return null
        }
    } else {
        return null
    }
}

const UserModel = model<IUser, IUserModel>('User', UserSchema)
export default UserModel