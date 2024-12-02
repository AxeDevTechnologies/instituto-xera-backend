import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../db';

export default class UserModel {
    public static async getUser(email: string): Promise<RowDataPacket[]> {
        const [result] = await pool.query<RowDataPacket[]>('SELECT * FROM User JOIN Person on User.id_person = Person.id_person WHERE User.email = ?', [email]);
        return result;
    }

    public static async createUser(name: string, email: string, password: string, userType: string): Promise<string> {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [existingUser] = await connection.query<RowDataPacket[]>('SELECT EXISTS (SELECT 1 FROM User WHERE email = ?) AS existingUser', [email]);
            if(existingUser[0].existingUser) {
                await connection.rollback();
                throw new Error('El correo electrónico ya existe.');
            }

            const [newPerson] = await connection.query<ResultSetHeader>('INSERT INTO Person (name) VALUES (?)', [name]);

            const idPerson: number = newPerson.insertId;

            await connection.query('INSERT INTO User (email, password, userType, id_person) VALUES (?, ?, ?, ?)', [email, password, userType, idPerson]);

            await connection.commit();

            return 'Usuario creado exitósamente';
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