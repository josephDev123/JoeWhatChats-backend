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
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Define SMTP configuration
const smtpConfig = {
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "8c619e086a8eaa",
        pass: "59b31dc12492de",
    },
};
// Create a reusable transporter
const transporter = nodemailer_1.default.createTransport(smtpConfig);
// Define a function to send emails
const sendMail = ({ otp, email }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const info = yield transporter.sendMail({
            from: "JosephUzuegbu@gmail.com",
            to: email,
            subject: "Confirmation OTP",
            text: otp,
            html: `<p>Pls don't expose this otp: ${otp}</p>`,
        });
        return info.messageId;
    }
    catch (error) {
        throw new Error("Failed to send email");
    }
});
exports.sendMail = sendMail;
//# sourceMappingURL=sendMail.js.map