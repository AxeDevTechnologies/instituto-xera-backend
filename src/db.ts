import mysql from 'mysql2/promise';
const config = {
    host: 'localhost',
    user: 'xera_user',
    password: '17650010',
    database: 'institutoXera',
};

const connection = mysql.createPool(config);

export default connection;