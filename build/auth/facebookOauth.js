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
const passport_1 = __importDefault(require("passport"));
const schema_1 = __importDefault(require("../services/users/schema"));
const functions_1 = require("./functions");
const passport_facebook_1 = __importDefault(require("passport-facebook"));
process.env.TS_NODE_DEV && require("dotenv").config();
const { FACEBOOK_APP_SECRET, FACEBOOK_APP_ID } = process.env;
const facebookStrategy = new passport_facebook_1.default.Strategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "https://whatsapp-strive-buildweek4.herokuapp.com/auth/facebook/callback",
    profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
}, (token, token2, profile, passportNext) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(profile);
        const user = yield schema_1.default.findOne({ facebookId: profile.id });
        if (user) {
            const tokens = yield (0, functions_1.provideTokens)(user);
            passportNext(null, { tokens, facebookId: user.facebookId });
            // passportNext()
        }
        else {
            const newUser = new schema_1.default({
                username: profile.name.givenName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile._json.email,
                facebookId: profile._json.id,
            });
            const saveNewUser = yield newUser.save();
            const tokens = yield (0, functions_1.provideTokens)(saveNewUser);
            passportNext(null, { tokens, facebookId: saveNewUser.facebookId });
        }
    }
    catch (error) {
        console.log(error);
    }
}));
passport_1.default.serializeUser(function (data, passportNext) {
    passportNext(null, data);
});
exports.default = facebookStrategy;
