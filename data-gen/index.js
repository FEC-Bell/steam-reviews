const { writeToCsv } = require('./utils');
const { generateUserData } = require('./user');
const { generateReviewData } = require('./review');

// Called on executing 'node data-gen/index.js'
let filesInSeeds = [];
const main = () => {
  fs.promises.readdir(path.resolve(__dirname, 'csv-seeds'))
    .then(files => {
      filesInSeeds = files;
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
    .catch(err => {
      console.error(err);
    })
    .then(() => {
      if (filesInSeeds.includes('reviews.csv')) {
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