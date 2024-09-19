/*
     Title: Relaxation List Form
     Description: Relaxation List Form
     Author: Alamgir Kabir
     Date: 27-March-2023
     Modified: 27-March-2023
*/
import ActionMenu from 'layouts/components/menu/action-menu';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { ChevronDown, Filter, Menu, RefreshCw, Settings } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledButtonDropdown } from 'reactstrap';
import AdvancedSearchBox from 'utility/custom/AdvancedSearchBox';
import FormLayout from 'utility/custom/FormLayout';
import IconButton from 'utility/custom/IconButton';
import TableCustomerHeader from 'utility/custom/TableCustomerHeader';
import CustomDataTable from 'utility/custom/production/CustomDataTable';
import CustomPagination from 'utility/custom/production/CustomPagination';
import { fetch_requisition_by_query } from '../store/actions';
import { requisitionreceiveTableColumn } from './requisitionReceiveTableColumn';
import { requisitionTableColumn } from './requisitionTableColumn';

const RequisitionList = () => {
  //#region Hooks
  const history = useHistory();
  const dispatch = useDispatch();
  const { items, total, loading } = useSelector( ( { requisitionReducer } ) => requisitionReducer );
  //#endregion

  //#region State
  const [active, setActive] = useState( '1' );
  const [searchTerm, setSearchTerm] = useState( '' );
  const [rowsPerPage, setRowsPerPage] = useState( 10 );
  const [currentPage, setCurrentPage] = useState( 1 );
  const [selectedRowId, setSelectedRowId] = useState( [] );
  // for open and off filter or Search Section
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
  //#endregion

  //#region UDFs
  /**
   * Get All Requisition Items
   */
  const getAllRequisitionByStatus = () => {
    if ( active === '1' ) {
      dispatch(
        fetch_requisition_by_query( {
          page: currentPage,
          perPage: rowsPerPage,
          ...( searchTerm && { searchKey: searchTerm } ),
          status: false
        } )
      );
    } else if ( active === '2' ) {
      dispatch(
        fetch_requisition_by_query( {
          page: currentPage,
          perPage: rowsPerPage,
          ...( searchTerm && { searchKey: searchTerm } ),
          status: true
        } )
      );
    }
  };
  //#endregion

  //#region Effects
  useEffect( () => {
    getAllRequisitionByStatus();
  }, [active, currentPage, dispatch, rowsPerPage, searchTerm] );

  //#endregion

  //#region Events
  // Function in get data on rows per page
  const handlePerPage = e => {
    const value = parseInt( e.currentTarget.value );
    setRowsPerPage( value );
    setCurrentPage( 1 );
  };
  /**
   * For Filtering
   */
  const handleFilter = e => {
    const { value } = e.target;
    setSearchTerm( value );
  };
  /**
 * For Search
 */
  const debouncedChangeHandler = useCallback( debounce( handleFilter, 1000 ), [] );
  const handlePageChange = ( { selected } ) => {
    setCurrentPage( selected + 1 );
  };
  /**
   * For Row Selection
   */
  const handleChangeSelectedRow = rows => {
    const row = rows.selectedRows.map( item => item );
    setSelectedRowId( row );
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
      id: 'requisition-list',
      name: 'Requisition',
      link: "/requisition-list",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion
  return (
    <>
      <ActionMenu
        breadcrumb={breadcrumb}
        title='Requisition'
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
              pathname: `requisition-new`
            } )
            }
          >
            Add New
          </NavLink>
        </NavItem>
      </ActionMenu>
      <FormLayout isNeedTopMargin={true}>
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
            onClick={() => getAllRequisitionByStatus()}
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
            <Nav tabs >
              <NavItem>
                <NavLink
                  active={active === '1'}
                  onClick={() => {
                    toggle( '1' );
                  }}
                >
                  Requisition
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={active === '2'}
                  onClick={() => {
                    toggle( '2' );
                  }}
                >
                  Receive
                </NavLink>
              </NavItem>
            </Nav>
          </div>
          <TabContent activeTab={active}>
            <TabPane tabId="1">
              <CustomDataTable
                progressPending={loading}
                noHeader={true}
                // onRowExpandToggled={onRowExpandToggled}
                contextActionButton={<Menu size={24} />}
                contextActionButtonColor="flat-primary"
                onSelectedRowsChange={handleChangeSelectedRow}
                // handleContextAction={handleOpenRequisitionConfirmModal}
                expandableRowsComponent={[]}
                columns={requisitionTableColumn}
                sortIcon={<ChevronDown />}
                selectedRowId={selectedRowId}
                data={items}
                striped
                highlightOnHover
                pointerOnHover
                // expandableRows
                selectableRows={false}
              // clearSelectedRows={clearSelectedRows}
              />
            </TabPane>
            <TabPane tabId="2">
              <CustomDataTable
                noHeader={true}
                progressPending={loading}
                // onRowExpandToggled={onRowExpandToggled}
                contextActionButton={<Menu size={24} />}
                contextActionButtonColor="flat-primary"
                expandableRowsComponent={[]}
                columns={requisitionreceiveTableColumn}
                sortIcon={<ChevronDown />}
                data={items}
                striped
                highlightOnHover
                pointerOnHover
                expandableRows={false}
                selectableRows={false}
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
      {/* Table To Header Ex: Row Per Page and Filter and Refresh Button */}

    </>
  );
};

export default RequisitionList;
