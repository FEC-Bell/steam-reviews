import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import MainReviews from './MainReviews';
import RecentReviews from './RecentReviews';

const ReviewsContainer = styled.div`
  min-height: 1000px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
`;

const Reviews = ({ mainReviews, recentReviews }) => {
  return (
    <ReviewsContainer>
      <MainReviews
        reviews={mainReviews}
      />
      <RecentReviews
        reviews={recentReviews}
      />
    </ReviewsContainer>
  );
};

Reviews.propTypes = {
  mainReviews: PropTypes.arrayOf(PropTypes.object).isRequired,
  recentReviews: PropTypes.array.isRequired
};

Reviews.defaultProps = {
  mainReviews: [],
  recentReviews: []
};

export default Reviews;
