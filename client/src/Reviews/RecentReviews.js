import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const RecentReviewsAside = styled.aside`
  width: 308px;
  margin-left: 14px;
`;

const RecentReview = styled.div`
  opacity: 0.9;
  background: -webkit-linear-gradient(left, rgba(34,50,70,1) -1%,rgba(34,50,70,1) 0%,rgba(34,50,70,0) 92%,rgba(34,50,70,0) 100%);
  background: linear-gradient(to right, rgba(34,50,70,1) -1%,rgba(34,50,70,1) 0%,rgba(34,50,70,0) 92%,rgba(34,50,70,0) 100%);
  margin-bottom: 26px;
`;

const RecentReviews = ({ reviews }) => {
  return (
    <RecentReviewsAside>
      {
        reviews.map((review, idx) => (
          <RecentReview key={idx}>{review.user.username}</RecentReview>
        ))
      }
    </RecentReviewsAside>
  );
};

RecentReviews.propTypes = {
  reviews: PropTypes.array.isRequired
};

RecentReviews.defaultProps = {
  reviews: []
};

export default RecentReviews;
