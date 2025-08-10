const { generatePassword } = require('../../controllers/authController');
const bcrypt = require('bcrypt');

describe("Password hashing", () => {
    test("should return a hashed password that is not equal to the original", async () => {
        const plainPassword = "MySecret123!";
        const hash = await generatePassword(plainPassword);

        expect(hash).not.toBe(plainPassword);
        expect(typeof hash).toBe("string");
        expect(hash.length).toBeGreaterThan(0);

        const isMatch = await bcrypt.compare(plainPassword, hash);
        expect(isMatch).toBe(true); // Ensure the hash matches the original
    });

    test("should throw an error if password is missing", async () => {
        await expect(generatePassword()).rejects.toThrow();
    });
});