import { stripe } from '../lib/Stripe';
import { db } from '../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Stripe from 'stripe';

export default class SubscriptionModel {

    // ? CREAR SUSCRIPCIÓN PARA USUARIO
    public static async createSubscription(customerID: string, priceID: string) {
        try {
            const subscription = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price: priceID,
                    quantity: 1,
                }],
                mode: 'subscription',
                customer: customerID,
                success_url: 'https://9cd1-2806-2f0-53e0-44d1-52f-71d1-a0bb-f0ac.ngrok-free.app/success-subscription',
                cancel_url: 'https://9cd1-2806-2f0-53e0-44d1-52f-71d1-a0bb-f0ac.ngrok-free.app/failed-subscription'
            });
            return subscription;
        }
        catch (err) {
            console.log(err);
            throw new Error(err as string);
        }
    }

    //? CREACIÓN DE USUARIO EN STRIPE
    public static async createStripeUser(newClient: Stripe.CustomerCreateParams) {
        try {
            const customer = await stripe.customers.create(newClient);
            stripe.paymentMethods.attach
            return customer.id;
        }
        catch (err) {
            throw new Error(err as string);
        }
    }

    //? CONSULTA DE PRECIOS Y/O PRODUCTOS
    public static async pricesList() {
        try {
            const priceList = await stripe.prices.list();
            return priceList;
        }
        catch (err) {
            throw new Error(err as string);
        }
    }

    //? CONSULTA DE PRECIOS Y/O PRODUCTOS
    public static async productList() {
        try {
            const priceList = await stripe.products.list();
            return priceList;
        }
        catch (err) {
            throw new Error(err as string);
        }
    }

    //? CONSULTA DE PRECIOS Y/O PRODUCTOS
    public static async retrieveSubscription(subscriptionID: string) {
        try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionID);
            console.log(subscription.items.data[0].plan.product)
            return subscription;
        }
        catch (err) {
            throw new Error(err as string);
        }
    }

    //? CONSULTA DE PRECIOS Y/O PRODUCTOS
    public static async getSubscriptions() {
        try {
            const priceList = await stripe.subscriptions.list({
                customer: 'cus_RiI9mobAO9NJy8',
                status: 'active',
            });
            return priceList;
        }
        catch (err) {
            throw new Error(err as string);
        }
    }

    //? CONSULTA A CLIENTE
    public static async getCustomer(customerId: string) {
        try {
            const customer = await stripe.customers.retrieve(customerId);
            return customer;
        }
        catch (err) {
            throw new Error(err as string);
        }
    }

    public static async getMembershipPaymentURL(course: string, membershipType: string) {
        try {
            const courseQuery = query(collection(db, 'Membership'), where('Course', '==', course));
            const courseSnap = await getDocs(courseQuery);

            if (courseSnap.empty) {
                throw new Error('Curso no encontrado');
            }
            return courseSnap.docs[0].data()[membershipType];
        }
        catch (err) {
            throw new Error(err as string);
        }
    }
}