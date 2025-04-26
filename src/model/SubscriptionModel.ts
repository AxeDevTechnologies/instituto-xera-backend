import { stripe } from '../lib/Stripe';
import { db } from '../firebase/config';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
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
                success_url: 'https://1312-177-242-220-113.ngrok-free.app/classes',
                cancel_url: 'https://1312-177-242-220-113.ngrok-free.app'
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
          
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data();
                
                const newMembership = {
                    instituteId: institute,
                    initDate: initDate,
                    dueDate: dueDate,
                    status: status,
                    paymentStatus: 'paid',
                };
            
                if (userData.memberships) {
                    const existingIndex = userData.memberships.findIndex(
                        (m: any) => m.instituteId === institute
                    );
                
                    if (existingIndex >= 0) {
                        const updatedMemberships = [...userData.memberships];
                        updatedMemberships[existingIndex] = newMembership;
                        
                        await updateDoc(userDoc.ref, {
                        memberships: updatedMemberships
                        });
                    }
                    else {
                        await updateDoc(userDoc.ref, {
                            memberships: [...userData.memberships, newMembership]
                        });
                    }
                }
                else {
                    await updateDoc(userDoc.ref, {
                        memberships: [newMembership]
                    });
                }
            }
            else {
                throw new Error('Usuario no existente');
            }
        } 
        catch (err) {
            throw new Error(typeof err === 'string' ? err : 'Error desconocido');
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

    //? CANCELAR UNA SUSCRIPCIÓN
    public static async cancelSubscription(subscriptionId: string) {
        try {
            const subscription = await stripe.subscriptions.cancel('sub_1MlPf9LkdIwHu7ixB6VIYRyX');
        }
        catch(err) {

        }
    }

    //! MOVER A ALGO DE SOLAMENTE STRIPE
    public static async retrieveWorkshopPayment(paymentId: string) {
        try {
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
            return paymentIntent;
        }
        catch(err) {

        }
    }

    public static async createUpdateWorkshopBuy(newWorkshop: any, customerId: string) {
        try {
            //! ESTO DE OBTENER EL USUARIO TAMBIÉN HACERLO GENERAL PARA QUE LO USEN VARIOS
            const userRef = collection(db, 'User');
            const queryUser = query(userRef, where('stripeId', '==', customerId));
            const userSnap = await getDocs(queryUser);

            if (!userSnap.empty) {
                // Actualizar el array de talleres
                const userDoc = userSnap.docs[0]
                const userData = userDoc.data();

                // Referencia al documento específico
                const userDocRef = doc(db, 'User', userDoc.id); 

                await updateDoc(userDocRef, {
                    workshops: userData.workshops 
                        ? [...userData.workshops, newWorkshop] 
                        : [newWorkshop]
                });

                return 'Taller comprado exitósamente'
                
            }
            else {
                console.error(`Usuario no encontrado`);
            }
        }
        catch(err) {

        }
    }
}