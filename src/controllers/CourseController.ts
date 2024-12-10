import { Request, Response } from 'express';
import CourseModel from '../model/courseModel';

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
}