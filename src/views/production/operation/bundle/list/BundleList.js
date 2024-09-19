/*
   Title:  Bundle List
   Description:  Bundle List
   Author: Alamgir Kabir
   Date: 18-July-2022
   Modified: 18-July-2022
*/
import ActionMenu from 'layouts/components/menu/action-menu';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { ChevronDown, Filter, RefreshCw, Settings } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Col, DropdownItem, DropdownMenu, DropdownToggle, Input, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledButtonDropdown } from 'reactstrap';
import { getCookie, selectThemeColors, setCookie } from 'utility/Utils';
import AdvancedSearchBox from 'utility/custom/AdvancedSearchBox';
import FormLayout from 'utility/custom/FormLayout';
import IconButton from 'utility/custom/IconButton';
import TableCustomerHeader from 'utility/custom/TableCustomerHeader';
import CustomDataTable from 'utility/custom/production/CustomDataTable';
import CustomPagination from 'utility/custom/production/CustomPagination';
import { ASSIGN_TO_STYLE_INFO, ON_PRODUCTION_SUB_PROCESS_CHANGE } from '../store/actionType';
import { fetchPartialBundleForAssigned, fetchPartialBundleForPass, fetchProductionSubProcessByStatus } from '../store/actions';
import { ExpandableAssignBundleTable } from './ExpandableAssignBundleTable';
import { default as ExpandableBundleTable } from './ExpandableBundleTable';
import { bundleAssignTableColumn } from './bundleAssignTableColumn';
import { bundleTableColumn } from './bundleTableColumn';

const BundleList = () => {
  //#region Hooks
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    total,
    productionSubProcessDropdownItems,
    bundlePartialItemsForPass,
    selectedProductionProcess,
    bundlePartialItemsForAssigned,
    loading
  } = useSelector( ( { bundleReducer } ) => bundleReducer );
  //#endregion

  //#region States
  const [active, setActive] = useState( '1' );
  const [rowsPerPage, setRowsPerPage] = useState( 10 );
  const [currentPage, setCurrentPage] = useState( 1 );

  const [searchTerm, setSearchTerm] = useState( '' );
  const [clearSelectedRows, setClearSelectedRows] = useState( false );
  // for open and off filter or Search Section
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
  //#endregion

  //#region UDFs
  /**
   * Get All Bundle Items
   */
  const getAllBundle = () => {
    if ( selectedProductionProcess !== null ) {
      if ( active === '1' ) {
        dispatch(
          fetchPartialBundleForPass( selectedProductionProcess, {
            page: currentPage,
            perPage: rowsPerPage,
            ...( searchTerm && { searchKey: searchTerm } ),
            // ...{ currentProcessId: selectedProductionProcess?.id }
          } )
        );
      } else if ( active === '2' ) {
        dispatch(
          fetchPartialBundleForAssigned( selectedProductionProcess, {
            page: currentPage,
            perPage: rowsPerPage,
            ...( searchTerm && { searchKey: searchTerm } ),
            // ...{ currentProcessId: selectedProductionProcess?.id }
          } )
        );
      }
    }
  };
  //#region Effects
  /**
   * Get data with selected tab
   */
  useEffect( () => {
    getAllBundle();
  }, [active, currentPage, dispatch, rowsPerPage, searchTerm, selectedProductionProcess] );

  /**
   * Get Production Sub process ddl
   */
  useEffect( () => {
    dispatch( fetchProductionSubProcessByStatus( 'partial' ) );
  }, [dispatch] );

  useEffect( () => {
    const bundleCookie = getCookie( 'bundleCookie' );
    if ( bundleCookie ) {
      const productionSubProcess = productionSubProcessDropdownItems?.find( f => f.name === bundleCookie );
      dispatch( {
        type: ON_PRODUCTION_SUB_PROCESS_CHANGE,
        payload: { productionSubProcess }
      } );
    }
  }, [dispatch, productionSubProcessDropdownItems] );
  //#endregion

  //#region Events
  /**
   * For Production Sub Process Change
   */
  const onProductionSubProcessChange = productionSubProcess => {
    if ( productionSubProcess ) {
      setCookie( 'bundleCookie', productionSubProcess.name );
      dispatch( {
        type: ON_PRODUCTION_SUB_PROCESS_CHANGE,
        payload: { productionSubProcess }
      } );
    }
  };

  /**
   * Get data with row per page
   */
  const handlePerPage = e => {
    const value = parseInt( e.currentTarget.value );
    setRowsPerPage( value );
    setCurrentPage( 1 );
  };

  /**
   * @param {Page change } param0
   */
  const handlePageChange = ( { selected } ) => {
    setCurrentPage( selected + 1 );
  };

  /**
   * @param {Get Bundle Master Data with toggle} boll
   * @param {*} row
   */
  /**
   * Filter
   */
  const handleFilter = e => {
    const { value } = e.target;
    setSearchTerm( value );
  };
  //For Search
  const debouncedChangeHandler = useCallback( debounce( handleFilter, 1000 ), [] );
  /**
   * Toggle Expansion
   */
  const onRowExpandToggled = ( boll, row ) => {
    console.log( { boll, row } );
    dispatch( {
      type: ASSIGN_TO_STYLE_INFO,
      payload: { boll, row }
    } );
  };
  /**
   * @param {change} tab
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
      id: 'bundle',
      name: 'Bundle',
      link: "/bundle",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion
  return (
    <div>
      <ActionMenu
        breadcrumb={breadcrumb}
        title='Bundle List'
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
        {/* <NavItem
            className="mr-1"

          >
            <NavLink
              tag={Button}
              size="sm"
              color="success"
              className="float-right"
              onClick={() => history.push( {
                pathname: `bundle-new`
              } )
              }
            >
              Add New
            </NavLink>
          </NavItem> */}
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
            onClick={() => getAllBundle()}
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
              <Select
                id="cutPlan"
                theme={selectThemeColors}
                options={productionSubProcessDropdownItems}
                className="erp-dropdown-select"
                classNamePrefix="dropdown"
                value={selectedProductionProcess}
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
                  <span>Assign To</span>
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
                noHeader={true}
                onRowExpandToggled={onRowExpandToggled}
                expandableRowsComponent={<ExpandableBundleTable data={data => data} lastPageInfo={{ page: currentPage, perPage: rowsPerPage }} />}
                columns={bundleTableColumn}
                sortIcon={<ChevronDown />}
                data={bundlePartialItemsForPass}
                striped
                highlightOnHover
                pointerOnHover
                expandableRows
                selectableRows={false}
                clearSelectedRows={clearSelectedRows}
              />
            </TabPane>
            <TabPane tabId="2">
              <CustomDataTable
                progressPending={loading}
                noHeader={true}
                selectableRows={false}
                expandableRowsComponent={<ExpandableAssignBundleTable data={data => data} />}
                columns={bundleAssignTableColumn}
                sortIcon={<ChevronDown />}

                data={bundlePartialItemsForAssigned}
                striped
                highlightOnHover
                pointerOnHover
                expandableRows
                clearSelectedRows={clearSelectedRows}
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

    </div>
  );
};

export default BundleList;
