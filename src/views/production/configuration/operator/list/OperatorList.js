/*
   Title: Operator List
   Description: Operator List
   Author: Alamgir Kabir
   Date: 12-December-2022
   Modified: 12-December-2022
*/
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import ActionMenu from 'layouts/components/menu/action-menu';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { ChevronDown, Filter, RefreshCw, Settings } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import {
  Button,
  Col, DropdownItem,
  DropdownMenu,
  DropdownToggle, Input, NavItem, NavLink, Row, UncontrolledButtonDropdown
} from 'reactstrap';
import { selectThemeColors } from 'utility/Utils';
import AdvancedSearchBox from 'utility/custom/AdvancedSearchBox';
import FormLayout from 'utility/custom/FormLayout';
import IconButton from 'utility/custom/IconButton';
import TableCustomerHeader from 'utility/custom/TableCustomerHeader';
import CustomDataTable from 'utility/custom/production/CustomDataTable';
import CustomPagination from 'utility/custom/production/CustomPagination';
import { statusOptions } from 'utility/enums';
import OperatorAddForm from '../form/OperatorAddForm';
import { fetchAllOperator, toggleOperatorSidebar } from '../store/actions';
import { operatorTableColumn } from './operatorTableColumn';
const OperatorList = () => {
  //#region Hooks
  const dispatch = useDispatch();
  const { isOpenSidebar, items, total, loading } = useSelector( ( { OperatorReducer } ) => OperatorReducer );
  const { isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
  //#endregion

  //#region State
  const [searchTerm, setSearchTerm] = useState( '' );
  const [currentPage, setCurrentPage] = useState( 1 );
  const [rowsPerPage, setRowsPerPage] = useState( 10 );
  const [currentStatus, setCurrentStatus] = useState( statusOptions[0] );
  // for open and off filter or Search Section
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );

  //#endregion

  //#region UDFS
  /**
   * For Get All Operator
   */
  const getAllOperator = () => {
    dispatch(
      fetchAllOperator( {
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
    getAllOperator();
  }, [dispatch, currentPage, currentStatus, rowsPerPage, searchTerm] );
  //#endregion

  //#region Events
  /**
   * For Page Change
   */
  const handlePerPage = e => {
    const value = parseInt( e.currentTarget.value );
    setRowsPerPage( value );
    setCurrentPage( 1 );
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
  * For Searching
  */
  const debouncedChangeHandler = useCallback( debounce( handleFilter, 1000 ), [] );

  /**
  * For Per Page Change
  */
  const handleRefresh = () => {
    getAllOperator();

  };
  const handlePageChange = ( { selected } ) => {
    setCurrentPage( selected + 1 );
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
      id: 'operatorGroup',
      name: 'Operator Group',
      link: "/operator-group",
      isActive: false,
      hidden: false
    },
    {
      id: 'operator',
      name: 'Operator',
      link: "/operator",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion
  return (
    <>


      <ActionMenu
        breadcrumb={breadcrumb}
        title='Operators'
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
            onClick={() => { dispatch( toggleOperatorSidebar() ); }}
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
                onClick={() => handleRefresh()}
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
              columns={operatorTableColumn}
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

      </UILoader >
      {isOpenSidebar && <OperatorAddForm lastPageInfo={{ page: currentPage, perPage: rowsPerPage, status: currentStatus?.value }} />
      }
    </>
  );
};

export default OperatorList;

/** Change Log
 * 07 June 2023(Alamgir): Fixed Filtering Issue(Active,In-active edit page change)
 */
