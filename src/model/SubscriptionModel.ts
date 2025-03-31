import { stripe } from '../lib/Stripe';
import { db } from '../firebase/config';
import { collection, getDocs, query, where, updateDoc } from 'firebase/firestore';
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
                success_url: 'https://378a-187-176-187-67.ngrok-free.app/success-subscription',
                cancel_url: 'https://378a-187-176-187-67.ngrok-free.app/failed-subscription'
            });
            return subscription;
        }
        catch (err) {
            console.log('el error es aquí', err);
            throw new Error(err as string);
        }
    }

    //? CREACIÓN DE USUARIO EN STRIPE
    public static async createStripeUser(newClient: Stripe.CustomerCreateParams) {
        try {
            const customer = await stripe.customers.create(newClient);
            return customer.id;
        }
        catch (err) {
            throw new Error(err as string);
        }
    }

    public static async updateStripeUser(customerId: string, firebaseCustomerId: string) {
        try {
            const customer = await stripe.customers.update(customerId, {
                metadata: {
                    firebaseCustomerId: firebaseCustomerId,
                },
            });
        }
        catch (err) {
            throw new Error(err as string);
        }
    }

    // ******** CONSULTA (QUERY, GET) DE DATOS ******** //

    //? CONSULTA DE PRECIOS
    public static async pricesList() {
        try {
            const priceList = await stripe.prices.list();
            return priceList;
        }
        catch (err) {
            throw new Error(err as string);
        }
    }

    //! CONSULTA DE PRODUCTOS
    public static async productList() {
        try {
            const priceList = await stripe.products.list();
            return priceList;
        }
        catch (err) {
            throw new Error(err as string);
        }
    }

    //? CONSULTA DE UNA SUSCRIPCIÓN EN ESPECÍFICO
    public static async retrieveSubscription(subscriptionID: string) {
        try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionID);
            return subscription;
        }
        catch (err) {
            throw new Error(err as string);
        }
    }

    //! CONSULTA DE TODAS LAS SUSCRIPCIONES DE UN USUARIO
    public static async getSubscriptions(customerId: string) {
        try {
            const subscriptionList = await stripe.subscriptions.list({
                customer: customerId,
                status: 'active',
            });
            return subscriptionList;
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

    //! CONSULTA DE UN PRODUCTO
    public static async retrieveProduct(productId: string) {
        try {
            const product = await stripe.products.retrieve(productId);
            return product;
        }
        catch (err) {
            throw new Error(err as string);
        }
    }

    public static async updateSubscriptionUser(customerId: string, status: string, initDate: number, dueDate: number, institute: string) {
        try {
            const userRef = collection(db, 'User');
            const queryUser = query(userRef, where('stripeId', '==', customerId));

            const querySnapshot = await getDocs(queryUser);

            if(!querySnapshot.empty) {
                await updateDoc(querySnapshot.docs[0].ref, {
                    membership: {
                        institute: institute,
                        initDate: initDate,
                        dueDate: dueDate,
                        status: status
                    },
                });

            }
            else {
                throw new Error('Usuario no existente');
            }
        }
        catch (err) {
            throw new Error(err as string);
        }
    }




    //! *****************TEST CLOCK***************** \\
    public static async testClock(testClockName: string) {
        try {
            const testClock = await stripe.testHelpers.testClocks.create({
                frozen_time: Math.floor(Date.now() / 1000),
                name: testClockName,
            });

            return testClock;
        }
        catch (err) {
            throw new Error(err as string);
        }
    }

    //? CREACIÓN DE USUARIO EN STRIPE CON TESTCLOCK
    public static async createStripeUserWithTestClock(newClient: Stripe.CustomerCreateParams) {
        try {
            const customer = await stripe.customers.create(newClient);
            return customer.id;
        }
        catch (err) {
            throw new Error(err as string);
        }
    }
}