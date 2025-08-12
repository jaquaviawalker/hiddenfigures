import bcrypt from 'bcrypt';
import { pool } from '../config/db.js';

/**
 * Creates a new admin user in the database
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing admin details
 * @param {string} req.body.username - Admin username
 * @param {string} req.body.password - Admin password (will be hashed)
 * @param {string} req.body.firstName - Admin first name
 * @param {string} req.body.lastName - Admin last name
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} - Response with status and admin data or error message
 */


export const createAdmin = async (req, res) => {
  const { username, password, firstName, lastName } = req.body;

  try {
    // ✅ Check if all fields are present
    if (!username || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Insert into DB
    const query = `
      INSERT INTO admin (username, password, firstName, lastName)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [username, hashedPassword, firstName, lastName];

    const result = await pool.query(query, values);

    return res.status(201).json({
      message: 'Admin created successfully',
      admin: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};