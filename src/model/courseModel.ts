import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../db';

export default class CourseModel {
    public static async getCourse(teacherId?: string): Promise<RowDataPacket[]> {
        // const [result] = await pool.query<RowDataPacket[]>('SELECT Person.name as username, Course.name as courseName FROM Course JOIN User ON User.id_user = Course.id_user JOIN Person ON Person.id_person = User.id_person WHERE Course.id_user = ?', [userId]);

        const [result] = await pool.query<RowDataPacket[]>('SELECT Person.name as username, Course.name as courseName FROM Course JOIN User ON User.id_user = Course.id_user JOIN Person ON Person.id_person = User.id_person');

        return result;
    }

    public static async createCourse(courseName: string, userId: number): Promise<string> {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            await connection.query('INSERT INTO Course (name, id_user) VALUES (?, ?)', [courseName, userId]);

            await connection.commit();

            return 'Curso creado exitósamente';
        }
        catch(err) {
            connection.rollback();
            throw new Error(err as string);
        }
        finally {
            connection.release();
        }
    }
}