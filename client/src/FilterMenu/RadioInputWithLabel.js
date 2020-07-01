import React from 'react';
import styled from 'styled-components';
import { FlexDiv } from '../UIUXUtils';
import InfoTooltip from './InfoTooltip';
import { addCommaToCount } from '../../utils';

const OptionCountSpan = styled.span`
  color: #7193a6;
`;

// Modular radio input (with label) component for filter menu dropdowns
const RadioInputWithLabel = ({ option, checkedOption, menuUnitTitle, count, handleChange, tooltipMessage }) => (
  <FlexDiv alignItems={'center'}>
    <input
      type="radio"
      value={option}
      name={menuUnitTitle}
      id={`${menuUnitTitle}_${option}`}
      checked={option === checkedOption}
      onChange={() => handleChange(option, menuUnitTitle)}
    />
    <label htmlFor={`${menuUnitTitle}_${option}`}>
      &nbsp;{option}&nbsp;
      {
        count ?
          <OptionCountSpan>({addCommaToCount(count)})</OptionCountSpan> :
          ''
      }
    </label>
    {
      tooltipMessage ?
        <InfoTooltip
          message={tooltipMessage}
          xOff={5}
          yOff={20}
        /> :
        ''
    }
  </FlexDiv>
);

export default RadioInputWithLabel;