"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
//user schema
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        maxlength: 30,
        minlength: 2,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure uniqueness
        // match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },
    password: {
        type: String,
        required: true,
        // maxlength: 10,
        // min: 6,
        unique: true,
    },
    username: {
        type: String,
        unique: true,
        validate: {
            validator: function (value) {
                // Alphanumeric with a length between 3 and 20 characters
                return /^[a-zA-Z0-9]{5,10}$/.test(value);
            },
            message: (props) => `${props.value} is not a valid username. Must be alphanumeric and between 3 to 20 characters.`,
        },
    },
    profile_img: String,
});
//user model
exports.UserModel = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=Users.js.map