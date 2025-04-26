import { Request, Response } from 'express';
import StoreModel from '../model/StoreModel';
import { getImageVideo, uploadFile } from '../firebase/FirebaseStorage';

export default class StoreController {
    public static async getProducts(request: Request, response: Response) {
        try {
            const workshops = await StoreModel.getProducts(request.query.teacherId as string || '');
            response.status(200).json(workshops);
        }
        catch(err) {
            response.status(500).json(err);
        }
    }

    public static async createProduct(request: Request, response: Response) {
        const files = request.files as { [fieldname: string]: Express.Multer.File[] };
        const image = files['image'] ? files['image'][0] : null;

        const { productName, price, institute, userId } = request.body;

        try {
            let thumbnail: string = '';
            if (!!image) {
                const imageContentType = image.mimetype;
                await uploadFile(`Thumbnail/${productName}`, image.buffer, imageContentType);
            }
            thumbnail = await getImageVideo(`Thumbnail/${productName}`) || 'default';

            await StoreModel.createProduct(productName, price, institute, userId, thumbnail);
            response.status(200).json({ message: 'Producto creado exitósamente', thumbnail: thumbnail });
        }

        catch(err: any) {
            response.status(500).json(err.message);
        }
    }
}