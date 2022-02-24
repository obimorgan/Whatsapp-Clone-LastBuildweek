// import express from "express"
// import passport from 'passport'

// const {FE_URL} = process.env

// const oauthRouter = express.Router()

// oauthRouter.get('/',
//   passport.authenticate('facebook', {scope: ["profile", "email"]}));

// oauthRouter.get('/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   async (req, res, next) => {
//     try {
//         res.cookie('accessToken', req.user.tokens.accessToken, { httpOnly: true, secure: false })
//         res.cookie('refreshToken', req.user.tokens.refreshToken, { httpOnly: true, secure: false })
//         res.redirect(`${FE_URL}`);
//     } catch (error) {
//        console.log(error)
//     }
//     })
  
// export default oauthRouter