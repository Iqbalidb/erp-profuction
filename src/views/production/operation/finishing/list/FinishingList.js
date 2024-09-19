/**
 * Title: Finishing Edit Form
 * Description: Finishing Edit Form
 * Author: Iqbal Hossain
 * Date: 05-January-2022
 * Modified: 05-January-2022
 */
import ActionMenu from 'layouts/components/menu/action-menu';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { ChevronDown, Filter, Menu, RefreshCw, Settings } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Button, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledButtonDropdown } from 'reactstrap';
import { getCookie, selectThemeColors, setCookie } from 'utility/Utils';
import AdvancedSearchBox from 'utility/custom/AdvancedSearchBox';
import FormLayout from 'utility/custom/FormLayout';
import IconButton from 'utility/custom/IconButton';
import TableCustomerHeader from 'utility/custom/TableCustomerHeader';
import { notify } from 'utility/custom/notifications';
import CustomDataTable from 'utility/custom/production/CustomDataTable';
import CustomPagination from 'utility/custom/production/CustomPagination';
import FinishingPassedModal from '../form/FinishingPassedModal';
import {
  fetchFinishingByProductionSubProcessId,
  fetchFinishingPassedByProductionSubProcessId,
  fetchProductionSubProcessByParentProcessIdAndStatus
} from '../store/actions';
import { finishingPreviousTableColumn } from './finishingPassedTableColumn';
import { finishingTodaysTableColumn } from './finishingTodaysTableColumn';
const FinishingListPage = () => {
  //#region Hooks
  const dispatch = useDispatch();
  const history = useHistory();
  const { productionSubProcessDdl, finishingItems, finishingPassedItems, total, loading } = useSelector( ( { finishingReducer } ) => finishingReducer );
  //#endregion

  //#region State
  const parentProcessId = 'da39dad9-488f-446f-16d7-08da81002fc6';
  const [searchTerm, setSearchTerm] = useState( '' );
  const [active, setActive] = useState( '1' );
  const [rowsPerPage, setRowsPerPage] = useState( 10 );
  const [currentPage, setCurrentPage] = useState( 1 );

  const [styleId, setStyleId] = useState( '' );
  const [selectedRowId, setSelectedRowId] = useState( [] );
  const [clearSelectedRows, setClearSelectedRows] = useState( false );
  const [selectedProductionSubProcess, setSelectedProductionSubProcess] = useState( null );
  const [finishingPassedModalOpen, setFinishingPassedModalOpen] = useState( false );
  // for open and off filter or Search Section
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
  //#endregion

  //#region
  /**
   * UDFs
   */
  const getAllFinishingItems = () => {
    if ( selectedProductionSubProcess !== null ) {
      if ( active === '1' ) {
        dispatch(
          fetchFinishingByProductionSubProcessId( {
            productionProcessId: selectedProductionSubProcess?.id,
            status: true,
            page: currentPage,
            perPage: rowsPerPage,
            ...( searchTerm && { searchKey: searchTerm } )
          } )
        );
      } else if ( active === '2' ) {
        dispatch(
          fetchFinishingPassedByProductionSubProcessId( {
            productionProcessId: selectedProductionSubProcess?.id,
            status: false,
            page: currentPage,
            perPage: rowsPerPage,
            ...( searchTerm && { searchKey: searchTerm } )
          } )
        );
      }
    }
  };
  //#endregion

  //#region Effects
  useEffect( () => {
    dispatch( fetchProductionSubProcessByParentProcessIdAndStatus( parentProcessId, true ) );
  }, [dispatch] );

  useEffect( () => {
    getAllFinishingItems();
  }, [active, currentPage, dispatch, rowsPerPage, searchTerm, selectedProductionSubProcess] );

  useEffect( () => {
    const finishingCookie = getCookie( 'finishingCookie' );
    if ( finishingCookie ) {
      const prevSelectedProcess = productionSubProcessDdl.find( f => f.name === finishingCookie );
      setSelectedProductionSubProcess( prevSelectedProcess );
    }
  }, [productionSubProcessDdl] );
  //#endregion

  //#region Events
  const handleFilter = e => {
    const { value } = e.target;
    setSearchTerm( value );
  };

  //For Production Process Change
  const handleChangeProductionSubProcess = item => {
    if ( item ) {
      setCookie( 'finishingCookie', item.name );
      setSelectedProductionSubProcess( item );
    } else {
      setSelectedProductionSubProcess( null );
    }
  };
  //For Search
  const debouncedChangeHandler = useCallback( debounce( handleFilter, 1000 ), [] );
  /**
   * Per Page Change
   */
  const handlePerPage = e => {
    const value = parseInt( e.currentTarget.value );
    setRowsPerPage( value );
    setCurrentPage( 1 );
  };

  // For toggle tab panel
  const toggle = tab => {
    if ( active !== tab ) {
      setActive( tab );
      setCurrentPage( 1 );
    }
  };

  //per page change
  const handlePageChange = ( { selected } ) => {
    setCurrentPage( selected + 1 );
  };

  //For Selected Row Change
  const handleChangeSelectedRow = rows => {
    if ( rows ) {
      const rowsId = rows?.selectedRows?.map( item => item.id );
      const styleId = rows?.selectedRows?.map( item => item.styleId );
      setSelectedRowId( rowsId );
      setStyleId( styleId );
    }
  };

  const onBundleAssignToExternal = selectedRow => {
    if ( selectedRow.length > 0 ) {
      const isStyleUnique = [...new Set( styleId )];
      if ( isStyleUnique.length === 1 ) {
        setStyleId( isStyleUnique );
        setFinishingPassedModalOpen( !finishingPassedModalOpen );
      } else {
        setFinishingPassedModalOpen( finishingPassedModalOpen );
        notify( 'warning', "You can't select more than one Style" );
      }
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
      id: 'finishing',
      name: 'Finishing',
      link: "/finishing",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion
  return (
    <>
      <ActionMenu
        breadcrumb={breadcrumb}
        title='Finishing'
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
              pathname: `finishing-new`
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
            onClick={() => getAllFinishingItems()}
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
                bsSize="sm"
                isLoading={!selectedProductionSubProcess}
                theme={selectThemeColors}
                options={productionSubProcessDdl}
                className="erp-dropdown-select"
                classNamePrefix="dropdown"
                value={selectedProductionSubProcess}
                onChange={data => handleChangeProductionSubProcess( data )}
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
                  Processed
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={active === '2'}
                  onClick={() => {
                    toggle( '2' );
                  }}
                >
                  Passed
                </NavLink>
              </NavItem>
            </Nav>
          </div>
          <TabContent activeTab={active} >
            {/* Pending Section Start */}
            <TabPane tabId="1">
              <CustomDataTable
                progressPending={loading}
                // onRowExpandToggled={onRowExpandToggled}
                contextActionButton={<Menu size={24} />}
                contextActionButtonColor="flat-primary"
                onSelectedRowsChange={handleChangeSelectedRow}
                handleContextAction={() => onBundleAssignToExternal( selectedRowId )}
                expandableRowsComponent={[]}
                columns={finishingTodaysTableColumn}
                sortIcon={<ChevronDown />}
                selectedRowId={selectedRowId}
                data={finishingItems}
                striped
                highlightOnHover
                pointerOnHover
                expandableRows={false}
                selectableRows
                clearSelectedRows={clearSelectedRows}
              />
            </TabPane>
            {/* Pending Section End */}

            {/* Passed Section Start */}

            <TabPane tabId="2">
              <CustomDataTable
                progressPending={loading}
                noHeader={true}
                onSelectedRowsChange={handleChangeSelectedRow}
                expandableRowsComponent={[]}
                columns={finishingPreviousTableColumn}
                sortIcon={<ChevronDown />}
                selectedRowId={selectedRowId}
                data={finishingPassedItems}
                striped
                highlightOnHover
                pointerOnHover
                expandableRows={false}
                selectableRows={false}
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

      {finishingPassedModalOpen && (
        <FinishingPassedModal
          openModal={finishingPassedModalOpen}
          setOpenModal={setFinishingPassedModalOpen}
          data={selectedRowId}
          styleId={styleId}
          selectedProductionSubProcess={selectedProductionSubProcess}
          setSelectedProductionSubProcess={setSelectedProductionSubProcess}
          setSelectedRowId={setSelectedRowId}
          setClearSelectedRows={setClearSelectedRows}
          lastPageInfo={{ page: currentPage, perPage: rowsPerPage, status: true, productionProcessId: selectedProductionSubProcess?.id, }}
        />
      )}
    </>
  );
};

export default FinishingListPage;
