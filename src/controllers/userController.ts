import UserModel from "../model/userModel";
import { Request, Response } from 'express';

export class UserController {
    public static async getPeople(request: Request, response: Response) {
        try {
            const test = await UserModel.getAllPeople();
            console.log(test);
            response.status(200).json(test[0]);
        }
        catch(err) {
            response.status(500).json(err);
        }
    }
}
// const UserController = {
//     getPeople: (resquest: Request, response: Response) => {
//         const test = UserModel.getAllPeople();
//         console.log(test);
        // UserModel.getAllPeople((err: Error, user: any) => {
        //     if(err) response.status(500).json({ error: err.message });
        //     response.status(200).json(user);
        // });
        // response.status(200).send('<h1>test</h1>');
            // response.status(200).json(test);
        // response.json(UserModel.getAllPeople());
    // },

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
// }

export default UserController;