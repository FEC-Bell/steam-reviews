import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GlobalStyle } from './GlobalStyle';
import FilterMenu from './FilterMenu/FilterMenu';
import FilterInfo from './FilterInfo/FilterInfo';

import { gameTitle, gameRating, summaryQueryRes, funnyQueryRes } from '../data/sampleData';

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
  const [activeFilterDisplay, setActiveFilterDisplay] = useState({
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

  /**
   * Get the appropriate tag name to display in Filter breadcrumbs beneath menu.
   * @param {String} title: one of [Review Type, Purchase Type, Language, Date Range, Playtime]
   * @param {String|Object} inputVal: if string, equal to displayed radio labels. If object, equal to a Playtime range
   * @param {Number} [inputVal.min]: minimum playtime if input val is object
   * @param {Number} [inputVal.max]: maximum playtime if input val is object
   */
  const getFilterTagDisplay = useCallback((title, inputVal) => {
    if (title !== 'Date Range' && typeof inputVal === 'string') {
      return inputVal === 'Other' ?
        'Not Purchased on Steam' : (
          title === 'Playtime' ?
            `Playtime: ${inputVal}` :
            inputVal
        );
    }
    if (title === 'Date Range') {
      return 'TODO: Hook up to review-graph api';
    }
    // Already checked for string inputVal above -- handle object inputVal here
    if (title === 'Playtime') {
      return JSON.stringify(inputVal);
    }
  }, []);

  const handleActiveFilterChange = useCallback((title, inputVal) => {
    // Exit handler if Playtime dropdown slider is used, setting select value to empty (but still triggering handleActiveFilterChange)
    if (!inputVal) {
      return;
    }
    if (hiddenFilters.current[title] === inputVal) {
      setActiveFilterDisplay(prevFilters => ({
        ...prevFilters,
        [title]: null
      }));
      return;
    }
    setActiveFilterDisplay(prevFilters => ({
      ...prevFilters,
      [title]: getFilterTagDisplay(title, inputVal)
    }));
  }, []);

  return (
    <React.Fragment>
      <GlobalStyle />
      <FilterMenu
        filterOrder={filterMenuOrder.current}
        filterMenuOpts={filterMenuOpts.current}
        filterMenuCounts={filterMenuCounts}
        handleFilterChange={handleActiveFilterChange}
      />
      <FilterInfo
        filterOrder={filterMenuOrder.current}
        activeFilterDisplay={activeFilterDisplay}
        gameSentiment={gameSentiment}
        reviewCount={reviewCount}
      />
    </React.Fragment>
  );
};

export default ReviewsModule;