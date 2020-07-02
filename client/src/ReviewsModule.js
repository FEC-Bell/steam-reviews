import React, { useState, useEffect, useRef } from 'react';
import { GlobalStyle } from './GlobalStyle';
import FilterMenu from './FilterMenu/FilterMenu';
import FilterInfo from './FilterInfo/FilterInfo';

import { gameTitle, gameRating, summaryQueryRes, funnyQueryRes } from '../../test/fixtures/sampleData';

/**
 * ROOT COMPONENT
 * Stretch goal: Steam website cookies for storing user-specific filters (observed on site)
 */
const ReviewsModule = () => {
  /**
 * STATIC VARIABLES
 */
  const filterMenuOrder = useRef(['Review Type', 'Purchase Type', 'Language', 'Date Range', 'Playtime', 'Display As']);
  const filterMenuOpts = useRef({
    'Review Type': ['All', 'Positive', 'Negative'],
    'Purchase Type': ['All', 'Steam Purchasers', 'Other'],
    'Language': ['All Languages', 'Your Languages'],
    'Date Range': ['Lifetime', 'Only Specific Range (Select on graph above)', 'Exclude Specific Range (Select on graph above)'],
    'Playtime': ['No Minimum', 'Over 1 hour', 'Over 10 hours', 'Over 100 hours'],
    'Display As': ['Summary', 'Most Helpful', 'Recent', 'Funny']
  });
  const hiddenFilters = useRef({
    'Review Type': 'All',
    'Purchase Type': 'All',
    'Language': 'All Languages',
    'Date Range': 'Lifetime',
    'Playtime': 'No Minimum',
  });

  /**
   * STATE
   */
  const [gameSentiment, setGameSentiment] = useState('');
  const [reviewCount, setReviewCount] = useState(0);
  const [activeFilters, setActiveFilters] = useState({
    'Review Type': null,
    'Purchase Type': null,
    'Language': 'Your Languages',
    'Date Range': null,
    'Playtime': null,
    'Display As': null
  });
  const [filterMenuCounts, setFilterMenuCounts] = useState({
    'Review Type': {
      'All': 0,
      'Positive': 0,
      'Negative': 0
    },
    'Purchase Type': {
      'All': 0,
      'Steam Purchasers': 0,
      'Other': 0
    },
    'Language': {
      'All Languages': 0,
      'Your Languages': 0
    }
  });

  // Checked options: values used by controller inputs in FilterMenu
  const defaultCheckedOptions = useRef({
    'Review Type': 'All',
    'Purchase Type': 'All',
    'Language': 'Your Languages',
    'Date Range': 'Lifetime',
    'Playtime': 'No Minimum',
    'Display As': 'summary'
  });
  const [checkedOptions, setCheckedOptions] = useState(defaultCheckedOptions.current);

  const isInitialMount = useRef(true);

  /**
   * HANDLERS & EFFECT HOOKS
   */
  /**
   * Update count displays of filterMenuOpts on component mount by
   * sending a GET request to the backend with default search parameters.
   *
   * Mocking fetch and using mocked data for 'Review Type'
   * TODO: replace with review-graph endpoint for review count/summary in proxy server
   *
   * Also mocking data for 'Purchase Type'
   * TODO: replace with data from this service's endpoint (after PR merge)
   */
  useEffect(() => {
    // Fetch to review-graph endpoint
    fetch('/')
      .then(() => {
        let { summary, total, positive, negative } = gameRating;
        setGameSentiment(summary);
        setFilterMenuCounts(prevCounts => ({
          ...prevCounts,
          'Review Type': {
            'All': total,
            'Positive': positive,
            'Negative': negative
          }
        }));
        // Fetch to my endpoint for initial review data
        return fetch('/');
      })
      .then(() => {
        // Due to different datasets between two services, purchase type total will be different than review
        // type total, despite them being the same on Steam.
        let totalPurchased = summaryQueryRes.steamPurchasedCount + summaryQueryRes.otherPurchasedCount;
        setReviewCount(summaryQueryRes.data.length);
        setFilterMenuCounts(prevCounts => ({
          ...prevCounts,
          'Purchase Type': {
            'All': totalPurchased,
            'Steam Purchasers': summaryQueryRes.steamPurchasedCount,
            'Other': summaryQueryRes.otherPurchasedCount
          },
          'Language': {
            'All Languages': totalPurchased,
            'Your Languages': totalPurchased
          }
        }));
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  // Make a new GET request with updated params on active filter change
  useEffect(() => {
    // Prevent double GET request on component mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      console.log('TODO: GET request with updated params: ReviewsModule.js line 135');
    }
  }, [activeFilters]);

  /**
   * Update the checked input option for a given filter dropdown
   * @param {String} title
   * @param {String} option
   */
  const updateCheckedOption = (title, option) => {
    setCheckedOptions(prevOptions => ({
      ...prevOptions,
      [title]: option
    }));
  };

  /**
   * Reset a filter to its default
   * @param {String} title
   */
  const resetOption = (title) => {
    updateCheckedOption(title, title === 'Language' ? 'All Languages' : defaultCheckedOptions.current[title]);
  };

  /**
   * Set activeFilter according to passed in values. Setting activeFilter triggers a tag display update
   * @param {String} title
   * @param {String|Object} inputVal
   */
  const handleActiveFilterChange = (title, inputVal) => {
    // Exit handler if Playtime dropdown slider is used, setting select value to empty (but still triggering handleActiveFilterChange)
    if (!inputVal) {
      return;
    }

    if (hiddenFilters.current[title] === inputVal || (typeof inputVal === 'object' && inputVal.min === 0 && inputVal.max === 100)) {
      setActiveFilters(prevFilters => ({
        ...prevFilters,
        [title]: null
      }));
      return;
    }

    if (title === 'Display As') {
      setActiveFilters(prevFilters => ({
        ...prevFilters,
        [title]: inputVal === 'summary' ? null : inputVal.split('-').slice(-1)[0]
      }));
      return;
    }

    setActiveFilters(prevFilters => ({
      ...prevFilters,
      [title]: inputVal
    }));
  };

  return (
    <React.Fragment>
      <GlobalStyle />
      <FilterMenu
        checkedOptions={checkedOptions}
        updateCheckedOption={updateCheckedOption}
        filterOrder={filterMenuOrder.current}
        filterMenuOpts={filterMenuOpts.current}
        filterMenuCounts={filterMenuCounts}
        handleFilterChange={handleActiveFilterChange}
      />
      <FilterInfo
        filterOrder={filterMenuOrder.current}
        activeFilters={activeFilters}
        gameSentiment={gameSentiment}
        reviewCount={reviewCount}
        resetOption={resetOption}
      />
    </React.Fragment>
  );
};

export default ReviewsModule;