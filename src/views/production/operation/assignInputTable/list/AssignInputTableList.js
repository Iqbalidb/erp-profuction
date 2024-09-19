/**
 * Title: Assing Input Table Edit Form
 * Description: Assing Input Table Edit Form
 * Author: Iqbal Hossain
 * Date: 05-January-2022
 * Modified: 05-January-2022
 */

import '@custom-styles/merchandising/others/custom-table.scss';
import ActionMenu from 'layouts/components/menu/action-menu';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { ChevronDown, Filter, RefreshCw, Settings } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Col, DropdownItem, DropdownMenu, DropdownToggle, Input, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledButtonDropdown } from 'reactstrap';
import AdvancedSearchBox from 'utility/custom/AdvancedSearchBox';
import FormLayout from 'utility/custom/FormLayout';
import IconButton from 'utility/custom/IconButton';
import TableCustomerHeader from 'utility/custom/TableCustomerHeader';
import CustomDataTable from 'utility/custom/production/CustomDataTable';
import CustomPagination from 'utility/custom/production/CustomPagination';
import { fetchAssignInputForAssigned, fetchAssignInputForPending } from '../store/actions';
import ExpandableAssignedTable from './ExpandableAssignedTable';
import ExpandablePendingAssignInputTable from './ExpandablePendingAssignInputTable';
import { assignInputTableColumn } from './assignInputTableColumn';
import { signedTableColumn } from './signedAssignedInputTableColumn';

const AssingInputTableListPage = () => {
  //#region Hooks
  const dispatch = useDispatch();
  const { total, loading, assignInputTablePendingItems, assignInputTableAssignedItems } = useSelector(
    ( { assignInputTableReducer } ) => assignInputTableReducer
  );
  //#endregion

  //#region State
  const [active, setActive] = useState( '1' );
  const [rowsPerPage, setRowsPerPage] = useState( 10 );
  const [currentPage, setCurrentPage] = useState( 1 );
  const [searchTerm, setSearchTerm] = useState( '' );
  const [hasAssignInputTable, setHasAssignInputTable] = useState( false );
  const [hasAssignInputTableRejectInfo, setHasAssignInputTableRejectInfo] = useState( false );
  const [selectedRowId, setSelectedRowId] = useState( [] );
  // for open and off filter or Search Section
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );

  //#endregion
  const selectedProductionProcess = '059eb699-2bf4-47b5-73e6-08da8100e2ef';
  //#region UDFs
  /**
   * For Get Assign input Table Items
   */
  const getAllAssignInputTableItem = () => {
    if ( selectedProductionProcess !== null ) {
      if ( active === '1' ) {
        dispatch(
          fetchAssignInputForPending( selectedProductionProcess, {
            page: currentPage,
            perPage: rowsPerPage,
            ...( searchTerm && { searchKey: searchTerm } ),
            //...{ currentProcessId: selectedProductionProcess }
          } )
        );
      } else if ( active === '2' ) {
        dispatch(
          fetchAssignInputForAssigned( {
            page: currentPage,
            perPage: rowsPerPage,
            ...( searchTerm && { searchKey: searchTerm } ),
            ...{ currentProcessId: selectedProductionProcess }
          } )
        );
      }
    }
  };
  //#endregion

  //#region Effect
  useEffect( () => {
    getAllAssignInputTableItem();
  }, [active, currentPage, dispatch, rowsPerPage, searchTerm] );
  //#endregion

  //#region Events

  // Function for modal open (Bundle Assigned Sewing)
  const handleOpenModalBundleAssigned = () => {
    setHasAssignInputTable( !hasAssignInputTable );
  };

  // Function for modal open (Bundle Assigned Sewing)
  const handleOpenModalAssignInputRejectInfo = () => {
    setHasAssignInputTableRejectInfo( !hasAssignInputTableRejectInfo );
  };

  // Function in get data on rows per page
  const handlePerPage = e => {
    const value = parseInt( e.currentTarget.value );
    setRowsPerPage( value );
    setCurrentPage( 1 );
  };
  /**
   * For Page Change
   */
  const handlePageChange = ( { selected } ) => {
    setCurrentPage( selected + 1 );
  };

  // ** Function in get data on search query change
  //For Filter
  const handleFilter = e => {
    const { value } = e.target;
    setSearchTerm( value );
  };
  //For Search
  const debouncedChangeHandler = useCallback( debounce( handleFilter, 1000 ), [] );
  // ** Start For Multiple Rows for Get IDs

  const handleRowSelected = rows => {
    const rowsId = rows.selectedRows.map( item => item.id );
    setSelectedRowId( rowsId );
  };

  /**
   * For Tab Change
   */
  const toggle = tab => {
    if ( active !== tab ) {
      setActive( tab );
      setCurrentPage( 1 );
    }
  };
  //#endregion

  //#region Breadcrum
  const breadcrumb = [
    {
      id: 'home',
      name: 'Home',
      link: "/home",
      isActive: false,
      hidden: false
    },

    {
      id: 'assign-input-table',
      name: 'Assign Input Table',
      link: "/assign-input-table",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion
  return (
    <>
      <ActionMenu
        moreButton={false}
        breadcrumb={breadcrumb}
        title='Assign Input Table'
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
            onClick={() => getAllAssignInputTableItem()}
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
                  Pending
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={active === '2'}
                  onClick={() => {
                    toggle( '2' );
                  }}
                >
                  Assigned
                </NavLink>
              </NavItem>
            </Nav>
          </div>
          <TabContent activeTab={active}>
            <TabPane tabId="1">
              <CustomDataTable
                progressPending={loading}
                subHeader={false}
                selectableRows={false}
                noHeader={true}
                expandableRowsComponent={<ExpandablePendingAssignInputTable data={data => data} lastPageInfo={{ page: currentPage, perPage: rowsPerPage }} />}
                columns={assignInputTableColumn}
                sortIcon={<ChevronDown />}
                selectedRowId={selectedRowId}
                data={assignInputTablePendingItems}
                striped
                highlightOnHover
                pointerOnHover
                expandableRows
              />
            </TabPane>
            <TabPane tabId="2">
              <CustomDataTable
                progressPending={loading}
                subHeader={false}
                selectableRows={false}
                noHeader={true}
                expandableRowsComponent={<ExpandableAssignedTable data={data => data} />}
                columns={signedTableColumn}
                sortIcon={<ChevronDown />}
                selectedRowId={selectedRowId}
                data={assignInputTableAssignedItems}
                striped
                highlightOnHover
                pointerOnHover
                expandableRows
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

export default AssingInputTableListPage;

/** Change Log
 * 26-Jan-2022 (Iqbal): Assign Input Table List Page and Tab With data render from mock and Onchange events
 */
