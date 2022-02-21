import { IJWTPayload } from "./users"

declare module 'express-serve-static-core' {
    interface Request {
        payload?: IJWTPayload
        user?: IReqUser
    }
}

namespace Express {
    interface Request {
        image?: string
    }
}

declare module 'query-to-mongo'