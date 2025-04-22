import { db } from '../firebase/config';
import { collection, getDocs, addDoc, query, where, doc, getDoc, DocumentData, DocumentReference, updateDoc } from 'firebase/firestore';
import SubscriptionModel from './SubscriptionModel';

export default class UserModel {
    public static async getUser(email: string){
        try {
            const userQuery = query(collection(db, 'User'), where('email', '==', email));
            const userSnap = await getDocs(userQuery);

            if(userSnap.empty) {
                return '';
            }
            return {
                userId: userSnap.docs[0].id,
                userInformation: userSnap.docs[0].data()
            };
        }
        catch(err) {
            console.log(err);
            throw new Error(err as string);
        }
    }

    public static async getUserById(userId: string) {
        try {
            const userDocRef = doc(db, 'User', userId);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                return '';
            }

            return userDoc;
        }
        catch(err) {

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

    public static async toggleScholarship(userId: string, institute: string, action: 'grant' | 'revoke', teacherId: string) {
        try {
            const userDocRef = doc(db, 'User', userId);
            const userDoc = await getDoc(userDocRef);
    
            if (!userDoc.exists()) {
                throw new Error('Usuario no encontrado');
            }
    
            const currentData = userDoc.data();
            const currentScholarships = currentData.scholarships || [];
            
            const scholarshipIndex = currentScholarships.findIndex(
                (s: any) => s.institute === institute
            );
    
            const newScholarship = {
                institute,
                status: action === 'grant' ? 'active' : 'inactive',
                teacherId
            };
    
            let updatedScholarships = [];
            
            if(scholarshipIndex >= 0) {
                updatedScholarships = [...currentScholarships];
                updatedScholarships[scholarshipIndex] = newScholarship;
            }
            else {
                if(action === 'grant') {
                    updatedScholarships = [...currentScholarships, newScholarship];
                }
                else {
                    throw new Error('No existe beca para revocar');
                }
            }
    
            updateDoc(userDocRef, {
                scholarships: updatedScholarships
            });
    
            // if (currentData.memberships) {
            //     const membershipIndex = currentData.memberships.findIndex(
            //         (m: any) => m.institute === institute
            //     );
    
            //     if (membershipIndex >= 0) {
            //         const updatedMemberships = [...currentData.memberships];
            //         updatedMemberships[membershipIndex].paymentStatus = 
            //             action === 'grant' ? 'waived' : 'pending';
                    
            //         updateDoc(userDocRef, {
            //             memberships: updatedMemberships
            //         });
            //     }
            // }
    
            return { 
                success: true,
                action: action === 'grant' ? 'Beca completa concedida' : 'Beca revocada'
            };
            
        } catch (err) {
            console.error('Error en toggleScholarship:', err);
            throw new Error(typeof err === 'string' ? err : 'Error al procesar beca');
        }
    }
}
