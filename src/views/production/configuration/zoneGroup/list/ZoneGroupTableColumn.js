/*
     Title: Zone Group Table Column
     Description: Zone Group Table Column
     Author: Alamgir Kabir
     Date: 29-March-2022
     Modified: 29-March-2022
*/

import { Edit, FileText, MoreVertical, Trash2 } from 'react-feather';
import { Link } from 'react-router-dom';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { store } from 'redux/storeConfig/store';
import { fetchZoneGroupById } from '../store/action';
export const zoneGroupTableColumn = [
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
    sortable: true,
    cell: row => (
      <Badge pill className="text-capitalize" color={`${row.status ? 'light-success' : 'light-secondary'}`}>
        {row.status ? 'active' : 'inactive'}
      </Badge>
    )
  },
  {
    name: 'Actions',
    width: '80px',
    cell: row => (
      <UncontrolledDropdown>
        <DropdownToggle tag="div" className="btn btn-sm">
          <MoreVertical size={14} className="cursor-pointer" />
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem onClick={() => store.dispatch( fetchZoneGroupById( row.id ) )} className="w-100">
            <FileText color="skyBlue" size={14} className="mr-50" />
            <span color="primary" className="align-middle">
              Details
            </span>
          </DropdownItem>

          <Link to={{ pathname: '/zone-group-edit', state: row.id }}>
            <DropdownItem
              // tag={Link}
              // to={`/zone-group-edit`}
              onClick={() => store.dispatch( fetchZoneGroupById( row.id ) )}
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
  }
];
