import UserModel from "../model/userModel";
import { Request, Response } from 'express';

export class UserController {
    public static async getPeople(request: Request, response: Response) {
        try {
            //! PENDING TO MODIFY THIS METHOD
            const test = await UserModel.getAllPeople();
            response.status(200).json(test[0].existingUser);
        }
        catch(err) {
            response.status(500).json(err);
        }
    }

    public static async createNewUser(request: Request, response: Response) {
        const {name, username, email, password, userType} = request.body;
        try {
            const test = await UserModel.createUser(name, username, email, password, userType);
            response.status(200).json({ message: test });
        }
        catch(err: any) {
            response.status(500).json(err.message);
        }
    }
}

export default UserController;