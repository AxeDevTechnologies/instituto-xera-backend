import { db } from '../firebase/config';
import { collection, doc, getDocs, addDoc, getDoc, where, query, QuerySnapshot, DocumentData } from 'firebase/firestore';
export default class WorkshopModel {
    public static async getWorkshops(userId: string) {
        try {
            const workshopQuery: QuerySnapshot<DocumentData, DocumentData> = await getDocs(query(collection(db, 'Workshops'), where('userId', '==', userId)));

            const workshops: any[] = [];

            workshopQuery.forEach((doc) => {
                workshops.push({ id: doc.id, ...doc.data() });
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
            const querySnapshot = await getDocs(collection(db, "Subtopic"));

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

    public static async createWorkshop(workshopName: string, userId: number): Promise<string> {
        try {
            await addDoc(collection(db, "Workshop"), {
                name: workshopName,
                userId: userId,
            });

            return 'Taller creado exitósamente';
        }
        catch(err) {
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
}