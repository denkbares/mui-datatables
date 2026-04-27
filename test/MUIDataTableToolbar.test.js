import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import TableToolbar from '../src/components/TableToolbar';
import getTextLabels from '../src/textLabels';

describe('<TableToolbar />', function() {
  let data;
  let columns;
  let options;
  let setTableAction = () => {};

  beforeEach(() => {
    options = {
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
    columns = ['First Name', 'Company', 'City', 'State'];
    data = [
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
  });

  it('should render a toolbar', () => {
    render(
      <TableToolbar columns={columns} data={data} options={options} setTableAction={setTableAction} />,
    );

    expect(screen.getByLabelText('Search')).toBeInTheDocument();
    expect(screen.getByLabelText('Download CSV')).toBeInTheDocument();
    expect(screen.getByLabelText('Print')).toBeInTheDocument();
    expect(screen.getByLabelText('View Columns')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter Table')).toBeInTheDocument();
  });

  it('should render a toolbar with custom title if title is not string', () => {
    const title = <h1 data-testid="custom-title">custom title</h1>;
    render(
      <TableToolbar title={title} columns={columns} data={data} options={options} setTableAction={setTableAction} />,
    );
    expect(screen.getByTestId('custom-title')).toBeInTheDocument();
  });

  it('should render a toolbar with search text initialized if option.searchText = some_text', async () => {
    const newOptions = { ...options, search: true, searchText: 'searchText' };
    render(
      <TableToolbar columns={columns} data={data} options={newOptions} setTableAction={setTableAction} searchText="searchText" />,
    );

    const textbox = await screen.findByRole('textbox');
    expect(textbox).toHaveValue('searchText');
  });

  it('should render a toolbar with search if option.searchOpen = true', () => {
    const newOptions = { ...options, searchOpen: true };
    render(
      <TableToolbar columns={columns} data={data} options={newOptions} setTableAction={setTableAction} />,
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render a toolbar with no search icon if option.search = false', () => {
    const newOptions = { ...options, search: false };
    render(
      <TableToolbar columns={columns} data={data} options={newOptions} setTableAction={setTableAction} />,
    );
    expect(screen.queryByLabelText('Search')).not.toBeInTheDocument();
  });

  it('should render a toolbar with search box and no search icon if option.searchAlwaysOpen = true', () => {
    const newOptions = { ...options, searchAlwaysOpen: true };
    render(
      <TableToolbar columns={columns} data={data} options={newOptions} setTableAction={setTableAction} />,
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.queryByLabelText('Search')).not.toBeInTheDocument();
  });

  it('should render a toolbar with no download icon if option.download = false', () => {
    const newOptions = { ...options, download: false };
    render(
      <TableToolbar columns={columns} data={data} options={newOptions} setTableAction={setTableAction} />,
    );
    expect(screen.queryByLabelText('Download CSV')).not.toBeInTheDocument();
  });

  it('should render a toolbar with no print icon if option.print = false', () => {
    const newOptions = { ...options, print: false };
    render(
      <TableToolbar columns={columns} data={data} options={newOptions} setTableAction={setTableAction} />,
    );
    expect(screen.queryByLabelText('Print')).not.toBeInTheDocument();
  });

  it('should render a toolbar with no view columns icon if option.viewColumns = false', () => {
    const newOptions = { ...options, viewColumns: false };
    render(
      <TableToolbar columns={columns} data={data} options={newOptions} setTableAction={setTableAction} />,
    );
    expect(screen.queryByLabelText('View Columns')).not.toBeInTheDocument();
  });

  it('should render a toolbar with no filter icon if option.filter = false', () => {
    const newOptions = { ...options, filter: false };
    render(
      <TableToolbar columns={columns} data={data} options={newOptions} setTableAction={setTableAction} />,
    );
    expect(screen.queryByLabelText('Filter Table')).not.toBeInTheDocument();
  });

  it('should render a toolbar with custom search when option.customSearchRender is provided', () => {
    const CustomSearchRender = () => <h1 data-testid="customSearchRender">customSearchRender</h1>;
    const newOptions = { ...options, customSearchRender: CustomSearchRender, searchOpen: true };
    render(
      <TableToolbar columns={columns} data={data} options={newOptions} setTableAction={setTableAction} />,
    );

    expect(screen.getByTestId('customSearchRender')).toBeInTheDocument();
  });

  it('should render a toolbar with a search clicking search icon', () => {
    render(
      <TableToolbar columns={columns} data={data} options={options} setTableAction={setTableAction} />,
    );

    const searchButton = screen.getByLabelText('Search');
    fireEvent.click(searchButton);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should hide search after clicking cancel icon', () => {
    const searchClose = jest.fn();
    render(
      <TableToolbar
        searchClose={searchClose}
        columns={columns}
        data={data}
        options={{ ...options, searchOpen: true }}
        setTableAction={setTableAction}
      />,
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();

    const closeButtons = screen.getAllByLabelText('Search');
    fireEvent.click(closeButtons[0]);

    expect(searchClose).toHaveBeenCalled();
  });

  it('should hide search when search icon is clicked while search is open without content', () => {
    const searchClose = jest.fn();
    render(
      <TableToolbar
        searchClose={searchClose}
        columns={columns}
        data={data}
        options={{ ...options, searchOpen: true }}
        setTableAction={setTableAction}
      />,
    );

    const searchButtons = screen.getAllByLabelText('Search');
    fireEvent.click(searchButtons[0]);

    expect(searchClose).toHaveBeenCalled();
  });

  it('should call onFilterDialogOpen when opening filters via toolbar', () => {
    const onFilterDialogOpen = jest.fn();
    const newOptions = { ...options, onFilterDialogOpen };
    render(
      <TableToolbar columns={columns} data={data} options={newOptions} setTableAction={setTableAction} />,
    );

    const filterButton = screen.getByLabelText('Filter Table');
    fireEvent.click(filterButton);

    expect(onFilterDialogOpen).toHaveBeenCalledTimes(1);
  });

  it('should trigger onDownload prop callback when downloading CSV', () => {
    const onDownload = jest.fn().mockReturnValue(false); // return false to prevent actual download
    const newOptions = { ...options, onDownload };

    render(
      <TableToolbar
        columns={columns}
        displayData={data}
        data={data}
        options={newOptions}
        setTableAction={setTableAction}
      />,
    );

    const downloadButton = screen.getByLabelText('Download CSV');
    fireEvent.click(downloadButton);

    expect(onDownload).toHaveBeenCalledTimes(1);
  });
});
