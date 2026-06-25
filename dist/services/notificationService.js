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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = exports.sendEmail = void 0;
const sendEmail = (to, subject, body) => __awaiter(void 0, void 0, void 0, function* () {
    // Simulate SendGrid network delay
    yield new Promise(resolve => setTimeout(resolve, 800));
    console.log('\n=================================================');
    console.log(`[MOCK SENDGRID] Email Dispatched Successfully`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${body}`);
    console.log('=================================================\n');
});
exports.sendEmail = sendEmail;
const sendSMS = (to, message) => __awaiter(void 0, void 0, void 0, function* () {
    // Simulate Twilio network delay
    yield new Promise(resolve => setTimeout(resolve, 500));
    console.log('\n=================================================');
    console.log(`[MOCK TWILIO] SMS Dispatched Successfully`);
    console.log(`To: ${to}`);
    console.log(`Message: ${message}`);
    console.log('=================================================\n');
});
exports.sendSMS = sendSMS;
