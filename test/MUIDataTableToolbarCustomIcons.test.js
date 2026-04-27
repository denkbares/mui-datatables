import { render, screen } from '@testing-library/react';
import React from 'react';
import TableToolbar from '../src/components/TableToolbar';
import getTextLabels from '../src/textLabels';

const CustomChip = props => {
  return <div data-testid="custom-chip">{props.label}</div>;
};

let setTableAction = () => {};
const options = {
  print: true,
  download: true,
  search: true,
  filter: true,
  viewColumns: true,
  textLabels: getTextLabels(),
  downloadOptions: {
    separator: ',',
    filename: 'tableDownload.csv',
    filterOptions: {
      useDisplayedRowsOnly: true,
      useDisplayedColumnsOnly: true,
    },
  },
};
const columns = ['First Name', 'Company', 'City', 'State'];
const data = [
  {
    data: ['Joe James', 'Test Corp', 'Yonkers', 'NY'],
    dataIndex: 0,
  },
  {
    data: ['John Walsh', 'Test Corp', 'Hartford', 'CT'],
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

const testCustomIcon = (iconName, label) => {
  const components = { icons: { [iconName]: CustomChip } };
  render(<TableToolbar {...{ columns, data, options, setTableAction, components }} />);
  
  expect(screen.getByTestId('custom-chip')).toBeInTheDocument();
  expect(screen.getAllByRole('button').length).toBe(5);
};

describe('<TableToolbar /> with custom icons', function() {
  it('should render a toolbar with a custom chip in place of the search icon', () => {
    testCustomIcon('SearchIcon');
  });

  it('should render a toolbar with a custom chip in place of the download icon', () => {
    testCustomIcon('DownloadIcon');
  });

  it('should render a toolbar with a custom chip in place of the print icon', () => {
    testCustomIcon('PrintIcon');
  });

  it('should render a toolbar with a custom chip in place of the view columns icon', () => {
    testCustomIcon('ViewColumnIcon');
  });

  it('should render a toolbar with a custom chip in place of the filter icon', () => {
    testCustomIcon('FilterIcon');
  });
});
