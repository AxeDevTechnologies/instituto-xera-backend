import { db } from '../firebase/config';
import { collection, getDocs, getDoc, addDoc, where, query, doc, or, QueryConstraint, updateDoc, deleteDoc } from 'firebase/firestore';
export default class ClassModel {

    public static async getClasses(institutes?: string[]) {
    try {
        const filters: QueryConstraint[] = [];
        
        // Filtro para institutes (array)
        if (institutes && institutes.length > 0) {
            for(const institute of institutes) {
                filters.push(where('institute', '==', institutes));
            }
            // Si hay múltiples institutes, usamos 'in' para comparar con el array
        }

        // Filtro fijo para classType
        filters.push(where('classType', '==', 'Gratuita'));

        // Crear la consulta
        const classQuery = query(collection(db, 'Class'), ...filters);
        const classResult = await getDocs(classQuery);


        // Obtener clases con datos de usuario
        const classes: any[] = [];
        
        // Usamos Promise.all para manejar las llamadas a usuarios en paralelo
        await Promise.all(
            classResult.docs.map(async (user) => {
                const userRef = doc(db, 'User', user.data().userId);
                const userSnap = await getDoc(userRef);
                
                classes.push({ 
                    id: user.id, 
                    ...user.data(), 
                    username: userSnap.data()?.name || 'Nombre no disponible'
                });
            }),
        );

        return classes;
    } catch (err) {
        console.log({err});
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

    public static async createClass(className: string, userId: string, classType: string, institute: string, thumbnail: string): Promise<string> {
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

    public static async doesClassExist(className: string) {
        try {
            const classQuery = query(collection(db, 'Class'), where('className', '==', className));

            const classSnap = await getDocs(classQuery);

            return classSnap.empty
        }
        catch(err) {
            throw new Error(err as string);
        }
    }
}