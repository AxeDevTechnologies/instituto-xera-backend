"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const User_1 = __importDefault(require("./routes/User"));
// import adminRoutes from './routes/admin';
// import shopRoutes from './routes/shoping';
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:8080',
}));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(User_1.default);
// app.use('/admin', adminRoutes); //* I should use this kind of url to teachers. But instead of use 'admin', I should use 'teacher' or something like that
// app.use(shopRoutes);
app.use((req, res) => {
    res.status(404).send('<h1>Page not found!</h1>');
});
app.listen(3000, () => {
    console.log('Local Server...');
});
