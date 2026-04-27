import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MUIDataTable from '../src/MUIDataTable';

describe('<TableBodyCell />', function() {
  let data;
  let columns;

  beforeEach(() => {
    columns = [
      {
        name: 'Name',
      },
      'Company',
      { name: 'City', label: 'City Label', options: { filterType: 'textField' } },
      {
        name: 'State',
        options: { filterType: 'multiselect' },
      },
      { name: 'Empty', options: { empty: true, filterType: 'checkbox' } },
    ];
    data = [
      ['Joe James', 'Test Corp', 'Yonkers', 'NY'],
      ['John Walsh', 'Test Corp', 'Hartford', null],
      ['Bob Herm', 'Test Corp X', 'Tampa', 'FL'],
      ['James Houston', 'Test Corp', 'Dallas', 'TX'],
    ];
  });

  it('should execute "onCellClick" prop when clicked if provided', () => {
    const onCellClick = jest.fn();
    const options = {
      onCellClick: onCellClick,
    };

    render(<MUIDataTable columns={columns} data={data} options={options} />);

    fireEvent.click(screen.getByTestId('MuiDataTableBodyCell-0-0'));
    expect(onCellClick).toHaveBeenCalledTimes(1);
    expect(onCellClick).toHaveBeenCalledWith('Joe James', expect.objectContaining({ colIndex: 0, rowIndex: 0 }));

    fireEvent.click(screen.getByTestId('MuiDataTableBodyCell-2-3'));
    expect(onCellClick).toHaveBeenCalledTimes(2);
    expect(onCellClick).toHaveBeenCalledWith('Dallas', expect.objectContaining({ colIndex: 2, rowIndex: 3 }));

    fireEvent.click(screen.getByTestId('MuiDataTableBodyCell-1-2'));
    expect(onCellClick).toHaveBeenCalledTimes(3);
    expect(onCellClick).toHaveBeenCalledWith('Test Corp X', expect.objectContaining({ colIndex: 1, rowIndex: 2 }));
  });
});
