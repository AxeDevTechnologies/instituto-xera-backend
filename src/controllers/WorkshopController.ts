import { Request, Response } from 'express';
import WorkshopModel from '../model/WorkshopModel';
import { deleteFile, getFileMetadata, getImageVideo, uploadFile } from '../firebase/FirebaseStorage';

export default class ClassController {
    public static async buyWorksop(request: Request, response: Response) {
        try {
            console.log(request.body);
            const workshop = await WorkshopModel.createBuyWorkshop(request.body.workshopPriceId, request.body.customerId);

            response.status(200).json(workshop);
        }
        catch(err) {
            response.status(500).json({ message: err });
        }
    }

    public static async getWorkshops(request: Request, response: Response) {
        try {
            const workshops = await WorkshopModel.getWorkshops(request.query.teacherId as string || '');

            response.status(200).json(workshops);
        }
        catch(err) {
            response.status(500).json(err);
        }
    }

    public static async getSubtopic(request: Request, response: Response) {
        try {
            const subtopic = await WorkshopModel.getSubtopic(request.body.subtopicId);
            response.status(200).json(subtopic);
        }
        catch(err) {
            response.status(500).json(err);
        }
    }

    public static async getSubtopics(request: Request, response: Response) {
        try {
            const subtopics = await WorkshopModel.getSubtopics(request.query.workshopId as string);
            response.status(200).json(subtopics);
        }
        catch(err) {
            response.status(500).json(err);
        }
    }

    public static async createWorkshop(request: Request, response: Response) {
        const files = request.files as { [fieldname: string]: Express.Multer.File[] };
            const image = files['image'] ? files['image'][0] : null;

        const { workshopName, price, institute, userId } = request.body;

        try {
            if(!await WorkshopModel.doesWorkshopExist(workshopName)) {
                response.status(400).json({ message: 'Ese nombre de taller ya existe.' });
                return;
            }

            let thumbnail: string = '';
            if (!!image) {
                const imageContentType = image.mimetype;
                await uploadFile(`Thumbnail/${workshopName}`, image.buffer, imageContentType);
            }
            thumbnail = await getImageVideo(`Thumbnail/${workshopName}`) || 'default';

            const workshopId = await WorkshopModel.createWorkshop(workshopName, price, institute, userId, thumbnail);
            response.status(200).json({ message: 'Taller creado exitósamente', workshopId: workshopId, thumbnail: thumbnail });
        }

        catch(err: any) {
            console.log({err});
            response.status(500).json(err.message);
        }
    }

    public static async createSubTopic(request: Request, response: Response) {
        try {
            const files = request.files as { [fieldname: string]: Express.Multer.File[] };
            const video = files['video'] ? files['video'][0] : null;
            const name = request.body.name;

            if(!video || !name) {
                response.status(400).json({ message: 'Archivo y nombre son requeridos'});
                return;
            }

            if(!await WorkshopModel.doesSubtopicExist(name)) {
                response.status(400).json({ message: 'Ese nombre ya existe.' });
            }

            const contentType = video?.mimetype;

            uploadFile(`Workshop/Subtopic/${request.body.workshopName}/${name}`, video!.buffer, contentType!);

            WorkshopModel.createSubTopic(name, request.body.workshopId);
            response.status(200).json({ message: 'Subtema guardado exitósamente '});
        }
        catch(err: any) {
            response.status(500).json(err.message);
        }
    }

    public static async deleteWorkshop(request: Request, response: Response) {
        try {
            const workshopName = await WorkshopModel.getWorkshop(request.params.workshopId);
            await deleteFile(`Workshop/${workshopName.name}`);

            if(await getFileMetadata(`Thumbnail/${workshopName.name}`)) {
                await deleteFile(`Thumbnail/${workshopName.name}`);
            }

            // const deletedClass: string = await ClassModel.deleteClass(request.params.classId);
            // response.status(200).json({ message: deletedClass });
        }
        catch(err: any) {
            response.status(500).json(err.message);
        }
    }
}