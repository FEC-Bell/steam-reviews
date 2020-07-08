// For styled components that are too small to have their own files, but are used repeatedly.
import styled from 'styled-components';

// Modular flexbox parent <div> which accepts optional props to change flex behavior, to be used in multiple components
export const FlexDiv = styled.div`
  display: ${props => props.display || 'flex'};
  flex-direction: ${props => props.flexDirection || 'row'};
  flex-wrap: ${props => props.flexWrap || 'nowrap'};
  justify-content: ${props => props.justifyContent || 'flex-start'};
  align-items: ${props => props.alignItems || 'stretch'};
  align-content: ${props => props.alignContent || 'stretch'};
`;

export const BoldText = styled.span`
  font-weight: ${props => props.weight ? props.weight : 'bold'};
`;

export const NoSelect = styled.div`
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;