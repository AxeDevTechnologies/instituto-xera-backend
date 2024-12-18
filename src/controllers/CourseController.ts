import { Request, Response } from 'express';
import CourseModel from '../model/courseModel';
import { uploadFile } from '../firebase/config';

export default class CourseController {
    public static async getCourses(request: Request, response: Response) {
        try {
            const courses = await CourseModel.getCourse();
            response.status(200).json(courses);
        }
        catch(err) {
            response.status(500).json(err);
        }
    }

    public static async createCourse(request: Request, response: Response) {
        const { courseName, userId } = request.body;
        console.log(request.body);

        try {
            const createdUserMessage = await CourseModel.createCourse(courseName, userId);
            response.status(200).json({ message: createdUserMessage });
        }
        catch(err: any) {
            response.status(500).json(err.message);
        }
    }

    public static async createSubTopic(request: Request, response: Response) {
        try {
            const file = request.file;
            const name = request.body.name;

            if(!file || !name) {
                response.status(400).json({ message: 'Archivo y nombre son requeridos'});
            }

            const contentType = file?.mimetype;

            uploadFile(name, file!.buffer, contentType!);
            response.status(200).json({ message: 'Subtema guardado exitósamente '});
        }
        catch(err: any) {
            response.status(500).json(err.message);
        }
    }
}