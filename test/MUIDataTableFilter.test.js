import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TableFilter from '../src/components/TableFilter';
import getTextLabels from '../src/textLabels';

describe('<TableFilter />', function() {
  let data;
  let columns;
  let filterData;

  beforeEach(() => {
    columns = [
      { name: 'firstName', label: 'First Name', display: true, sort: true, filter: true, sortDirection: 'desc' },
      { name: 'company', label: 'Company', display: true, sort: true, filter: true, sortDirection: 'desc' },
      { name: 'city', label: 'City Label', display: true, sort: true, filter: true, sortDirection: 'desc' },
      { name: 'state', label: 'State', display: true, sort: true, filter: true, sortDirection: 'desc' },
    ];

    data = [
      ['Joe James', 'Test Corp', 'Yonkers', 'NY'],
      ['John Walsh', 'Test Corp', 'Hartford', 'CT'],
      ['Bob Herm', 'Test Corp', 'Tampa', 'FL'],
      ['James Houston', 'Test Corp', 'Dallas', 'TX'],
    ];

    filterData = [
      ['Joe James', 'John Walsh', 'Bob Herm', 'James Houston'],
      ['Test Corp'],
      ['Yonkers', 'Hartford', 'Tampa', 'Dallas'],
      ['NY', 'CT', 'FL', 'TX'],
    ];
  });

  it('should render label as filter name', () => {
    const options = { filterType: 'checkbox', textLabels: getTextLabels() };
    const filterList = [[], [], [], []];
    render(
      <TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />,
    );
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('City Label')).toBeInTheDocument();
    expect(screen.getByText('State')).toBeInTheDocument();
  });

  it("should render data table filter view with checkboxes if filterType = 'checkbox'", () => {
    const options = { filterType: 'checkbox', textLabels: getTextLabels() };
    const filterList = [[], [], [], []];
    render(
      <TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />,
    );

    const checkboxes = screen.getAllByRole('checkbox');
    // filterData total items: 4 + 1 + 4 + 4 = 13
    expect(checkboxes.length).toBe(13);
  });

  it('should render data table filter view with no checkboxes if filter=false for each column', () => {
    const options = { filterType: 'checkbox', textLabels: getTextLabels() };
    const filterList = [[], [], [], []];
    const noFilterColumns = columns.map(item => ({ ...item, filter: false }));

    render(
      <TableFilter columns={noFilterColumns} filterData={filterData} filterList={filterList} options={options} />,
    );

    const checkboxes = screen.queryAllByRole('checkbox');
    expect(checkboxes.length).toBe(0);
  });

  it("should render data table filter view with selects if filterType = 'select'", () => {
    const options = { filterType: 'select', textLabels: getTextLabels() };
    const filterList = [['Joe James'], [], [], []];

    render(
      <TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />,
    );

    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBe(4);
  });

  it("should data table custom filter view with if filterType = 'custom' and a valid display filterOption is provided", () => {
    const columnsWithCustom = columns.map((col, index) => 
      index === 0 ? {
        ...col,
        filterType: 'custom',
        filterOptions: {
          display: (filterList, onChange, index, column) => (
            <div>
              <input data-testid="custom-filter-render" defaultValue="Custom Filter Render" />
            </div>
          ),
        }
      } : col
    );

    const options = { textLabels: getTextLabels() };
    const filterList = [[], [], [], []];
    render(
      <TableFilter columns={columnsWithCustom} filterData={filterData} filterList={filterList} options={options} />,
    );

    expect(screen.getByTestId('custom-filter-render')).toBeInTheDocument();
  });

  it("should render column.label as filter label if filterType = 'textField'", () => {
    const options = { filterType: 'textField', textLabels: getTextLabels() };
    const filterList = [[], [], [], []];
    render(
      <TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />,
    );
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Company')).toBeInTheDocument();
    expect(screen.getByLabelText('City Label')).toBeInTheDocument();
    expect(screen.getByLabelText('State')).toBeInTheDocument();
  });

  it('should invoke onFilterReset when reset is pressed', () => {
    const options = { textLabels: getTextLabels() };
    const filterList = [[], [], [], []];
    const onFilterUpdate = jest.fn();
    const handleClose = jest.fn();
    const onFilterReset = jest.fn();

    render(
      <TableFilter
        columns={columns}
        onFilterUpdate={onFilterUpdate}
        filterData={filterData}
        filterList={filterList}
        options={options}
        handleClose={handleClose}
        onFilterReset={onFilterReset}
      />,
    );

    fireEvent.click(screen.getByTestId('filterReset-button'));

    expect(onFilterReset).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledTimes(0);
  });

  it('should trigger onFilterUpdate prop callback when checkbox is clicked', () => {
    const options = { filterType: 'checkbox', textLabels: getTextLabels() };
    const filterList = [[], [], [], []];
    const onFilterUpdate = jest.fn();
    const updateFilterByType = jest.fn();

    render(
      <TableFilter
        columns={columns}
        onFilterUpdate={onFilterUpdate}
        updateFilterByType={updateFilterByType}
        filterData={filterData}
        filterList={filterList}
        options={options}
      />,
    );

    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);
    
    expect(updateFilterByType).toHaveBeenCalled();
  });
});
