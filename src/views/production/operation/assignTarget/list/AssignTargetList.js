/**
 * Title: Assign Target List
 * Description: Assign Target List
 * Author: Iqbal Hossain
 * Date: 27-January-2022
 * Modified: 27-January-2022
 */
import '@custom-styles/merchandising/others/custom-table.scss';
import ActionMenu from 'layouts/components/menu/action-menu';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { ChevronDown, Filter, RefreshCw, Settings } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledButtonDropdown } from 'reactstrap';
import AdvancedSearchBox from 'utility/custom/AdvancedSearchBox';
import FormLayout from 'utility/custom/FormLayout';
import IconButton from 'utility/custom/IconButton';
import TableCustomerHeader from 'utility/custom/TableCustomerHeader';
import { notify } from 'utility/custom/notifications';
import CustomDataTable from 'utility/custom/production/CustomDataTable';
import CustomPagination from 'utility/custom/production/CustomPagination';
import AssignTargetActionPage from '../details/AssignTargetActionPage';
import AssingTargetDetails from '../details/AssignTargetDetails';
import { fetchPreviousAssignTarget, fetchTodaysAssignTarget } from '../store/actions';
import { previousAssignTargetTableColumn } from './PreviousAssignTargetTableColumn';
import { todaysAssignTargetTableColumn } from './TodaysAssignTargetTableColumn';
const AssingTargetListPage = () => {
  //#region Hook
  const history = useHistory();
  const dispatch = useDispatch();
  const { loading, todaysTarget, previousTarget, total } = useSelector( ( { assignTargetReducer } ) => assignTargetReducer );
  //#endregion

  //#region State
  const [hasAssignTargetAction, setHasAssignTargetAction] = useState( false );
  const [hasAssignTargetDetails, setHasAssignTargetDetails] = useState( false );
  const [rowsPerPage, setRowsPerPage] = useState( 10 );
  const [currentPage, setCurrentPage] = useState( 1 );
  const [searchTerm, setSearchTerm] = useState( '' );
  const [selectedRowIds] = useState( [] );
  // const [clearSelectedRow, setClearSelectedRow] = useState(false);
  const [active, setActive] = useState( '1' );
  // for open and off filter or Search Section
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
  //#endregion
  //#region UDFs
  /**
   * Get All Assign Target
   */
  const getAllAssignTarget = async () => {
    try {
      if ( active === '1' ) {
        dispatch(
          fetchTodaysAssignTarget( {
            page: currentPage,
            perPage: rowsPerPage,
            ...( searchTerm && { searchKey: searchTerm } )
          } )
        );
      } else if ( active === '2' ) {
        dispatch(
          fetchPreviousAssignTarget( {
            page: currentPage,
            perPage: rowsPerPage,
            ...( searchTerm && { searchKey: searchTerm } )
          } )
        );
      }
    } catch ( error ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
  //#endregion

  //#region Effects
  useEffect( () => {

    getAllAssignTarget();
  }, [dispatch, active, currentPage, rowsPerPage, searchTerm] );
  //#endregion

  //#region Events

  // Function in get data on rows per page
  const handlePerPage = e => {
    const value = parseInt( e.currentTarget.value );
    setRowsPerPage( value );
    setCurrentPage( 1 );
  };

  //For Per page Change
  const handlePageChange = ( { selected } ) => {
    setCurrentPage( selected + 1 );
  };

  //For Filter
  const handleFilter = e => {
    const { value } = e.target;
    setSearchTerm( value );
  };

  //For Search
  const debouncedChangeHandler = useCallback( debounce( handleFilter, 1000 ), [] );

  // For toggle tab
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
      id: 'assign-target',
      name: 'Assign Target',
      link: "/assign-target",
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
        title='Assign Target'
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
            className="float-right"
            onClick={() => history.push( {
              pathname: `assign-target-new`
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
        >

          <IconButton
            id="freshBtnId"
            color='primary'
            classNames="ml-1"
            onClick={() => getAllAssignTarget()}
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
                  Todays
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
              <CustomDataTable
                progressPending={loading}
                subHeader={false}
                selectableRows={false}
                noHeader={true}
                // onSelectedRowsChange={handleRowSelected}
                // expandableRowsComponent={<ExpandableUnCheckTable data={[]} />}
                columns={todaysAssignTargetTableColumn}
                sortIcon={<ChevronDown />}
                // selectedRowId={selectedRowId}
                data={todaysTarget}
                striped
                highlightOnHover
                pointerOnHover
              // expandableRows
              />
            </TabPane>
            <TabPane tabId="2">
              <CustomDataTable
                progressPending={loading}
                subHeader={false}
                selectableRows={false}
                noHeader={true}
                // onSelectedRowsChange={handleRowSelected}
                // expandableRowsComponent={<ExpandableUnCheckTable data={[]} />}
                columns={previousAssignTargetTableColumn}
                sortIcon={<ChevronDown />}
                // selectedRowId={selectedRowId}
                data={previousTarget}
                striped
                highlightOnHover
                pointerOnHover
              // expandableRows
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
        {hasAssignTargetAction && (
          <AssignTargetActionPage openModal={hasAssignTargetAction} setOpenModal={setHasAssignTargetAction} selectedRowIds={selectedRowIds} />
        )}
        {hasAssignTargetDetails && <AssingTargetDetails openModal={hasAssignTargetDetails} setOpenModal={setHasAssignTargetDetails} data={[]} />}
      </FormLayout>
    </>
  );
};

export default AssingTargetListPage;

/** Change Log
 * 27-Jan-2022 (Iqbal): Assign Target List Page and Tab With data render from mock
 */
