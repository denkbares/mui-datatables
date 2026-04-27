import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MUIDataTable from '../src/MUIDataTable';

const columns = ['Name', 'Company', 'City', 'State'];
const data = [
  ['Joe James', 'Test Corp', 'Yonkers', 'NY'],
  ['John Walsh', 'Test Corp', 'Hartford', 'CT'],
  ['Bob Herm', 'Test Corp', 'Tampa', 'FL'],
  ['James Houston', 'Test Corp', 'Dallas', 'TX'],
];

describe('<MUIDataTable /> RTL', () => {
  it('should render a table with data', () => {
    render(<MUIDataTable title="Test" data={data} columns={columns} />);

    expect(screen.getByRole('table')).toBeInTheDocument();

    expect(screen.getByText('Joe James')).toBeInTheDocument();
    expect(screen.getByText('John Walsh')).toBeInTheDocument();
    expect(screen.getByText('Bob Herm')).toBeInTheDocument();
    expect(screen.getByText('James Houston')).toBeInTheDocument();
  });

  it('should render column headers', () => {
    render(<MUIDataTable title="Test" data={data} columns={columns} />);

    const headers = screen.getAllByRole('columnheader');
    const headerTexts = headers.map(h => h.textContent);
    expect(headerTexts).toContain('Name');
    expect(headerTexts).toContain('Company');
    expect(headerTexts).toContain('City');
    expect(headerTexts).toContain('State');
  });

  it('should open search when search icon is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MUIDataTable
        title="Test"
        data={data}
        columns={columns}
        options={{ search: true }}
      />,
    );

    const searchButton = screen.getByLabelText('Search');
    await user.click(searchButton);

    // After clicking search, an input should appear
    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();
  });
});
