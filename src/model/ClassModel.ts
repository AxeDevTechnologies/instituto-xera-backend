import { db } from '../firebase/config';
import { collection, doc, getDocs, addDoc } from 'firebase/firestore';
export default class ClassModel {

    public static async getClasses(teacherId: string) {
        try {
            const querySnapshot = await getDocs(collection(db, "Class"));

        const classes: any[] = [];

            querySnapshot.forEach((doc) => {
                classes.push({ id: doc.id, ...doc.data() });
            });

        return classes;
        }
        catch(err) {
            throw new Error(err as string);
        }
    }

    public static async createClass(className: string, userId: number): Promise<string> {
        try {
            await addDoc(collection(db, "Class"), {
                name: className,
                userId: userId,
            });

            return 'Clase creada exitósamente';
        }
        catch(err) {
            throw new Error(err as string);
        }
    }
}