import { Request, Response } from 'express';
import ClassModel from '../model/ClassModel';
import { uploadFile, getURLVideo, getImageVideo } from '../firebase/FirebaseStorage';

export default class ClassController {
    public static async getAllClasses(request: Request, response: Response) {
        try {
            const classes = await ClassModel.getClasses(request.query.institute as string || '');

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
            console.log(request, 'dsfhsdfsd');
            const files = request.files as { [fieldname: string]: Express.Multer.File[] };
            console.log(files);
            const video = files['video'] ? files['video'][0] : null;
            const image = files['image'] ? files['image'][0] : null;

            const className = request.body.name;
            const userId = request.body.userId;
            const classType = request.body.classType;
            const institute = request.body.institute;

            if(!video || !className) {
                response.status(400).json({ message: 'Archivo y nombre son requeridos'});
            }

            const videoContentType = video!.mimetype;

            uploadFile(`Class/${className}`, video!.buffer, videoContentType!);

            let thumbnail: string = '';
            if (image) {
                const imageContentType = image.mimetype;
                await uploadFile(`Thumbnail/${className}`, image.buffer, imageContentType);

                thumbnail = await getImageVideo(`Thumbnail/${className}`);
            }

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
}