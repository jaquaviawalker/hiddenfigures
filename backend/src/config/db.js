        const { db } = require('pg');

        const db = new DB({
            host: 'localhost',
            port: 5432,
            database: 'hiddenfigures'
        });

        db.connect()
            .then(() => console.log('Connected to PostgreSQL'))
            .catch(err => console.error('Connection error', err.stack));

       module.exports = { db }

