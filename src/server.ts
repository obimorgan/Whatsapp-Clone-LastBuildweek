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
const whitelist = ['http://localhost:3000', 'https://strive-bw-4.vercel.app']
const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
    },
    credentials: true
}
server.use(cors(corsOptions))
server.use(express.json())
server.use(cookieParser())
server.use(passport.initialize())


server.use('/users', usersRouter)
server.use('/conversations', JWTAuth, conversationRouter)
server.use('/auth/facebook', oauthRouter)

server.use(errorHandlers)


export default server