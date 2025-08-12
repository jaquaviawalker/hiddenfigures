const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');

// Mock the dependencies
jest.mock('../../models/authModel.js', () => ({
  createAdmin: jest.fn()
}));

// Need to manually require after the mock is set up
const { createAdmin } = require('../../models/authModel.js');
const authRoutes = require('../../routes/authRoutes.js').default;

describe('Auth Routes', () => {
  let app;

  beforeEach(() => {
    // Reset mocks between tests
    jest.clearAllMocks();
    
    // Create express app for testing
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
  });

  describe('POST /api/auth/admin', () => {
    it('should create a new admin successfully', async () => {
      // Mock the createAdmin implementation
      createAdmin.mockImplementation((req, res) => {
        return res.status(201).json({
          message: 'Admin created successfully',
          admin: {
            id: 1,
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName
          }
        });
      });

      const adminData = {
        username: 'testadmin',
        password: 'password123',
        firstName: 'Test',
        lastName: 'Admin'
      };

      const response = await request(app)
        .post('/api/auth/admin')
        .send(adminData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toEqual({
        message: 'Admin created successfully',
        admin: {
          id: 1,
          username: 'testadmin',
          firstName: 'Test',
          lastName: 'Admin'
        }
      });

      // Verify that createAdmin was called with the request
      expect(createAdmin).toHaveBeenCalled();
    });

    it('should return 400 when required fields are missing', async () => {
      // Mock createAdmin to return 400 for missing fields
      createAdmin.mockImplementation((req, res) => {
        return res.status(400).json({ error: 'All fields are required' });
      });

      const incompleteData = {
        username: 'testadmin',
        // Missing password
        firstName: 'Test',
        lastName: 'Admin'
      };

      const response = await request(app)
        .post('/api/auth/admin')
        .send(incompleteData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual({ error: 'All fields are required' });
      expect(createAdmin).toHaveBeenCalled();
    });

    it('should handle server errors', async () => {
      // Mock createAdmin to throw an error
      createAdmin.mockImplementation((req, res) => {
        return res.status(500).json({ error: 'Server error' });
      });

      const adminData = {
        username: 'testadmin',
        password: 'password123',
        firstName: 'Test',
        lastName: 'Admin'
      };

      const response = await request(app)
        .post('/api/auth/admin')
        .send(adminData)
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toEqual({ error: 'Server error' });
      expect(createAdmin).toHaveBeenCalled();
    });
  });
});
