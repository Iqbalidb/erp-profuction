/* eslint-disable no-unused-vars */
/*
   Title: Zone Group List
   Description: Zone Group List
   Author: Alamgir Kabir
   Date: 29-March-2022
   Modified: 29-March-2022
*/
import ActionMenu from 'layouts/components/menu/action-menu';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { ChevronDown, Edit, FileText, Filter, MoreVertical, RefreshCw, Settings, Trash2 } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import {
  Badge,
  Button,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  NavItem,
  NavLink,
  Row,
  UncontrolledButtonDropdown,
  UncontrolledDropdown
} from 'reactstrap';
import { baseAxios } from 'services';
import { ZONE_GROUP_API } from 'services/api-end-points/production/v1/zoneGroup';
import { selectThemeColors } from 'utility/Utils';
import AdvancedSearchBox from 'utility/custom/AdvancedSearchBox';
import FormLayout from 'utility/custom/FormLayout';
import IconButton from 'utility/custom/IconButton';
import TableCustomerHeader from 'utility/custom/TableCustomerHeader';
import { notify } from 'utility/custom/notifications';
import CustomDataTable from 'utility/custom/production/CustomDataTable';
import CustomPagination from 'utility/custom/production/CustomPagination';
import { statusOptions } from 'utility/enums';
import ZoneGroupDetails from '../details/ZoneGroupDetails';
import { fetchZoneGroupByQuery } from '../store/action';
import { FETCH_ZONE_GROUP_BY_ID, TOGGLE_ZONE_GROUP_DETAILS_MODAL } from '../store/actionTypes';

const ZoneGroupList = () => {
  //#region Hooks
  const history = useHistory();
  const dispatch = useDispatch();
  const { selectedItem, loading, items, isOpenModal, total } = useSelector( ( { zoneGroupReducer } ) => zoneGroupReducer );
  //#endregion

  //#region State
  const [rowsPerPage, setRowsPerPage] = useState( 10 );
  const [currentPage, setCurrentPage] = useState( 1 );
  const [searchTerm, setSearchTerm] = useState( '' );
  const [currentStatus, setCurrentStatus] = useState( statusOptions[0] );
  // for open and off filter or Search Section
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
  //#endregion

  //#region UDFs
  /**
   * Get Zone Group Details
   */
  const onZoneGroupDetailsView = async id => {
    try {
      const res = await baseAxios.get( ZONE_GROUP_API.fetch_by_id, { params: { id } } );
      if ( res.data.succeeded ) {
        dispatch( {
          type: FETCH_ZONE_GROUP_BY_ID,
          payload: {
            selectedItem: res.data.data
          }
        } );
        dispatch( {
          type: TOGGLE_ZONE_GROUP_DETAILS_MODAL,
          payload: {
            toggleDirection: true
          }
        } );
      }
    } catch ( error ) {
      notify( 'error', 'Something went wrong!! Please try again' );
    }
  };
  /**
   * Get All Zone Group
   */
  const getAllZoneGroup = () => {
    dispatch(
      fetchZoneGroupByQuery( {
        page: currentPage,
        perPage: rowsPerPage,
        ...( searchTerm && { searchKey: searchTerm } ),
        ...( currentStatus && { status: currentStatus.value } )
      } )
    );
  };
  //#endregion

  //#region Effects
  useEffect( () => {
    getAllZoneGroup();
  }, [currentPage, currentStatus, dispatch, rowsPerPage, searchTerm] );

  //#endregion
  //#region Table Columns
  const zoneGroupTableColumn = [
    {
      name: 'Actions',
      width: '80px',
      center: true,
      cell: row => (
        <UncontrolledDropdown>
          <DropdownToggle tag="div" className="btn btn-sm">
            <MoreVertical size={14} className="cursor-pointer" />
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem onClick={() => onZoneGroupDetailsView( row.id )} className="w-100">
              <FileText color="skyBlue" size={14} className="mr-50" />
              <span color="primary" className="align-middle">
                Details
              </span>
            </DropdownItem>
            <Link to={{ pathname: '/zone-group-edit', state: row.id }}>
              <DropdownItem
                // tag={Link}
                // to={`/zone-group-edit`}
                onClick={() => { }}
                className="w-100"
              >
                <Edit color="green" size={14} className="mr-50" />
                <span className="align-middle">Edit</span>
              </DropdownItem>
            </Link>
            <DropdownItem className="w-100" onClick={() => { }}>
              <Trash2 color="red" size={14} className="mr-50" />
              <span className="align-middle">Delete</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      )
    },
    {
      name: 'Zone Name',
      selector: 'zoneName',
      sortable: true,
      cell: row => row.zoneName
    },
    {
      name: 'Status',
      width: '100px',
      selector: 'status',
      center: true,
      cell: row => (
        <Badge pill className="text-capitalize" color={`${row.status ? 'light-success' : 'light-secondary'}`}>
          {row.status ? 'active' : 'inactive'}
        </Badge>
      )
    },
  ];

  //#endregion

  //#region Events
  /**
   * For Per Page Change
   */
  const handlePerPage = e => {
    const value = parseInt( e.currentTarget.value );
    setRowsPerPage( value );
    setCurrentPage( 1 );
  };

  const handleSort = () => { };
  /**
 * For  Page Change
 */
  const handlePageChange = ( { selected } ) => {
    setCurrentPage( selected + 1 );
  };
  /**
 * For Filter
 */
  const handleFilter = e => {
    const { value } = e.target;
    setSearchTerm( value );
  };
  /**
* For Change Current Status
*/
  const handleChangeCurrentStatus = data => {
    if ( data ) {
      const isChangeStatus = currentStatus.label !== data.label;
      if ( isChangeStatus ) {
        setCurrentPage( 1 );
      }
      setCurrentStatus( data );
    }
  };
  /**
 * For Search
 */
  const debouncedChangeHandler = useCallback( debounce( handleFilter, 1000 ), [] );

  const handleDeleteZoneGroupRange = () => { };
  /**
 * For Navigation to Zone group create page
 */
  const handleNavigateToNew = () => {
    history.push( '/zone-group-create' );
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
      id: 'zone',
      name: 'Zone',
      link: "/zone",
      isActive: false,
      hidden: false
    },
    {
      id: 'zone-group',
      name: 'Zone Group',
      link: "/zone-group",
      isActive: true,
      hidden: false
    },
  ];
  //#endregion
  return (
    <div>
      <ActionMenu
        breadcrumb={breadcrumb}
        title='Zone Group'
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
            onClick={handleNavigateToNew}
          >
            Add New
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
          >
            <IconButton
              id="freshBtnId"
              color='primary'
              classNames="ml-1"
              onClick={() => getAllZoneGroup()}
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
                  theme={selectThemeColors}
                  className="erp-dropdown-select"
                  classNamePrefix="dropdown"
                  isClearable={false}
                  options={statusOptions}
                  value={currentStatus}
                  onChange={handleChangeCurrentStatus}
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
          {/* Data Table Section */}
          <CustomDataTable
            noHeader={true}
            progressPending={loading}
            columns={zoneGroupTableColumn}
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
      {isOpenModal && <ZoneGroupDetails />}
    </div>
  );
};

export default ZoneGroupList;
