import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser"
import usersRouter from "./Services/users"
import { errorHandlers } from "./Middlewares/errorhandlers"

const server = express()
server.use(cors())
server.use(express.json())
server.use(cookieParser())

server.use('/users', usersRouter)
server.use('/contacts')
server.use('/conversations')

server.use(errorHandlers)


export default server