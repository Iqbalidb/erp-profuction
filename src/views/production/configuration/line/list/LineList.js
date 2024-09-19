/**
 * Title: Line List
 * Description: List page for Lines
 * Author: Nasir Ahmed
 * Date: 18-November-2021
 * Modified: 20-November-2021
 */

import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import ActionMenu from 'layouts/components/menu/action-menu';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { ChevronDown, Filter, RefreshCw, Settings } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, NavItem, NavLink, Row, UncontrolledButtonDropdown } from 'reactstrap';
import { selectThemeColors } from 'utility/Utils';
import AdvancedSearchBox from 'utility/custom/AdvancedSearchBox';
import FormLayout from 'utility/custom/FormLayout';
import IconButton from 'utility/custom/IconButton';
import TableCustomerHeader from 'utility/custom/TableCustomerHeader';
import CustomDataTable from 'utility/custom/production/CustomDataTable';
import CustomPagination from 'utility/custom/production/CustomPagination';
import { statusOptions } from 'utility/enums';
import LineForm from '../form/LineForm';
import ManageCriticalProcess from '../form/ManageCriticalProcess';
import { deleteLineByRange, fetchLinesByQuery, openCriticalProcessManageModal, toggleLineSidebar } from '../store/actions';
import { LineTableColumn } from './lineTableColumn';

const LineList = () => {
  //#region Hooks
  const dispatch = useDispatch();
  const { items, isOpenSidebar, total, selectedItem, loading, isOpenManageCriticalProcessModal } = useSelector( ( { lineReducer } ) => lineReducer );
  const { isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
  //#endregion

  //#region States
  const [rowsPerPage, setRowsPerPage] = useState( 10 );
  const [currentPage, setCurrentPage] = useState( 1 );
  const [selectedRowId, setSelectedRowId] = useState( [] );
  const [clearSelectedRow, setClearSelectedRow] = useState( false );
  const [searchTerm, setSearchTerm] = useState( '' );
  const [currentStatus, setCurrentStatus] = useState( statusOptions[0] );
  // for open and off filter or Search Section
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
  //#endregion

  //#region UDFs
  /**
   * For Get All Line
   */
  const getAllLine = () => {
    dispatch(
      fetchLinesByQuery( {
        page: currentPage,
        perPage: rowsPerPage,
        ...( searchTerm && { searchKey: searchTerm } ),
        ...( currentStatus && { status: currentStatus.value } )
      } )
    );
  };
  //#endregion

  //#region Effects
  useEffect( () => {
    getAllLine();
  }, [dispatch, rowsPerPage, currentPage, searchTerm, currentStatus] );
  //#endregion

  //#region Events

  /**
   * For Per Page Change
   */
  const handlePerPage = e => {
    const value = parseInt( e.currentTarget.value );
    setRowsPerPage( value );
    setCurrentPage( 1 );
  };

  /**
   * For Row Selection and Get Id
   */
  const handleRowSelected = rows => {
    const rowIds = rows.selectedRows.map( item => item.id );
    setSelectedRowId( rowIds );
    setClearSelectedRow( false );
  };

  /**
   * For Page Change
   */
  const handlePageChange = ( { selected } ) => {
    setCurrentPage( selected + 1 );
  };

  /**
   * For Filter
   */
  const handleFilter = e => {
    const { value } = e.target;
    setSearchTerm( value );
  };
  /**
* For Change Current Status
*/
  const handleChangeCurrentStatus = data => {
    if ( data ) {
      const isChangeStatus = currentStatus.label !== data.label;
      if ( isChangeStatus ) {
        setCurrentPage( 1 );
      }
      setCurrentStatus( data );
    }
  };

  /**
   * For Search
   */
  const debouncedChangeHandler = useCallback( debounce( handleFilter, 1000 ), [] );

  // **Clear Delete Ids
  const handleClearSelected = () => {
    setClearSelectedRow( true );
  };

  // ** Delete Rang
  const handleDeleteByRange = () => {
    dispatch( deleteLineByRange( selectedRowId ) );
    setSelectedRowId( [] );
    handleClearSelected();
  };

  /**
   * For Open Manage Critical Modal Open
   */
  const handleManageCriticalModalOpen = () => {
    dispatch( openCriticalProcessManageModal() );
  };
  //#endregion

  /**
   * Breadcrumb
   */
  const breadcrumb = [
    {
      id: 'home',
      name: 'Home',
      link: "/home",
      isActive: false,
      hidden: false
    },
    {
      id: 'line',
      name: 'Lines ',
      link: "/line",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion


  return (
    <div>
      <UILoader
        blocking={isDataProgressCM}
        loader={<ComponentSpinner />}>
        <ActionMenu
          breadcrumb={breadcrumb}
          title='Lines'
          // moreButton={isPermit( userPermission?.ItemGroupCreate, authPermissions )}
          middleNavButton={
            <UncontrolledButtonDropdown>
              <DropdownToggle color='flat-primary' className="p-0" size="sm">
                <Settings size={20} />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => { console.log( 'hel' ); }}>
                  Print
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>
          }
        >
          <NavItem
            className="mr-1"
          // hidden={!isPermit( userPermission?.ItemGroupCreate, authPermissions )}
          >
            <NavLink
              tag={Button}
              size="sm"
              color="primary"
              onClick={() => { dispatch( toggleLineSidebar( !isOpenSidebar ) ); }}
            >
              Add New
            </NavLink>
          </NavItem>
        </ActionMenu>
        <FormLayout isNeedTopMargin={true} >
          <div>
            {/* Table To Header Ex: Row Per Page and Filter and Refresh Button */}
            <TableCustomerHeader
              handlePerPage={handlePerPage}
              rowsPerPage={rowsPerPage}
              searchTerm={searchTerm}
              totalRecords={total}
            >
              <IconButton
                id="freshBtnId"
                color='primary'
                classNames="ml-1"
                onClick={() => getAllLine()}
                icon={<RefreshCw size={18} />}
                label='Refresh'
                placement='bottom'
                isBlock={true}
              />
              <IconButton
                id="filterBtn"
                color='primary'
                classNames="ml-1"
                onClick={() => setIsFilterBoxOpen( !isFilterBoxOpen )}
                icon={<Filter size={18} />}
                label='Filter'
                placement='bottom'
                isBlock={true}
              />
            </TableCustomerHeader>
            {/* For Search Section */}
            <AdvancedSearchBox isOpen={isFilterBoxOpen}>
              <Row>

                <Col xs={12} sm={12} md={2} lg={2} className="mt-1 mt-sm-1  mt-md-0 mt-lg-0">
                  <Select
                    theme={selectThemeColors}
                    className="erp-dropdown-select"
                    classNamePrefix="dropdown"
                    isClearable={false}
                    options={statusOptions}
                    value={currentStatus}
                    onChange={handleChangeCurrentStatus}
                  />
                </Col>
                <Col xs={12} sm={12} md={4} lg={3} className="mt-0 mt-sm-0  mt-md-0 mt-lg-0">
                  <Input
                    id="search-item"
                    className="w-100"
                    placeholder="Search"
                    type="text"
                    bsSize="sm"
                    defaultValue={searchTerm}
                    onChange={debouncedChangeHandler}
                  />
                </Col>
              </Row>
            </AdvancedSearchBox>
            {/* Data Table Section */}
            <CustomDataTable
              noHeader={true}
              progressPending={loading}
              columns={LineTableColumn}
              data={items}
              selectableRows={false}
              className="react-custom-dataTable"
              sortIcon={<ChevronDown />
              } />
          </div>
          <div>
            <CustomPagination
              count={Number( Math.ceil( total / rowsPerPage ) )}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </FormLayout>
      </UILoader>
      {isOpenSidebar && <LineForm selectedItem={selectedItem} lastPageInfo={{ page: currentPage, perPage: rowsPerPage, status: currentStatus?.value }} />}
      {isOpenManageCriticalProcessModal && (
        <ManageCriticalProcess openModal={isOpenManageCriticalProcessModal} setOpenModal={handleManageCriticalModalOpen} />
      )}
    </div>
  );
};

export default LineList;

/** Change Log
 * 06-Jan-2022 (Iqbal): Create List Page With Mock
 * 16-Feb-2022 (Alamgir): Api Intregrate and modify Open Sidebar  Condition
 */
