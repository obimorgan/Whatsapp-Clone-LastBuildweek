import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { IUser, IUserModel } from '../../users'

const { Schema, model } = mongoose

const UserSchema = new Schema<IUser>(
    {
        _id: { type: String },
        username: { type: String, required: true },
        email: { type: String },
        password: { type: String },
        avatar: { type: String },
        firstName: { type: String },
        lastName: { type: String },
        refreshJWTs: [{ type: String }],
        filename: { type: String }
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


export default model<IUser, IUserModel>('User', UserSchema)