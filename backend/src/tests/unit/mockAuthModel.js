// Simple version for testing
import { jest } from '@jest/globals';

export const createAdmin = async (req, res) => {
  const { username, password, firstName, lastName } = req.body;
  
  // Check if fields are missing (same as real implementation)
  if (!username || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  return res.status(201).json({
    message: 'Admin created successfully',
    admin: {
      id: 1,
      username,
      firstName,
      lastName
    }
  });
};
