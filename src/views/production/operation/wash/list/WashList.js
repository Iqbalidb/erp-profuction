/**
 * Title: Wash List Form
 * Description: Wash List Form
 * Author: Iqbal Hossain
 * Date: 12-February-2022
 * Modified: 12-February-2022
 */
import ActionMenu from 'layouts/components/menu/action-menu';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { ChevronDown, Filter, Menu, RefreshCw, Settings } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import {
  Button,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input, Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane, UncontrolledButtonDropdown
} from 'reactstrap';
import { getCookie, selectThemeColors, setCookie } from 'utility/Utils';
import AdvancedSearchBox from 'utility/custom/AdvancedSearchBox';
import FormLayout from 'utility/custom/FormLayout';
import IconButton from 'utility/custom/IconButton';
import TableCustomerHeader from 'utility/custom/TableCustomerHeader';
import { notify } from 'utility/custom/notifications';
import CustomDataTable from 'utility/custom/production/CustomDataTable';
import CustomPagination from 'utility/custom/production/CustomPagination';
import { fetchProductionSubProcessByParentProcessIdAndStatus } from '../../finishing/store/actions';
import WashReceiveModal from '../details/WashReceiveModal';
import { fetchWashPassedItemByProcessId, fetchWashReceiveItemByProcessId, fetchWashSendItemByProcessId } from '../store/actions';
import { washPassedTableColumn } from './washPassedTableColumn';
import { washReceivedTableColumn } from './washReceivedTableColumn';
import { washSendTableColumn } from './washSendTableColumn';

const WashList = () => {
  //#region Hooks
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    finishingReducer: { productionSubProcessDdl },
    washReducer: { total, washSendItems, loading, washReceiveItems, washPassedItems }
  } = useSelector( state => state );
  //#endregion

  //#region State
  const [active, setActive] = useState( '1' );
  const [rowsPerPage, setRowsPerPage] = useState( 10 );
  const [currentPage, setCurrentPage] = useState( 1 );
  const [searchTerm, setSearchTerm] = useState( '' );
  const [productionSubProcess, setProductionSubProcess] = useState( [] );
  const [selectedProductionSubProcess, setSelectedProductionSubProcess] = useState( null );
  const [clearSelectedRows, setClearSelectedRows] = useState( false );
  const [selectedRowInfo, setSelectedRowInfo] = useState( [] );
  const parentProcessId = '5d8944b9-1a66-4eae-16d6-08da81002fc6';
  const [isOpenWashPassedModal, setIsOpenWashPassedModal] = useState( false );
  // for open and off filter or Search Section
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
  //#endregion

  //#region UDFs
  /**
   * Get All Wash Items
   */
  const getAllWashItems = () => {
    if ( selectedProductionSubProcess !== null ) {
      if ( active === '1' ) {
        dispatch(
          fetchWashSendItemByProcessId( {
            processId: selectedProductionSubProcess?.id,
            status: true,
            page: currentPage,
            perPage: rowsPerPage,
            ...( searchTerm && { searchKey: searchTerm } )
          } )
        );
      } else if ( active === '2' ) {
        dispatch(
          fetchWashReceiveItemByProcessId( {
            processId: selectedProductionSubProcess?.id,
            status: true,
            page: currentPage,
            perPage: rowsPerPage,
            ...( searchTerm && { searchKey: searchTerm } )
          } )
        );
      } else if ( active === '3' ) {
        dispatch(
          fetchWashPassedItemByProcessId( {
            processId: selectedProductionSubProcess?.id,
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

  //#region Effect
  useEffect( () => {
    dispatch( fetchProductionSubProcessByParentProcessIdAndStatus( parentProcessId, true ) );
  }, [dispatch] );

  useEffect( () => {
    if ( productionSubProcessDdl?.length > 0 ) {
      setProductionSubProcess( productionSubProcessDdl );
    }
  }, [dispatch, productionSubProcessDdl] );

  useEffect( () => {
    getAllWashItems();
  }, [active, currentPage, dispatch, rowsPerPage, searchTerm, selectedProductionSubProcess] );

  useEffect( () => {
    const washCookie = getCookie( 'washCookie' );
    if ( washCookie ) {
      const prevSelectedProcess = productionSubProcess.find( f => f.name === washCookie );
      setSelectedProductionSubProcess( prevSelectedProcess );
    }
  }, [productionSubProcess] );
  //#endregion

  //#region Events
  /**
   * For Production Sub Process Change
   */
  const handleChangeProductionSubProcess = item => {
    if ( item ) {
      setCookie( 'washCookie', item.name );
      setSelectedProductionSubProcess( item );
    } else {
      setSelectedProductionSubProcess( null );
    }
  };
  /**
   * For Row Selection to Nex Process
   */
  const handleChangeSelectedRow = rows => {
    const uniqueProcess = Array.from( new Map( rows.selectedRows?.map( item => [item['processId'], item] ) ).values() );
    const uniQueStyle = Array.from( new Map( rows.selectedRows?.map( item => [item['styleId'], item] ) ).values() );
    const currentProcessId = uniqueProcess[0]?.processId;
    const styleId = uniQueStyle[0]?.styleId;

    const isUniqueStyle = rows.selectedRows.every( e => e.styleId );

    if ( isUniqueStyle ) {
      const rowsId = rows.selectedRows.map( item => item.id );

      setSelectedRowInfo( { rowsId, styleId, currentProcessId } );
    } else {
      setClearSelectedRows( !clearSelectedRows );
      notify( 'warning', 'Style No.  not matched!!!' );
    }
  };
  /**
   * Per Page Change
   */
  const handlePerPage = e => {
    const value = parseInt( e.currentTarget.value );
    setRowsPerPage( value );
    setCurrentPage( 1 );
  };
  /**
   *  Page Change
   */
  const handlePageChange = ( { selected } ) => {
    setCurrentPage( selected + 1 );
  };

  /**
 * Filter
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
   * For Wash Passed Modal Open
   */
  const onWashPassedModalOpen = selectedRowInfo => {
    if ( selectedRowInfo?.rowsId?.length > 0 ) {
      setIsOpenWashPassedModal( !isOpenWashPassedModal );
    }
  };

  /**
   * Toggle Tab
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
      id: 'wash',
      name: 'Wash',
      link: "/wash",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion
  return (
    <>
      <ActionMenu
        breadcrumb={breadcrumb}
        title='Wash '
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
            color="success"
            onClick={() => history.push( {
              pathname: `wash-new`
            } )
            }

          >
            Send
          </NavLink>
        </NavItem>
        <NavItem
          className="mr-1"
        // hidden={!isPermit( userPermission?.ItemGroupCreate, authPermissions )}
        >
          <NavLink
            tag={Button}
            size="sm"
            color="primary"
            onClick={() => history.push( {
              pathname: `wash-received`
            } )
            }
          >
            Received
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
            onClick={() => getAllWashItems()}
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
        <AdvancedSearchBox isOpen={isFilterBoxOpen}>
          <Row>

            <Col xs={12} sm={12} md={2} lg={2} className="mt-1 mt-sm-1  mt-md-0 mt-lg-0">
              <Select
                id="cutPlan"
                isLoading={!selectedProductionSubProcess}
                theme={selectThemeColors}
                options={productionSubProcess}
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
                  Send
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
              <NavItem>
                <NavLink
                  active={active === '3'}
                  onClick={() => {
                    toggle( '3' );
                  }}
                >
                  Passed
                </NavLink>
              </NavItem>
            </Nav>
          </div>
          <TabContent activeTab={active} >
            <TabPane tabId="1">
              <CustomDataTable
                progressPending={loading}
                noHeader={true}
                // onRowExpandToggled={onRowExpandToggled}
                contextActionButton={<Menu size={24} />}
                contextActionButtonColor="flat-primary"
                // onSelectedRowsChange={handleChangeSelectedRow}
                // handleContextAction={() => onBundleAssignToExternal(selectedRowId)}
                expandableRowsComponent={[]}
                columns={washSendTableColumn}
                sortIcon={<ChevronDown />}
                // selectedRowId={selectedRowId}
                data={washSendItems}
                striped
                highlightOnHover
                pointerOnHover
                expandableRows={false}
                selectableRows={false}
              // clearSelectedRows={clearSelectedRows}
              />
            </TabPane>
            <TabPane tabId="2">
              <CustomDataTable
                progressPending={loading}
                // onRowExpandToggled={onRowExpandToggled}
                contextActionButton={<Menu size={24} />}
                contextActionButtonColor="flat-primary"
                onSelectedRowsChange={handleChangeSelectedRow}
                handleContextAction={() => onWashPassedModalOpen( selectedRowInfo )}
                expandableRowsComponent={[]}
                columns={washReceivedTableColumn}
                sortIcon={<ChevronDown />}
                selectedRowId={selectedRowInfo}
                data={washReceiveItems}
                striped
                highlightOnHover
                pointerOnHover
                expandableRows={false}
                selectableRows
                clearSelectedRows={clearSelectedRows}
              />
            </TabPane>
            <TabPane tabId="3">
              <CustomDataTable
                progressPending={loading}
                noHeader={true}
                // onRowExpandToggled={onRowExpandToggled}
                contextActionButton={<Menu size={24} />}
                contextActionButtonColor="flat-primary"
                onSelectedRowsChange={handleChangeSelectedRow}
                handleContextAction={() => { }}
                expandableRowsComponent={[]}
                columns={washPassedTableColumn}
                sortIcon={<ChevronDown />}
                // selectedRowId={selectedRowId}
                data={washPassedItems}
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

      {isOpenWashPassedModal && (
        <WashReceiveModal
          isOpenWashPassedModal={isOpenWashPassedModal}
          setIsOpenWashPassedModal={setIsOpenWashPassedModal}
          selectedRowInfo={selectedRowInfo}
          setSelectedRowInfo={setSelectedRowInfo}
          setClearSelectedRows={setClearSelectedRows}
          selectedProductionSubProcess={selectedProductionSubProcess}
          lastPageInfo={{ page: currentPage, perPage: rowsPerPage, status: true, processId: selectedProductionSubProcess?.id, }}
        />
      )}
    </>
  );
};

export default WashList;

/** Change Log
 * 12-Feb-2022 (Iqbal): Wash List Page and Tab With data render from mock and Onchange events
 */
