import chatsModel from "./conversation"
import { Router, Request, Response, NextFunction } from "express"
import createHttpError from 'http-errors'

const chatsRoute = Router()

chatsRoute.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const conversation = await new chatsModel(req.body).save()
        res.sendStatus(201)
    } catch (error) {   
        console.log(error)
        next(error)
    }
})

chatsRoute.post('/:chatId/history', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const chats = await chatsModel.findByIdAndUpdate(req.params.chatId,
            { $push: { singleChat: req.body } }, { new: true })
        if (chats) { res.status(201).send(chats) }
        else {next(createHttpError(404, `could not find chat with this id: ${req.params.id}`))}
    } catch (error) {   
        console.log(error)
        next(error)
    }
})

chatsRoute.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const chats = await chatsModel.findById(req.params.id)
        if(chats)
            res.send(chats)
        else {
            return next(createHttpError(404, 'Could not find chats'))
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
})
chatsRoute.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const chats = await chatsModel.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if(chats)
            res.send(chats)
        else {
            return next(createHttpError(404, 'Could not find chats'))
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
})
chatsRoute.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const chats = await chatsModel.findById(req.params.id)
        if(chats)
            res.send(chats)
        else {
            return next(createHttpError(404, 'Could not find chats'))
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
})

