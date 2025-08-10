        const { Pool } = require('pg');

        const pool = new Pool({
            host: 'localhost',
            port: 5432,
            database: 'hiddenfigures'
        });

        pool.connect()
            .then(() => console.log('Connected to PostgreSQL'))
            .catch(err => console.error('Connection error', err.stack));

       module.exports = { pool }

