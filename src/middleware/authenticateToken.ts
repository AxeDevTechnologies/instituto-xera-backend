import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authenticateToken = (request: Request, response: Response, next: NextFunction) => {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return response.status(401).json({ message: 'No token provided' });

    jwt.verify(token, process.env.ACCESS_SECRET!, (err, user) => {
        if (err) return response.status(403).json({ message: 'Invalid or expired token' });
        (request as any).user = user;
        next();
    });
};

export default authenticateToken;