import { Request, Response } from 'express';
import SubscriptionModel from '../model/SubscriptionModel';

interface Workshop {
    id: string;                 // ID único del taller (generado por Firebase o Stripe)
    workshopId: string;          // ID de referencia a tu catálogo de talleres
    stripePaymentId: string;     // ID del pago en Stripe (ej: 'pi_123')
    purchaseDate: number;        // Timestamp de compra
    status: 'active' | 'used' | 'expired'; // Estado del taller
    price: number;              // Precio pagado (en centavos o unidad monetaria)
    currency: string;           // Moneda (ej: 'mxn')
    sessionId?: string;         // ID de la sesión de Stripe Checkout
    expiresAt?: number;         // Timestamp de expiración (si aplica)
}

export default class NotificationController {
    //! *****************WEBHOOKS***************** \\
    public static async webhooks(request: Request, response: Response) {
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
        // try {
        //     const testClock = await SubscriptionModel.testClock();

        //     response.status(200).json({ testClock: testClock });
        // }
        // catch(err) {
        //     response.status(500).json({ message: err });
        // }
    }

    public static async webhookWorkshop(request: Request, response: Response) {
        const event = request.body;
        
        try {
            // Verificar solo eventos de pago completados
            if (event.type === 'checkout.session.completed' && event.data.object.mode === 'payment') {
                const session = event.data.object;
                const customerId = session.customer; // ID del cliente en Stripe
                const paymentIntentId = session.payment_intent;
                
                // 1. Obtener detalles del pago
                const paymentIntent = await SubscriptionModel.retrieveWorkshopPayment(paymentIntentId)
                
                // 2. Extraer metadata (debes configurarla al crear el checkout)
                const workshopId = session.metadata?.workshopId;
                const userId = session.metadata?.customerId; // ID de tu sistema
                
                if (!workshopId || !userId) {
                    throw new Error('Metadata faltante en sesión de Stripe');
                }
    
                // 3. Crear objeto del taller
                const newWorkshop: Workshop = {
                    id: paymentIntentId, // Usamos el ID del pago como ID único
                    workshopId: workshopId,
                    stripePaymentId: paymentIntentId,
                    purchaseDate: Date.now(),
                    status: 'active',
                    price: paymentIntent!.amount,
                    currency: paymentIntent!.currency,
                    sessionId: session.id,
                };
    
                SubscriptionModel.createUpdateWorkshopBuy(newWorkshop, customerId);
            }
            
            response.status(200).send('Webhook procesado');
        }
        catch (err) {
            console.error('Error en webhook:', err);
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