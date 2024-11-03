import UserModel from "../model/userModel";
import { Request, Response } from 'express';
import { EncryptionService } from "../services/EncryptionService";

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
        //! MOVE EMAIL VALIDATION TO FRONTEND PART
        try {
            const hash: string = await EncryptionService.encryptPassword(password);
            const test = await UserModel.createUser(name, username, email, hash, userType);
            response.status(200).json({ message: test });
        }
        catch(err: any) {
            response.status(500).json(err.message);
        }
    }
}

export default UserController;