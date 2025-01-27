import { db } from '../firebase/config';
import { collection, getDocs, getDoc, addDoc, where, query, doc, or, QueryConstraint } from 'firebase/firestore';
export default class ClassModel {

    public static async getClasses(teacherId?: string, institute?: string) {
        try {
            const filters: QueryConstraint[] = [];
            if(teacherId !== '') {
                filters.push(where('userId', '==', teacherId));
            }
              
            if(institute !== '') {
                filters.push(where('institute', '==', institute));
            }

            const classQuery = filters.length > 0 
                ? query(collection(db, 'Class'), ...filters)
                : collection(db, 'Class');

            const classResult = await getDocs(classQuery);

            const userRef = doc(db, 'User', teacherId || classResult.docs[0].data().userId);
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

    public static async createClass(className: string, userId: number, classType: string, institute: string): Promise<string> {
        try {
            const response = await addDoc(collection(db, "Class"), {
                className: className,
                userId: userId,
                classType: classType,
                institute: institute
            });

            return response.id;
        }
        catch(err) {
            throw new Error(err as string);
        }
    }
}