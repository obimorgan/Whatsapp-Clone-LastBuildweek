import e from 'express'
import express, { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import { provideTokens, verifyJWTsAndRegenerate } from '../../auth/functions'
import { cloudinary, parser } from '../../utils/cloudinary'
import UserModel from './schema'

const usersRouter = express.Router()

usersRouter.post('/register', parser.single('userAvatar'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName } = req.body
        const newUser = new UserModel({
            ...req.body,
            avatar: req.file?.path || `https://ui-avatars.com/api/?name=${firstName}+${lastName}`,
            filename: req.file?.filename
        })
        await newUser.save()
        res.status(201).send(newUser)
    } catch (error) {
        next(error)
    }
})

usersRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body
        const user = await UserModel.authenticate(email, password)
        if (user) {
            const { accessJWT, refreshJWT } = await provideTokens(user)
            res.send({ accessJWT, refreshJWT })
        } else {
            next(createHttpError(401, 'Invalid credentials.'))
        }
    } catch (error) {
        next(error)
    }
})

usersRouter.post('/refreshToken', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { currentRefreshJWT } = req.body
        const { accessJWT, refreshJWT } = await verifyJWTsAndRegenerate(currentRefreshJWT)
        res.send({ accessJWT, refreshJWT })
    } catch (error) {
        next(error)
    }
})

export default usersRouter