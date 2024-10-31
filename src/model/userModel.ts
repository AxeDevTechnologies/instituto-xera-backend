import { FieldPacket, RowDataPacket } from 'mysql2';
import connection from '../db';
import { PoolConnection } from 'mysql2/typings/mysql/lib/PoolConnection';

export class ModelUser {
    public static async getAllPeople(): Promise<RowDataPacket[]> {
        // const result = connection.query('SELECT * FROM Person');
        const [result] = await connection.query<RowDataPacket[]>('SELECT * FROM Person');
        console.log(result);
        return result;
    }

    // public static createUser(name: string, username: string, password: string, userType: string, callback: any) {
    //     connection.getConnection((err: NodeJS.ErrnoException | null, connection: PoolConnection) => {
    //         if(err) return new Error('Connection Error');

    //         connection.beginTransaction((err: QueryError | null) => {
    //             if(err) {
    //                 connection.release();
    //                 return new Error('Transaction Error');
    //             }

    //             connection.query('INSERT INTO Person (name) VALUES (?)', [name], (err: QueryError | null, result: any) => {
    //                 if(err) {
    //                     return connection.rollback((err: QueryError | null) => {
    //                         connection.release();
    //                         new Error('Cannot save new person');
    //                     });
    //                 }
        
    //                 const idPerson: number = result.insertId
    //                 console.log(idPerson);
        
    //                 connection.query('SELECT EXISTS(SELET 1 FROM User WHERE username = ?) AS EXISTS', [username], (err: QueryError | null, result) => {
    //                     if(err) return new Error('Error to query the username');

    //                     // if(result.EXISTS === 0)
    //                 });
    //             });
    //         });
    //     });
    // }
}

const UserModel = {
    // getAllPeople: (callback: any) => {
    //     const query: string = 'SELECT * FROM Person;'
    //     connection.query(query, (err: QueryError, result: QueryResult) => {
    //         if(err) {
    //             return callback(err);
    //         }

    //         callback(null, result);
    //     });
    // },

    // createPerson: (name: string, callback: any) => {
    //     if (name === '') {
    //         return callback(new Error('Nombre no proporcionado'));
    //     }

    //     connection.query('INSERT INTO Person (name) VALUES (?)', [name]);
    // },

    // createUser: (username: string, email: string, password: string, userType: string, idPerson: number, callback: any) => {
    //     if(!!username || !!email || !!password || !!userType || !!idPerson) return callback(new Error('All fields are required.'));

    //     connection.query('INSERT INTO User (username, email, password, usertype, id_person) VALUES (?, ?, ?, ?, ?, ?)', [username, email, password, userType, idPerson], (err: QueryError | null, result: QueryResult) => {
    //         if(err) return callback(err, null);
    //         callback(null, result);
    //     });
    // }
}

export default ModelUser;