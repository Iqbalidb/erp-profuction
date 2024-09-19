/*
     Title: Floor Table Column
     Description: Floor Table Column
     Author: Alamgir Kabir
     Date: 14-February-2022
     Modified: 14-February-2022
*/
import { Edit, MoreVertical } from 'react-feather';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { store } from 'redux/storeConfig/store';
import { fetchFloorById } from '../store/actions';

export const floorTableColumn = [
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
          <DropdownItem className="w-100" onClick={() => store.dispatch( fetchFloorById( row.id ) )}>
            <Edit color="green" size={14} />
            <span className="align-middle">Edit</span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    )
  },
  {
    name: 'Name',
    selector: 'name',
    sortable: true,
    cell: row => row.name,
    width: '250px'
  },
  {
    name: 'Details',
    selector: 'details',
    sortable: true,
    cell: row => row.details
  },
  {
    name: 'Status',
    width: '100px',
    selector: 'status',
    center: true,
    cell: row => (
      <Badge className="text-capitalize" color={`${row.status ? 'light-success' : 'light-secondary'}`}>
        {row.status ? 'active' : 'inactive'}
      </Badge>
    )
  },

];
