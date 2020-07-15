import styled from 'styled-components';
import { EmphasisFont, FlexDiv } from '../UIUXUtils';

// Reviews.js
export const ReviewsContainer = styled(FlexDiv)`
  min-height: 1000px;
  max-width: 940px;
`;

// MainReviews.js
export const MainReviewsDiv = styled.div`
  width: 616px;
`;

export const ReviewTypeInfo = styled(EmphasisFont)`
  display: inline-block;
  font-size: 14px;
  color: #fff;
  text-transform: uppercase;
  padding-bottom: 5px;
  letter-spacing: 2px;
  & span {
    color: #56707f;
  }
`;

// MainReview.js
export const ReviewContainer = styled(FlexDiv)`
  background-color: rgba(0, 0, 0, 0.2);
  margin-bottom: 26px;
  background-image: url(https://steamstore-a.akamaihd.net/public/images/v6/maincol_gradient_rule.png);
  background-repeat: no-repeat;
  background-position: top left;
`;

export const Review = styled(FlexDiv)`
  width: 400px;
  margin-left: 14px;
`;

// MainReviewHeader.js
export const ReviewHeader = styled(FlexDiv)`
  cursor: pointer;
  margin: 8px 0 13px;
  background: rgba(0, 0, 0, 0.2);
  height: 40px;
  font-family: 'Roboto', sans-serif;
  :hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const ThumbIcon = styled.img`
  margin-right: 10px;
`;

export const ReviewRecommendation = styled.div`
  font-size: 16px;
  color: #d6d7d8;
  padding-top: 3px;
  line-height: 19px;
  display: inline-block;
`;

export const UserGameHours = styled.div`
  font-size: 11px;
  font-weight: 300;
  line-height: 15px;
  color: #8091a2;
  opacity: 0.6;
`;

export const PurchaseTypeIcon = styled.img`
  margin-right: 5px;
  margin-top: 12px;
  opacity: 0.5;
`;

// MainReviewBody.js
export const BodyContainer = styled.div`
  max-height: 236px;
  overflow: hidden;
  margin-right: 8px;
  & div {
    margin-bottom: 8px;
  }
`;

export const PostedDate = styled.div`
  font-size: 10px;
  text-transform: uppercase;
  color: #8091a2;
  display: inline-block;
  opacity: 0.6;
`;

export const ReceivedFree = styled.div`
  font-size: 10px;
  color: #97907A;
  display: block;
`;

export const ReviewBody = styled(EmphasisFont)`
  display: block;
  font-size: 13px;
  padding-bottom: 11px;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(98, 99, 102, 0.6);
`;

// MainReviewFooter.js
export const ReviewHelpfulQuestion = styled.div`
  margin-bottom: 8px;
  color: #8091a2;
  font-size: 12px;
  opacity: 0.6;
`;

export const ButtonContainer = styled(FlexDiv)`
  padding-bottom: 10px;
`;

export const VoteButton = styled(FlexDiv)`
  border-radius: 2px;
  border: none;
  cursor: pointer;
  color: #66c0f4;
  background: #212c3d;
  padding: 2px 6px;
  margin-right: 5px;
  font-size: 12px;
  :hover {
    color: #fff;
    background: #66c0f4;
  }
  :hover * { /* Change child SVG styles on hover */
    fill: #fff;
    stroke: rgba(0, 0, 0, 0.2);
  }
`;

export const IconContainer = styled.div`
  width: 16px;
  height: 16px;
`;

export const ReviewInfoContainer = styled(FlexDiv)`
  padding: 0 9px 8px 0;
  font-size: 12px;
  color: #647580;
  min-height: 16px;
`;

export const CommentCount = styled.div`
  color: #66c0f4;
  background-image: url(https://steamstore-a.akamaihd.net/public/shared/images/comment_quoteicon_blue.png);
  background-position: right;
  background-repeat: no-repeat;
  padding-right: 20px;
  height: 16px;
  cursor: pointer;
  :hover {
    background-image: url(https://steamstore-a.akamaihd.net/public/shared/images/comment_quoteicon_bright.png);
    color: #fff;
  }
`;
