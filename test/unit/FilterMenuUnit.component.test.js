import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FilterMenuUnit from '../../client/src/FilterMenu/FilterMenuUnit';

jest.mock('../../client/src/FilterMenu/DropdownContent', () => {
  return ({ title, options, checkedOption }) => (
    <div>
      <div>{title} - {checkedOption}</div>
      <div>{JSON.stringify(options)}</div>
    </div>
  );
});

describe('<FilterMenuUnit /> tests', () => {
  test('renders a non-"Display As" dropdown', () => {
    render(<FilterMenuUnit
      checkedOption='a'
      updateCheckedOption={() => {}}
      title='Review Type'
      options={['a', 'b', 'c']}
      handleFilterChange={() => {}}
    />);

    let menuTitle = screen.getByText('Review Type');
    expect(menuTitle).toBeInTheDocument();
    expect(menuTitle).toHaveStyle(`
      background-image: url(https://steamstore-a.akamaihd.net/public/images/v6/btn_arrow_down_padded.png);
    `);
    // NOTE: hovering over menuTitle does not make hover styles visible.
    // This is beyond Jest/RTL/JsDOM's scope
    expect(screen.getByText('Review Type - a')).not.toBeVisible();
    expect(screen.getByText('Review Type - a')).toBeInTheDocument();
    expect(screen.getByText('["a","b","c"]')).toBeInTheDocument();
  });

  test('renders a "Display As" dropdown', () => {
    const mockedOptionUpdate = jest.fn();

    render(<FilterMenuUnit
      checkedOption='a'
      updateCheckedOption={mockedOptionUpdate}
      title='Display As'
      options={['a', 'b', 'c']}
      handleFilterChange={() => {}}
    />);

    expect(screen.getByText('Display As:')).toBeInTheDocument();
    let select = screen.getByTestId('display-as-select');
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('a');

    expect(screen.getByTestId('option-0')).toBeInTheDocument();
    expect(screen.getByTestId('option-1')).toBeInTheDocument();
    expect(screen.getByTestId('option-2')).toBeInTheDocument();

    // fireEvent.click does NOT trigger the onChange for the select
    fireEvent.change(select, { target: { value: 'b' }});
    expect(mockedOptionUpdate).toHaveBeenCalledWith('Display As', 'b');
    fireEvent.change(select, { target: { value: 'c' } });
    expect(mockedOptionUpdate).toHaveBeenCalledWith('Display As', 'c');
    fireEvent.change(select, { target: { value: 'a' } });
    expect(mockedOptionUpdate).toHaveBeenCalledWith('Display As', 'a');
  });
});