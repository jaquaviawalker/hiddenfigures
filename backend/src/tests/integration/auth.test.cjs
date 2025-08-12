const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

// Import app modules - using require syntax for CommonJS compatibility with Jest
const authRoutes = require('../../routes/authRoutes.js').default;

// Connect to the real hiddenfigures database
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'hiddenfigures'
});

describe('Auth API Integration Tests', () => {
  let app;
  let testAdminId;

  // Set up Express app before tests
  beforeAll(async () => {
    // Create express app for testing
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
  });

  // Clean up after all tests
  afterAll(async () => {
    // Clean up any test data created during tests
    if (testAdminId) {
      await pool.query('DELETE FROM admin WHERE id = $1', [testAdminId]);
    }
    
    // Close the database connection
    await pool.end();
  });

  describe('POST /api/auth/admin', () => {
    it('should create a new admin in the database', async () => {
      // Generate a unique username to avoid conflicts
      const uniqueUsername = `testadmin_${Date.now()}`;
      
      const adminData = {
        username: uniqueUsername,
        password: 'password123',
        firstName: 'Integration',
        lastName: 'Test'
      };

      const response = await request(app)
        .post('/api/auth/admin')
        .send(adminData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Admin created successfully');
      expect(response.body).toHaveProperty('admin');
      expect(response.body.admin).toHaveProperty('id');
      expect(response.body.admin).toHaveProperty('username', uniqueUsername);
      
      // Store the admin ID for cleanup
      testAdminId = response.body.admin.id;
      
      // Verify admin was actually created in the database
      const dbResult = await pool.query('SELECT * FROM admin WHERE id = $1', [testAdminId]);
      expect(dbResult.rows.length).toBe(1);
      expect(dbResult.rows[0].username).toBe(uniqueUsername);
      
      // Verify password was hashed (not stored as plaintext)
      expect(dbResult.rows[0].password).not.toBe('password123');
      
      // Optional: Verify the password hash works
      const validPassword = await bcrypt.compare('password123', dbResult.rows[0].password);
      expect(validPassword).toBe(true);
    });

    it('should return 400 when required fields are missing', async () => {
      // Missing password
      const incompleteData = {
        username: 'testadmin',
        firstName: 'Integration',
        lastName: 'Test'
      };

      const response = await request(app)
        .post('/api/auth/admin')
        .send(incompleteData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual({ error: 'All fields are required' });
    });
  });
});
