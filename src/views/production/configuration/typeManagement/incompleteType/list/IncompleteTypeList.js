/**
 * Title: Incomplete Type List Page
 * Description: Incomplete Type List Page
 * Author: Iqbal Hossain
 * Date: 05-January-2022
 * Modified: 10-January-2022
 */

import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Card, CardBody, CardHeader, CardTitle, Col, Input, Row } from 'reactstrap';
import { store } from 'redux/storeConfig/store';
import CustomDataTable from 'utility/custom/production/CustomDataTable';
import CustomPagination from 'utility/custom/production/CustomPagination';
import { PlusIcon } from 'utility/custom/production/icons/CustomIcons';
import TableCustomerHeader from 'utility/custom/TableCustomerHeader';
import { statusOptions } from 'utility/enums';
import { selectThemeColors } from 'utility/Utils';
import IncompleteTypeAddForm from '../form/IncompleteTypeAddForm';
import IncompleteTypeEditForm from '../form/IncompleteTypeEditForm';
import { deleteIncompleteTypeByRange, fetchIncompleteTypesByQuery, toggleIncompleteTypeSidebar } from '../store/actions';
import { incompleteTypeTableColumn } from './incompleteTypeTableColumn';

const IncompleteTypeList = () => {
  const dispatch = useDispatch();
  const { items, loading, isOpenSidebar, total, selectedItem } = useSelector( ( { incompleteTypeReducer } ) => incompleteTypeReducer );

  //#region States
  const [rowsPerPage, setRowsPerPage] = useState( 5 );
  const [currentPage, setCurrentPage] = useState( 1 );
  const [selectedRowId, setSelectedRowId] = useState( [] );
  const [clearSelectedRow, setClearSelectedRow] = useState( false );
  const [searchTerm, setSearchTerm] = useState( '' );
  const [currentStatus, setCurrentStatus] = useState( statusOptions[0] );

  //#endregion

  //Global Function to toggle Sidebar
  const toggleSidebar = () => store.dispatch( toggleIncompleteTypeSidebar( !isOpenSidebar ) );

  //#region Effects
  useEffect( () => {
    dispatch(
      fetchIncompleteTypesByQuery( {
        page: currentPage,
        perPage: rowsPerPage,
        ...( searchTerm && { searchKey: searchTerm } ),
        ...( currentStatus && { status: currentStatus.value } )
      } )
    );
  }, [dispatch, rowsPerPage, currentPage, searchTerm, currentStatus] );
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
  const handleFilter = e => {
    const { value } = e.target;
    setSearchTerm( value );
  };
  const debouncedChangeHandler = useCallback( debounce( handleFilter, 1000 ), [] );

  const handleSort = () => { };

  // **Clear Delete Ids
  const handleClearSelected = () => {
    setClearSelectedRow( true );
  };

  // ** Delete Rang
  const handleDeleteByRange = () => {
    dispatch( deleteIncompleteTypeByRange( selectedRowId ) );
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
                defaultValue={searchTerm}
                onChange={debouncedChangeHandler}
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
                onChange={data => setCurrentStatus( data )}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle tag="h2">Incomplete Type</CardTitle>
        </CardHeader>
        <TableCustomerHeader handlePerPage={handlePerPage} rowsPerPage={rowsPerPage} searchTerm={searchTerm}>
          <PlusIcon onClick={toggleSidebar} />
        </TableCustomerHeader>

        <CustomDataTable
          onSelectedRowsChange={handleRowSelected}
          onSort={handleSort}
          progressPending={loading}
          handleContextAction={handleDeleteByRange}
          clearSelectedRows={clearSelectedRow}
          columns={incompleteTypeTableColumn}
          sortIcon={<ChevronDown />}
          selectedRowId={selectedRowId}
          data={items}
        />

        <CustomPagination count={Number( Math.ceil( total / rowsPerPage ) )} currentPage={currentPage} onPageChange={handlePageChange} />
      </Card>

      {selectedItem !== null && isOpenSidebar ? (
        <IncompleteTypeEditForm data={selectedItem} open={isOpenSidebar} lastPageInfo={{ page: currentPage, perPage: rowsPerPage, total }} />
      ) : isOpenSidebar ? (
        <IncompleteTypeAddForm open={isOpenSidebar} lastPageInfo={{ page: currentPage, perPage: rowsPerPage, total }} />
      ) : null}
    </div>
  );
};

export default IncompleteTypeList;

/** Change Log
 * 11-Jan-2022 (Iqbal): Create List Page With Mock
 */
