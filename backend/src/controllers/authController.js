const bcrypt = require('bcrypt');

/**
 * Generates a hashed password
 * @param {string} password - The user's plain text password
 * @returns {Promise<string>} - The hashed password
 */
async function generatePassword(password) {
    try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        console.error("Error generating password:", error);
        throw error;
    }
}

module.exports = { generatePassword };