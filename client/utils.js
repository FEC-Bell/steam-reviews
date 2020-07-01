/**
   * Transforms a number into a human-readable, comma separated numString.
   * I.E. 1234567 -> 1,234,567
   * @param {Number} count
   * @returns {String}
   */
export const addCommaToCount = (count) => {
  return count.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,');
};