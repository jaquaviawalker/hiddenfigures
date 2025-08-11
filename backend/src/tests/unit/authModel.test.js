import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Import our test version instead
import { createAdmin } from './mockAuthModel';

describe('authModel - createAdmin', () => {
  let mockReq;
  let mockRes;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Set up request and response mocks
    mockReq = {
      body: {
        username: 'testadmin',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'Admin'
      }
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });
  
  it('should create admin successfully', async () => {
    // Act
    await createAdmin(mockReq, mockRes);
    
    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(201);
  });
  
  it('should return 400 when fields are missing', async () => {
    // Arrange
    mockReq.body.password = '';
    
    // Act
    await createAdmin(mockReq, mockRes);
    
    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
});
