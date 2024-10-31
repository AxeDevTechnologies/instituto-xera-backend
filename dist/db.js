"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const config = {
    host: 'localhost',
    user: 'xera_user',
    password: '17650010',
    database: 'institutoXera',
};
const connection = mysql2_1.default.createPool(config);
exports.default = connection;
