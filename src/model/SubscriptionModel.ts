import { vexor } from '../lib/vexor';
import { VexorSubscriptionBody, VexorSubscriptionResponse } from 'vexor';

export default class SubscriptionModel {
    public static async monthlySuscription(subscriptionPlan: VexorSubscriptionBody) {
        try {
            const response: VexorSubscriptionResponse = await vexor.subscribe.mercadopago(subscriptionPlan);
            return response;
        }
        catch(err) {
            console.log(err);
            throw new Error(err as string);
        }
    }
}