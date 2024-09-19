/*
   Title: Process List
   Description: List Page for Processes
   Author: Iqbal Hossain
   Date: 21-November-2021
   Modified: 07-February-2022
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
import { store } from 'redux/storeConfig/store';
import { selectThemeColors } from 'utility/Utils';
import AdvancedSearchBox from 'utility/custom/AdvancedSearchBox';
import FormLayout from 'utility/custom/FormLayout';
import IconButton from 'utility/custom/IconButton';
import TableCustomerHeader from 'utility/custom/TableCustomerHeader';
import CustomDataTable from 'utility/custom/production/CustomDataTable';
import CustomPagination from 'utility/custom/production/CustomPagination';
import { statusOptions } from 'utility/enums';
import ProductionProcessAddForm from '../form/ProductionProcessAddForm';
import ProductionProcessEditForm from '../form/ProductionProcessEditForm';
import { fetchProductionProcessesByQuery, toggleProductionProcessSidebar } from '../store/actions';
import { ProductionPorcessTableColumn } from './productionProcessTableColumn';

const ProductionProcessList = () => {
  //#region Hooks
  const dispatch = useDispatch();
  const { items, isOpenSidebar, total, loading, selectedItem } = useSelector( ( { productionProcessReducer } ) => productionProcessReducer );
  const { isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
  //#endregion

  //#region States
  const [rowsPerPage, setRowsPerPage] = useState( 10 );
  const [currentPage, setCurrentPage] = useState( 1 );
  const [selectedRowId, setSelectedRowId] = useState( [] );
  const [searchTerm, setSearchTerm] = useState( '' );
  const [currentStatus, setCurrentStatus] = useState( statusOptions[0] );
  // for open and off filter or Search Section
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
  //#endregion
  //#region UDFs
  //Global Function to toggle Sidebar
  const toggleSidebar = () => store.dispatch( toggleProductionProcessSidebar( !isOpenSidebar ) );
  /**
   * Get All Production Process
   */
  const getAllProductionProcess = () => {
    dispatch(
      fetchProductionProcessesByQuery( {
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
    getAllProductionProcess();
  }, [dispatch, rowsPerPage, currentPage, searchTerm, currentStatus] );
  //#endregion

  //#region Events
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
      id: 'style-wise-production-process-group',
      name: 'Style Wise Production Process Group',
      link: "/style-wise-production-process-group",
      isActive: false,
      hidden: false
    },
    {
      id: 'productionProcessGroup',
      name: 'Production Process Group',
      link: "/production-process-group",
      isActive: false,
      hidden: false
    },
    {
      id: 'productionSubProcess',
      name: 'Production Sub Process',
      link: "/production-sub-process",
      isActive: false,
      hidden: false
    },
    {
      id: 'production-main-process',
      name: 'Production Process',
      link: "/production-main-process",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion
  return (
    <div>

      <ActionMenu
        breadcrumb={breadcrumb}
        title='Production Processes'
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
            onClick={toggleSidebar}
          >
            Add New
          </NavLink>
        </NavItem>
      </ActionMenu>
      <UILoader
        blocking={isDataProgressCM}
        loader={<ComponentSpinner />}>
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
                onClick={() => getAllProductionProcess()}
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
              columns={ProductionPorcessTableColumn}
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
      {selectedItem !== null && isOpenSidebar ? (
        <ProductionProcessEditForm data={selectedItem} open={isOpenSidebar} lastPageInfo={{ page: currentPage, perPage: rowsPerPage, status: currentStatus?.value }} />
      ) : isOpenSidebar ? (
        <ProductionProcessAddForm open={isOpenSidebar} lastPageInfo={{ page: currentPage, perPage: rowsPerPage, status: currentStatus?.value }} />
      ) : null}
    </div>
  );
};

export default ProductionProcessList;

/** Change Log
 * 09-Jan-2022 (Iqbal): Create List Page With Mock
 * 07-Feb-2022 (nasir) : fetch data from api
 */
