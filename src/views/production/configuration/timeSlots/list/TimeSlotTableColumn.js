/*
     Title: Time Slot Table Column
     Description:Time Slot Table Column
     Author: Alamgir Kabir
     Date: 12-February-2022
     Modified: 12-February-2022
*/
import { Edit, MoreVertical } from 'react-feather';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { store } from 'redux/storeConfig/store';
import { formattedTime } from 'utility/dateHelpers';
import { fetchTimeSlotById } from '../store/actions';

export const timeSlotTableColumn = [
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
          <DropdownItem className="w-100" onClick={() => store.dispatch( fetchTimeSlotById( row.id ) )}>
            <Edit color="green" size={14} />
            <span className="align-middle">Edit</span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    )
  },
  {
    name: 'Name',
    minWidth: '25%',
    selector: 'name',
    sortable: true,
    cell: row => row.name
  },
  {
    name: 'From Time',
    minWidth: '20%',
    selector: 'fromTime',
    sortable: true,
    cell: row => formattedTime( row.fromTime )
  },
  {
    name: 'To Time',
    minWidth: '20%',
    selector: 'toTime',
    sortable: true,
    cell: row => formattedTime( row.toTime )
  },
  {
    name: 'Duration',
    minWidth: '15%',
    selector: 'duration',
    sortable: true,
    cell: row => row.duration
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
