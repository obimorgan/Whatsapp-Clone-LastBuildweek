// import passport from 'passport'
// import UserModel from "../services/users/schema"
// import { INewUser } from "../users"
// import { provideTokens } from "./functions"
// import FacebookStrategy, {Profile} from "passport-facebook"
// import { VerifyCallback } from 'jsonwebtoken'

// process.env.TS_NODE_DEV && require("dotenv").config()
// const { FACEBOOK_APP_SECRET, FACEBOOK_APP_ID} = process.env

// const facebookStrategy = new FacebookStrategy.Strategy(
//     {
//         clientID: FACEBOOK_APP_ID!,
//         clientSecret: FACEBOOK_APP_SECRET!,
//         callbackURL: "http://localhost:3000/auth/facebook/callback"
//     },
//     async (profile: any, passportNext: any) => {
//         try {
//             console.log(profile)
//             const user = await UserModel.findOne({ facebookId: profile.id })
//             if (user) {
//                 const tokens = await provideTokens(user)
//                 passportNext(null, { tokens})
//                 // passportNext()
//             } else {
//                 const newUser = new UserModel({
//                     firstName: profile.name.givenName,
//                     lastName: profile.name.familyName,
//                     email: profile.email[0].value,
//                     facebookId: profile.id,
//                 });
//                 const saveNewUser = await newUser.save()
//                 const tokens = await provideTokens(saveNewUser)
//                 passportNext()
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }
    
// )

// passport.serializeUser(function (data, passportNext) {
//   passportNext(null, data);
// });

// export default facebookStrategy
