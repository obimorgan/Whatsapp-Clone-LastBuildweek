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
const http_errors_1 = __importDefault(require("http-errors"));
const functions_1 = require("../../auth/functions");
const JWTAuth_1 = require("../../middlewares/JWTAuth");
const cloudinary_1 = require("../../utils/cloudinary");
const schema_1 = __importDefault(require("./schema"));
const schema_2 = __importDefault(require("../conversation/schema"));
const usersRouter = express_1.default.Router();
const { NODE_ENV } = process.env;
usersRouter.post('/register', cloudinary_1.parser.single('userAvatar'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { firstName, lastName } = req.body;
        const newUser = new schema_1.default(Object.assign(Object.assign({}, req.body), { avatar: ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) || `https://ui-avatars.com/api/?name=${firstName}+${lastName}`, filename: (_b = req.file) === null || _b === void 0 ? void 0 : _b.filename }));
        yield newUser.save();
        const { accessJWT, refreshJWT } = yield (0, functions_1.provideTokens)(newUser);
        res.cookie('accessToken', accessJWT, { httpOnly: true, secure: NODE_ENV === "production" ? true : false });
        res.cookie('refreshToken', refreshJWT, { httpOnly: true, secure: NODE_ENV === "production" ? true : false });
        res.status(201).send(newUser);
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield schema_1.default.authenticate(email, password);
        if (user) {
            const { accessJWT, refreshJWT } = yield (0, functions_1.provideTokens)(user);
            res.cookie('accessToken', accessJWT, { httpOnly: true, secure: true });
            res.cookie('refreshToken', refreshJWT, { httpOnly: true, secure: true });
            res.send('Tokens Sent');
        }
        else {
            next((0, http_errors_1.default)(401, 'Invalid credentials.'));
        }
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.post('/facebook-login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.cookies.facebookId) {
            next((0, http_errors_1.default)(401, 'No access token provided in cookies.'));
        }
        else {
            try {
                const token = req.cookies.facebookId;
                const user = yield schema_1.default.findOne({ facebookId: token });
                if (!user)
                    return next((0, http_errors_1.default)(404, "No user"));
                res.send(user);
            }
            catch (error) {
                next((0, http_errors_1.default)(401, 'Invalid token in cookies.'));
            }
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}));
usersRouter.post('/refreshToken', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.cookies;
        const { accessJWT, refreshJWT } = yield (0, functions_1.verifyJWTsAndRegenerate)(refreshToken);
        res.cookie('accessToken', accessJWT, { httpOnly: true, secure: NODE_ENV === "production" ? true : false });
        res.cookie('refreshToken', refreshJWT, { httpOnly: true, secure: NODE_ENV === "production" ? true : false });
        res.send('Tokens Sent');
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.get('/', JWTAuth_1.JWTAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield schema_1.default.find();
        res.send(users);
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.get('/everyone-else', JWTAuth_1.JWTAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const users = yield schema_1.default.find({ _id: { $ne: (_c = req.payload) === null || _c === void 0 ? void 0 : _c._id } }).sort({ username: 'asc' });
        res.send(users);
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.get('/me', JWTAuth_1.JWTAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.payload) {
            const user = yield schema_1.default.findById(req.payload._id).populate({ path: 'conversations', populate: { path: 'members' } });
            user ? res.send(user) : next((0, http_errors_1.default)(404, `User with id ${req.payload._id} does not exist.`));
        }
        else {
            next((0, http_errors_1.default)(400, 'Invalid request.'));
        }
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.put('/me', JWTAuth_1.JWTAuth, cloudinary_1.parser.single('userAvatar'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    try {
        if (req.payload) {
            const oldUser = yield schema_1.default.findById(req.payload._id);
            if (oldUser) {
                const body = Object.assign(Object.assign({}, req.body), { avatar: ((_d = req.file) === null || _d === void 0 ? void 0 : _d.path) || oldUser.avatar, filename: ((_e = req.file) === null || _e === void 0 ? void 0 : _e.filename) || oldUser.filename });
                const editedUser = yield schema_1.default.findByIdAndUpdate(req.payload._id, body, { new: true });
                if (!editedUser)
                    return next((0, http_errors_1.default)(404, `User with id ${req.payload._id} does not exist.`));
                if (oldUser.filename && req.file) {
                    yield cloudinary_1.cloudinary.uploader.destroy(oldUser.filename);
                }
                res.send(editedUser);
            }
            else {
                next((0, http_errors_1.default)(404, `User with id ${req.payload._id} does not exist.`));
            }
        }
        else {
            next((0, http_errors_1.default)(400, 'Invalid request.'));
        }
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.delete('/me', JWTAuth_1.JWTAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.payload) {
            const deletedUser = yield schema_1.default.findByIdAndDelete(req.payload._id);
            if (!deletedUser)
                return next((0, http_errors_1.default)(404, `User with id ${req.payload._id} does not exist or has already been deleted.`));
            if (deletedUser.filename) {
                yield cloudinary_1.cloudinary.uploader.destroy(deletedUser.filename);
            }
            res.status(204).send();
        }
        else {
            next((0, http_errors_1.default)(400, 'Invalid request.'));
        }
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.get('/me/contacts', JWTAuth_1.JWTAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.payload) {
            const user = yield schema_1.default.findById(req.payload._id, { contacts: 1, _id: 0 }).populate('contacts');
            user ? res.send(user.contacts) : next((0, http_errors_1.default)(404, `User with id ${req.payload._id} does not exist.`));
        }
        else {
            next((0, http_errors_1.default)(400, 'Invalid request.'));
        }
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.get('/me/conversations', JWTAuth_1.JWTAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.payload) {
            const conversations = yield schema_2.default.find({}, { members: 1, _id: 0 }).populate('members');
            if (!conversations)
                return next((0, http_errors_1.default)(404, `conversations with id ${req.payload._id} does not exist.`));
            res.send(conversations);
        }
        else {
            next((0, http_errors_1.default)(400, 'Invalid request.'));
        }
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.post('/contact', JWTAuth_1.JWTAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    try {
        const userToAdd = yield schema_1.default.findOne({ email: req.body.email });
        if (!userToAdd)
            return next((0, http_errors_1.default)(404, 'user not found'));
        const user = yield schema_1.default.findByIdAndUpdate((_f = req.payload) === null || _f === void 0 ? void 0 : _f._id, {
            $push: { contacts: userToAdd._id }
        }, { new: true, runValidators: true });
        if (!user)
            return next((0, http_errors_1.default)(400, 'Invalid request.'));
        res.send(userToAdd);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}));
exports.default = usersRouter;
