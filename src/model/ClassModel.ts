import { db } from '../firebase/config';
import { collection, getDocs, getDoc, addDoc, where, query, doc } from 'firebase/firestore';
export default class ClassModel {

    public static async getClasses(teacherId: string) {
        try {
            const classQuery = query(collection(db, 'Class'), where('userId', '==', teacherId));
            const classResult = await getDocs(classQuery);

            const userRef = doc(db, 'User', teacherId);
            const userSnap = await getDoc(userRef);

            const classes: any[] = [];

                classResult.forEach((doc) => {
                    classes.push({ id: doc.id, ...doc.data(), username: userSnap.data()!.name });
                });

            return classes;
        }

        catch(err) {
            throw new Error(err as string);
        }
    }

    public static async createClass(className: string, userId: number, classType: string): Promise<string> {
        try {
            const response = await addDoc(collection(db, "Class"), {
                className: className,
                userId: userId,
                classType: classType
            });

            return response.id;
        }
        catch(err) {
            throw new Error(err as string);
        }
    }
}