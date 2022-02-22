import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser"
import usersRouter from "./Services/users/index"
import { errorHandlers } from "./Middlewares/errorhandlers"
import contactRouter from "./Services/Contacts/index"
import conversationRouter from "./Services/Conversation/index"

const server = express()
server.use(cors({ origin: 'http//:localhost:3000', credentials: true }))
server.use(express.json())
server.use(cookieParser())

server.use('/contacts', contactRouter)
server.use('/conversations', conversationRouter)
server.use('/users', usersRouter)

server.use(errorHandlers)


export default server