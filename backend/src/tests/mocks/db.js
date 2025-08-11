// Mock for pool
export const pool = {
  query: jest.fn().mockResolvedValue({
    rows: [{ id: 1, username: 'admin', firstName: 'Test', lastName: 'User' }],
    rowCount: 1
  })
};
