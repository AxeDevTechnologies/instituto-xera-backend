import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../db';

export default class CourseModel {
    public static async getCourse(name: string) {
        const [result] = await pool.query<RowDataPacket[]>('SELECT * FROM Course');
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