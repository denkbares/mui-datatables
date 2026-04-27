import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import getTextLabels from '../src/textLabels';
import TableBody from '../src/components/TableBody';

describe('<TableBody />', function() {
  let data;
  let displayData;
  let columns;
  const tableId = 'tableID';

  beforeEach(() => {
    columns = [
      { name: 'First Name', display: 'true' },
      { name: 'Company', display: 'true' },
      { name: 'City', display: 'true' },
      { name: 'State', display: 'true' },
    ];
    data = [
      ['Joe James', 'Test Corp', 'Yonkers', 'NY'],
      ['John Walsh', 'Test Corp', null, 'CT'],
      ['Bob Herm', 'Test Corp', 'Tampa', 'FL'],
      ['James Houston', 'Test Corp', 'Dallas', 'TX'],
    ];
    displayData = [
      {
        data: ['Joe James', 'Test Corp', 'Yonkers', 'NY'],
        dataIndex: 0,
      },
      {
        data: ['John Walsh', 'Test Corp', null, 'CT'],
        dataIndex: 1,
      },
      {
        data: ['Bob Herm', 'Test Corp', 'Tampa', 'FL'],
        dataIndex: 2,
      },
      {
        data: ['James Houston', 'Test Corp', 'Dallas', 'TX'],
        dataIndex: 3,
      },
    ];
  });

  it('should render a table body with no selectable cells if selectableRows = none', () => {
    const options = { selectableRows: 'none' };
    const selectRowUpdate = () => {};
    const toggleExpandRow = () => {};

    render(
      <table>
        <TableBody
          data={displayData}
          count={displayData.length}
          columns={columns}
          page={0}
          rowsPerPage={10}
          selectedRows={{}}
          selectRowUpdate={selectRowUpdate}
          expandedRows={{}}
          toggleExpandRow={toggleExpandRow}
          options={options}
          searchText={''}
          filterList={[]}
        />
      </table>,
    );

    const actualResult = screen.queryAllByRole('checkbox');
    expect(actualResult.length).toBe(0);
  });

  it('should render a table body with no records if no data provided', () => {
    const options = { selectableRows: 'none', textLabels: getTextLabels() };
    const selectRowUpdate = () => {};
    const toggleExpandRow = () => {};

    render(
      <table>
        <TableBody
          data={[]}
          columns={columns}
          page={0}
          rowsPerPage={10}
          selectedRows={{}}
          selectRowUpdate={selectRowUpdate}
          expandedRows={{}}
          toggleExpandRow={toggleExpandRow}
          options={options}
          searchText={''}
          filterList={[]}
        />
      </table>,
    );

    expect(screen.getByText('Sorry, no matching records found')).toBeInTheDocument();
  });

  it('should render a table body with selectable cells if selectableRows = true', () => {
    const options = { selectableRows: 'multiple' };
    const selectRowUpdate = () => {};
    const toggleExpandRow = () => {};

    render(
      <table>
        <TableBody
          data={displayData}
          count={displayData.length}
          columns={columns}
          page={0}
          rowsPerPage={10}
          selectedRows={{}}
          selectRowUpdate={selectRowUpdate}
          expandedRows={{}}
          toggleExpandRow={toggleExpandRow}
          options={options}
          searchText={''}
          filterList={[]}
        />
      </table>,
    );

    const actualResult = screen.getAllByRole('checkbox');
    expect(actualResult.length).toBe(4);
  });

  it('should return the correct rowIndex when calling instance method getRowIndex', () => {
    const options = { sort: true, selectableRows: 'multiple' };
    const selectRowUpdate = () => {};
    const toggleExpandRow = () => {};

    render(
      <table>
        <TableBody
          data={displayData}
          count={displayData.length}
          columns={columns}
          page={1}
          rowsPerPage={2}
          selectedRows={{ lookup: { 1: true, 2: true, 3: true } }}
          selectRowUpdate={selectRowUpdate}
          expandedRows={{}}
          toggleExpandRow={toggleExpandRow}
          options={options}
          searchText={''}
          filterList={[]}
        />
      </table>,
    );

    // Page 1 with 2 rows per page means we should see dataIndex 2 and 3
    expect(screen.getByText('Bob Herm')).toBeInTheDocument();
    expect(screen.getByText('James Houston')).toBeInTheDocument();
  });

  it('should return correctly if row exists in selectedRows when calling instance method isRowSelected', () => {
    const options = { sort: true, selectableRows: true };
    const selectRowUpdate = () => {};
    const toggleExpandRow = () => {};

    render(
      <table>
        <TableBody
          data={displayData}
          count={displayData.length}
          columns={columns}
          page={0}
          rowsPerPage={15}
          selectedRows={{ lookup: { 1: true, 2: true, 3: true } }}
          selectRowUpdate={selectRowUpdate}
          expandedRows={{}}
          toggleExpandRow={toggleExpandRow}
          options={options}
          searchText={''}
          filterList={[]}
        />
      </table>,
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[0]).not.toBeChecked();
  });

  it('should trigger selectRowUpdate prop callback when calling method handleRowSelect', () => {
    const options = { sort: true, selectableRows: 'multiple' };
    const selectRowUpdate = jest.fn();
    const toggleExpandRow = () => {};

    render(
      <table>
        <TableBody
          data={displayData}
          count={displayData.length}
          columns={columns}
          page={0}
          rowsPerPage={10}
          selectedRows={{}}
          selectRowUpdate={selectRowUpdate}
          expandedRows={{}}
          toggleExpandRow={toggleExpandRow}
          options={options}
          searchText={''}
          filterList={[]}
        />
      </table>,
    );

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[2]);

    expect(selectRowUpdate).toHaveBeenCalledTimes(1);
  });

  it('should select the adjacent rows when a row is shift+clicked and a previous row has been selected.', () => {
    let adjacentRows = [];
    const options = { sort: true, selectableRows: 'multiple', selectableRowsOnClick: true };
    const previousSelectedRow = { index: 0, dataIndex: 0 };
    const selectRowUpdate = (type, data, adjacent) => {
      adjacentRows = adjacent;
    };
    const selectedRows = { data: [], lookup: {} };
    const toggleExpandRow = () => {};

    render(
      <table>
        <TableBody
          data={displayData}
          count={displayData.length}
          columns={columns}
          page={0}
          rowsPerPage={10}
          selectedRows={selectedRows}
          selectRowUpdate={selectRowUpdate}
          previousSelectedRow={previousSelectedRow}
          expandedRows={{}}
          toggleExpandRow={toggleExpandRow}
          options={options}
          searchText={''}
          filterList={[]}
          tableId={tableId}
        />
      </table>,
    );

    const row = screen.getByTestId('MUIDataTableBodyRow-3');
    fireEvent.click(row, { shiftKey: true });

    expect(adjacentRows.length).toBe(3);
  });

  it('should gather selected row data when clicking row with selectableRowsOnClick=true.', () => {
    let selectedRowData;
    const options = { selectableRows: 'multiple', selectableRowsOnClick: true };
    const selectRowUpdate = (type, data) => (selectedRowData = data);
    const toggleExpandRow = jest.fn();

    render(
      <table>
        <TableBody
          data={displayData}
          count={displayData.length}
          columns={columns}
          page={0}
          rowsPerPage={10}
          selectedRows={{}}
          selectRowUpdate={selectRowUpdate}
          expandedRows={{}}
          toggleExpandRow={toggleExpandRow}
          options={options}
          searchText={''}
          filterList={[]}
          tableId={tableId}
        />
      </table>,
    );

    const row = screen.getByTestId('MUIDataTableBodyRow-2');
    fireEvent.click(row);

    const expectedResult = { index: 2, dataIndex: 2 };
    expect(selectedRowData).toEqual(expectedResult);
    expect(toggleExpandRow).toHaveBeenCalledTimes(0);
  });

  it('should not gather selected row data when clicking row with selectableRowsOnClick=true when it is disabled with isRowSelectable via index.', () => {
    let selectedRowData;
    const options = {
      selectableRows: 'multiple',
      selectableRowsOnClick: true,
      isRowSelectable: dataIndex => (dataIndex === 2 ? false : true),
    };
    const selectRowUpdate = (_, data) => (selectedRowData = data);
    const toggleExpandRow = jest.fn();

    render(
      <table>
        <TableBody
          data={displayData}
          count={displayData.length}
          columns={columns}
          page={0}
          rowsPerPage={10}
          selectedRows={{}}
          selectRowUpdate={selectRowUpdate}
          expandedRows={{}}
          toggleExpandRow={toggleExpandRow}
          options={options}
          searchText={''}
          filterList={[]}
          tableId={tableId}
        />
      </table>,
    );

    const row = screen.getByTestId('MUIDataTableBodyRow-2');
    fireEvent.click(row);

    expect(selectedRowData).toBeUndefined();
    expect(toggleExpandRow).toHaveBeenCalledTimes(0);
  });

  it('should not gather expanded row data when clicking row with expandableRowsOnClick=true when it is disabled with isRowExpandable via dataIndex.', () => {
    let expandedRowData;
    const options = {
      expandableRows: true,
      renderExpandableRow: () => (
        <tr>
          <td>foo</td>
        </tr>
      ),
      expandableRowsOnClick: true,
      isRowExpandable: dataIndex => (dataIndex === 2 ? false : true),
    };
    const toggleExpandRow = jest.fn((_, data) => (expandedRowData = data));

    render(
      <table>
        <TableBody
          data={displayData}
          count={displayData.length}
          columns={columns}
          page={0}
          rowsPerPage={10}
          selectedRows={{}}
          expandedRows={{}}
          toggleExpandRow={toggleExpandRow}
          options={options}
          searchText={''}
          filterList={[]}
          tableId={tableId}
        />
      </table>,
    );

    const row = screen.getByTestId('MUIDataTableBodyRow-2');
    fireEvent.click(row);

    expect(expandedRowData).toBeUndefined();
    expect(toggleExpandRow).toHaveBeenCalledTimes(0);
  });

  it('should not gather selected row data when clicking row with selectableRowsOnClick=true when it is disabled with isRowSelectable via selectedRows.', () => {
    let selectedRowData;
    const options = {
      selectableRows: 'multiple',
      selectableRowsOnClick: true,
      isRowSelectable: (dataIndex, selectedRows) => selectedRows.lookup[dataIndex] || selectedRows.data.length < 1,
    };
    const selectRowUpdate = (_, data) => (selectedRowData = data);
    const toggleExpandRow = jest.fn();
    const initialSelectedRows = {
      data: [{ index: 1, dataIndex: 1 }],
      lookup: { 1: true },
    };

    render(
      <table>
        <TableBody
          data={displayData}
          count={displayData.length}
          columns={columns}
          page={0}
          rowsPerPage={10}
          selectedRows={initialSelectedRows}
          selectRowUpdate={selectRowUpdate}
          expandedRows={{}}
          toggleExpandRow={toggleExpandRow}
          options={options}
          searchText={''}
          filterList={[]}
          tableId={tableId}
        />
      </table>,
    );

    const row = screen.getByTestId('MUIDataTableBodyRow-2');
    fireEvent.click(row);

    expect(selectedRowData).toBeUndefined();
    expect(toggleExpandRow).toHaveBeenCalledTimes(0);
  });

  it('should gather selected row data when clicking row with selectableRowsOnClick=true when it is enabled with isRowSelectable via dataIndex.', () => {
    let selectedRowData;
    const options = {
      selectableRows: 'multiple',
      selectableRowsOnClick: true,
      isRowSelectable: (dataIndex, selectedRows) => selectedRows.lookup[dataIndex] || selectedRows.data.length < 1,
    };
    const selectRowUpdate = (_, data) => (selectedRowData = data);
    const toggleExpandRow = jest.fn();
    const initialSelectedRows = {
      data: [{ index: 1, dataIndex: 1 }],
      lookup: { 1: true },
    };

    render(
      <table>
        <TableBody
          data={displayData}
          count={displayData.length}
          columns={columns}
          page={0}
          rowsPerPage={10}
          selectedRows={initialSelectedRows}
          selectRowUpdate={selectRowUpdate}
          expandedRows={{}}
          toggleExpandRow={toggleExpandRow}
          options={options}
          searchText={''}
          filterList={[]}
          tableId={tableId}
        />
      </table>,
    );

    const row = screen.getByTestId('MUIDataTableBodyRow-1');
    fireEvent.click(row);

    const expectedResult = { index: 1, dataIndex: 1 };
    expect(selectedRowData).toEqual(expectedResult);
    expect(toggleExpandRow).toHaveBeenCalledTimes(0);
  });

  it('should gather expanded row data when clicking row with expandableRowsOnClick=true when it is enabled with isRowExpandable via dataIndex.', () => {
    let expandedRowData;
    const options = {
      expandableRows: true,
      renderExpandableRow: () => (
        <tr>
          <td>foo</td>
        </tr>
      ),
      expandableRowsOnClick: true,
      isRowExpandable: dataIndex => (dataIndex === 2 ? true : false),
    };
    const toggleExpandRow = jest.fn(data => (expandedRowData = data));

    render(
      <table>
        <TableBody
          data={displayData}
          count={displayData.length}
          columns={columns}
          page={0}
          rowsPerPage={10}
          selectedRows={{}}
          expandedRows={{}}
          toggleExpandRow={toggleExpandRow}
          options={options}
          searchText={''}
          filterList={[]}
          tableId={tableId}
        />
      </table>,
    );

    const row = screen.getByTestId('MUIDataTableBodyRow-2');
    fireEvent.click(row);

    expect(expandedRowData).toBeDefined();
    expect(toggleExpandRow).toHaveBeenCalledTimes(1);
  });

  it('should gather expanded row data when clicking row with expandableRows=true and expandableRowsOnClick=true.', () => {
    let expandedRowData;
    const options = { selectableRows: 'multiple', expandableRows: true, expandableRowsOnClick: true };
    const selectRowUpdate = jest.fn();
    const toggleExpandRow = data => (expandedRowData = data);

    render(
      <table>
        <TableBody
          data={displayData}
          count={displayData.length}
          columns={columns}
          page={0}
          rowsPerPage={10}
          selectedRows={{}}
          selectRowUpdate={selectRowUpdate}
          expandedRows={{}}
          toggleExpandRow={toggleExpandRow}
          options={options}
          searchText={''}
          filterList={[]}
          tableId={tableId}
        />
      </table>,
    );

    const row = screen.getByTestId('MUIDataTableBodyRow-2');
    fireEvent.click(row);

    const expectedResult = { index: 2, dataIndex: 2 };
    expect(expandedRowData).toEqual(expectedResult);
    expect(selectRowUpdate).toHaveBeenCalledTimes(0);
  });

  it('should gather both selected and expanded row data when clicking row with expandableRows=true, selectableRowsOnClick=true, and expandableRowsOnClick=true.', () => {
    let expandedRowData;
    let selectedRowData;
    const options = {
      selectableRows: 'multiple',
      selectableRowsOnClick: true,
      expandableRows: true,
      expandableRowsOnClick: true,
    };
    const selectRowUpdate = (type, data) => (selectedRowData = data);
    const toggleExpandRow = data => (expandedRowData = data);

    render(
      <table>
        <TableBody
          data={displayData}
          count={displayData.length}
          columns={columns}
          page={0}
          rowsPerPage={10}
          selectedRows={{}}
          selectRowUpdate={selectRowUpdate}
          expandedRows={{}}
          toggleExpandRow={toggleExpandRow}
          options={options}
          searchText={''}
          filterList={[]}
          tableId={tableId}
        />
      </table>,
    );

    const row = screen.getByTestId('MUIDataTableBodyRow-2');
    fireEvent.click(row);

    const expectedResult = { index: 2, dataIndex: 2 };
    expect(selectedRowData).toEqual(expectedResult);
    expect(expandedRowData).toEqual(expectedResult);
  });

  it('should not call onRowClick when clicking on checkbox for selectable row', () => {
    const onRowClick = jest.fn();
    const options = { selectableRows: 'multiple', onRowClick };
    const selectRowUpdate = jest.fn();
    const toggleExpandRow = jest.fn();

    render(
      <table>
        <TableBody
          data={displayData}
          count={displayData.length}
          columns={columns}
          page={0}
          rowsPerPage={10}
          selectedRows={{}}
          selectRowUpdate={selectRowUpdate}
          expandedRows={{}}
          toggleExpandRow={toggleExpandRow}
          options={options}
          searchText={''}
          filterList={[]}
        />
      </table>,
    );

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    expect(onRowClick).toHaveBeenCalledTimes(0);
  });

  it('should not call onRowClick when clicking to select a row', () => {
    const onRowClick = jest.fn();
    const options = { selectableRows: 'multiple', selectableRowsOnClick: true, onRowClick };
    const selectRowUpdate = jest.fn();
    const toggleExpandRow = jest.fn();

    render(
      <table>
        <TableBody
          data={displayData}
          count={displayData.length}
          columns={columns}
          page={0}
          rowsPerPage={10}
          selectedRows={{}}
          selectRowUpdate={selectRowUpdate}
          expandedRows={{}}
          toggleExpandRow={toggleExpandRow}
          options={options}
          searchText={''}
          filterList={[]}
        />
      </table>,
    );

    const row = screen.getByTestId('MUIDataTableBodyRow-0');
    fireEvent.click(row);

    expect(onRowClick).toHaveBeenCalledTimes(0);
  });

  it('should call onRowClick when Row is clicked', () => {
    const onRowClick = jest.fn();
    const options = { selectableRows: 'multiple', onRowClick };
    const selectRowUpdate = jest.fn();
    const toggleExpandRow = () => {};

    render(
      <table>
        <TableBody
          data={displayData}
          count={displayData.length}
          columns={columns}
          page={0}
          rowsPerPage={10}
          selectedRows={{}}
          selectRowUpdate={selectRowUpdate}
          expandedRows={{}}
          toggleExpandRow={toggleExpandRow}
          options={options}
          searchText={''}
          filterList={[]}
        />
      </table>,
    );

    const row = screen.getByTestId('MUIDataTableBodyRow-2');
    fireEvent.click(row);

    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick).toHaveBeenCalledWith(data[2], expect.objectContaining({ rowIndex: 2, dataIndex: 2 }), expect.anything());
  });

  it("should add custom props to rows if 'setRowProps' provided", () => {
    const setRowProps = jest.fn().mockReturnValue({ className: 'testClass' });
    const options = { setRowProps };
    const selectRowUpdate = jest.fn();
    const toggleExpandRow = () => {};

    render(
      <table>
        <TableBody
          data={displayData}
          count={displayData.length}
          columns={columns}
          page={0}
          rowsPerPage={10}
          selectedRows={{}}
          selectRowUpdate={selectRowUpdate}
          expandedRows={{}}
          toggleExpandRow={toggleExpandRow}
          options={options}
          searchText={''}
          filterList={[]}
          tableId={tableId}
        />
      </table>,
    );

    const row = screen.getByTestId('MUIDataTableBodyRow-1');
    expect(row).toHaveClass('testClass');
    expect(setRowProps).toHaveBeenCalled();
  });

  it("should not fail if 'setRowProps' returns undefined", () => {
    const setRowProps = jest.fn().mockReturnValue(undefined);
    const options = { setRowProps };
    const selectRowUpdate = jest.fn();
    const toggleExpandRow = () => {};

    render(
      <table>
        <TableBody
          data={displayData}
          count={displayData.length}
          columns={columns}
          page={0}
          rowsPerPage={10}
          selectedRows={{}}
          selectRowUpdate={selectRowUpdate}
          expandedRows={{}}
          toggleExpandRow={toggleExpandRow}
          options={options}
          searchText={''}
          filterList={[]}
          tableId={tableId}
        />
      </table>,
    );

    const row = screen.getByTestId('MUIDataTableBodyRow-1');
    expect(row).not.toHaveClass('testClass');
    expect(setRowProps).toHaveBeenCalled();
    expect(setRowProps).toHaveBeenCalledWith(displayData[1].data, 1, 1);
  });

  it("should use 'customRowRender' when provided", () => {
    const options = { customRowRender: (row, dataIndex, rowIndex) => <tr key={dataIndex}><td>Test_Text_{dataIndex}</td></tr> };
    const selectRowUpdate = jest.fn();
    const toggleExpandRow = () => {};

    render(
      <table>
        <TableBody
          data={displayData}
          count={displayData.length}
          columns={columns}
          page={0}
          rowsPerPage={10}
          selectedRows={{}}
          selectRowUpdate={selectRowUpdate}
          expandedRows={{}}
          toggleExpandRow={toggleExpandRow}
          options={options}
          searchText={''}
          filterList={[]}
        />
      </table>,
    );

    expect(screen.getByText('Test_Text_0')).toBeInTheDocument();
    expect(screen.getByText('Test_Text_1')).toBeInTheDocument();
  });

  it('should pass in selectedRows to isRowSelectable', () => {
    const selectedIndex = 2;
    const originalSelectedRows = {
      data: [{ index: selectedIndex, dataIndex: selectedIndex }],
      lookup: { [selectedIndex]: true },
    };
    const isRowSelectable = jest.fn((_, selectedRows) => {
      return true;
    });

    const options = { selectableRows: 'multiple', isRowSelectable };

    render(
      <table>
        <TableBody
          data={displayData}
          count={displayData.length}
          columns={columns}
          page={0}
          selectedRows={originalSelectedRows}
          rowsPerPage={10}
          expandedRows={{}}
          options={options}
          searchText={''}
          filterList={[]}
        />
      </table>,
    );

    expect(isRowSelectable).toHaveBeenCalledWith(expect.anything(), originalSelectedRows);
    expect(isRowSelectable).toHaveBeenCalledTimes(displayData.length);
  });
});
