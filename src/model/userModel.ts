import { db } from '../firebase/config';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import SubscriptionModel from './SubscriptionModel';

export default class UserModel {
    public static async getUser(email: string){
        try {
            const userQuery = query(collection(db, 'User'), where('email', '==', email));
            const userSnap = await getDocs(userQuery);

            if(userSnap.empty) {
                throw new Error('Usuario no encontrado');
            }
            return {
                userId: userSnap.docs[0].id,
                userInformation: userSnap.docs[0].data()
            };
        }
        catch(err) {
            throw new Error(err as string);
        }
    }

    public static async getStudents(){
        try {
            const userQuery = query(collection(db, 'User'), where('userType', '==', 'Student'));
            const userSnap = await getDocs(userQuery);

            if(userSnap.empty) {
                throw new Error('Usuario no encontrado');
            }

            const users: any = [];
            userSnap.forEach((doc) => {
                const student = doc.data();
                delete student.password
                users.push({ id: doc.id, ...student });
            });

            return users;
        }
        catch(err) {
            throw new Error(err as string);
        }
    }

    public static async createUser(name: string, email: string, password: string, userType: string): Promise<string> {
        try {
            const testClock = await SubscriptionModel.testClock(email);
            const customer = {
                email: email,
                name: name,
                metadata: {
                    userType: userType,
                },
                test_clock: testClock.id,
            };

            const stripeCustomer = await SubscriptionModel.createStripeUser(customer);

            const firebaseClient = await addDoc(collection(db, "User"), {
                email: email,
                password: password,
                userType: userType,
                name: name,
                stripeId: stripeCustomer,
            });

            SubscriptionModel.updateStripeUser(stripeCustomer, firebaseClient.id);

            return 'Usuario creado exitósamente';
        }
        catch(err) {
            throw new Error(err as string);
        }
    }
}