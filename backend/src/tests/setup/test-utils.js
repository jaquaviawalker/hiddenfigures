// test-utils.js
import { jest } from '@jest/globals';
import express from 'express';
import { pool } from '../../config/db.js';

export { jest };

// Export the actual application pool for tests to use
export { pool };

// Utility to set up the database for testing
export const setupTestDb = async () => {
  try {
    console.log('Setting up test environment in main database...');
    
    // Create tables if they don't exist (should already exist in your main database)
    // But just to be safe, we'll add it here
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        firstName VARCHAR(50) NOT NULL,
        lastName VARCHAR(50) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Clean up any existing test data to avoid conflicts
    await pool.query('DELETE FROM admin WHERE username LIKE $1', ['test%']);
    
    console.log('Test environment prepared successfully');
  } catch (error) {
    console.error('Error setting up test environment:', error);
    throw error;
  }
};

// Utility to clean up after tests
export const tearDownTestDb = async () => {
  try {
    // Remove all test data created during testing
    await pool.query('DELETE FROM admin WHERE username LIKE $1', ['test%']);
    console.log('Test data cleaned up successfully');
  } catch (error) {
    console.error('Error cleaning up test data:', error);
    throw error;
  }
};

// Utility to create a test app instance
export const createTestApp = () => {
  const app = express();
  app.use(express.json());
  
  return app;
};
