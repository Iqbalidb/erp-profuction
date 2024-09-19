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
import { notify } from 'utility/custom/notifications';
import Backdrop from 'utility/custom/production/Backdrop';
import CustomDataTable from 'utility/custom/production/CustomDataTable';
import CustomPagination from 'utility/custom/production/CustomPagination';
import { fetchChecked, fetchUnchecked } from '../store/actions';
import { checkedItemsTableColumn } from './CheckedItemsTableColumn';
import ExpandableCheckTable from './ExpandableCheckTable';
import ExpandableUnCheckTable from './ExpandableUnCheckTable';
import { UnCheckedItemsTableColumn } from './UnCheckedItemsTableColumn';
const PanelCheckModifiedList = () => {
  //#region Hooks
  const dispatch = useDispatch();
  const {
    uncheckedItems, checkedItems, showBackdrop, total } = useSelector( ( { panelCheckReducer } ) => panelCheckReducer );
  //#endregion

  //#region States
  const [searchTerm, setSearchTerm] = useState( '' );
  const [active, setActive] = useState( '1' );
  const [rowsPerPage, setRowsPerPage] = useState( 10 );
  const [selectedRowId, setSelectedRowId] = useState( [] );
  const [currentPage, setCurrentPage] = useState( 1 );
  // for open and off filter or Search Section
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );

  //#endregion

  //#region UDFs
  /**
   * Get Bundle by Status
   */
  const fetchBundleByStatus = async () => {
    try {
      if ( active === '1' ) {
        dispatch(
          fetchUnchecked( {
            page: currentPage,
            perPage: rowsPerPage,
            ...( searchTerm && { searchKey: searchTerm } )
          } )
        );
      } else if ( active === '2' ) {
        dispatch(
          fetchChecked( {
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
    fetchBundleByStatus();
  }, [active, currentPage, dispatch, rowsPerPage, searchTerm] );
  //#endregion

  //#region Events

  //For Checked Row
  const handleRowSelected = rows => {
    const rowsId = rows.selectedRows.map( item => item.id );
    setSelectedRowId( rowsId );
  };

  //For Filter
  const handleFilter = e => {
    const { value } = e.target;
    setSearchTerm( value );
  };
  //For Search
  const debouncedChangeHandler = useCallback( debounce( handleFilter, 1000 ), [] );

  //For Per Page Change
  const handlePerPage = e => {
    const value = parseInt( e.currentTarget.value );
    setRowsPerPage( value );
    setCurrentPage( 1 );
  };

  //For Page Change
  const handlePageChange = ( { selected } ) => {
    setCurrentPage( selected + 1 );
  };
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
      id: 'panel-check',
      name: 'Panel Check',
      link: "/panel-check",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion
  return (
    <div >
      <ActionMenu
        moreButton={false}
        breadcrumb={breadcrumb}
        title='Panel Check'
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
            onClick={() => fetchBundleByStatus()}
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
                  UnChecked
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={active === '2'}
                  onClick={() => {
                    toggle( '2' );
                  }}
                >
                  Checked
                </NavLink>
              </NavItem>
            </Nav>
          </div>
          <TabContent activeTab={active}>
            <TabPane tabId="1">
              <CustomDataTable
                subHeader={false}
                selectableRows={false}
                noHeader={true}
                onSelectedRowsChange={handleRowSelected}
                expandableRowsComponent={<ExpandableUnCheckTable data={data => data}
                  lastPageInfo={{ page: currentPage, perPage: rowsPerPage }} />}
                columns={UnCheckedItemsTableColumn}
                sortIcon={<ChevronDown />}
                selectedRowId={selectedRowId}
                data={uncheckedItems}
                striped
                highlightOnHover
                pointerOnHover
                expandableRows
              />
            </TabPane>
            <TabPane tabId="2">
              <CustomDataTable
                subHeader={false}
                noHeader={true}
                selectableRows={false}
                onSelectedRowsChange={handleRowSelected}
                expandableRowsComponent={<ExpandableCheckTable data={data => data} />}
                columns={checkedItemsTableColumn}
                sortIcon={<ChevronDown />}
                selectedRowId={selectedRowId}
                data={checkedItems}
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
        <Backdrop show={showBackdrop} />
      </FormLayout>
    </div>
  );
};

export default PanelCheckModifiedList;
