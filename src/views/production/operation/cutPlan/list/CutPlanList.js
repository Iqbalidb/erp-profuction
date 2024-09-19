/* eslint-disable no-unused-vars */
/**
 * Title: Line List
 * Description: List page for Lines
 * Author: Nasir Ahmed
 * Date: 18-November-2021
 * Modified: 20-November-2021
 */

import ActionMenu from 'layouts/components/menu/action-menu';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { ChevronDown, Filter, RefreshCw, Settings } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
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
import { deleteCutPlanByRange, fetchCutPlansByQuery } from '../store/actions';
import CutPlanExpandTable from './CutPlanExpandTable';
import { cutPlanTableColumn } from './cutPlanTableColumn';

const CutPlanList = () => {
  //#region Hooks
  const history = useHistory();
  const dispatch = useDispatch();
  const { items, total, loading } = useSelector( ( { cutPlanReducer } ) => cutPlanReducer );
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
   * Get All Cut Plan
   */
  const getAllCutPlan = () => {
    dispatch(
      fetchCutPlansByQuery( {
        page: currentPage,
        perPage: rowsPerPage,
        ...( searchTerm && { searchKey: searchTerm } ),
        ...( currentStatus && { status: JSON.parse( currentStatus.value ) } )
      } )
    );
  };
  //#endregion

  //#region Effects
  useEffect( () => {
    getAllCutPlan();
  }, [dispatch, rowsPerPage, currentPage, searchTerm, currentStatus] );
  //#endregion

  //#region Events
  /**
   * Get data with row per page
   */
  const handlePerPage = e => {
    const value = parseInt( e.currentTarget.value );
    setRowsPerPage( value );
    setCurrentPage( 1 );
  };

  /**
   * Select multiple rows
   */
  const handleRowSelected = rows => {
    const rowsId = rows?.selectedRows?.map( item => item.id );
    setSelectedRowId( rowsId );
    setClearSelectedRow( false );
  };

  const handlePageChange = ( { selected } ) => {
    setCurrentPage( selected + 1 );
  };

  /**
   * Filter
   */
  const handleFilter = e => {
    const { value } = e.target;
    setSearchTerm( value );
  };
  const debouncedChangeHandler = useCallback( debounce( handleFilter, 1000 ), [] );

  const handleSort = ( column, direction ) => {
    const { selector } = column;
    dispatch( fetchCutPlansByQuery( { sortedBy: direction, sortedColumn: selector } ) );
  };

  /**
   * Clear Delete Ids
   */
  const handleClearSelected = () => {
    setClearSelectedRow( true );
  };

  /**
   * Delete by range
   */
  const handleDeleteByRange = () => {
    dispatch( deleteCutPlanByRange( selectedRowId ) );
    setSelectedRowId( [] );
    handleClearSelected();
  };
  //#endregion
  //#region Breadcrumb
  const breadcrumb = [
    {
      id: 'home',
      name: 'Home',
      link: "/home",
      isActive: false,
      hidden: false
    },

    {
      id: 'cut-plan',
      name: 'Cut Plan',
      link: "/cut-plan",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion
  return (
    <div>
      <ActionMenu
        breadcrumb={breadcrumb}
        title='Cut Plan'
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
            onClick={() => history.push( {
              pathname: `cut-plan-new`
            } )
            }
          >
            Add New
          </NavLink>
        </NavItem>
      </ActionMenu>
      <FormLayout isNeedTopMargin={true}>
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
              onClick={() => getAllCutPlan()}
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
                  onChange={data => setCurrentStatus( data )}
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
            expandableRowsComponent={<CutPlanExpandTable data={data => data} />}
            columns={cutPlanTableColumn}
            data={items}
            selectableRows={false}
            expandableRows
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

    </div>
  );
};

export default CutPlanList;

/** Change Log
 * 06-Jan-2022 (Iqbal): Create List Page With Mock
 */
