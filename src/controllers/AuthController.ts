import { Request, Response } from 'express';
import UserModel from '../model/userModel';
import { RowDataPacket } from 'mysql2';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();
export default class AuthController {
    private static readonly access_token: string = process.env.ACCESS_SECRET || '';
    private static readonly refresh_token: string = process.env.REFRESH_SECRET || '';
    
    public static async login(request: Request, response: Response) {
        const { email, password } = request.body;

        const [user]: RowDataPacket[] = await UserModel.getUser(email);
        if(!user) {
            response.status(400).json('Correo electrónico incorrecto');
            return;
        }
        
        const isThePasswordRight: boolean = await bcrypt.compare(password, user.password);
        
        if(!isThePasswordRight) {
            response.status(400).json('Contraseña incorrecta');
            return;
        }

        response.json(AuthController.generateTokens(user.name, user.email, user.userType, user.id_user));
    }

    public static refreshToken(request: Request, response: Response) {
        const refreshToken: string = request.body.refreshToken;

        if (!refreshToken) {
            response.status(403).send('Refresh token is required');
        }

        jwt.verify(refreshToken, AuthController.refresh_token, (err, decoded) => {
            if (err) {
                response.status(403).send('Invalid refresh token');
            }
    
            if (typeof decoded !== 'string' && decoded) {
                response.json(AuthController.generateTokens(
                    decoded.username, 
                    decoded.email, 
                    decoded.userType,
                    decoded.id_user
                ));
            }
            else {
                response.status(403).send('Invalid token payload');
            }
        });
    }

    public static generateTokens(name: string, email: string, userType: string, userId: number) {
        const expiresIn: number = 3600;
        const accessToken: string = jwt.sign({ username: name, email: email, userType: userType, userId }, AuthController.access_token, { expiresIn: '1h' });

        const refreshToken: string = jwt.sign({ username: name, email: email, userType: userType, userId }, AuthController.refresh_token, { expiresIn: '7d' });

        return { accessToken, refreshToken, expiresIn };
    }
}