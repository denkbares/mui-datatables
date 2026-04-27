import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import getTextLabels from '../src/textLabels';
import TableHeadCell from '../src/components/TableHeadCell';
import { DndProvider } from 'react-dnd';
import { TestBackend } from 'react-dnd-test-backend';

describe('<TableHeadCell />', function() {
  let classes;

  beforeEach(() => {
    classes = {
      root: {},
    };
  });

  it('should add custom props to header cell if "setCellHeaderProps" provided', () => {
    const options = { sort: true, textLabels: getTextLabels() };
    const toggleSort = () => {};
    const setCellHeaderProps = { myprop: 'test', className: 'testClass' };

    render(
      <DndProvider backend={TestBackend}>
        <table>
          <thead>
            <tr>
              <TableHeadCell
                cellHeaderProps={setCellHeaderProps}
                options={options}
                sortDirection={'asc'}
                sort={true}
                toggleSort={toggleSort}
                classes={classes}>
                some content
              </TableHeadCell>
            </tr>
          </thead>
        </table>
      </DndProvider>
    );

    const cell = screen.getByRole('cell');
    expect(cell).toHaveAttribute('myprop', 'test');
    expect(cell).toHaveClass('testClass');
  });

  it('should render a table head cell with sort label when options.sort = true provided', () => {
    const options = { sort: true, textLabels: getTextLabels() };
    const toggleSort = () => {};

    render(
      <DndProvider backend={TestBackend}>
        <table>
          <thead>
            <tr>
              <TableHeadCell options={options} sortDirection={'asc'} sort={true} toggleSort={toggleSort} classes={classes}>
                some content
              </TableHeadCell>
            </tr>
          </thead>
        </table>
      </DndProvider>
    );

    expect(screen.getByRole('button', { name: /sort/i })).toBeInTheDocument();
  });

  it('should render a table head cell without sort label when options.sort = false provided', () => {
    const options = { sort: false, textLabels: getTextLabels() };
    const toggleSort = () => {};

    render(
      <DndProvider backend={TestBackend}>
        <table>
          <thead>
            <tr>
              <TableHeadCell options={options} sortDirection={'asc'} sort={false} toggleSort={toggleSort} classes={classes}>
                some content
              </TableHeadCell>
            </tr>
          </thead>
        </table>
      </DndProvider>
    );

    expect(screen.queryByRole('button', { name: /sort/i })).not.toBeInTheDocument();
  });

  it('should render a table help icon when hint provided', () => {
    const options = { sort: true, textLabels: getTextLabels() };

    render(
      <DndProvider backend={TestBackend}>
        <table>
          <thead>
            <tr>
              <TableHeadCell options={options} hint={'hint text'} classes={classes}>
                some content
              </TableHeadCell>
            </tr>
          </thead>
        </table>
      </DndProvider>
    );

    expect(screen.getByTestId('HelpIcon')).toBeInTheDocument();
  });

  it('should render a table head cell without custom tooltip when hint provided', () => {
    const options = { sort: true, textLabels: getTextLabels() };

    render(
      <DndProvider backend={TestBackend}>
        <table>
          <thead>
            <tr>
              <TableHeadCell options={options} classes={classes}>
                some content
              </TableHeadCell>
            </tr>
          </thead>
        </table>
      </DndProvider>
    );

    expect(screen.queryByTestId('HelpIcon')).not.toBeInTheDocument();
  });

  it('should trigger toggleSort prop callback when calling method handleSortClick', () => {
    const options = { sort: true, textLabels: getTextLabels() };
    const toggleSort = jest.fn();

    render(
      <DndProvider backend={TestBackend}>
        <table>
          <thead>
            <tr>
              <TableHeadCell
                options={options}
                sort={true}
                index={0}
                sortDirection={'asc'}
                toggleSort={toggleSort}
                classes={classes}>
                some content
              </TableHeadCell>
            </tr>
          </thead>
        </table>
      </DndProvider>
    );

    fireEvent.click(screen.getByText('some content'));
    expect(toggleSort).toHaveBeenCalledTimes(1);
  });
});
