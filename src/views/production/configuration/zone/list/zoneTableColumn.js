/*
     Title: Zone Table Column
     employeeCode: zone Table Column
     Author: Iqbal Hossain
     Date: 06-January-2022
     Modified: 06-January-2022
*/

import { Edit, FileText, MoreVertical, Trash2 } from 'react-feather';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { store } from 'redux/storeConfig/store';
import { deleteZone, fetchZoneById } from '../store/actions';

export const ZoneTableColumn = [
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
          <DropdownItem
            className="w-100"
            onClick={() => {
              store.dispatch( fetchZoneById( row.id ) );
            }}
          >
            <Edit color="green" size={14} className="mr-50" />
            <span className="align-middle">Edit</span>
          </DropdownItem>
          <DropdownItem
            className="w-100"
            onClick={() => {
              store.dispatch( deleteZone( row.id ) );
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
    name: 'Zone  Name',
    minWidth: '20%',
    selector: 'name',
    sortable: true,
    cell: row => row.name
  },

  {
    name: 'Production Process',
    minWidth: '20%',
    selector: 'productionProcessName',
    sortable: true,
    cell: row => row.productionProcessName
  },
  {
    name: 'Floor Name',
    minWidth: '20%',
    selector: 'floorName',
    sortable: true,
    cell: row => row.floorName
  },
  {
    name: 'Details',
    minWidth: '20%',
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
      <Badge className="text-capitalize" color={`${row.status ? 'light-success' : 'light-secondary'}`} pill>
        {row.status ? 'active' : 'Inactive'}
      </Badge>
    )
  },

];
/** Change Log
 * 17-Feb-2022(Alamgir):Modify Column Name
 */
