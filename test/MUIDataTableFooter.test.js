import React from 'react';
import { render, screen } from '@testing-library/react';
import getTextLabels from '../src/textLabels';
import TableFooter from '../src/components/TableFooter';

describe('<TableFooter />', function() {
  let options;
  const changeRowsPerPage = jest.fn();
  const changePage = jest.fn();

  beforeEach(() => {
    options = {
      rowsPerPageOptions: [5, 10, 15],
      textLabels: getTextLabels(),
    };
  });

  it('should render a table footer', () => {
    render(
      <table>
        <TableFooter
          options={options}
          rowCount={100}
          page={1}
          rowsPerPage={10}
          changeRowsPerPage={changeRowsPerPage}
          changePage={changePage}
        />
      </table>,
    );

    expect(screen.getByText(/11-20 of 100/i)).toBeInTheDocument();
  });

  it('should render a table footer with customFooter', () => {
    const customOptions = {
      ...options,
      customFooter: (rowCount, page, rowsPerPage, changeRowsPerPage, changePage, textLabels) => {
        return (
          <tfoot data-testid="custom-footer">
            <tr>
              <td>Custom Footer</td>
            </tr>
          </tfoot>
        );
      },
    };

    render(
      <table>
        <TableFooter
          options={customOptions}
          rowCount={100}
          page={1}
          rowsPerPage={10}
          changeRowsPerPage={changeRowsPerPage}
          changePage={changePage}
        />
      </table>,
    );

    expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
    expect(screen.getByText('Custom Footer')).toBeInTheDocument();
  });

  it('should not render a table footer', () => {
    const nonPageOption = {
      ...options,
      pagination: false,
    };

    const { container } = render(
      <table>
        <TableFooter
          options={nonPageOption}
          rowCount={100}
          page={1}
          rowsPerPage={10}
          changeRowsPerPage={changeRowsPerPage}
          changePage={changePage}
        />
      </table>,
    );

    expect(container.querySelector('tfoot')).not.toBeInTheDocument();
  });

  it('should render a JumpToPage component', () => {
    const optionsWithJump = {
      ...options,
      jumpToPage: true,
    };

    render(
      <table>
        <TableFooter
          options={optionsWithJump}
          rowCount={100}
          page={1}
          rowsPerPage={10}
          changeRowsPerPage={changeRowsPerPage}
          changePage={changePage}
        />
      </table>,
    );

    expect(screen.getByText(options.textLabels.pagination.jumpToPage)).toBeInTheDocument();
  });
});
