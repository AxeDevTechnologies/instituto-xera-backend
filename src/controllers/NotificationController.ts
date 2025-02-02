import { Request, Response } from 'express';

export default class NotificationController {
    public static async setPayment(request: Request, response: Response) {
        console.log('notificado', request.body, request.query);
        console.log('**************');
        console.log(request.url);
        response.status(200).json({ message: 'payment' });
    }
}