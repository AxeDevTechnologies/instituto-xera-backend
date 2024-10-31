"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../model/userModel"));
const UserController = {
    getPeople: (resquest, response) => {
        const test = userModel_1.default.getAllPeople();
        console.log(test);
        // UserModel.getAllPeople((err: Error, user: any) => {
        //     if(err) response.status(500).json({ error: err.message });
        //     response.status(200).json(user);
        // });
        // response.status(200).send('<h1>test</h1>');
        response.status(200).json(test);
        // response.json(UserModel.getAllPeople());
    },
    // newUser: (request: Request, response: Response) => {
    //     UserModel.createPerson(request.body.name, (err: Error, user) => {
    //         if(err) return response.status(500).json({ error: err.message });
    //         const message = UserController.createUser(user.insertId, request);
    //         console.log(message)
    //     });
    // },
    // createUser: (idPerson: number, request: Request) => {
    //     const { username, email, password, userType } = request.body;
    //     if(!!username || !!email || !!password || !!userType || !!idPerson) return new Error('All fields are required.');
    //     UserModel.createUser(username, email, password, userType, idPerson, (err: Error, newUser: any) => {
    //         if(err) return new Error(err.message);
    //         return { message: 'Usuario creado exitósamente', newUser };
    //     });
    // }
};
exports.default = UserController;
