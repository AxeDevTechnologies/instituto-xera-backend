import { Request, Response } from 'express';
import WorkshopModel from '../model/WorkshopModel';
import { uploadFile } from '../firebase/FirebaseStorage';

export default class ClassController {
    public static async getWorkshops(request: Request, response: Response) {
        try {
            const workshops = await WorkshopModel.getWorkshops(request.query.teacherId as string);

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
        const { workshopName, userId } = request.body;

        try {
            const createdUserMessage = await WorkshopModel.createWorkshop(workshopName, userId);
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

            uploadFile(`Workshop/Subtopic/${name}`, file!.buffer, contentType!);

            WorkshopModel.createSubTopic(name, request.body.classId);
            response.status(200).json({ message: 'Subtema guardado exitósamente '});
        }
        catch(err: any) {
            response.status(500).json(err.message);
        }
    }
}