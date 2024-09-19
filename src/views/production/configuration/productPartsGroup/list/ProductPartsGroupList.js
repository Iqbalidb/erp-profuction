/*
     Title: Production Parts Group
     Description: Production Parts Group
     Author: Alamgir Kabir
     Date: 14-May-2022
     Modified: 14-May-2022
*/
import ActionMenu from 'layouts/components/menu/action-menu';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { ChevronDown, Filter, RefreshCw, Settings } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Col, DropdownItem,
  DropdownMenu,
  DropdownToggle, Input, NavItem, NavLink, Row, UncontrolledButtonDropdown
} from 'reactstrap';
import AdvancedSearchBox from 'utility/custom/AdvancedSearchBox';
import FormLayout from 'utility/custom/FormLayout';
import IconButton from 'utility/custom/IconButton';
import TableCustomerHeader from 'utility/custom/TableCustomerHeader';
import CustomDataTable from 'utility/custom/production/CustomDataTable';
import CustomPagination from 'utility/custom/production/CustomPagination';
import { fetchProductPartsGroupByQuery } from '../store/actions';
import { productPartsGroupTableColumn } from './productPartsGroupTableColumn';

const ProductPartsGroupList = () => {
  //#region Hooks
  const history = useHistory();
  const dispatch = useDispatch();
  const { items, total, loading } = useSelector( ( { productionPartsGroup } ) => productionPartsGroup );
  //#endregion

  //#region States
  const [rowsPerPage, setRowsPerPage] = useState( 10 );
  const [currentPage, setCurrentPage] = useState( 1 );
  const [searchTerm, setSearchTerm] = useState( '' );
  // for open and off filter or Search Section
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
  //#endregion

  //#region UDFs
  /**
   * Get All Product Part
   */
  const getAllProductPartGroup = () => {
    dispatch(
      fetchProductPartsGroupByQuery( {
        page: currentPage,
        perPage: rowsPerPage,
        ...( searchTerm && { searchKey: searchTerm } )
      } )
    );
  };
  //#endregion

  //#region Effects
  useEffect( () => {
    getAllProductPartGroup();
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
   * For Page Change
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
      id: 'product-parts',
      name: 'Product Part',
      link: "/product-parts",
      isActive: false,
      hidden: false
    },
    {
      id: 'FabricType',
      name: 'Fabric Type',
      link: "/part-groups",
      isActive: false,
      hidden: false
    },

    {
      id: 'product-parts-group',
      name: 'Product Part Group',
      link: "/product-parts-group",
      isActive: true,
      hidden: false
    },
  ];
  //#endregion
  return (
    <div>
      <ActionMenu
        breadcrumb={breadcrumb}
        title='Product Part Group'
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
              pathname: `/product-parts-group-new`
            } )
            }
          >
            Add New
          </NavLink>
        </NavItem>
      </ActionMenu>
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
              onClick={() => getAllProductPartGroup()}
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
            columns={productPartsGroupTableColumn}
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

export default ProductPartsGroupList;
