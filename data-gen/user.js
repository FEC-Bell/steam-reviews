const fs = require('fs');
const path = require('path');
const faker = require('faker');
const { writeToCsv } = require('./utils');

const NUM_USERS = 750;

/**
 * Generates NUM_USERS units of user data based on seed.sql users schema
 * @returns {Array}: NUM_USERS elements long
 */
const generateUserData = () => {
  /**
 * Rules:
 * 1. Usernames must be unique
 * 2. id_badge must be between 1 and 16, in_game_id between 1 and 100
 * 3. num_reviews must be between 1 and num_products
 * 4. If isOnline is false, is_in_game is false and in_game_id/in_game_status are null
 */

  // Generate usernames & ensure uniqueness before generating other data
  let userData = [];
  for (let i = 0; i < NUM_USERS; i++) {
    let randomUsername;
    do {
      randomUsername = faker.internet.userName();
    } while (userData.includes(randomUsername));
    userData.push(randomUsername);
  }

  // Generate other data specified in users schema (seed.sql)
  userData = userData.map((username, idx) => {
    let userObj = {
      username,
      profileUrl: `https://picsum.photos/seed/${idx * 50}/100`,
      isOnline: Math.random() < 0.5,
      numProducts: Math.ceil(Math.random() * 200),
      steamLevel: Math.ceil(Math.random() * 50),
      idBadge: Math.ceil(Math.random() * 16),
    };

    // Rule 3
    userObj.numReviews = Math.ceil(Math.random() * userObj.numProducts);

    // Rule 4
    userObj.isInGame = userObj.isOnline ? Math.random() < 0.5 : false;
    userObj.inGameId = userObj.isInGame ? Math.ceil(Math.random() * 100) : '';
    userObj.inGameStatus = userObj.isInGame ? faker.hacker.phrase() : '';

    return userObj;
  });

  console.log('Users data generated. Writing to .csv file...');
  return userData;
};

// Called on executing 'node data-gen/user.js'
const main = () => {
  fs.promises.readdir(path.resolve(__dirname, 'csv-seeds'))
    .then(files => {
      if (files.includes('users.csv')) {
        throw new Error('users.csv file already generated. Check your ./data-gen/csv-seeds directory');
      } else {
        return generateUserData();
      }
    })
    .then(data => {
      return writeToCsv(
        data,
        ['username', 'profileUrl', 'isOnline', 'numProducts', 'numReviews', 'steamLevel', 'idBadge', 'isInGame', 'inGameId', 'inGameStatus'],
        path.resolve(__dirname, 'csv-seeds', 'users.csv')
      );
    })
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
};

main();

