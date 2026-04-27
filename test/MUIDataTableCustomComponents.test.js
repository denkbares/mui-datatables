import React from 'react';
import { render, screen } from '@testing-library/react';
import MUIDataTable from '../src/MUIDataTable';
import TableFilterList from '../src/components/TableFilterList';

const CustomChip = props => {
  return <div data-testid="custom-chip">{props.label}</div>;
};

const CustomFilterList = props => {
  return <TableFilterList {...props} ItemComponent={CustomChip} />;
};

describe('<MUIDataTable /> with custom components', function() {
  let data;
  let columns;

  beforeEach(() => {
    columns = [
      { name: 'Name' },
      {
        name: 'Company',
        options: {
          filter: true,
          filterType: 'custom',
          filterList: ['Test Corp'],
        },
      },
      { name: 'City', label: 'City Label' },
      { name: 'State' },
      { name: 'Empty', options: { empty: true, filterType: 'checkbox' } },
    ];
    data = [
      ['Joe James', 'Test Corp', 'Yonkers', 'NY'],
      ['John Walsh', 'Test Corp', 'Hartford', null],
      ['Bob Herm', 'Test Corp', 'Tampa', 'FL'],
      ['James Houston', 'Test Corp', 'Dallas', 'TX'],
    ];
  });

  it('should render a table with custom Chip in TableFilterList', () => {
    render(
      <MUIDataTable
        columns={columns}
        data={data}
        components={{
          TableFilterList: CustomFilterList,
        }}
      />,
    );

    expect(screen.getByTestId('custom-chip')).toHaveTextContent('Test Corp');
  });
});
