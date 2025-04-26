import Stripe from 'stripe';
import { db } from '../firebase/config';
import { stripe } from '../lib/Stripe';
import { collection, doc, getDocs, addDoc, getDoc, where, query, QuerySnapshot, DocumentData, QueryConstraint } from 'firebase/firestore';
export default class WorkshopModel {
    public static async createBuyWorkshop(workshopPriceId: string, customerId: string, workshopId: string) {
        try {
            const sessionObject: Stripe.Checkout.SessionCreateParams = {
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: workshopPriceId,
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                customer: customerId,
                metadata: {
                    workshopId: workshopId,
                    customerId: customerId,
                    workshopPriceId: workshopPriceId
                },
                success_url: 'https://76b9-2806-2f0-53e0-a14-8288-86ad-e3a6-d106.ngrok-free.app/workshop',
                cancel_url: 'https://76b9-2806-2f0-53e0-a14-8288-86ad-e3a6-d106.ngrok-free.app'
            }
            const session = await stripe.checkout.sessions.create(sessionObject);

            return session;
        }
        catch(err) {
            throw new Error(err as string);
        }
    }

    public static async getWorkshops(userId?: string) {
        try {

            const filters: QueryConstraint[] = []; 
            if(userId !== '') {
                filters.push(where('userId', '==', userId));
            }

            const workshopQuery: QuerySnapshot<DocumentData, DocumentData> = await getDocs(query(collection(db, 'Workshop'), ...filters));

            if(workshopQuery.empty) {
                return {
                    message: 'Todavía no hay talleres disponibles.',
                }
            }

            let userSnap = null
            if(userId !== '') {
                const userRef = doc(db, 'User', userId!);
                userSnap = await getDoc(userRef);
            }

            const workshops: any[] = [];

            workshopQuery.forEach((doc) => {
                workshops.push({ id: doc.id, ...doc.data(), teacher: userSnap?.data()?.name || '' });
            });

            return workshops;
        }
        catch(err) {
            throw new Error(err as string);
        }
    }

    public static async getWorkshopsForTeachers(teacherId: string) {
        try {            
            const workshopQuery: QuerySnapshot<DocumentData, DocumentData> = await getDocs(query(collection(db, 'Workshop'), where('userId', '==', teacherId)));

            if(workshopQuery.empty) {
                return {
                    message: 'Todavía no hay talleres disponibles.',
                }
            }

            const userRef = doc(db, 'User', teacherId);
            const userSnap = await getDoc(userRef);

            const workshops: any[] = [];

            workshopQuery.forEach((doc) => {
                workshops.push({ id: doc.id, ...doc.data(), teacher: userSnap.data()!.name });
            });

            return workshops;
        }
        catch(err) {
            throw new Error(err as string);
        }
    }

    public static async getSubtopic(subtopicId: string) {
        try {
            const subtopic = await getDoc(doc(db, 'Subtopic', subtopicId));

            if(!subtopic.exists()) {
                throw new Error('Vídeo no encontrado');
            }

            return subtopic.data();
        }
        catch(err) {
            throw new Error(err as string);
        }
    }

    public static async getSubtopics(workshopId: string) {
        try {
            const querySnapshot = await getDocs(query(collection(db, "Subtopic"), where('workshopId', '==', workshopId)));

            const subtopics: any[] = [];

            querySnapshot.forEach((doc) => {
                subtopics.push({ id: doc.id, ...doc.data() });
            });

            return subtopics;
        }
        catch(err) {
            throw new Error(err as string);
        }
    }

    public static async createWorkshop(workshopName: string, price: number, institute: string, userId: string, thumbnail: string): Promise<string> {
        try {
            const workshopIdStripe = await WorkshopModel.createWorkshopForStripe(workshopName, price);
            const workshop = await addDoc(collection(db, "Workshop"), {
                name: workshopName,
                price: price,
                institute: institute,
                userId: userId,
                thumbnail: thumbnail,
                workshopIdStripe: workshopIdStripe.productId,
                priceId: workshopIdStripe.priceId
            });

            const metadata = {
                workshopId: workshop.id,
                customerId: userId,
                priceId: workshopIdStripe.priceId
            }

            await this.updateWorkshopForStripe(metadata, workshopIdStripe.productId)

            return workshop.id;
        }
        catch(err) {
            console.log(err, 'err');
            throw new Error(err as string);
        }
    }

    public static async createWorkshopForStripe(workshopName: string, precio: number,) {
        try {
            // Crear producto
            const product = await stripe.products.create({
                name: workshopName,
            });

            // Crear precio asociado
            const price = await stripe.prices.create({
                unit_amount: Math.round(precio * 100),
                currency: 'mxn',
                product: product.id,
            });

            return {
                productId: product.id,
                priceId: price.id,
            };
        }
        catch (error) {
            console.error('Error creando producto y precio en Stripe:', error);
            throw error;
        }
    }

    public static async updateWorkshopForStripe(newData: any, productId: string) {
        try {
            // Crear producto
            const product = await stripe.products.update(productId,
                {
                    metadata: newData,
                },
            );
        }
        catch (error) {
            console.error('Error creando producto y precio en Stripe:', error);
            throw error;
        }
    }

    public static async createSubTopic(subtopic: string, workshopId: number) {
        try {
            await addDoc(collection(db, "Subtopic"), {
                name: subtopic,
                workshopId: workshopId,
            });

            return 'Clase creada exitósamente';
        }
        catch(err) {
            throw new Error(err as string);
        }
    }

    public static async doesWorkshopExist(workshopName: string) {
        try {
            const workshopQuery = query(collection(db, 'Workshop'), where('name', '==', workshopName));

            const workshopSnap = await getDocs(workshopQuery);

            return workshopSnap.empty
        }
        catch(err) {
            throw new Error(err as string);
        }
    }

    public static async doesSubtopicExist(subtopicName: string) {
        try {
            const suptopicQuery = query(collection(db, 'Subtopic'), where('name', '==', subtopicName));

            const subtopicSnap = await getDocs(suptopicQuery);

            return subtopicSnap.empty
        }
        catch(err) {
            throw new Error(err as string);
        }
    }

    public static async getWorkshop(workshopId: string) {
        try {
            const docRef = doc(db, 'Workshop', workshopId);
            const snapshot = await getDoc(docRef);

            return snapshot.data()!;
        }
        catch(err) {
            throw new Error(err as string);
        }
    }
}