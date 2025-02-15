import { db } from '../firebase/config';
import { collection, getDocs, getDoc, addDoc, where, query, doc, or, QueryConstraint } from 'firebase/firestore';
export default class ClassModel {

    public static async getClasses(institute?: string) {
        try {
            const filters: QueryConstraint[] = [];
              
            if(institute !== '') {
                filters.push(where('institute', '==', institute));
            }

            else {
                filters.push(where('classType', '==', 'Gratuita'));
            }

            const classQuery = query(collection(db, 'Class'), ...filters);

            const classResult = await getDocs(classQuery);

            const userRef = doc(db, 'User', classResult.docs[0].data().userId);
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

    public static async getClassesForTeacher(teacherId: string) {
        try {
            console.log(teacherId);
            const filters: QueryConstraint[] = [];
              
            filters.push(where('userId', '==', teacherId));

            const classQuery = query(collection(db, 'Class'), ...filters);

            const classResult = await getDocs(classQuery);

            if(classResult.empty) {
                return {
                    message: 'Todavía no hay clases disponibles.',
                }
            }

            const userRef = doc(db, 'User', classResult.docs[0].data().userId);
            const userSnap = await getDoc(userRef);

            const classes: any[] = [];

                classResult.forEach((doc) => {
                    classes.push({ id: doc.id, ...doc.data(), username: userSnap.data()!.name });
                });

            return classes;
        }

        catch(err) {
            console.log(err);
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