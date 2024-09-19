/**
 * Title: SewingOut List Form
 * Description: SewingOut List Form
 * Author: Iqbal Hossain
 * Date: 05-January-2022
 * Modified: 26-March-2022
 */

import '@custom-styles/merchandising/others/custom-table.scss';
import ActionMenu from 'layouts/components/menu/action-menu';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { ChevronDown, Filter, Menu, RefreshCw, Settings } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledButtonDropdown } from 'reactstrap';
import AdvancedSearchBox from 'utility/custom/AdvancedSearchBox';
import CustomPreLoader from 'utility/custom/CustomPreLoader';
import FormLayout from 'utility/custom/FormLayout';
import IconButton from 'utility/custom/IconButton';
import TableCustomerHeader from 'utility/custom/TableCustomerHeader';
import { notify } from 'utility/custom/notifications';
import CustomDataTable from 'utility/custom/production/CustomDataTable';
import CustomPagination from 'utility/custom/production/CustomPagination';
import SewingOutModal from '../details/SewingOutModal';
import { fetchPreviousSewingOut, fetchTodaysSewingOut } from '../store/actions';
import { sewingOutPassedTableColumn } from './SewingOutPassedTableColumn';
import { sewingOutTableColumn } from './SewingOutTableColumn';
const SewingOutListPage = () => {
  //#region Hook
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    sewingOutReducer: { total, todaysSewingOut, loading, previousSewingOut }
  } = useSelector( state => state );
  //#endregion

  //#region State
  const [active, setActive] = useState( '1' );
  const [rowsPerPage, setRowsPerPage] = useState( 10 );
  const [currentPage, setCurrentPage] = useState( 1 );
  const [searchTerm, setSearchTerm] = useState( '' );
  const [selectedRowId, setSelectedRowId] = useState( [] );
  const [clearSelectedRows, setClearSelectedRows] = useState( false );
  const [openSewingOutModal, setOpenSewingOutModal] = useState( false );
  const [styleId, setStyleId] = useState( '' );
  // for open and off filter or Search Section
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
  //#endregion

  //#region UDFs
  /**
   * Get All Sewing Out Items
   */
  const getAllSewingOut = () => {
    if ( active === '1' ) {
      dispatch(
        fetchTodaysSewingOut( {
          page: currentPage,
          perPage: rowsPerPage,
          ...( searchTerm && { searchKey: searchTerm } )
        } )
      );
    } else if ( active === '2' ) {
      dispatch(
        fetchPreviousSewingOut( {
          page: currentPage,
          perPage: rowsPerPage,
          ...( searchTerm && { searchKey: searchTerm } )
        } )
      );
    }
  };
  //#endregion

  //#region Effects
  useEffect( () => {
    getAllSewingOut();
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
  const handleSort = () => { };

  const toggle = tab => {
    if ( active !== tab ) {
      setActive( tab );
      setCurrentPage( 1 );
    }
  };
  /**
   * @param {Get Production sub process ddl} selectedRow
   * Open Modal
   */
  const onBundleAssignToExternal = selectedRow => {
    if ( selectedRow.length > 0 ) {
      const isStyleUnique = [...new Set( styleId )];
      if ( isStyleUnique.length === 1 ) {
        setStyleId( isStyleUnique );
        setOpenSewingOutModal( !openSewingOutModal );
      } else {
        setOpenSewingOutModal( openSewingOutModal );
        notify( 'warning', "You can't select more than one Style" );
      }
    }
  };

  /**
   * @param {selected} rows
   */
  const handleRowSelected = rows => {
    if ( rows ) {
      const rowsId = rows?.selectedRows?.map( item => item.id );
      const styleId = rows?.selectedRows?.map( item => item.styleId );
      setSelectedRowId( rowsId );
      setStyleId( styleId );
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
      id: 'sewing-out',
      name: 'Sewing Out ',
      link: "/sewing-out",
      isActive: true,
      hidden: false
    },

  ];
  //#endregion
  return (
    <>
      <ActionMenu
        breadcrumb={breadcrumb}
        title='Sewing Out '
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
              pathname: `sewing-out-new`
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
            onClick={() => getAllSewingOut()}
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
                  <span>Sewing Out</span>
                  {/* <span>Todays</span> */}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={active === '2'}
                  onClick={() => {
                    toggle( '2' );
                  }}
                >
                  {/* <span>Previous</span> */}
                  <span>Passed</span>
                </NavLink>
              </NavItem>
            </Nav>
          </div>
          <TabContent activeTab={active}>
            <TabPane tabId="1">
              <CustomDataTable
                onSort={handleSort}
                progressPending={loading}
                progressComponent={<CustomPreLoader />}
                dense
                subHeader={false}
                // noHeader={true}
                highlightOnHover
                responsive
                paginationServer
                persistTableHead
                columns={sewingOutTableColumn}
                selectedRowId={selectedRowId}
                clearSelectedRows={clearSelectedRows}
                onSelectedRowsChange={handleRowSelected}
                contextActionButton={<Menu size={24} />}
                contextActionButtonColor="flat-primary"
                handleContextAction={() => onBundleAssignToExternal( selectedRowId )}
                sortIcon={<ChevronDown />}
                className="react-dataTable"
                data={todaysSewingOut}
                expandableRows={false}
              // selectableRows={false}
              />
            </TabPane>
            <TabPane tabId="2">
              <CustomDataTable
                onSort={handleSort}
                noHeader={true}
                progressPending={loading}
                progressComponent={<CustomPreLoader />}
                dense
                subHeader={false}
                highlightOnHover
                responsive
                paginationServer
                // expandOnRowClicked
                persistTableHead
                columns={sewingOutPassedTableColumn}
                sortIcon={<ChevronDown />}
                className="react-dataTable"
                data={previousSewingOut}
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

      {openSewingOutModal && (
        <SewingOutModal
          openModal={openSewingOutModal}
          setOpenModal={setOpenSewingOutModal}
          data={selectedRowId}
          styleId={styleId}
          setSelectedRowId={setSelectedRowId}
          setClearSelectedRows={setClearSelectedRows}
          lastPageInfo={{ page: currentPage, perPage: rowsPerPage }}
        />
      )}

    </>
  );
};

export default SewingOutListPage;
