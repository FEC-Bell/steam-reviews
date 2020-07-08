import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import InfoTooltip from '../../client/src/FilterMenu/InfoTooltip';

describe('<InfoTooltip /> tests', () => {
  test('renders a tooltip with expected message and position', () => {
    render(<InfoTooltip message='Test Message' xOff={20} yOff={30} />);

    // Image exists
    let imageNode = screen.getByAltText('tooltip-image');
    expect(imageNode).toBeInTheDocument();
    expect(imageNode).toHaveAttribute('src', 'https://steamstore-a.akamaihd.net/public/shared/images/ico/icon_questionmark_dark.png');

    // Tooltip with correct message, position, and visibility exists
    fireEvent.mouseEnter(imageNode);
    let tooltipNode = screen.getByText('Test Message');
    expect(tooltipNode).toBeInTheDocument();
    expect(tooltipNode).toHaveStyle(`
      bottom: 30px;
      left: 20px;
      visibility: visible;
    `);
    fireEvent.mouseOut(imageNode);
    expect(tooltipNode).toBeInTheDocument();
    expect(tooltipNode).toHaveStyle(`
      bottom: 30px;
      left: 20px;
      visibility: hidden;
    `);
  });

  test('renders an tooltip with default position when not passed position props', () => {
    render(<InfoTooltip message='Test Message 2'/>);

    // Image exists
    let imageNode = screen.getByAltText('tooltip-image');
    expect(imageNode).toBeInTheDocument();
    expect(imageNode).toHaveAttribute('src', 'https://steamstore-a.akamaihd.net/public/shared/images/ico/icon_questionmark_dark.png');

    // Tooltip with default position exists
    fireEvent.mouseEnter(imageNode);
    let tooltipNode = screen.getByText('Test Message 2');
    expect(tooltipNode).toBeInTheDocument();
    expect(tooltipNode).toHaveStyle(`
      bottom: 20px;
      left: 5px;
      visibility: visible;
    `);
    fireEvent.mouseOut(imageNode);
    expect(tooltipNode).toHaveStyle(`
      bottom: 20px;
      left: 5px;
      visibility: hidden;
    `);
  });
});