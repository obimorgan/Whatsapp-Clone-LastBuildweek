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
        const conversation = await new conversationModel().save()
        if (!conversation) return next(createHttpError(400, 'Invalid request.'))
        
        const sender = await UserModel.findByIdAndUpdate(req.payload?._id, { $push: { conversations: conversation._id },},
            { new: true, runValidators: true })
        if (!sender) return next(createHttpError(400, 'Invalid request.'))
        
        const recipient = await UserModel.findByIdAndUpdate(req.body.recipientId, {$push: { conversations: conversation._id },}, 
            { new: true, runValidators: true })
        if (!recipient) return next(createHttpError(400, 'Invalid request.'))
        
        res.send({ sender, recipient })
    } catch (error) {
        console.log(error)
        next(error)
    }
})

// conversationRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const conversation = await conversationModel.find()
//         if (conversation)
//             res.send(conversation)
//         else {
//             return next(createHttpError(404, 'Could not find chats'))
//         }
//     } catch (error) {
//         console.log(error)
//         next(error)
//     }
// })

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

