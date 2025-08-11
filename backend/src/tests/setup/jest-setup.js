// jest-setup.js
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Global setup and teardown is now handled differently
// Just loading env vars for now
