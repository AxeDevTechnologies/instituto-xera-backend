import { Request, Response } from 'express';
import ClassModel from '../model/ClassModel';
import { uploadFile, getURLVideo, getImageVideo, deleteFile, getFileMetadata } from '../firebase/FirebaseStorage';

export default class ClassController {
    public static async getAllClasses(request: Request, response: Response) {
        try {
            const institutes = request.query.institutes as string[] || [];

            const classes = await ClassModel.getClasses(institutes);

            response.status(200).json(classes);
        }
        catch (e) {
            response.status(500).json(e);
        }
    }

    public static async getClassesForTeacher(request: Request, response: Response) {
        try {
            const classes = await ClassModel.getClassesForTeacher(request.query.teacherId as string || '');

            response.status(200).json(classes);
        }
        catch (e) {
            response.status(500).json(e);
        }
    }

    public static async createClass(request: Request, response: Response) {
        try {
            const files = request.files as { [fieldname: string]: Express.Multer.File[] };
            const video = files['video'] ? files['video'][0] : null;
            const image = files['image'] ? files['image'][0] : null;

            const className: string = request.body.name;
            const userId: string = request.body.userId;
            const classType: string = request.body.classType;
            const institute: string = request.body.institute;

            if(!video || !className) {
                response.status(400).json({ message: 'Archivo y nombre son requeridos'});
                return;
            }

            if(!await ClassModel.doesClassExist(className)) {
                response.status(400).json({ message: 'Ese nombre ya existe. Use otro nombre'});
                return;
            }

            const videoContentType = video!.mimetype;

            await uploadFile(`Class/${className}`, video!.buffer, videoContentType!);

            let thumbnail: string = '';
            if (!!image) {
                const imageContentType = image.mimetype;
                await uploadFile(`Thumbnail/${className}`, image.buffer, imageContentType);
            }

            const thumbnailImage = await getImageVideo(`Thumbnail/${className}`);
            thumbnail = thumbnailImage === 'No hay imagen disponible' ? 'default' : thumbnailImage;

            const classId: string = await ClassModel.createClass(className, userId, classType, institute, thumbnail);
            
            response.status(200).json({ message: 'Clase creada correctamente', classId: classId, imageVideo: thumbnail });
        }
        catch(err: any) {
            console.log('aquí está el error', err);
            response.status(500).json(err.message);
        }
    }

    public static async getURLClass(request: Request, response: Response) {
        try {
            const classVideo: string = await getURLVideo(request.query.className as string);
            response.status(200).json({ video: classVideo });
        }
        catch(err: any) {
            response.status(500).json(err.message);
        }
    }

    public static async getImageVideo(request: Request, response: Response) {
        try {
            const classVideo: string = await getImageVideo(request.query.className as string);
            response.status(200).json({ video: classVideo });
        }
        catch(err: any) {
            response.status(500).json(err.message);
        }
    }

    public static async deleteClass(request: Request, response: Response) {
        try {
            const className = await ClassModel.getClass(request.params.classId);
            await deleteFile(`Class/${className.className}`);

            if(await getFileMetadata(`Thumbnail/${className.className}`)) {
                await deleteFile(`Thumbnail/${className.className}`);
            }

            const deletedClass: string = await ClassModel.deleteClass(request.params.classId);
            response.status(200).json({ message: deletedClass });
        }
        catch(err: any) {
            response.status(500).json(err.message);
        }
    }
}