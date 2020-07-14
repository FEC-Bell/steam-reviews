/**
   * Transforms a number into a human-readable, comma separated numString.
   * I.E. 1234567 -> 1,234,567
   * @param {Number} count
   * @returns {String}
   */
export const addCommaToCount = (count) => {
  return count.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,');
};

/**
 * Gets the id portion of window.location.pathname. Returns default (1) if invalid.
 * @returns {Number} int between 1-100, inclusive
 */
export const getPathId = () => {
  let pathArr = window.location.pathname.split('/');
  let pathId = 1;
  if (pathArr.length) {
    pathId = parseInt(pathArr.slice(-1)[0]);
    if (Number.isNaN(pathId) || pathId > 100 || pathId < 1) {
      pathId = 1;
    }
  }
  return pathId;
};

/**
 * Given an ISO date string (2020-06-01T00:00:00Z), format into
 * human readable date (1 Jun, 2020)
 * @param {String} ISOString
 * @returns {String}
 */
export const getHumanReadableFromISO = (ISOString) => {
  let months = {
    '01': 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December'
  };

  return `${parseInt(ISOString.slice(8, 10))} ${months[ISOString.slice(5, 7)]}, ${ISOString.slice(0, 4)}`;
};

/**
 * Get total, positive, and negative review count, plus semantic rating & % positive, from /api/reviews/:gameid
 * @param {Integer} gameid: int between 1-100, inclusive
 * @returns {Promise->Object}
 */
export const fetchAllGameReviews = (gameid) => {
  if (!gameid || gameid > 100 || gameid < 1) {
    throw new Error('Invalid game id');
  }

  return fetch(`/api/reviewcount/${gameid}`)
    .then(response => response.json());
};

/**
 * Get purchase count and reviews data from /api/gamereviews/:gameid
 * @param {Integer} gameid: int between 1-100, inclusive
 * @returns {Promise->Object}
 */
export const fetchReviewInfo = (gameid) => {
  if (!gameid || gameid > 100 || gameid < 1) {
    throw new Error('Invalid game id');
  }

  return fetch(`/api/gamereviews/${gameid}`)
    .then(response => response.json());
};

