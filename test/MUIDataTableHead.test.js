import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TableHead from '../src/components/TableHead';
import TableHeadCell from '../src/components/TableHeadCell';
import { DndProvider } from 'react-dnd';
import { TestBackend } from 'react-dnd-test-backend';

describe('<TableHead />', function() {
  let columns;
  let handleHeadUpdateRef;

  beforeEach(() => {
    columns = [
      { name: 'First Name', label: 'First Name', display: 'true', sort: true },
      { name: 'Company', label: 'Company', display: 'true', sort: null },
      { name: 'City', label: 'City Label', display: 'true', sort: null },
      {
        name: 'State',
        label: 'State',
        display: 'true',
        options: { fixedHeaderOptions: { xAxis: true, yAxis: true }, selectableRows: 'multiple' },
        customHeadRender: columnMeta => <TableHeadCell {...columnMeta}>{columnMeta.name + 's'}</TableHeadCell>,
        sort: null,
      },
    ];

    handleHeadUpdateRef = () => {};
  });

  it('should render a table head', () => {
    const options = {};
    const toggleSort = () => {};
    render(
      <DndProvider backend={TestBackend}>
        <table>
          <TableHead
            columns={columns}
            options={options}
            setCellRef={() => {}}
            handleHeadUpdateRef={handleHeadUpdateRef}
            toggleSort={toggleSort}
          />
        </table>
      </DndProvider>,
    );
    const actualResult = screen.getAllByRole('columnheader');
    expect(actualResult.length).toBe(4);
  });

  it('should render the label in the table head cell', () => {
    const options = {};
    const toggleSort = () => {};

    render(
      <DndProvider backend={TestBackend}>
        <table>
          <TableHead
            columns={columns}
            options={options}
            setCellRef={() => {}}
            handleHeadUpdateRef={handleHeadUpdateRef}
            toggleSort={toggleSort}
          />
        </table>
      </DndProvider>,
    );
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('City Label')).toBeInTheDocument();
    expect(screen.getByText('States')).toBeInTheDocument();
  });

  it('should render a table head with no cells', () => {
    const options = {};
    const toggleSort = () => {};

    const newColumns = columns.map(column => ({ ...column, display: 'false' }));
    render(
      <DndProvider backend={TestBackend}>
        <table>
          <TableHead
            columns={newColumns}
            options={options}
            setCellRef={() => {}}
            handleHeadUpdateRef={handleHeadUpdateRef}
            toggleSort={toggleSort}
          />
        </table>
      </DndProvider>,
    );
    const actualResult = screen.queryAllByRole('columnheader');
    expect(actualResult.length).toBe(0);
  });

  it('should trigger toggleSort prop callback when calling method handleToggleColumn', () => {
    const options = { sort: true };
    const toggleSort = jest.fn();

    render(
      <DndProvider backend={TestBackend}>
        <table>
          <TableHead
            columns={columns}
            options={options}
            setCellRef={() => {}}
            handleHeadUpdateRef={handleHeadUpdateRef}
            toggleSort={toggleSort}
          />
        </table>
      </DndProvider>,
    );

    fireEvent.click(screen.getByText('First Name'));
    expect(toggleSort).toHaveBeenCalledTimes(1);
  });
});