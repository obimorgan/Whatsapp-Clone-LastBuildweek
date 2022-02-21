import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser"

const server = express()
server.use(cors())
server.use(express.json())
server.use(cookieParser())


export default server