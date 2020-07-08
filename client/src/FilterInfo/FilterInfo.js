import React from 'react';
import styled from 'styled-components';
import FilterTags from './FilterTags';
import { BoldText } from '../UIUXUtils';

const FilterInfoContainer = styled.div`
  border-bottom: 1px solid #000;
  padding-bottom: 20px;
  margin-bottom: 20px;
`;

const FilterScoreInfo = styled.div`
  padding-top: 10px;
  font-size: 15px;
`;

// Positive color: #66c0f4 (Overwhelmingly Positive, Mostly Positive, Very Positive)
// Mixed color: #b9a06a (Mixed)
// Negative color: #a34c25 (Overwhelmingly Negative, Mostly Negative, Very Negative)
const RatingText = styled(BoldText)`
  color: ${props => props.context === 'Positive' ? '#66c0f4' : (props.context === 'Negative' ? '#a34c25' : '#b9a06a')};
  cursor: help;
`;

const FilterInfo = ({ resetOption, filterOrder, activeFilters, gameSentiment, reviewCount }) => {
  return (
    <FilterInfoContainer>
      <FilterTags
        filterOrder={filterOrder}
        activeFilters={activeFilters}
        resetOption={resetOption}
      />
      <FilterScoreInfo className='emphasis-font'>
        Showing&nbsp;
        <BoldText weight={900}>{reviewCount}</BoldText>
        &nbsp;reviews that match the filters above
        ( <RatingText context={gameSentiment.split(' ').slice(-1)[0]}>{gameSentiment}</RatingText> )
      </FilterScoreInfo>
    </FilterInfoContainer>
  );
};

export default FilterInfo;