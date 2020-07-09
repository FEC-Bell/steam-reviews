import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

/**
 * STYLED COMPONENTS
 */
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const TooltipDiv = styled.div`
  position: absolute;
  bottom: ${props => `${props.y}px`};
  left: ${props =>`${props.x}px`};
  padding: 5px;
  box-sizing: border-box;
  width: 300px;
  background: #c2c2c2;
  color: #3d3d3f;
  box-shadow: 0 0 4px 0 #000;
  border-radius: 4px;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
  font-size: 11.5px;
  line-height: 12px;
  display: inline-block;
  visibility: ${props => props.open ? 'visible' : 'hidden'};
  animation: ${props => props.open ? fadeIn : fadeOut} 0.1s linear;
  transition: visibility 0.1s linear;
`;

const StyledImg = styled.img`
  cursor: default;
`;

const RelativeParentContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  height: 12px;
  padding-left: 5px;
`;

/**
 * MAIN COMPONENT: Modular hover tooltip
 */
const InfoTooltip = ({ message, xOff, yOff }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <RelativeParentContainer>
      <TooltipDiv
        x={xOff}
        y={yOff}
        open={tooltipOpen}
      >
        {message}
      </TooltipDiv>
      <StyledImg
        onMouseEnter={() => setTooltipOpen(true)}
        onMouseOut={() => setTooltipOpen(false)}
        src="https://steamstore-a.akamaihd.net/public/shared/images/ico/icon_questionmark_dark.png"
        alt="tooltip-image"
      />
    </RelativeParentContainer>
  );
};

InfoTooltip.propTypes = {
  message: PropTypes.string.isRequired,
  xOff: PropTypes.number,
  yOff: PropTypes.number
};

InfoTooltip.defaultProps = {
  message: '',
  xOff: 5,
  yOff: 20
};

export default InfoTooltip;