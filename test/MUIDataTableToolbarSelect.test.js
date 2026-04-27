import React from 'react';
import { render, screen } from '@testing-library/react';
import TableToolbarSelect from '../src/components/TableToolbarSelect';
import getTextLabels from '../src/textLabels';

describe('<TableToolbarSelect />', function() {
  it('should render table toolbar select', () => {
    const onRowsDelete = () => {};
    render(
      <TableToolbarSelect
        options={{ textLabels: getTextLabels() }}
        selectedRows={{ data: [1] }}
        onRowsDelete={onRowsDelete}
      />,
    );

    expect(screen.getByRole('button', { name: /delete selected rows/i })).toBeInTheDocument();
  });

  it('should call customToolbarSelect with 3 arguments', () => {
    const onRowsDelete = () => {};
    const customToolbarSelect = jest.fn();
    const selectedRows = { data: [1] };
    const displayData = [1];

    render(
      <TableToolbarSelect
        options={{ textLabels: getTextLabels(), customToolbarSelect }}
        selectedRows={selectedRows}
        onRowsDelete={onRowsDelete}
        displayData={displayData}
      />,
    );

    expect(customToolbarSelect).toHaveBeenCalledWith(selectedRows, displayData, expect.any(Function));
  });

  it('should call selectRowUpdate when customToolbarSelect passed and setSelectedRows was called', () => {
    const onRowsDelete = () => {};
    const selectRowUpdate = jest.fn();
    const customToolbarSelect = (_, __, setSelectedRows) => {
      setSelectedRows([1]);
    };
    const selectedRows = { data: [1] };
    const displayData = [1];

    render(
      <TableToolbarSelect
        options={{ textLabels: getTextLabels(), customToolbarSelect }}
        selectedRows={selectedRows}
        onRowsDelete={onRowsDelete}
        displayData={displayData}
        selectRowUpdate={selectRowUpdate}
      />,
    );

    expect(selectRowUpdate).toHaveBeenCalledTimes(1);
    expect(selectRowUpdate).toHaveBeenCalledWith('custom', [1]);
  });
});
