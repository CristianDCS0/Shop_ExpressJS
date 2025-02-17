"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
// export async function connect() {
//     return createPool({
//         host: 'localhost',
//         user: 'root',
//         password: 'root',
//         database: 'express_react',
//         connectionLimit: 10
//     });
// }
exports.connect = promise_1.default.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'express_react',
    connectionLimit: 10
});
