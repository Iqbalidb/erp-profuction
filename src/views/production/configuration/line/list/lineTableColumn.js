/*
     Title: Line Table Column
     Description: Line Table Column
     Author: Iqbal Hossain
     Date: 06-January-2022
     Modified: 06-January-2022
*/

import { Edit, FileText, MoreVertical, Settings, Trash2 } from 'react-feather';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { store } from 'redux/storeConfig/store';
import { deleteLine, fetchLineById, openCriticalProcessManageModal } from '../store/actions';

export const LineTableColumn = [
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
          <DropdownItem className="w-100">
            <FileText color="skyBlue" size={14} className="mr-50" />
            <span color="primary" className="align-middle">
              Details
            </span>
          </DropdownItem>
          <DropdownItem className="w-100" onClick={() => store.dispatch( fetchLineById( row.id ) )}>
            <Edit color="green" size={14} className="mr-50" />
            <span className="align-middle">Edit</span>
          </DropdownItem>
          <DropdownItem
            className="w-100"
            onClick={() => {
              store.dispatch( deleteLine( row.id ) );
            }}
          >
            <Trash2 color="red" size={14} className="mr-50" />
            <span className="align-middle">Delete</span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    )
  },

  {
    name: 'Line Name',
    minWidth: '15%',
    selector: 'name',
    sortable: true,
    cell: row => row.name
  },

  {
    name: 'Production Process ',
    minWidth: '15%',
    selector: 'productionProcessName',
    sortable: true,
    cell: row => row.productionProcessName
  },
  {
    name: 'Floor Name',
    minWidth: '15%',
    selector: 'floorName',
    sortable: true,
    cell: row => row.floorName
  },
  {
    name: 'Details',
    minWidth: '15%',
    selector: 'details',
    sortable: true,
    cell: row => row.details
  },
  {
    name: 'Manage Critical Process',
    width: '20%',
    center: true,
    selector: 'manage',
    sortable: true,
    cell: row => (
      <div>
        <Settings className="cursor-pointer" onClick={() => store.dispatch( openCriticalProcessManageModal( row ) )}></Settings>
      </div>
    )
  },
  {
    name: 'Status',
    width: '100px',
    selector: 'status',
    center: true,
    cell: row => (
      <Badge className="text-capitalize" color={`${row.status ? 'light-success' : 'light-secondary'}`} pill>
        {row.status ? 'active' : 'inactive'}
      </Badge>
    )
  },


];
