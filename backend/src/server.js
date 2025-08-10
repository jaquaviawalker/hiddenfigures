    const express = require('express');
    const app = express();
    const port = 3000;
    const { pool } = require('./config/db')


    // Define a basic route
    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    //Test database connection
    pool.connect()
        .then(() => console.log('Connected to PostgreSQL'))
        .catch(err => console.error('Connection error', err.stack));

    // Start the server
    app.listen(port, () => {
      console.log(`Express app listening at http://localhost:${port}`);
    });