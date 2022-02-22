import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser"
import usersRouter from "./services/users/index"
import { errorHandlers } from "./middlewares/errorhandlers"
import contactRouter from "./services/contacts/index"
import conversationRouter from "./services/conversation/index"

const server = express()
server.use(cors({ origin: 'http//:localhost:3000', credentials: true }))
server.use(express.json())
server.use(cookieParser())

server.use('/contacts', contactRouter)
server.use('/conversations', conversationRouter)
server.use('/users', usersRouter)

server.use(errorHandlers)


export default server