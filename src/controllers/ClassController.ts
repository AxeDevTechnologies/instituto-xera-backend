import { Request, Response } from 'express';
import ClassModel from '../model/ClassModel';
import { uploadFile } from '../firebase/FirebaseStorage';

export default class ClassController {
    public static async getAllClasses(request: Request, response: Response) {
        try {
            const classes = await ClassModel.getClasses(request.body.teacherId);

            response.status(200).json(classes);
        }
        catch (e) {
            response.status(500).json(e);
        }
    }

    // public static async getSubtopics(request: Request, response: Response) {
    //     try {
    //         const subtopics = await ClassModel.getSubtopics(request.query.classId as string);
    //         console.log(subtopics);
    //         response.status(200).json(subtopics);
    //     }
    //     catch(err) {
    //         response.status(500).json(err);
    //     }
    // }

    public static async createClass(request: Request, response: Response) {
        try {
            const file = request.file;
            const className = request.body.name;
            const userId = request.body.userId;

            if(!file || !className) {
                response.status(400).json({ message: 'Archivo y nombre son requeridos'});
            }

            const contentType = file?.mimetype;

            uploadFile(`Class/${className}`, file!.buffer, contentType!);
            const createdUserMessage = await ClassModel.createClass(className, userId);
            response.status(200).json({ message: createdUserMessage });
        }
        catch(err: any) {
            response.status(500).json(err.message);
        }
    }
}