import { Request, Response } from 'express';
import UserModel from '../model/userModel';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();
export default class AuthController {
    private static readonly access_token: string = process.env.ACCESS_SECRET || '';
    private static readonly refresh_token: string = process.env.REFRESH_SECRET || '';
    
    public static async login(request: Request, response: Response) {
        try {
            const { email, password } = request.body;

            const user = await UserModel.getUser(email);
            if(!user) {
                response.status(400).json('Correo electrónico incorrecto');
                return;
            }
            
            const isThePasswordRight: boolean = await bcrypt.compare(password, user.userInformation.password);
            
            if(!isThePasswordRight) {
                response.status(400).json('Contraseña incorrecta');
                return;
            }

            delete user.userInformation.password;

            response.json({token: AuthController.generateTokens(user.userInformation.name, user.userInformation.email), user });
        }
        catch(err) {
            console.log(err);
        }
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
                ));
            }
            else {
                response.status(403).send('Invalid token payload');
            }
        });
    }

    public static generateTokens(name: string, email: string) {
        const expiresIn: number = 3600;
        const accessToken: string = jwt.sign({ username: name, email: email }, AuthController.access_token, { expiresIn: '1d' });

        const refreshToken: string = jwt.sign({ username: name, email: email }, AuthController.refresh_token, { expiresIn: '7d' });

        return { accessToken, refreshToken, expiresIn };
    }
}