const fs = require('fs');
const path = require('path');
const faker = require('faker');
const { writeToCsv } = require('./utils');

const REVIEWS_PER_GAME = 10;
let unusedUserIds = new Array(750).fill(0).map((_, idx) => idx + 1);

/**
 * Generates n unique ids between low and high, inclusive,
 * with a preference for unused ids
 * @param {Integer} low
 * @param {Integer} high
 * @param {Integer} n
 * @returns {Array} array length n
 */
const generateNUniqueIds = (low, high, n) => {
  let result = [];
  for (let i = 0; i < n; i++) {
    let uniqueId;
    if (unusedUserIds.length) {
      let randIdx = Math.floor(Math.random() * unusedUserIds.length);
      uniqueId = unusedUserIds[randIdx];
      unusedUserIds.splice(randIdx, 1);
    } else {
      do {
        uniqueId = Math.floor(Math.random() * high) + low;
      } while (result.includes(uniqueId));
    }
    result.push(uniqueId);
  }
  return result;
};

/**
 * Generates REVIEWS_PER_GAME * 100 units of review data based on seed.sql reviews schema
 * @returns {Array}: REVIEWS_PER_GAME * 100 elements long
 */
const generateReviewData = () => {
  /**
   * Rules:
   * 1. id_user must be between 1-NUM_USERS (750)
   * 2. id_game must be between 1-100
   * 3. hours_at_review_time must not exceed hours_on_record
   * 4. purchase_type must be one of ('direct', 'key')
   * 5. date_posted must be weighted to be more recent
   * 6. A user may only review a game at most 1 time
   * 7. Each user reviews at least 1 game
   */

  // Maps reviewData to id_game, ensuring there are REVIEWS_PER_GAME num of each game id
  let reviewData = new Array(REVIEWS_PER_GAME * 100).fill(0);
  reviewData = reviewData.map((_, idx) => (idx - (idx % REVIEWS_PER_GAME)) / REVIEWS_PER_GAME + 1);

  // Generate other data specified in reviews schema
  // Rules: 1, 2, 6, 7
  for (let i = 0; i < reviewData.length; i += REVIEWS_PER_GAME) {
    let gameAndUserIdTuples = generateNUniqueIds(1, 750, REVIEWS_PER_GAME)
      .map(idUser => ({
        idGame: reviewData[i],
        idUser
      }));
    reviewData.splice(i, REVIEWS_PER_GAME, ...gameAndUserIdTuples);
  }

  // Rule 4 (purchaseType === 'direct' || 'key')
  reviewData = reviewData.map(({ idGame, idUser }) => ({
    idUser,
    idGame,
    isRecommended: Math.random() < parseFloat(Math.random().toFixed(1)),
    hoursOnRecord: parseFloat((Math.random() * 4000).toFixed(1)),
    purchaseType: Math.random() < 0.5 ? 'direct' : 'key',
    receivedFree: Math.random() < 0.1,
    reviewText: Math.random() < 0.5 ? faker.lorem.paragraph() : `${faker.lorem.paragraph()} ${faker.lorem.paragraph()} ${faker.lorem.paragraph()}`,
    numFoundHelpful: Math.floor(Math.random() * 800),
    numFoundFunny: Math.floor(Math.random() * 800),
    numComments: Math.floor(Math.random() * 100)
  }));

  // Rule 3 (hoursAtReviewTime <= hoursOnRecord)
  // Rule 5 (datePosted constraints) - 65% chance of being in the last 30 days
  let msIn1Year = 1000 * 60 * 60 * 24 * 365;
  let msIn30Days = 1000 * 60 * 60 * 24 * 30;
  reviewData.forEach(reviewObj => {
    reviewObj.hoursAtReviewTime = parseFloat((Math.random() * reviewObj.hoursOnRecord).toFixed(1));
    let datePostedMs = Date.now();
    Math.random() <= 0.65 ? datePostedMs -= Math.floor(Math.random() * msIn30Days) : datePostedMs -= Math.floor(Math.random() * msIn1Year);
    let date = new Date(datePostedMs);
    reviewObj.datePosted = date.toISOString();
  });

  console.log('Reviews data generated. Writing to .csv file...');
  return reviewData;
};

const main = () => {
  fs.promises.readdir(path.resolve(__dirname, 'csv-seeds'))
    .then(files => {
      if (files.includes('reviews.csv')) {
        throw new Error('reviews.csv file already generated. Check your ./data-gen/csv-seeds directory');
      } else {
        return generateReviewData();
      }
    })
    .then(data => {
      return writeToCsv(
        data,
        ['idUser', 'idGame', 'isRecommended', 'hoursOnRecord', 'hoursAtReviewTime', 'purchaseType', 'datePosted', 'receivedFree', 'reviewText', 'numFoundHelpful', 'numFoundFunny', 'numComments'],
        path.resolve(__dirname, 'csv-seeds', 'reviews.csv')
      );
    })
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
};

main();

