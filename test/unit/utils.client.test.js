import { addCommaToCount } from '../../client/utils';

describe('addCommaToCount client util', () => {
  test('adds commas in proper places to a stringfied number', () => {
    // Args given to count will always be integers
    let args = [1, 10, 100, 1000, 10000, 100000, 1000000];
    let expected = ['1', '10', '100', '1,000', '10,000', '100,000', '1,000,000'];
    args.forEach((arg, idx) => {
      expect(addCommaToCount(arg)).toBe(expected[idx]);
    });
  });
});