import express from "express"
import passport from 'passport'
import { provideTokens } from "./functions";

const {FE_URL, NODE_ENV} = process.env

const oauthRouter = express.Router()

oauthRouter.get('/',
  passport.authenticate('facebook', {scope: "email"}));

oauthRouter.get('/callback',
  passport.authenticate('facebook', { failureRedirect: `${FE_URL}/register` }),
  async (req, res, next) => {
    try {
      console.log(req.user)

      res.cookie('accessToken', req.user.tokens.accessJWT, { httpOnly: true, secure: NODE_ENV === "production" ? true : false, sameSite: "none"  })
      res.cookie('refreshToken', req.user.tokens.refreshJWT, { httpOnly: true, secure: NODE_ENV === "production" ? true : false, sameSite: "none" })
      res.cookie('facebookId', req.user.facebookId, { httpOnly: true, secure: NODE_ENV === "production" ? true : false, sameSite: "none" })
      res.redirect(`${FE_URL}/facebook`);
        
    } catch (error) {
       console.log(error)
    }
    })
  
export default oauthRouter