import { describe, it, expect, beforeAll, afterAll, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { setupTestDb, tearDownTestDb, createTestApp } from '../setup/test-utils.js';
import { createAdmin } from '../mocks/testAuthModel.js';

describe('Admin Authentication Integration Tests', () => {
  let app;
  
  // Setup before all tests
  beforeAll(async () => {
    // Set longer timeout for database operations
    jest.setTimeout(10000);
    
    try {
      // Initialize test database
      await setupTestDb();
      console.log('Test database setup complete');
    } catch (error) {
      console.error('Failed to set up test database:', error);
      throw error;
    }
  });
  
  // Clean up after all tests
  afterAll(async () => {
    try {
      await tearDownTestDb();
      console.log('Test database teardown complete');
    } catch (error) {
      console.error('Failed to tear down test database:', error);
    }
  });
  
  beforeEach(() => {
    // Create a fresh test application for each test
    app = createTestApp();
    
    // Add test routes that use our test database
    app.post('/test/admin', createAdmin);
  });
  
  // Test creating admin user directly via model
  it('should create admin user successfully', async () => {
    const res = await request(app)
      .post('/test/admin')
      .send({
        username: 'testadmin',
        password: 'Test1234!',
        firstName: 'Test',
        lastName: 'Admin'
      });
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'Admin created successfully');
    expect(res.body).toHaveProperty('admin');
    expect(res.body.admin).toHaveProperty('username', 'test_testadmin');
    expect(res.body.admin).toHaveProperty('firstName', 'Test');
    expect(res.body.admin).toHaveProperty('lastName', 'Admin');
    expect(res.body.admin).not.toHaveProperty('password'); // Password should not be returned
  });
  
  // Test validation - missing fields
  it('should reject admin creation when fields are missing', async () => {
    const res = await request(app)
      .post('/test/admin')
      .send({
        username: 'testadmin2',
        // password missing
        firstName: 'Test',
        lastName: 'Admin'
      });
    
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'All fields are required');
  });
  
  // Test duplicate username handling
  it('should reject duplicate usernames', async () => {
    const uniqueIdentifier = Date.now().toString(); // Ensures unique usernames in each test run
    
    // First create a user
    await request(app)
      .post('/test/admin')
      .send({
        username: `uniqueadmin_${uniqueIdentifier}`,
        password: 'Test1234!',
        firstName: 'Unique',
        lastName: 'Admin'
      });
    
    // Try to create another user with the same username
    const res = await request(app)
      .post('/test/admin')
      .send({
        username: `uniqueadmin_${uniqueIdentifier}`, // Same username
        password: 'Different123!',
        firstName: 'Another',
        lastName: 'User'
      });
    
    // Should get a 409 error due to unique constraint
    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('error', 'Username already exists');
  });
  
  // Test the structure of the response
  it('should return properly structured admin data', async () => {
    const res = await request(app)
      .post('/test/admin')
      .send({
        username: 'structuretest',
        password: 'Password123!',
        firstName: 'Structure',
        lastName: 'Test'
      });
    
    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      message: 'Admin created successfully',
      admin: expect.objectContaining({
        id: expect.any(Number),
        username: 'test_structuretest',
        firstName: 'Structure',
        lastName: 'Test',
        createdAt: expect.any(String)
      })
    });
  });
  
  // Test handling of unsafe inputs
  it('should handle special characters in input fields', async () => {
    const res = await request(app)
      .post('/test/admin')
      .send({
        username: 'special!@#',
        password: 'Pass<script>alert("xss")</script>',
        firstName: "O'Brien",
        lastName: 'Smith-Jones'
      });
    
    expect(res.status).toBe(201);
    expect(res.body.admin.username).toBe('test_special!@#');
    expect(res.body.admin.firstName).toBe("O'Brien");
    expect(res.body.admin.lastName).toBe('Smith-Jones');
  });
  
  // Add more tests here as you implement more functionality:
  // - Login tests
  // - Authentication middleware tests
  // - Protected route tests
});
