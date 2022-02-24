import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser"
import usersRouter from "./services/users/index"
import { errorHandlers } from "./middlewares/errorhandlers"
import conversationRouter from "./services/conversation/index"
import { JWTAuth } from "./middlewares/JWTAuth"
import facebookStrategy from "./auth/facebookOauth"
import oauthRouter from "./auth"
import passport from 'passport'

passport.use('facebook', facebookStrategy)
const server = express()
server.use(cors({ origin: 'http://localhost:3000', credentials: true }))
server.use(express.json())
server.use(cookieParser())
server.use(passport.initialize())


server.use('/users', usersRouter)
server.use('/conversations', JWTAuth, conversationRouter)
server.use('/auth/facebook', oauthRouter)

server.use(errorHandlers)


export default server