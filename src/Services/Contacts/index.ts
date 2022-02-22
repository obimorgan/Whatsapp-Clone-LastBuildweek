import { Router, Request, Response, NextFunction } from "express"
import createHttpError from 'http-errors'
import contactModel from "./schema"

const contactRouter = Router()

contactRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newContact = await new contactModel(req.body).save()
        res.status(201).send(newContact)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

contactRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const contacts = await contactModel.find()
        if (contacts)
            res.send(contacts)
        else {
            return next(createHttpError(404, 'Could not find chats'))
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
})
contactRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const conatacts = await contactModel.findByIdAndDelete(req.params.id,)
        if (conatacts)
            res.send()
        else {
            return next(createHttpError(404, 'Could not find contact'))
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
})

export default contactRouter