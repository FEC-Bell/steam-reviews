const { generateUserData } = require('./user');

describe('User data generation', () => {
  test('generates an array of 750 user objects with correct data fields', () => {
    console.log = jest.fn();
    let userData = generateUserData();
    expect(console.log).toHaveBeenCalled();
    expect(userData.length).toBe(750);
    userData.forEach(userObj => {
      expect(userObj).toMatchObject({
        username: expect.any(String),
        profileUrl: expect.any(String),
        isOnline: expect.any(Boolean),
        numProducts: expect.any(Number),
        numReviews: expect.any(Number),
        steamLevel: expect.any(Number),
        isInGame: expect.any(Boolean),
        inGameStatus: expect.any(String)
      });
    });
  });
});