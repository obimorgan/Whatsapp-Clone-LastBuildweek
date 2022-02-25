"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const index_1 = __importDefault(require("./services/users/index"));
const errorhandlers_1 = require("./middlewares/errorhandlers");
const index_2 = __importDefault(require("./services/conversation/index"));
const JWTAuth_1 = require("./middlewares/JWTAuth");
const facebookOauth_1 = __importDefault(require("./auth/facebookOauth"));
const auth_1 = __importDefault(require("./auth"));
const passport_1 = __importDefault(require("passport"));
passport_1.default.use('facebook', facebookOauth_1.default);
const server = (0, express_1.default)();
const whitelist = ['http://localhost:3000', 'https://strive-bw-4.vercel.app'];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};
server.use((0, cors_1.default)(corsOptions));
server.use(express_1.default.json());
server.use((0, cookie_parser_1.default)());
server.use(passport_1.default.initialize());
server.use('/users', index_1.default);
server.use('/conversations', JWTAuth_1.JWTAuth, index_2.default);
server.use('/auth/facebook', auth_1.default);
server.use(errorhandlers_1.errorHandlers);
exports.default = server;
