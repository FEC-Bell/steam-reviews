const { generateReviewData } = require('./review');

describe('Review data generation', () => {
  test('generates an array of 1000 review objects with correct data fields', () => {
    console.log = jest.fn();
    let reviewData = generateReviewData();
    expect(console.log).toHaveBeenCalled();
    expect(reviewData.length).toBe(1000);
    reviewData.forEach(reviewObj => {
      expect(reviewObj).toMatchObject({
        idUser: expect.any(Number),
        idGame: expect.any(Number),
        isRecommended: expect.any(Boolean),
        hoursOnRecord: expect.any(Number),
        hoursAtReviewTime: expect.any(Number),
        purchaseType: expect.stringMatching(/direct|key/),
        receivedFree: expect.any(Boolean),
        reviewText: expect.any(String),
        numFoundHelpful: expect.any(Number),
        numFoundFunny: expect.any(Number),
        numComments: expect.any(Number),
        datePosted: expect.stringMatching(/20\d{2}-\d{2}-\d{2}/)
      });
    });
  });


});