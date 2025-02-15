import { Request, Response } from 'express';
import ClassModel from '../model/ClassModel';
import { uploadFile, getURLVideo } from '../firebase/FirebaseStorage';

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
            const file = request.file;
            const className = request.body.name;
            const userId = request.body.userId;
            const classType = request.body.classType;
            const institute = request.body.institute;

            if(!file || !className) {
                response.status(400).json({ message: 'Archivo y nombre son requeridos'});
            }

            const contentType = file?.mimetype;

            uploadFile(`Class/${className}`, file!.buffer, contentType!);
            await ClassModel.createClass(className, userId, classType, institute);
            
            response.status(200).json({ message: 'Clase creada correctamente' });
        }
        catch(err: any) {
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
}