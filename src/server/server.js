const { Pool } = require('pg');
const password = require('../constant/passwordPostgres');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password,
    database: 'dindin',
});

module.exports = pool;