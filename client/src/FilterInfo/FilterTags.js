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

const FilterTags = ({ resetOption, filterOrder, activeFilters }) => {
  let validTagsToBeDisplayed = filterOrder.filter(title => {
    return title !== 'Display As' && activeFilters[title];
  });

  /**
   * Get the appropriate tag name to display in Filter breadcrumbs beneath menu.
   * @param {String} title: one of [Review Type, Purchase Type, Language, Date Range, Playtime]
   * @param {String|Object} inputVal: if string, equal to displayed radio labels. If object, equal to a Playtime range
   * @param {Number} [inputVal.min]: minimum playtime if input val is object
   * @param {Number} [inputVal.max]: maximum playtime if input val is object
   */
  const getFilterTagDisplay = (title, inputVal) => {
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

      return `Playtime: ${inputVal.max === 100 ? 'Over ' : ''}${inputVal.min} hour(s)${inputVal.max !== 100 ? ` to ${inputVal.max} hour(s)` : ''}`;
    }
  };

  return (
    <FlexDiv flexWrap={'wrap'} alignItems={'center'}>
      {
        validTagsToBeDisplayed.length ?
          <TitleLabel className='emphasis-font'>Filters</TitleLabel> :
          ''
      }
      {
        validTagsToBeDisplayed.map((title, idx) => (
          <Tag
            key={idx}
            onClick={() => { resetOption(title); }}
          >
            {getFilterTagDisplay(title, activeFilters[title])}
          </Tag>
        ))
      }
    </FlexDiv>
  );
};

export default FilterTags;