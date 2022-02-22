import express, { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import { provideTokens, verifyJWTsAndRegenerate } from '../../auth/functions'
import { JWTAuth } from '../../Middlewares/JWTAuth'
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
            res.cookie('accessToken', accessJWT, { httpOnly: true, secure: false })
            res.cookie('refreshToken', refreshJWT, { httpOnly: true, secure: false })
            res.send()
        } else {
            next(createHttpError(401, 'Invalid credentials.'))
        }
    } catch (error) {
        next(error)
    }
})

usersRouter.post('/refreshToken', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.cookies
        const { accessJWT, refreshJWT } = await verifyJWTsAndRegenerate(refreshToken)
        res.cookie('accessToken', accessJWT, { httpOnly: true, secure: false })
        res.cookie('refreshToken', refreshJWT, { httpOnly: true, secure: false })
        res.send()
    } catch (error) {
        next(error)
    }
})

usersRouter.get('/', JWTAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await UserModel.find()
        res.send(users)
    } catch (error) {
        next(error)
    }
})

usersRouter.get('/me', JWTAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.payload) {
            const user = await UserModel.findById(req.payload._id)
            user ? res.send(user) : next(createHttpError(404, `User with id ${req.payload._id} does not exist.`))
        } else {
            next(createHttpError(400, 'Invalid request.'))
        }
    } catch (error) {
        next(error)
    }
})

usersRouter.put('/me', JWTAuth, parser.single('userAvatar'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.payload) {
            const oldUser = await UserModel.findById(req.payload._id)
            if (oldUser) {
                const body = { ...req.body, avatar: req.file?.path || oldUser.avatar, filename: req.file?.filename || oldUser.filename }
                const editedUser = await UserModel.findByIdAndUpdate(req.payload._id, body, { new: true })
                if (!editedUser) return next(createHttpError(404, `User with id ${req.payload._id} does not exist.`))
                if (oldUser && req.file) {
                    await cloudinary.uploader.destroy(oldUser.filename)
                }
                res.send(editedUser)
            } else {
                next(createHttpError(404, `User with id ${req.payload._id} does not exist.`))
            }
        } else {
            next(createHttpError(400, 'Invalid request.'))
        }
    } catch (error) {
        next(error)
    }
})

usersRouter.delete('/me', JWTAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.payload) {
            const deletedUser = await UserModel.findByIdAndDelete(req.payload._id)
            if (!deletedUser) return next(createHttpError(404, `User with id ${req.payload._id} does not exist or has already been deleted.`))
            if (deletedUser.filename) {
                await cloudinary.uploader.destroy(deletedUser.filename)
            }
            res.status(204).send()
        } else {
            next(createHttpError(400, 'Invalid request.'))
        }
    } catch (error) {
        next(error)
    }
})

export default usersRouter
