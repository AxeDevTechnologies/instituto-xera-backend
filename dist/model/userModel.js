"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelUser = void 0;
const db_1 = __importDefault(require("../db"));
class ModelUser {
    static getAllPeople(callback) {
        return new Promise((resolve, reject) => {
            db_1.default.query('SELECT * FROM Person', (err, result) => {
                if (err)
                    return reject(err);
                resolve(result);
            });
        });
    }
    static createUser(name, username, password, userType, callback) {
        db_1.default.getConnection((err, connection) => {
            if (err)
                return new Error('Connection Error');
            connection.beginTransaction((err) => {
                if (err) {
                    connection.release();
                    return new Error('Transaction Error');
                }
                connection.query('INSERT INTO Person (name) VALUES (?)', [name], (err, result) => {
                    if (err) {
                        return connection.rollback((err) => {
                            connection.release();
                            new Error('Cannot save new person');
                        });
                    }
                    const idPerson = result.insertId;
                    console.log(idPerson);
                    connection.query('SELECT EXISTS(SELET 1 FROM User WHERE username = ?) AS EXISTS', [username], (err, result) => {
                        if (err)
                            return new Error('Error to query the username');
                        // if(result.EXISTS === 0)
                    });
                });
            });
        });
    }
}
exports.ModelUser = ModelUser;
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
};
exports.default = ModelUser;
