require('dotenv').config();
const path = require('path');
const fetch = require('node-fetch');
const cors = require('cors');
const express = require('express');
const expressStaticGzip = require('express-static-gzip');
const app = express();
const router = express.Router();

const { getPurchaseTypeDataForGameId, getReviewsByGameIdWithOptions, getUserById, getBadgeById } = require('../db/index');
const { asyncForEach } = require('./asyncForEach');

app.use('/api', router);
app.use(express.json());
app.use(cors());
app.use('/', expressStaticGzip(path.resolve(__dirname, '..', 'public')));

// Prevent "Cannot /GET /app/:gameid" on relevant frontend requests
app.get('/app/:gameid', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
});

router.get('/gamereviews/:gameid', async (req, res) => {
  let { gameid } = req.params;
  if (parseInt(gameid) <= 0 || parseInt(gameid) > 100) {
    res.status(400).json({ error: 'Invalid game ID. Please use a number between 1 and 100.' });
    return;
  }
  try {
    // Get steamPurchased, otherPurchased counts via db call
    let { direct, key } = await getPurchaseTypeDataForGameId(gameid);

    // Get review data, sorted/filtered according to URLSearchParams
    let data = await getReviewsByGameIdWithOptions(gameid, req.query);

    // Attach user, badge info to each review with separate db calls
    // asyncForEach > forEach b/c forEach doesn't work well with asynchronous callbacks
    await asyncForEach(data, async (review) => {
      let [ user ] = await getUserById(review.id_user);
      review.user = user;
      if (review.user.id_badge) {
        let [ badge ] = await getBadgeById(review.user.id_badge);
        review.user.badge = badge;
      }
    });

    // If req.query doesn't contain display, or display === 'summary',
    // data needs to be copied & sorted by recently posted after asyncForEach
    let helpful;
    let recent;
    if ((req.query.display && req.query.display === 'summary') || !req.query.display) {
      helpful = data;
      recent = data.slice().sort((a, b) => Date.parse(a.date_posted) > Date.parse(b.date_posted) ? -1 : 1);
    }
    res.status(200).json({
      steamPurchasedCount: direct,
      otherPurchasedCount: key,
      data: helpful || data,
      recent
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error retrieving reviews' });
  }
});

router.get('/reviewcount/:gameid', (req, res) => {
  fetch(`http://ec2-54-185-79-51.us-west-2.compute.amazonaws.com:3002/api/reviewcount/${req.params.gameid}`)
    .then(response => response.json())
    .then(results => {
      res.status(200).json(results);
    })
    .catch(e => {
      console.error(e);
      res.status(500).json({ error: 'Error fetching review counts' });
    });
});

const server = app.listen(process.env.PORT || 3001, () => {
  console.log(`Server listening on port ${process.env.PORT || 3001}`);
});

module.exports = { app, server };
