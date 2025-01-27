import { db } from '../firebase/config';
import { collection, getDocs, addDoc, query, where, DocumentData } from 'firebase/firestore';

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
                users.push({ id: doc.id, ...doc.data() });
            });

            return users;
        }
        catch(err) {
            throw new Error(err as string);
        }
    }

    public static async createUser(name: string, email: string, password: string, userType: string): Promise<string> {
        try {

            await addDoc(collection(db, "User"), {
                email: email,
                password: password,
                userType: userType,
                name: name,
            });

            return 'Usuario creado exitósamente';
        }
        catch(err) {
            throw new Error(err as string);
        }
    }
}