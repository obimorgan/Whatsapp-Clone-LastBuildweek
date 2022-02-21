import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import { verifyJWT } from '../auth/functions'


export const JWTAuth = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.accessJWT) {
        next(createHttpError(401, 'No access token provided in cookies.'))
    } else {
        try {
            const token = req.cookies.accessJWT
            const payload = verifyJWT(token)
            req.payload = { _id: (await payload)._id, email: (await payload).email }
            next()
        } catch (error) {
            next(createHttpError(401, 'Invalid token in cookies.'))
        }
    }
}