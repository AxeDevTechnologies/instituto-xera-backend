import { db } from '../firebase/config';
import { collection, getDocs, query, where, updateDoc, addDoc, QueryConstraint, QuerySnapshot, doc, DocumentData, getDoc } from 'firebase/firestore';

export default class StoreModel {
    public static async createProduct(productName: string, price: number, institute: string, userId: string, thumbnail: string): Promise<string> {
        try {
            const product = await addDoc(collection(db, "Product"), {
                name: productName,
                price: price,
                institute: institute,
                userId: userId,
                thumbnail: thumbnail
            });

            return product.id;
        }
        catch(err) {
            throw new Error(err as string);
        }
    }

    public static async getProducts(userId?: string) {
        try {

            const filters: QueryConstraint[] = []; 
            if(userId !== '') {
                filters.push(where('userId', '==', userId));
            }

            const productQuery: QuerySnapshot<DocumentData, DocumentData> = await getDocs(query(collection(db, 'Product'), ...filters));

            if(productQuery.empty) {
                return {
                    message: 'Todavía no hay productos disponibles.',
                }
            }

            const products: any[] = [];

            productQuery.forEach((doc) => {
                products.push({ id: doc.id, ...doc.data() });
            });

            return products;
        }
        catch(err) {
            throw new Error(err as string);
        }
    }
}