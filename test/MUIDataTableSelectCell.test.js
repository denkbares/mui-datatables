import React from 'react';
import { render, screen } from '@testing-library/react';
import TableSelectCell from '../src/components/TableSelectCell';

describe('<TableSelectCell />', function() {
  it('should render table select cell', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableSelectCell checked={false} selectableOn="multiple" />
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('should render table select cell checked', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableSelectCell checked={true} selectableOn="multiple" />
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('should render table select cell unchecked', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableSelectCell checked={false} selectableOn="multiple" />
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });
});
