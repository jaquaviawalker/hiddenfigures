import { createAdmin } from '../../models/authModel';
import bcrypt from 'bcrypt';
import { pool } from '../../config/db';

// Mock dependencies
jest.mock('bcrypt');
jest.mock('../../config/db', () => ({
  pool: {
    query: jest.fn()
  }
}));

describe('createAdmin function', () => {
  let req, res;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock request and response objects
    req = {
      body: {
        username: 'testadmin',
        password: 'password123',
        firstName: 'Test',
        lastName: 'Admin'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mock bcrypt hash function
    bcrypt.hash.mockResolvedValue('hashed_password');
    
    // Mock database query result
    pool.query.mockResolvedValue({
      rows: [{
        id: 1,
        username: 'testadmin',
        firstName: 'Test',
        lastName: 'Admin',
        password: 'hashed_password'
      }]
    });
  });

  it('should create an admin successfully', async () => {
    await createAdmin(req, res);
    
    // Verify bcrypt was called with correct params
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    
    // Verify database query was called with correct params
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO admin'),
      ['testadmin', 'hashed_password', 'Test', 'Admin']
    );
    
    // Verify response
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Admin created successfully',
      admin: expect.objectContaining({
        id: 1,
        username: 'testadmin'
      })
    });
  });

  it('should return 400 if required fields are missing', async () => {
    // Missing password
    req.body = {
      username: 'testadmin',
      firstName: 'Test',
      lastName: 'Admin'
    };

    await createAdmin(req, res);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required' });
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(pool.query).not.toHaveBeenCalled();
  });

  it('should handle database errors', async () => {
    // Temporarily silence console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Simulate database error
    pool.query.mockRejectedValue(new Error('Database error'));

    await createAdmin(req, res);
    
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
    
    // Restore console.error
    consoleSpy.mockRestore();
  });
});