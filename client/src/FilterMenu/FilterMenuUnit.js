import React from 'react';
import styled from 'styled-components';
import { FlexDiv } from '../UIUXUtils';
import DropdownContent from './DropdownContent';

/**
 * STYLED COMPONENTS
 */
const MenuUnit = styled.div`
  border-left: 1px solid #2a475e;
  padding-right: 10px;
  white-space: nowrap;
  ${({ isDisplayAs }) => (
    isDisplayAs ?
      `
        padding: 5px 0;
      ` :
      `
        :hover {
          background-color: #c6d4df;
        }
      `
  )}
`;

const Title = styled.div`
  text-transform: uppercase;
  font-size: 10px;
  color: #4582a5;
  padding: 5px 0 5px 10px;
`;

const TitleWithArrow = styled(Title)`
  padding: 10px;
  padding-right: 20px;
  cursor: pointer;
  background-image: url(https://steamstore-a.akamaihd.net/public/images/v6/btn_arrow_down_padded.png);
  background-repeat: no-repeat;
  background-position-y: center;
  background-position-x: right;
`;

const StyledSelect = styled.select`
  width: 100px;
  background: #4582a5;
  font-size: 12px;
  border: none;
  border-radius: 2px;
  outline: none;
  margin-left: 10px;
`;

const Dropdown = styled.div`
  background-color: #c6d4df;
  position: absolute;
  margin-top: 31.2px;
  padding: 10px;
  color: #556772;
  line-height: 20px;
  visibility: hidden;
  box-sizing: border-box;
  ${MenuUnit}:hover & {
    visibility: visible;
  }
`;

/**
 * MAIN COMPONENT
 */
const FilterMenuUnit = ({ title, options, handleFilterChange }) => (
  <MenuUnit isDisplayAs={title === 'Display As'}>
    {
      // If dropdown === Display as, display a title without arrow and a select dropdown
      title === 'Display As' ?
        (
          <FlexDiv alignItems={'center'} flexWrap={'wrap'}>
            <Title>{title}:</Title>
            <StyledSelect
              onChange={(e) => handleFilterChange(title, e.target.value)}
            >
              {
                options.map((option, idx) => <option value={option.toLowerCase().split(' ').join('-')} key={idx}>{option}</option>)
              }
            </StyledSelect>
          </FlexDiv>
        ) :
        // Else display title with an arrow. Hovering over the title will display the dropdown
        (
          <FlexDiv flexWrap='wrap' flexDirection='column'>
            <TitleWithArrow>{title}</TitleWithArrow>
            {
              <Dropdown id={`${title.toLowerCase().split(' ').join('-')}-dropdown`}>
                <DropdownContent
                  title={title}
                  options={options}
                  handleFilterChange={handleFilterChange}
                />
              </Dropdown>
            }
          </FlexDiv>
        )
    }
  </MenuUnit>
);

export default FilterMenuUnit;