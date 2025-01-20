import { Request, Response } from 'express';
import { VexorSubscriptionBody } from 'vexor';
import SubscriptionModel from '../model/SubscriptionModel';

export default class SuscriptionsController {
    private static baseSubscription: VexorSubscriptionBody = {
        name: '',
        description: '',
        interval: '',
        price: 699,
        currency: 'MXN',
        successRedirect: 'https://www.youtube.com/', //? This should not be a local url, instead should be a public url
        customer: {
            email: '',
            name: '',
        },
    }

    public static async monthlySuscription(request: Request, response: Response) {
        try {
            SuscriptionsController.baseSubscription.name = request.body.name;
            SuscriptionsController.baseSubscription.description = request.body.description;
            SuscriptionsController.baseSubscription.interval = request.body.interval;
            SuscriptionsController.baseSubscription.price = request.body.price;
            SuscriptionsController.baseSubscription.customer = {
                email: request.body.email,
                name: request.body.username
            };

            const payment = await SubscriptionModel.monthlySuscription(SuscriptionsController.baseSubscription);
            response.status(200).json(payment);
        }
        catch(err) {
            console.log(err)
            response.status(500).json({ message: err });
        }
    }
}