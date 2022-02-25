import conversationModel from "./schema"
import { Router, Request, Response, NextFunction } from "express"
import createHttpError from 'http-errors'
import { cloudinary, parser } from '../../utils/cloudinary'
import UserModel from "../users/schema"

const conversationRouter = Router()

// conversationRouter.post('/', parser.single('conversationImg'), async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { text } = req.body
//         const conversation = await new conversationModel({
//             ...req.body,
//             image: req.file?.path,
//             filename: req.file?.filename
//         }).save()
//         console.log(conversation)
//         res.status(201).send(conversation)
//     } catch (error) {
//         console.log(error)
//         next(error)
//     }
// })

conversationRouter.post('/newConvo', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserModel.findById(req.body.recipientId)
        if (!user) return next(createHttpError(404, 'Invalid Recipient.'))
        const previousConversations = await conversationModel.find().populate('members')
        const oldConvo = previousConversations.filter(convo => {
            if (convo.members.length === 2 && ((convo.members[0]._id.toString() === user._id.toString() && convo.members[1]._id.toString() === req.payload?._id.toString()) || (convo.members[0]._id.toString() === req.payload?._id.toString() && convo.members[1]._id.toString() === user._id.toString()))) return convo
        })
        if (oldConvo.length > 0) return res.status(202).send(oldConvo[0])
        const conversation = await new conversationModel({
            members: [req.payload?._id, user._id]
        }).save()
        if (!conversation) return next(createHttpError(400, 'Invalid request.'))
        const newConvo = await conversationModel.findById(conversation._id)
        const sender = await UserModel.findByIdAndUpdate(req.payload?._id, { $push: { conversations: conversation._id },},
            { new: true, runValidators: true })
        if (!sender) return next(createHttpError(400, 'Invalid request.'))
        
        const recipient = await UserModel.findByIdAndUpdate(user._id, {$push: { conversations: conversation._id },}, 
            { new: true, runValidators: true })
        if (!recipient) return next(createHttpError(400, 'Invalid request.'))
        
        res.send(newConvo)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

conversationRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const conversation = await conversationModel.findById(req.params.id)
        if (conversation)
            res.send(conversation)
        else {
            return next(createHttpError(404, 'Could not find chats'))
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
})

conversationRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const me = await UserModel.findByIdAndUpdate(req.payload?._id, { $pull: { conversations: req.params.id }},
            { new: true, runValidators: true })
        if (!me) return next(createHttpError(400, 'Invalid request.'))        
        res.send(me)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

export default conversationRouter

