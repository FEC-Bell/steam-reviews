import React from 'react';
import PropTypes from 'prop-types';
import MainReviews from './MainReviews';
import RecentReviews from './RecentReviews';
import { ReviewsContainer } from './Reviews.styles';

const Reviews = ({ mainReviews, recentReviews }) => {
  return (
    <ReviewsContainer
      flexDirection='row'
      flexWrap='nowrap'
      justifyContent='space-between'
    >
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
  recentReviews: PropTypes.array
};

Reviews.defaultProps = {
  mainReviews: [{}], // If prop error, pass 1 empty review so that reviews aren't empty (rendered via MainReview.defaultProps)
  recentReviews: []
};

export default Reviews;
