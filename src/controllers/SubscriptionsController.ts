import { Request, Response } from 'express';
import SubscriptionModel from '../model/SubscriptionModel';
import {config} from 'dotenv'

config();
export default class SubscriptionsController {

    private static memberships: Map<string, string> = new Map<string, string>();

    static {
        SubscriptionsController.memberships.set('Xera - Month', process.env.XERA_MONTH_PRICE!)
        SubscriptionsController.memberships.set('Akokotzin - Month', process.env.AKOKOTZIN_MONTH_PRICE!)
        SubscriptionsController.memberships.set('Akokotzin - Xera - Month', process.env.XERA_AKOKOTZI_MONTH_PRICE!)
        SubscriptionsController.memberships.set('Xera - Biannual', process.env.XERA_BIANNUAL_PRICE!)
        SubscriptionsController.memberships.set('Akokotzin - Biannual', process.env.AKOKOTZIN_BIANNUAL_PRICE!)
        SubscriptionsController.memberships.set('Akokotzin - Xera - Biannual', process.env.XERA_AKOKOTZI_BIANNUAL_PRICE!)
    }

    public static async createSubscription(request: Request, response: Response) {
        try {
            const subscription = await SubscriptionModel.createSubscription(request.body.customerId, SubscriptionsController.memberships.get(`${request.body.course} - ${request.body.membershipType}`) as string);
            response.status(200).json(subscription);
        }
        catch(err) {
            console.log(err);
            response.status(500).json({ message: err });
        }
    }

    public static async getProductList(request: Request, response: Response) {
        try {
            const productList = await SubscriptionModel.productList();
            response.status(200).json(productList);
        }
        catch(err) {
            console.log(err);
            response.status(500).json({ message: err });
        }
    }

    public static async getAllPrices(request: Request, response: Response) {
        try {
            const paymentURL = await SubscriptionModel.pricesList();

            response.status(200).json({ course: paymentURL });
        }
        catch(err) {
            response.status(500).json({ message: err });
        }
    }

    public static async getAllSubscriptions(request: Request, response: Response) {
        try {
            const subscription = await SubscriptionModel.getSubscriptions(request.query.customerId as string);

            response.status(200).json({ course: subscription });
        }
        catch(err) {
            response.status(500).json({ message: err });
        }
    }

    public static async getCustomer(request: Request, response: Response) {
        try {
            const subscription = await SubscriptionModel.getCustomer(request.query.customerId as string);

            response.status(200).json({ course: subscription });
        }
        catch(err) {
            response.status(500).json({ message: err });
        }
    }

    public static async retrieveSubscription(request: Request, response: Response) {
        try {
            const subscription = await SubscriptionModel.retrieveSubscription(request.query.subscriptionID as string);

            response.status(200).json({ course: subscription });
        }
        catch(err) {
            response.status(500).json({ message: err });
        }
    }

    public static async retrieveProduct(request: Request, response: Response) {
        try {
            const product = await SubscriptionModel.retrieveProduct(request.query.productId as string);

            response.status(200).json({ product: product });
        }
        catch(err) {
            response.status(500).json({ message: err });
        }
    }
}