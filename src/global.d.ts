import facebookStrategy from "./auth/facebookOauth"
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

namespace facebookStrategy {
    type UserField =
        | 'id'
        | 'email'
        | 'first_name'
        | 'last_name'
        | 'name';
    type User = any; 

}