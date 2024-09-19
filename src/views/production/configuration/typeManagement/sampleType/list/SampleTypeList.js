/**
 * Title: SampleType Edit Form
 * Description: SampleType Edit Form
 * Author: Iqbal Hossain
 * Date: 05-January-2022
 * Modified: 05-January-2022
 */

import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Card, CardBody, CardHeader, CardTitle, Col, Input, Row } from 'reactstrap';
import { store } from 'redux/storeConfig/store';
import CustomDataTable from 'utility/custom/production/CustomDataTable';
import CustomPagination from 'utility/custom/production/CustomPagination';
import { PlusIcon } from 'utility/custom/production/icons/CustomIcons';
import TableCustomerHeader from 'utility/custom/TableCustomerHeader';
import { selectThemeColors } from 'utility/Utils';
import SampleTypeAddForm from '../form/SampleTypeAddForm';
import SampleTypeEditForm from '../form/SampleTypeEditForm';
import { deleteSampleTypeByRange, fetchSampleTypesByQuery, toggleSampleTypeSidebar } from '../store/actions';
import { SampleTypeTableColumn } from './sampleTypeTableColumn';

// Status filter options
const statusOptions = [
  { value: '', label: 'Select Status', number: 0 },
  { value: true, label: 'Active', number: 1 },
  { value: false, label: 'Inactive', number: 2 }
];

const SampleTypeList = () => {
  const dispatch = useDispatch();
  const { items, loading, isOpenSidebar, total, selectedItem } = useSelector( ( { sampleTypeReducer } ) => sampleTypeReducer );

  //#region States
  const [rowsPerPage, setRowsPerPage] = useState( 5 );
  const [currentPage, setCurrentPage] = useState( 1 );
  const [selectedRowId, setSelectedRowId] = useState( [] );
  const [clearSelectedRow, setClearSelectedRow] = useState( false );
  const [searchTerm, setSearchTerm] = useState( '' );
  const [currentStatus, setCurrentStatus] = useState( {
    value: '',
    label: 'Select Status',
    number: 0
  } );

  //#endregion

  //Global Function to toggle Sidebar
  const toggleSidebar = () => store.dispatch( toggleSampleTypeSidebar( !isOpenSidebar ) );

  //#region Effects
  useEffect( () => {
    dispatch( fetchSampleTypesByQuery( { page: currentPage, rowsPerPage } ) );
  }, [dispatch, rowsPerPage, currentPage] );
  //#endregion

  //#region Events
  // Function in get data on rows per page
  const handlePerPage = e => {
    const value = parseInt( e.currentTarget.value );
    setRowsPerPage( value );
    setCurrentPage( 1 );
  };

  // ** Start For Multiple Rows for Get IDs
  const handleRowSelected = rows => {
    const rowsId = rows.selectedRows.map( item => item.id );
    setSelectedRowId( rowsId );
    setClearSelectedRow( false );
  };

  const handlePageChange = ( { selected } ) => {
    setCurrentPage( selected + 1 );
  };

  // ** Function in get data on search query change
  const handleFilter = val => {
    setSearchTerm( val );
    dispatch( fetchSampleTypesByQuery( { q: val, rowsPerPage } ) );
  };

  const handleSort = ( column, direction ) => {
    const { selector } = column;
    dispatch( fetchSampleTypesByQuery( { sortedBy: direction, sortedColumn: selector } ) );
  };

  // **Clear Delete Ids
  const handleClearSelected = () => {
    setClearSelectedRow( true );
  };

  // ** Delete Rang
  const handleDeleteSampleTypesRange = () => {
    dispatch( deleteSampleTypeByRange( selectedRowId ) );
    setSelectedRowId( [] );
    handleClearSelected();
  };
  //#endregion

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag="h4">Search Filter</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md="6">
              <Input
                id="search-item"
                className="w-100 mt-50"
                placeholder="Search"
                type="text"
                value={searchTerm}
                onChange={e => handleFilter( e.target.value )}
              />
            </Col>

            <Col md="6">
              <Select
                theme={selectThemeColors}
                isClearable={false}
                className="react-select  mt-50"
                classNamePrefix="select"
                options={statusOptions}
                value={currentStatus}
                onChange={data => {
                  setCurrentStatus( data );
                  dispatch(
                    fetchSampleTypesByQuery( {
                      page: currentPage,
                      rowsPerPage,
                      status: data.value ? 'active' : 'inactive'
                    } )
                  );
                }}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle tag="h2">SampleTypes</CardTitle>
        </CardHeader>
        <TableCustomerHeader handlePerPage={handlePerPage} rowsPerPage={rowsPerPage} searchTerm={searchTerm}>
          <PlusIcon onClick={toggleSidebar} />
        </TableCustomerHeader>

        <CustomDataTable
          onSelectedRowsChange={handleRowSelected}
          onSort={handleSort}
          progressPending={loading}
          handleContextAction={handleDeleteSampleTypesRange}
          clearSelectedRows={clearSelectedRow}
          columns={SampleTypeTableColumn}
          sortIcon={<ChevronDown />}
          selectedRowId={selectedRowId}
          data={items}
        />

        <CustomPagination count={Number( Math.ceil( total / rowsPerPage ) )} currentPage={currentPage} onPageChange={handlePageChange} />
      </Card>

      {selectedItem !== null && isOpenSidebar ? (
        <SampleTypeEditForm data={selectedItem} open={isOpenSidebar} lastPageInfo={{ page: currentPage, rowsPerPage, total }} />
      ) : isOpenSidebar ? (
        <SampleTypeAddForm open={isOpenSidebar} lastPageInfo={{ page: currentPage, rowsPerPage, total }} />
      ) : null}
    </div>
  );
};

export default SampleTypeList;

/** Change Log
 * 09-Jan-2022 (Iqbal): Create List Page
 */
