import { Request, Response } from 'express';
import SubscriptionModel from '../model/SubscriptionModel';
import { PreApprovalPlanRequest } from 'mercadopago/dist/clients/preApprovalPlan/commonTypes';
export default class SuscriptionsController {
    private static planData: PreApprovalPlanRequest = {
        reason: 'Akokotzin y Xera - Suscripción semestral',
        auto_recurring: {
          frequency: 6, // Cada 1 mes
          frequency_type: 'months', // months
          transaction_amount: 4999, // Monto a cobrar
          currency_id: 'MXN', // Moneda
        },
        payment_methods_allowed: {
          payment_types: [
            { id: "credit_card" }, // Tarjeta de crédito
            { id: "debit_card" },   // Tarjeta de débito
          ],
          payment_methods: [
            { id: "visa" },          // Visa
            { id: "master" },        // MasterCard
            { id: "debito" },        // Débito
          ],
        },
        back_url: "https://www.youtube.com/",
      };

    public static async membershipSubscription(request: Request, response: Response) {
        try {
            const payment = await SubscriptionModel.membershipSubscription(SuscriptionsController.planData);
            response.status(200).json({ urlPayment: payment });
        }
        catch(err) {
            response.status(500).json({ message: err });
        }
    }

    public static async getMembershipPaymentURL(request: Request, response: Response) {
        try {
            const paymentURL = await SubscriptionModel.getMembershipPaymentURL(request.query.course as string, request.query.membershipType as string);

            response.status(200).json({ course: paymentURL });
        }
        catch(err) {
            response.status(500).json({ message: err });
        }
    }
}