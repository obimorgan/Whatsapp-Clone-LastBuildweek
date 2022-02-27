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
const schema_1 = __importDefault(require("./schema"));
const express_1 = require("express");
const http_errors_1 = __importDefault(require("http-errors"));
const schema_2 = __importDefault(require("../users/schema"));
const conversationRouter = (0, express_1.Router)();
// conversationRouter.post('/', parser.single('conversationImg'), async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { text } = req.body
//         const conversation = await new conversationModel({
//             ...req.body,
//             image: req.file?.path,
//             filename: req.file?.filename
//         }).save()
//         console.log(conversation)
//         res.status(201).send(conversation)
//     } catch (error) {
//         console.log(error)
//         next(error)
//     }
// })
conversationRouter.post('/newConvo', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const user = yield schema_2.default.findById(req.body.recipientId);
        if (!user)
            return next((0, http_errors_1.default)(404, 'Invalid Recipient.'));
        const previousConversations = yield schema_1.default.find().populate('members');
        const oldConvo = previousConversations.filter(convo => {
            var _a, _b;
            if (convo.members.length === 2 && ((convo.members[0]._id.toString() === user._id.toString() && convo.members[1]._id.toString() === ((_a = req.payload) === null || _a === void 0 ? void 0 : _a._id.toString())) || (convo.members[0]._id.toString() === ((_b = req.payload) === null || _b === void 0 ? void 0 : _b._id.toString()) && convo.members[1]._id.toString() === user._id.toString())))
                return convo;
        });
        if (oldConvo.length > 0)
            return res.status(202).send(oldConvo[0]);
        const conversation = yield new schema_1.default({
            members: [(_a = req.payload) === null || _a === void 0 ? void 0 : _a._id, user._id]
        }).save();
        if (!conversation)
            return next((0, http_errors_1.default)(400, 'Invalid request.'));
        const newConvo = yield schema_1.default.findById(conversation._id).populate('members');
        const sender = yield schema_2.default.findByIdAndUpdate((_b = req.payload) === null || _b === void 0 ? void 0 : _b._id, { $push: { conversations: conversation._id }, }, { new: true, runValidators: true });
        if (!sender)
            return next((0, http_errors_1.default)(400, 'Invalid request.'));
        const recipient = yield schema_2.default.findByIdAndUpdate(user._id, { $push: { conversations: conversation._id }, }, { new: true, runValidators: true });
        if (!recipient)
            return next((0, http_errors_1.default)(400, 'Invalid request.'));
        res.send(newConvo);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}));
conversationRouter.post('/newGroupConvo', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const conversation = yield new schema_1.default({
            name: req.body.name,
            members: [(_c = req.payload) === null || _c === void 0 ? void 0 : _c._id, ...req.body.memberIds]
        }).save();
        if (!conversation)
            return next((0, http_errors_1.default)(400, 'Invalid request.'));
        const newConvo = yield schema_1.default.findById(conversation._id).populate('members');
        const sender = yield schema_2.default.findByIdAndUpdate((_d = req.payload) === null || _d === void 0 ? void 0 : _d._id, { $push: { conversations: conversation._id }, }, { new: true, runValidators: true });
        if (!sender)
            return next((0, http_errors_1.default)(400, 'Invalid request.'));
        req.body.memberIds.forEach((member) => __awaiter(void 0, void 0, void 0, function* () {
            const recipient = yield schema_2.default.findByIdAndUpdate(member, { $push: { conversations: conversation._id }, }, { new: true, runValidators: true });
            if (!recipient)
                return next((0, http_errors_1.default)(400, 'Invalid request.'));
        }));
        res.send(newConvo);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}));
conversationRouter.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conversation = yield schema_1.default.findById(req.params.id);
        if (conversation)
            res.send(conversation);
        else {
            return next((0, http_errors_1.default)(404, 'Could not find chats'));
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}));
conversationRouter.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const me = yield schema_2.default.findByIdAndUpdate((_e = req.payload) === null || _e === void 0 ? void 0 : _e._id, { $pull: { conversations: req.params.id } }, { new: true, runValidators: true });
        if (!me)
            return next((0, http_errors_1.default)(400, 'Invalid request.'));
        res.send(me);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}));
exports.default = conversationRouter;
