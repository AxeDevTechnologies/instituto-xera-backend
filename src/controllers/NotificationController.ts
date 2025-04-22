import { Request, Response } from 'express';
import SubscriptionModel from '../model/SubscriptionModel';

export default class NotificationController {
    //! *****************WEBHOOKS***************** \\
    public static async webhooks(request: Request, response: Response) {
        console.log(request.body);
        if(request.body.type === 'invoice.paid' && request.body.data.object.billing_reason === 'subscription_create') {
            const subscriptionId: string = request.body.data.object.subscription;
            const customerId: string = request.body.data.object.customer;

            const subscription = await SubscriptionModel.retrieveSubscription(subscriptionId);
            const currentPeriodStart: number = subscription.current_period_start;
            const currentPeriodEnd: number = subscription.current_period_end;

            const product = await SubscriptionModel.retrieveProduct(subscription.items.data[0].plan.product as string);

            await SubscriptionModel.updateSubscriptionUser(customerId, 'Active', currentPeriodStart, currentPeriodEnd, product.name);
        }
    }

    //! *****************TEST CLOCK***************** \\
    public static async monthlyPayment(request: Request, response: Response) {
        console.log(request.body);
        // try {
        //     const testClock = await SubscriptionModel.testClock();

        //     response.status(200).json({ testClock: testClock });
        // }
        // catch(err) {
        //     response.status(500).json({ message: err });
        // }
    }

    public static async webhookWorkshop(request: Request, response: Response) {
        console.log(request.body);
        if (request.body.type === 'checkout.session.completed' && request.body.data.object.mode === 'payment') {
            
        }
    }

    public static async sendEvent(request: Request, response: Response) {
        response.setHeader("Content-Type", "text/event-stream");
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Connection", "keep-alive");

        const sendEvent = () => {
            response.write('data: Hola mundo');
        }

        sendEvent();
    }
}