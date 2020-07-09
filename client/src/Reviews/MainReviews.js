import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const MainReviewsDiv = styled.div`
  width: 616px;
`;

const MainReview = styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  margin-bottom: 26px;
  background-image: url(https://steamstore-a.akamaihd.net/public/images/v6/maincol_gradient_rule.png);
  background-repeat: no-repeat;
  background-position: top left;
`;

const MainReviews = ({ reviews }) => {
  return (
    <MainReviewsDiv>
      {
        reviews.map((review, idx) => (
          <MainReview key={idx}>{review.user.username}</MainReview>
        ))
      }
    </MainReviewsDiv>
  );
};

MainReviews.propTypes = {
  reviews: PropTypes.array.isRequired
};

MainReviews.defaultProps = {
  reviews: []
};

export default MainReviews;
