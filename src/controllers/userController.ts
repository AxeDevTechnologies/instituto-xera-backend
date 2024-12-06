import UserModel from "../model/userModel";
import { Request, Response } from 'express';
import EncryptionService from "../services/EncryptionService";

export default class UserController {
    public static async getUser(request: Request, response: Response) {
        try {
            //! PENDING TO MODIFY THIS METHOD
            const test = await UserModel.getUser(request.body.email);
            response.status(200).json(test);
        }
        catch(err) {
            response.status(500).json(err);
        }
    }

    public static async createNewUser(request: Request, response: Response) {
        const {name, email, password, userType} = request.body;
        try {
            const hash: string = await EncryptionService.encryptPassword(password);
            const message = await UserModel.createUser(name, email, hash, userType);
            response.status(200).json({ message: message });
        }
        catch(err: any) {
            response.status(500).json(err.message);
        }
    }
}