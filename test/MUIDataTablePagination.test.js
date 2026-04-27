import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import getTextLabels from '../src/textLabels';
import TablePagination from '../src/components/TablePagination';

describe('<TablePagination />', function() {
  let options;

  beforeEach(() => {
    options = {
      rowsPerPageOptions: [5, 10, 15],
      textLabels: getTextLabels(),
    };
  });

  it('should render a table footer with pagination', () => {
    render(
      <table>
        <TablePagination options={options} count={100} page={1} rowsPerPage={10} />
      </table>
    );

    expect(screen.getByText(/11-20 of 100/i)).toBeInTheDocument();
  });

  it('should trigger changePage prop callback when page is changed', () => {
    const changePage = jest.fn();
    render(
      <table>
        <TablePagination options={options} count={100} page={1} rowsPerPage={10} changePage={changePage} />
      </table>
    );

    const nextButton = screen.getByLabelText(/next page/i);
    fireEvent.click(nextButton);

    expect(changePage).toHaveBeenCalledTimes(1);
  });

  it('should correctly change page to be in bounds if out of bounds page was set', () => {
    // Set a page that is too high for the count and rowsPerPage
    render(
      <table>
        <TablePagination options={options} count={5} page={1} rowsPerPage={10} />
      </table>
    );

    expect(screen.getByText(/1-5 of 5/i)).toBeInTheDocument();
  });
});
