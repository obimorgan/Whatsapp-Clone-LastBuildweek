"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const { FE_URL, NODE_ENV } = process.env;
const oauthRouter = express_1.default.Router();
oauthRouter.get('/', passport_1.default.authenticate('facebook', { scope: "email" }));
oauthRouter.get('/callback', passport_1.default.authenticate('facebook', { failureRedirect: `${FE_URL}/register` }), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.user);
        res.cookie('accessToken', req.user.tokens.accessJWT, { httpOnly: true, secure: NODE_ENV === "production" ? true : false });
        res.cookie('refreshToken', req.user.tokens.refreshJWT, { httpOnly: true, secure: NODE_ENV === "production" ? true : false });
        res.cookie('facebookId', req.user.facebookId, { httpOnly: true, secure: NODE_ENV === "production" ? true : false });
        res.redirect(`${FE_URL}/facebook`);
    }
    catch (error) {
        console.log(error);
    }
}));
exports.default = oauthRouter;
