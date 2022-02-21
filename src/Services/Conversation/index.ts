import conversationModel from "./schema"
import { Router, Request, Response, NextFunction } from "express"
import createHttpError from 'http-errors'
import { cloudinary, parser } from '../../utils/cloudinary'

const conversationRouter = Router()

conversationRouter.post('/', parser.single('conversationImg'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {content} = req.body
        const conversation = await new conversationModel({...req.body,
            image: req.file?.path,
            filename: req.file?.filename
        }).save()
        console.log(conversation)
        res.status(201).send(conversation)
    } catch (error) {   
        console.log(error)
        next(error)
    }
})

conversationRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const conversation = await conversationModel.find()
        if(conversation)
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
        const conversation = await conversationModel.findByIdAndDelete(req.params.id,)
        if(conversation)
            res.send()
        else {
            return next(createHttpError(404, 'Could not find chats'))
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
})

export default conversationRouter

