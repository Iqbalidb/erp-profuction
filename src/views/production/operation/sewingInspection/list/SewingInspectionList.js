/**
 * Title: Sewing Inspection List
 * Description: Sewing Inspection List
 * Author: Iqbal Hossain
 * Date: 27-January-2022
 * Modified: 27-January-2022
 */

import '@custom-styles/merchandising/others/custom-table.scss';
import ActionMenu from 'layouts/components/menu/action-menu';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, RefreshCw, Settings } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledButtonDropdown } from 'reactstrap';
import AdvancedSearchBox from 'utility/custom/AdvancedSearchBox';
import CustomPreLoader from 'utility/custom/CustomPreLoader';
import FormLayout from 'utility/custom/FormLayout';
import IconButton from 'utility/custom/IconButton';
import TableCustomerHeader from 'utility/custom/TableCustomerHeader';
import CustomPagination from 'utility/custom/production/CustomPagination';
import { fetchPreviousSewingInspection, fetchSewingInspectionsByQuery, fetchTodaysSewingInspection } from '../store/actions';
import { sewingInspectionTableColumn } from './SewingInspectionTableColumn';
const SewingInspectionListPage = () => {
  //#region Hook
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    sewingInspectionReducer: { total, todaysSewingInspection, loading, previousSewingInspection }
  } = useSelector( state => state );
  //#endregion

  //#region State
  const [active, setActive] = useState( '1' );
  const [rowsPerPage, setRowsPerPage] = useState( 10 );
  const [currentPage, setCurrentPage] = useState( 1 );
  const [searchTerm, setSearchTerm] = useState( '' );
  // for open and off filter or Search Section
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
  //#endregion

  //#region UDFs
  /**
   * Get All Sewing Items
   */
  const getAllSewingItems = () => {
    if ( active === '1' ) {
      dispatch(
        fetchTodaysSewingInspection( {
          page: currentPage,
          perPage: rowsPerPage,
          ...( searchTerm && { searchKey: searchTerm } )
        } )
      );
    } else if ( active === '2' ) {
      dispatch(
        fetchPreviousSewingInspection( {
          page: currentPage,
          perPage: rowsPerPage,
          ...( searchTerm && { searchKey: searchTerm } )
        } )
      );
    }
  };
  useEffect( () => {
    getAllSewingItems();
  }, [active, currentPage, dispatch, rowsPerPage, searchTerm] );
  //#endregion

  //#region Events

  // Function in get data on rows per page
  const handlePerPage = e => {
    const value = parseInt( e.currentTarget.value );
    setRowsPerPage( value );
    setCurrentPage( 1 );
  };

  //per page change
  const handlePageChange = ( { selected } ) => {
    setCurrentPage( selected + 1 );
  };
  // ** Function in get data on search query change
  const handleFilter = e => {
    const { value } = e.target;
    setSearchTerm( value );
  };
  //For Search
  const debouncedChangeHandler = useCallback( debounce( handleFilter, 1000 ), [] );

  //For Sorting
  const handleSort = ( column, direction ) => {
    const { selector } = column;
    dispatch( fetchSewingInspectionsByQuery( { sortedBy: direction, sortedColumn: selector } ) );
  };
  /**
   * Tab Change
   */
  const toggle = tab => {
    if ( active !== tab ) {
      setActive( tab );
      setCurrentPage( 1 );
    }
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
      id: 'sewing-inspection',
      name: 'Sewing Inspection ',
      link: "/sewing-inspection",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion
  return (
    <>
      <ActionMenu
        breadcrumb={breadcrumb}
        title='Sewing Inspection '
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
              pathname: `sewing-inspection-new`
            } )
            }

          >
            Add New
          </NavLink>
        </NavItem>
      </ActionMenu>
      <FormLayout isNeedTopMargin={true}>

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
            onClick={() => fetchSewingInspectionsByQuery()}
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
        <div>
          <div >
            <Nav tabs>
              <NavItem>
                <NavLink
                  active={active === '1'}
                  onClick={() => {
                    toggle( '1' );
                  }}
                >
                  <span>Todays</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={active === '2'}
                  onClick={() => {
                    toggle( '2' );
                  }}
                >
                  Previous
                </NavLink>
              </NavItem>
            </Nav>
          </div>
          <TabContent activeTab={active}>
            <TabPane tabId="1">
              <DataTable
                onSort={handleSort}
                noHeader={true}
                progressPending={loading}
                progressComponent={<CustomPreLoader />}
                dense
                subHeader={false}
                highlightOnHover
                responsive
                paginationServer
                expandOnRowClicked
                persistTableHead
                columns={sewingInspectionTableColumn}
                sortIcon={<ChevronDown />}
                className="react-dataTable"
                data={todaysSewingInspection}
              />
            </TabPane>
            <TabPane tabId="2">
              <DataTable
                onSort={handleSort}
                noHeader={true}
                progressPending={loading}
                progressComponent={<CustomPreLoader />}
                dense
                subHeader={false}
                highlightOnHover
                responsive
                paginationServer
                expandOnRowClicked
                persistTableHead
                columns={sewingInspectionTableColumn}
                sortIcon={<ChevronDown />}
                className="react-dataTable"
                data={previousSewingInspection}
              />
            </TabPane>
          </TabContent>
        </div>
        <div>
          <CustomPagination
            count={Number( Math.ceil( total / rowsPerPage ) )}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </FormLayout>

    </>
  );
};

export default SewingInspectionListPage;

/** Change Log
 * 29-Jan-2022 (Iqbal): Sewing Inspection List Page and Tab With data render from mock
 */
