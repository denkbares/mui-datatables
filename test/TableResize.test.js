import React from 'react';
import { render, screen } from '@testing-library/react';
import TableResize from '../src/components/TableResize';

describe('<TableResize />', function() {
  let options;

  beforeEach(() => {
    options = {
      resizableColumns: true,
      tableBodyHeight: '500px',
    };
  });

  it('should render a table resize component', () => {
    const updateDividers = jest.fn();
    const setResizeable = jest.fn();

    render(
      <TableResize options={options} updateDividers={updateDividers} setResizeable={setResizeable} />,
    );

    expect(updateDividers).toHaveBeenCalledTimes(1);
    expect(setResizeable).toHaveBeenCalledTimes(1);
  });
});
