import React from 'react';
import styled from 'styled-components';
import { FlexDiv } from '../UIUXUtils';

const TitleLabel = styled.div`
  font-size: 15px;
  color: #c6d4df;
  padding-bottom: 5px;
  margin-right: 5px;
`;

const Tag = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 5px;
  padding-right: 25px;
  margin: 0 5px 2.5px 2.5px;
  border-radius: 2px;
  cursor: pointer;
  background-repeat: no-repeat;
  background-image: url(https://steamstore-a.akamaihd.net/public/images/v6/deleteSearchTerm.png);
  background-position: right 5px center;
`;

const FilterTags = ({ filterOrder, activeFilters }) => {
  // let validTagsToBeDisplayed = filterOrder.filter(title => {
  //   return title !== 'Display As' && activeFilters[title];
  // });
  return (
    <FlexDiv flexWrap={'wrap'} alignItems={'center'}>
      {/* {
        validTagsToBeDisplayed.length ?
          <TitleLabel className='emphasis-font'>Filters</TitleLabel> :
          ''
      }
      {
        validTagsToBeDisplayed.map((title, idx) => (
          <Tag key={idx}>{activeFilters[title]}</Tag>
        ))
      } */}
    </FlexDiv>
  );
};

export default FilterTags;