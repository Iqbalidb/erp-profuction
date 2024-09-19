/**
 * Title: External List Form
 * Description: External List Form
 * Author: Iqbal Hossain
 * Date: 24-January-2022
 * Modified: 24-January-2022
 */

import ActionMenu from 'layouts/components/menu/action-menu';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { ChevronDown, Filter, RefreshCw, Settings } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Col, DropdownItem, DropdownMenu, DropdownToggle, Input, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledButtonDropdown } from 'reactstrap';
import { getCookie, selectThemeColors, setCookie } from 'utility/Utils';
import AdvancedSearchBox from 'utility/custom/AdvancedSearchBox';
import FormLayout from 'utility/custom/FormLayout';
import IconButton from 'utility/custom/IconButton';
import TableCustomerHeader from 'utility/custom/TableCustomerHeader';
import CustomDataTable from 'utility/custom/production/CustomDataTable';
import CustomPagination from 'utility/custom/production/CustomPagination';
import { ASSIGN_TO_STYLE_INFO } from '../../bundle/store/actionType';
import {
  ON_PRODUCTION_PROCESS_CHANGE
} from '../store/actionType';
import {
  fetchPartialBundleInfoForPending,
  fetchPartialBundleInfoForReceived,
  fetchPartialBundleInfoForSend,
  fetchPartialBundleInfoPassed,
  fetchProductionSubProcessDdlByStatus
} from '../store/actions';
import ExpandableExpPassedTable from './ExpandableExpPassedTable';
import ExpandableExpPendingTable from './ExpandableExpPendingTable';
import ExpandableExpReceivedTable from './ExpandableExpReceivedTable';
import ExpandableExpSendTable from './ExpandableExpSendTable';
import { externalProcessPassedTableColumn } from './ExternalProcessPassedTableColumn';
import { externalProcessPendingTableColumn } from './ExternalProcessPendingTableColumn';
import { externalProcessReceivedTableColumn } from './ExternalProcessReceivedTableColumn';
import { externalProcessSendTableColumn } from './ExternalProcessSendTableColumn';

const ExternalProcessList = () => {
  //#region Hooks
  const dispatch = useDispatch();
  const {
    productionSubProcessDropdownItems,
    selectedProductionSubProcess,
    partialBundleInfoForPending,
    partialBundleInfoForSend,
    partialBundleInfoForReceived,
    partialBundleInfoPassed,
    total,
    loading
  } = useSelector( ( { externalProcessReducer } ) => externalProcessReducer );
  //#endregion

  //#region State
  const [active, setActive] = useState( '1' );
  const [rowsPerPage, setRowsPerPage] = useState( 10 );
  const [currentPage, setCurrentPage] = useState( 1 );
  const [searchTerm, setSearchTerm] = useState( '' );
  // for open and off filter or Search Section
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
  //#endregion

  //#region UDFS
  /**
   * Get All External Process Items
   */
  const getAllExternalProcess = () => {
    if ( selectedProductionSubProcess !== null ) {
      if ( active === '1' ) {
        dispatch(
          fetchPartialBundleInfoForPending( selectedProductionSubProcess, {
            page: currentPage,
            perPage: rowsPerPage,
            ...( searchTerm && { searchKey: searchTerm } )
            // ...{ currentProcessId: selectedProductionSubProcess?.id }
          } )
        );
      } else if ( active === '2' ) {
        dispatch(
          fetchPartialBundleInfoForSend( selectedProductionSubProcess, {
            page: currentPage,
            perPage: rowsPerPage,
            ...( searchTerm && { searchKey: searchTerm } )
            // ...{ currentProcessId: selectedProductionSubProcess?.id }
          } )
        );
      } else if ( active === '3' ) {
        dispatch(
          fetchPartialBundleInfoForReceived( selectedProductionSubProcess, {
            page: currentPage,
            perPage: rowsPerPage,
            ...( searchTerm && { searchKey: searchTerm } )
            // ...{ currentProcessId: selectedProductionSubProcess?.id }
          } )
        );
      } else if ( active === '4' ) {
        dispatch(
          fetchPartialBundleInfoPassed( selectedProductionSubProcess, {
            page: currentPage,
            perPage: rowsPerPage,
            ...( searchTerm && { searchKey: searchTerm } )
            // ...{ currentProcessId: selectedProductionSubProcess?.id }
          } )
        );
      }
    }
  };
  //#endregion

  //#region Effect
  useEffect( () => {
    dispatch( fetchProductionSubProcessDdlByStatus() );
  }, [dispatch] );

  useEffect( () => {
    getAllExternalProcess();
  }, [dispatch, currentPage, searchTerm, selectedProductionSubProcess, rowsPerPage, active] );

  useEffect( () => {
    const externalProcessCookie = getCookie( 'externalProcessCookie' );
    if ( externalProcessCookie ) {
      const productionSubProcess = productionSubProcessDropdownItems?.find( f => f.name === externalProcessCookie );

      dispatch( {
        type: ON_PRODUCTION_PROCESS_CHANGE,
        payload: { productionSubProcess }
      } );
    }
  }, [dispatch, productionSubProcessDropdownItems] );
  //#endregion

  //#region Events

  // Function in get data on rows per page
  const handlePerPage = e => {

    const value = parseInt( e.currentTarget.value );
    setRowsPerPage( value );
    setCurrentPage( 1 );
  };

  //For Per Page Change
  const handlePageChange = ( { selected } ) => {
    setCurrentPage( selected + 1 );
  };

  // ** Function in get data on search query change
  const handleFilter = e => {
    const { value } = e.target;
    setSearchTerm( value );
  };
  /**
   * For Search
   */
  const debouncedChangeHandler = useCallback( debounce( handleFilter, 1000 ), [] );

  const handleSort = () => { };

  //On Production Sub Process Change
  const onProductionSubProcessChange = productionSubProcess => {
    if ( productionSubProcess ) {
      setCookie( 'externalProcessCookie', productionSubProcess.name );
      dispatch( {
        type: ON_PRODUCTION_PROCESS_CHANGE,
        payload: { productionSubProcess }
      } );
    }
  };

  /**
   * For Toggle Expandable Row
   */
  const onRowExpandToggled = ( boll, row ) => {
    dispatch( {
      type: ASSIGN_TO_STYLE_INFO,
      payload: { boll, row }
    } );
  };
  //For Tab Change
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
      id: 'external-process',
      name: 'External Process ',
      link: "/external-process",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion
  return (
    <>
      <ActionMenu
        breadcrumb={breadcrumb}
        title='External Process '
        moreButton={false}
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
            onClick={() => getAllExternalProcess()}
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
                id="cutPlan"
                theme={selectThemeColors}
                options={productionSubProcessDropdownItems}
                className="erp-dropdown-select"
                classNamePrefix="dropdown"
                value={selectedProductionSubProcess}
                onChange={onProductionSubProcessChange}
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
                  Send
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={active === '3'}
                  onClick={() => {
                    toggle( '3' );
                  }}
                >
                  Received
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={active === '4'}
                  onClick={() => {
                    toggle( '4' );
                  }}
                >
                  Passed
                </NavLink>
              </NavItem>
            </Nav>
          </div>
          <TabContent activeTab={active}>
            <TabPane tabId="1">
              <CustomDataTable
                progressPending={loading}
                noHeader={true}
                selectableRows={false}
                // onRowExpandToggled={onRowExpandToggled}
                // onSelectedRowsChange={handleRowSelected}
                expandableRowsComponent={<ExpandableExpPendingTable data={data => data} lastPageInfo={{ page: currentPage, perPage: rowsPerPage }} />}
                columns={externalProcessPendingTableColumn}
                sortIcon={<ChevronDown />}
                // selectedRowId={selectedRowId}
                data={partialBundleInfoForPending}
                striped
                highlightOnHover
                pointerOnHover
                expandableRows
              // clearSelectedRows={clearSelectedRows}
              />
            </TabPane>
            <TabPane tabId="2">
              <CustomDataTable
                progressPending={loading}
                noHeader={true}
                selectableRows={false}
                // onRowExpandToggled={onRowExpandToggled}
                // onSelectedRowsChange={handleRowSelected}
                expandableRowsComponent={<ExpandableExpSendTable data={data => data} lastPageInfo={{ page: currentPage, perPage: rowsPerPage }} />}
                columns={externalProcessSendTableColumn}
                sortIcon={<ChevronDown />}
                // selectedRowId={selectedRowId}
                data={partialBundleInfoForSend}
                striped
                highlightOnHover
                pointerOnHover
                expandableRows
              // clearSelectedRows={clearSelectedRows}
              />
            </TabPane>
            <TabPane tabId="3">
              <CustomDataTable
                progressPending={loading}
                noHeader={true}
                selectableRows={false}
                onRowExpandToggled={onRowExpandToggled}
                // onSelectedRowsChange={handleRowSelected}
                expandableRowsComponent={<ExpandableExpReceivedTable data={data => data} lastPageInfo={{ page: currentPage, perPage: rowsPerPage }} />}
                columns={externalProcessReceivedTableColumn}
                sortIcon={<ChevronDown />}
                // selectedRowId={selectedRowId}
                data={partialBundleInfoForReceived}
                striped
                highlightOnHover
                pointerOnHover
                expandableRows
              // clearSelectedRows={clearSelectedRows}
              />
            </TabPane>
            <TabPane tabId="4">
              <CustomDataTable
                progressPending={loading}
                noHeader={true}
                selectableRows={false}
                onSort={handleSort}
                onRowExpandToggled={onRowExpandToggled}
                // onSelectedRowsChange={handleRowSelected}
                expandableRowsComponent={<ExpandableExpPassedTable data={data => data} />}
                columns={externalProcessPassedTableColumn}
                sortIcon={<ChevronDown />}
                // selectedRowId={selectedRowId}
                data={partialBundleInfoPassed}
                striped
                highlightOnHover
                pointerOnHover
                expandableRows
              // clearSelectedRows={clearSelectedRows}
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

export default ExternalProcessList;

/** Change Log
 * 24-Jan-2022 (Iqbal): External Process List Page and Tab With data render from mock and Onchange events
 */
