import { db } from '../firebase/config';
import { collection, doc, getDocs, addDoc, getDoc, where, query, QuerySnapshot, DocumentData, QueryConstraint } from 'firebase/firestore';
export default class WorkshopModel {
    public static async getWorkshops(userId?: string) {
        try {
            const workshopQuery: QuerySnapshot<DocumentData, DocumentData> = await getDocs(collection(db, 'Workshop'));

            if(workshopQuery.empty) {
                return {
                    message: 'Todavía no hay talleres disponibles.',
                }
            }

            const userRef = doc(db, 'User', userId!);
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
            const workshop = await addDoc(collection(db, "Workshop"), {
                name: workshopName,
                price: price,
                institute: institute,
                userId: userId,
                thumbnail: thumbnail,
            });

            return workshop.id;
        }
        catch(err) {
            console.log(err, 'err');
            throw new Error(err as string);
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