// Mock for bcrypt
const bcrypt = {
  hash: jest.fn((password, saltRounds) => Promise.resolve(`hashed_${password}`)),
  compare: jest.fn((password, hash) => Promise.resolve(hash === `hashed_${password}`))
};

export default bcrypt;
