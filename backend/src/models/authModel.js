const {bcrypt} = require('bcrypt')
const {generatePassword} = require('../controllers/authController')
const {pool} = require('../config/db')
/**
 * Post Admin to database 
 * @param {string} password - The user's plain text password
 * @returns {Promise<string>} - The hashed password
 */