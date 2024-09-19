/*
    Title: Parts Stock List
    Description: Parts Stock List
    Author: Iqbal Hossain
    Date: 06-July-2022
    Modified: 06-July-2022
*/

import ActionMenu from 'layouts/components/menu/action-menu';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { ChevronDown, Filter, RefreshCw, Settings } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, NavItem, NavLink, Row, UncontrolledButtonDropdown } from 'reactstrap';
import AdvancedSearchBox from 'utility/custom/AdvancedSearchBox';
import FormLayout from 'utility/custom/FormLayout';
import IconButton from 'utility/custom/IconButton';
import TableCustomerHeader from 'utility/custom/TableCustomerHeader';
import CustomDataTable from 'utility/custom/production/CustomDataTable';
import CustomPagination from 'utility/custom/production/CustomPagination';
import { fetchPartsStocksByQuery } from '../store/actions';
import { partsStockTableColumn } from './partsStockTableColumn';

const PartsStockList = () => {
  //#region Hooks
  const history = useHistory();
  const dispatch = useDispatch();
  const { items, total, loading } = useSelector( ( { partsStockReducer } ) => partsStockReducer );
  //#endregion

  //#region States
  const [rowsPerPage, setRowsPerPage] = useState( 10 );
  const [currentPage, setCurrentPage] = useState( 1 );
  const [selectedRowId, setSelectedRowId] = useState( [] );
  const [clearSelectedRow, setClearSelectedRow] = useState( false );
  const [searchTerm, setSearchTerm] = useState( '' );
  // for open and off filter or Search Section
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
  //#endregion

  //#region UDFs
  /**
   * Get All Part Stock
   */
  const getAllPartStock = () => {
    dispatch( fetchPartsStocksByQuery( { page: currentPage, perPage: rowsPerPage, ...( searchTerm && { searchKey: searchTerm } ) } ) );
  };
  //#endregion

  //#region Effects
  useEffect( () => {
    getAllPartStock();
  }, [dispatch, rowsPerPage, currentPage, searchTerm] );

  //#endregion
  //#region Events
  /**
   * Get data with row per page
   */
  const handlePerPage = e => {
    const value = parseInt( e.currentTarget.value );
    setRowsPerPage( value );
    setCurrentPage( 1 );
  };

  /**
   * Select multiple rows
   */
  const handleRowSelected = rows => {
    const rowsId = rows?.selectedRows?.map( item => item.id );
    setSelectedRowId( rowsId );
    setClearSelectedRow( false );
  };

  /**
   * page change
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
   * Search
   */
  const debouncedChangeHandler = useCallback( debounce( handleFilter, 1000 ), [] );

  /**
   * Sort
   */
  const handleSort = () => { };
  //#endregion
  //#region Breadcrum
  const breadcrumb = [
    {
      id: 'home',
      name: 'Home',
      link: "/home",
      isActive: false,
      hidden: false
    },

    {
      id: 'parts-stock',
      name: 'Parts Stock',
      link: "/parts-stock",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion
  return (
    <div>
      <ActionMenu
        breadcrumb={breadcrumb}
        title='Parts Stock'
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
              pathname: `parts-stock-new`
            } )
            }
          >
            Add Stock
          </NavLink>
        </NavItem>
        <NavItem
          className="mr-1"
        // hidden={!isPermit( userPermission?.ItemGroupCreate, authPermissions )}
        >
          <NavLink
            tag={Button}
            size="sm"
            color="success"
            onClick={() => history.push( {
              pathname: `bundle-new`
            } )
            }
          >
            Add Bundle
          </NavLink>
        </NavItem>
      </ActionMenu>
      <FormLayout isNeedTopMargin={true}>
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
              onClick={() => getAllPartStock()}
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
          {/* Data Table Section */}
          <CustomDataTable
            noHeader={true}
            progressPending={loading}
            columns={partsStockTableColumn}
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

    </div>
  );
};

export default PartsStockList;
