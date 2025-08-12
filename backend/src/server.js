    import express from 'express';
    import { pool } from './config/db.js';
    import authRoutes from './routes/authRoutes.js';
    
    const app = express();
    const port = 3000;
    
    // Middleware
    app.use(express.json()); // For parsing application/json
    app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
    
    // Define a basic route
    app.get('/', (req, res) => {
      res.send('Hello World!');
    });
    
    // Use routes
    app.use('/api/auth', authRoutes);
    
    //Test database connection
    pool.connect()
        .then(() => console.log('Connected to PostgreSQL'))
        .catch(err => console.error('Connection error', err.stack));

    // Start the server
    app.listen(port, () => {
      console.log(`Express app listening at http://localhost:${port}`);
    });