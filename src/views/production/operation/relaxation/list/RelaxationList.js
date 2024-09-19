/*
     Title: Relaxation List
     Description: Relaxation List
     Author: Alamgir Kabir
     Date: 10-May-2023
     Modified: 10-May-2023
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
import { statusOptions } from 'utility/enums';
import { fetch_relaxation_by_query } from '../store/actions';
import { relaxationCompleteTableColumn } from './relaxationCompleteTableColumn';
import { relaxationTableColumn } from './relaxationTableColumn';

const RelaxationList = () => {
  //#region Hooks
  const history = useHistory();
  const dispatch = useDispatch();
  const { items, total, loading } = useSelector( ( { relaxationReducer } ) => relaxationReducer );
  //#endregion

  //#region State
  const [active, setActive] = useState( '1' );
  const [searchTerm, setSearchTerm] = useState( '' );
  const [currentStatus, setCurrentStatus] = useState( statusOptions[0] );
  const [rowsPerPage, setRowsPerPage] = useState( 10 );
  const [currentPage, setCurrentPage] = useState( 1 );
  const [selectedRowId, setSelectedRowId] = useState( [] );
  // for open and off filter or Search Section
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
  //#endregion

  //#region UDFs
  /**
   * Get All Relaxation Items
   */
  const getAllRelaxation = () => {
    if ( active === '1' ) {
      dispatch(
        fetch_relaxation_by_query( {
          page: currentPage,
          perPage: rowsPerPage,
          ...( searchTerm && { searchKey: searchTerm } ),
          status: false
        } )
      );
    } else if ( active === '2' ) {
      dispatch(
        fetch_relaxation_by_query( {
          page: currentPage,
          perPage: rowsPerPage,
          ...( searchTerm && { searchKey: searchTerm } ),
          status: true
        } )
      );
    }
  };
  //#region Effects
  useEffect( () => {
    getAllRelaxation();
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
   * For Filteration
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
      id: 'relaxation-list',
      name: 'Relaxation ',
      link: "/relaxation-list",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion
  return (
    <>
      <ActionMenu
        breadcrumb={breadcrumb}
        title='Relaxation '
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
              pathname: `relaxation-new`
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
            onClick={() => getAllRelaxation()}
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
                  Running
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={active === '2'}
                  onClick={() => {
                    toggle( '2' );
                  }}
                >
                  Complete
                </NavLink>
              </NavItem>
            </Nav>
          </div>
          <TabContent activeTab={active}>
            <TabPane tabId="1">
              <CustomDataTable
                noHeader={true}
                progressPending={loading}
                // onRowExpandToggled={onRowExpandToggled}
                contextActionButton={<Menu size={24} />}
                contextActionButtonColor="flat-primary"
                onSelectedRowsChange={handleChangeSelectedRow}
                // handleContextAction={handleOpenRequisitionConfirmModal}
                expandableRowsComponent={[]}
                columns={relaxationTableColumn}
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
                columns={relaxationCompleteTableColumn}
                sortIcon={<ChevronDown />}
                data={items}
                striped
                highlightOnHover
                pointerOnHover
                // expandableRows={false}
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
    </>
  );
};

export default RelaxationList;
