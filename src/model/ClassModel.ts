import { db } from '../firebase/config';
import { collection, getDocs, getDoc, addDoc, where, query, doc, or, QueryConstraint, updateDoc, deleteDoc } from 'firebase/firestore';
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

    public static async createClass(className: string, userId: number, classType: string, institute: string, thumbnail: string): Promise<string> {
        thumbnail = thumbnail === '' ? 'default' : thumbnail;
        try {
            const response = await addDoc(collection(db, "Class"), {
                className: className,
                userId: userId,
                classType: classType,
                institute: institute,
                thumbnail: thumbnail
            });

            return response.id;
        }
        catch(err) {
            console.log({err});
            throw new Error(err as string);
        }
    }

    public static async updateClass(docId: string, newName?: string, classType?: string) {  
        try {
            const classRef = doc(db, "Class", docId);
            let updatedClass: { [key: string]: any } = {};

            if(!!classType) {
                updatedClass.classType = classType;
            }

            if(!!newName) {
                updatedClass.className = newName;
            }

            await updateDoc(classRef, updatedClass);
            return 'Clase actualizada';
        }
        catch(err) {
            console.log({err});
            throw new Error(err as string);
        }
    }

    public static async updateImageClass(docId: string, thumbnail: string) {  
        try {
            const classRef = doc(db, "Class", docId);  
            await updateDoc(classRef, { thumbnail: thumbnail });

            return 'Clase actualizada';
        }
        catch(err) {
            console.log({err});
            throw new Error(err as string);
        }
    }

    public static async getClass(classId: string) {
        try {
            const docRef = doc(db, 'Class', classId);
            const snapshot = await getDoc(docRef);

            return snapshot.data()!;
        }
        catch(err) {
            throw new Error(err as string);
        }
    }

    public static async deleteClass(classId: string) {
        try {
            const classRef = doc(db, 'Class', classId);  
            await deleteDoc(classRef);

            return 'Clase eliminada';
        }
        catch(err) {
            throw new Error(err as string);
        }
    }
}