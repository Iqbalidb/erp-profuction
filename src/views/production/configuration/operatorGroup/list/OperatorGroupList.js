/*
     Title: Operator Group List Page
     Description: Operator Group List Page
     Author: Alamgir Kabir
     Date: 15-December-2022
     Modified: 15-December-2022
*/
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import ActionMenu from 'layouts/components/menu/action-menu';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { CheckSquare, ChevronDown, Filter, RefreshCw, Settings, Trash2 } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Badge, Button, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledButtonDropdown, UncontrolledDropdown } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { OPERATOR_GROUP_API } from 'services/api-end-points/production/v1/operatorGroup';
import { errorResponse } from 'utility/Utils';
import AdvancedSearchBox from 'utility/custom/AdvancedSearchBox';
import { confirmDialog } from 'utility/custom/ConfirmDialog';
import FormLayout from 'utility/custom/FormLayout';
import IconButton from 'utility/custom/IconButton';
import TableCustomerHeader from 'utility/custom/TableCustomerHeader';
import { notify } from 'utility/custom/notifications';
import CustomDataTable from 'utility/custom/production/CustomDataTable';
import CustomPagination from 'utility/custom/production/CustomPagination';
import { formattedDate } from 'utility/dateHelpers';
import { confirmObj } from 'utility/enums';
import OperatorGroupAddFormModified from '../form/OperatorGroupAddForm';
import { editActiveOperatorGroup, fetchActiveOperatorGroup, toggleOperatorGroupSidebar } from '../store/actions';
const OperatorGroupList = () => {
  //#region Hooks
  const dispatch = useDispatch();
  const { total, isOpenSidebar, loading, items } = useSelector(
    ( { OperatorGroupReducer } ) => OperatorGroupReducer
  );
  const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
  //#endregion

  //#region State
  const [searchTerm, setSearchTerm] = useState( '' );
  const [currentPage, setCurrentPage] = useState( 1 );
  const [rowsPerPage, setRowsPerPage] = useState( 10 );
  const [active, setActive] = useState( '1' );
  // for open and off filter or Search Section
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
  //#endregion

  //#region UDFs
  /**
   * Get All Operator Group
   */
  const getAllOperatorGroup = () => {
    if ( active === "1" ) {
      dispatch(
        fetchActiveOperatorGroup( {
          page: currentPage,
          perPage: rowsPerPage,
          ...( searchTerm && { searchKey: searchTerm } ),
          status: true
        } )
      );
    } else if ( active === '2' ) {
      dispatch(
        fetchActiveOperatorGroup( {
          page: currentPage,
          perPage: rowsPerPage,
          ...( searchTerm && { searchKey: searchTerm } ),
          status: false
        } )
      );
    }
  };
  /**
   * For Edit Operator
   */
  const handleEdit = async ( row ) => {
    dispatch( editActiveOperatorGroup( row ) );
    if ( row !== null ) {
      const rowId = row?.id;
      const updatedStatus = !row?.status;
      const confirmStatus = await confirmDialog( confirmObj );
      if ( confirmStatus.isConfirmed ) {
        dispatch( dataSubmitProgressCM( true ) );
        try {
          const res = await baseAxios.put( OPERATOR_GROUP_API.update, null, { params: { id: rowId, status: updatedStatus } } );
          if ( res.status === 200 ) {
            notify( 'success', "Operator group has been updated successfully!!!" );
            dispatch( dataSubmitProgressCM( false ) );
            getAllOperatorGroup();
          }
        } catch ( error ) {
          errorResponse( error );
          dispatch( dataSubmitProgressCM( false ) );
        }
      }
    }

  };
  //#endregion

  //#region Effect
  useEffect( () => {
    getAllOperatorGroup();
  }, [dispatch, active, currentPage, rowsPerPage, searchTerm] );
  //#endregion

  //#region Event
  /**
   * For Per Page Change
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
 * For Search
 */
  const debouncedChangeHandler = useCallback( debounce( handleFilter, 1000 ), [] );
  /**
 * For Page Change
 */
  const handlePageChange = ( { selected } ) => {
    setCurrentPage( selected + 1 );
  };

  // For toggle tab panel
  const toggle = tab => {
    if ( active !== tab ) {
      setActive( tab );
      setCurrentPage( 1 );
    }
  };
  /**
   * For Sidebar
   */
  const handleOpenSidebar = () => {
    dispatch( toggleOperatorGroupSidebar() );
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
      id: 'operator',
      name: 'Operator',
      link: "/operator",
      isActive: false,
      hidden: false
    },
    {
      id: 'operatorGroup',
      name: 'Operator Group',
      link: "/operator-group",
      isActive: true,
      hidden: false
    },
  ];
  //#endregion
  const operatorGroupTableColumn = [
    {
      name: 'Action',
      width: '5%',
      center: true,
      cell: row => (
        <UncontrolledDropdown>
          <DropdownToggle tag="div" className="btn btn-sm" id="btnDisable" onClick={() => handleEdit( row )}>
            {row?.status ? (
              <Trash2 className="text-danger cursor-pointer" size={20} color="red" id="btnDisable" />
            ) : (
              <CheckSquare className="text-danger cursor-pointer" size={20} color="green" id="btnDisable" />
            )}
          </DropdownToggle>
        </UncontrolledDropdown>
      )
    },
    {
      name: 'Name',
      minWidth: '25%',
      selector: 'operatorName',
      sortable: true,
      cell: row => row.operatorName
    },
    {
      name: 'Process',
      minWidth: '25%',
      selector: 'productionProcessName',
      sortable: true,
      cell: row => row.productionProcessName
    },
    {
      name: 'Active Date',
      minWidth: '20%',
      selector: 'activatedAt',
      sortable: true,
      cell: row => formattedDate( row.activatedAt )
    },

    {
      name: 'Status',
      selector: 'status',
      // sortable: true,
      cell: row => (
        <Badge pill className="text-capitalize" color={`${row.status ? 'light-success' : 'light-secondary'}`}>
          {row.status ? 'active' : 'inactive'}
        </Badge>
      ),
      width: '100px',
      center: true
    }
  ];
  return (
    <div>

      <ActionMenu
        breadcrumb={breadcrumb}
        title='Operator Group'
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
            onClick={() => { handleOpenSidebar(); }}
          >
            Add New
          </NavLink>
        </NavItem>
      </ActionMenu>
      <UILoader
        blocking={iSubmitProgressCM}
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
                onClick={() => getAllOperatorGroup()}
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

          </div>
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
                    Active
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    active={active === '2'}
                    onClick={() => {
                      toggle( '2' );
                    }}
                  >
                    InActive
                  </NavLink>
                </NavItem>
              </Nav>
            </div>
            <TabContent activeTab={active}>
              <TabPane tabId="1">
                {/* Data Table Section */}
                <CustomDataTable
                  noHeader={true}
                  progressPending={loading}
                  columns={operatorGroupTableColumn}
                  data={items}
                  selectableRows={false}
                  className="react-custom-dataTable"
                  sortIcon={<ChevronDown />
                  } />
              </TabPane>
              <TabPane tabId="2">
                {/* Data Table Section */}
                <CustomDataTable
                  noHeader={true}
                  progressPending={loading}
                  columns={operatorGroupTableColumn}
                  data={items}
                  selectableRows={false}
                  className="react-custom-dataTable"
                  sortIcon={<ChevronDown />
                  } />
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
      </UILoader>
      {isOpenSidebar && <OperatorGroupAddFormModified />}
    </div>
  );
};

export default OperatorGroupList;
