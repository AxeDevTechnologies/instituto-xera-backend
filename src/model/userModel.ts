import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../db';

export class ModelUser {
    public static async getAllPeople(): Promise<RowDataPacket[]> {
        const [result] = await pool.query<RowDataPacket[]>('SELECT * FROM Person');
        return result;
    }

    public static async createUser(name: string, username: string, email: string, password: string, userType: string): Promise<string> {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [existingUser] = await connection.query<RowDataPacket[]>('SELECT EXISTS (SELECT 1 FROM User WHERE username = ?) AS existingUser', [username]);
            if(existingUser[0].existingUser) {
                await connection.rollback();
                throw new Error('User already exists');
            }

            const [newPerson] = await connection.query<ResultSetHeader>('INSERT INTO Person (name) VALUES (?)', [name]);

            const idPerson: number = newPerson.insertId;

            await connection.query('INSERT INTO User (username, password, email, userType, id_person) VALUES (?, ?, ?, ?, ?)', [username, password, email, userType, idPerson]);

            await connection.commit();

            return 'User created successfully';
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

export default ModelUser;