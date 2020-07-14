import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import InfoTooltip from '../../client/src/FilterMenu/InfoTooltip';

describe('<InfoTooltip /> tests', () => {
  test('renders a tooltip with expected message and position', () => {
    render(
      <InfoTooltip message='Test Message' xOff={20} yOff={30}>
        <img
          style={{ paddingLeft: '5px' }}
          src="https://steamstore-a.akamaihd.net/public/shared/images/ico/icon_questionmark_dark.png"
          alt="tooltip-image"
        />
      </InfoTooltip>
    );

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
      width: 300px;
      visibility: visible;
    `);
    fireEvent.mouseOut(imageNode);
    expect(tooltipNode).toBeInTheDocument();
    expect(tooltipNode).toHaveStyle(`
      bottom: 30px;
      left: 20px;
      width: 300px;
      visibility: hidden;
    `);
  });

  test('renders an tooltip with default position when not passed position props', () => {
    render(
      <InfoTooltip message='Test Message 2'>
        <img
          style={{ paddingLeft: '5px' }}
          src="https://steamstore-a.akamaihd.net/public/shared/images/ico/icon_questionmark_dark.png"
          alt="tooltip-image"
        />
      </InfoTooltip>
    );

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
      width: 300px;
      visibility: visible;
    `);
    fireEvent.mouseOut(imageNode);
    expect(tooltipNode).toHaveStyle(`
      bottom: 20px;
      left: 5px;
      width: 300px;
      visibility: hidden;
    `);
  });

  test('renders tooltip child correctly via component forwarding', () => {
    render(
      <InfoTooltip message='Test Message 3'>
        <div>Test child component</div>
      </InfoTooltip>
    );

    let childComponent = screen.getByText('Test child component');
    expect(childComponent).toBeInTheDocument();

    // Tooltip functionality works with random child element
    fireEvent.mouseEnter(childComponent);
    let tooltipNode = screen.getByText('Test Message 3');
    expect(tooltipNode).toBeInTheDocument();
    expect(tooltipNode).toHaveStyle(`
      bottom: 20px;
      left: 5px;
      visibility: visible;
    `);
    fireEvent.mouseOut(childComponent);
    expect(tooltipNode).toHaveStyle(`
      bottom: 20px;
      left: 5px;
      visibility: hidden;
    `);
  });

  test('renders a tooltip correctly when passed a width prop', () => {
    render(
      <InfoTooltip message='Test Message 3' width='24ch'>
        <div>Test child component</div>
      </InfoTooltip>
    );

    // Tooltip functionality works with random child element
    let childComponent = screen.getByText('Test child component');
    fireEvent.mouseEnter(childComponent);
    let tooltipNode = screen.getByText('Test Message 3');
    expect(tooltipNode).toBeInTheDocument();
    expect(tooltipNode).toHaveStyle(`
      bottom: 20px;
      left: 5px;
      width: 24ch;
      visibility: visible;
    `);
    fireEvent.mouseOut(childComponent);
    expect(tooltipNode).toHaveStyle(`
      bottom: 20px;
      left: 5px;
      width: 24ch;
      visibility: hidden;
    `);
  });
});
