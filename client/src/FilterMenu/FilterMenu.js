import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FilterMenuUnit from './FilterMenuUnit';

/**
 * STYLED COMPONENTS
 */
const StyledMenu = styled.div`
  margin-bottom: 30px;
  background-color: #1f2f42;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

/**
 * MAIN COMPONENT
 */
const FilterMenu = ({ checkedOptions, updateCheckedOption, filterOrder, filterMenuOpts, filterMenuCounts, handleFilterChange }) => {
  return (
    <StyledMenu>
      {
        // Despite filterMenuOpts being a static object, object key order is not guaranteed, so
        // mapping with filterOrder ensures the order stays the same every time
        filterOrder.map((title, idx) => (
          <FilterMenuUnit
            checkedOption={checkedOptions[title]}
            updateCheckedOption={updateCheckedOption}
            title={title}
            key={idx}
            options={filterMenuCounts[title] ? filterMenuCounts[title] : filterMenuOpts[title]}
            handleFilterChange={handleFilterChange}
          />
        ))
      }
    </StyledMenu>
  );
};

export default FilterMenu;