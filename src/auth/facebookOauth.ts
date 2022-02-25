import passport from 'passport'
import UserModel from "../services/users/schema"
import { INewUser } from "../users"
import { provideTokens } from "./functions"
import FacebookStrategy, {Profile} from "passport-facebook"
import { VerifyCallback } from 'jsonwebtoken'

process.env.TS_NODE_DEV && require("dotenv").config()
const { FACEBOOK_APP_SECRET, FACEBOOK_APP_ID} = process.env

const facebookStrategy = new FacebookStrategy.Strategy(
    {
        clientID: FACEBOOK_APP_ID!,
        clientSecret: FACEBOOK_APP_SECRET!,
        callbackURL: "https://whatsapp-strive-buildweek4.herokuapp.com/auth/facebook/callback",
        profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
    },
    async (token: string, token2: string, profile: any, passportNext: any) => {
        try {
            console.log(profile)
            const user = await UserModel.findOne({ facebookId: profile.id })
            if (user) {
                const tokens = await provideTokens(user)
                passportNext(null, { tokens, facebookId: user.facebookId})
                // passportNext()
            } else {
                const newUser = new UserModel({
                    username: profile.name.givenName,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    email: profile._json.email,
                    facebookId: profile._json.id,
                });
                const saveNewUser = await newUser.save()
                const tokens = await provideTokens(saveNewUser)
                passportNext(null, {tokens, facebookId: saveNewUser.facebookId})
            }
        } catch (error) {
            console.log(error)
        }
    }
    
)

passport.serializeUser(function (data, passportNext) {
  passportNext(null, data);
});

export default facebookStrategy
