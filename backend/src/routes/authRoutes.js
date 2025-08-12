import express from 'express';
import { createAdmin } from '../models/authModel.js';

const router = express.Router();

/**
 * @route   POST /api/auth/admin
 * @desc    Create a new admin
 * @access  Private
 */
router.post('/admin', createAdmin);

// Export the router
export default router;