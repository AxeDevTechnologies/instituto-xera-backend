import { Request, Response } from 'express';
import UserModel from '../model/userModel';
import { RowDataPacket } from 'mysql2';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

export default class AuthController {
    private static readonly secret_key: string = '(Ph}S6O=S[5-L8cR=5;lGN7D/oLg7HF8';
    
    public static async login(request: Request, response: Response) {
        const { username, password } = request.body;

        const [user]: RowDataPacket[] = await UserModel.getUser(username);
        if(!user) {
            response.status(400).json({ error: 'Wrong username' });
            return;
        }
        
        const isThePasswordRight: boolean = await bcrypt.compare(password, user.password);
        
        if(!isThePasswordRight) {
            response.status(400).json({ error: 'Wrong password' });
            return;
        }

        response.json(jwt.sign({ username: user.username, userType: user.userType }, AuthController.secret_key, { expiresIn: '1m' }));
    }
}