/*
     Title: Previous Target Table Column
     Description: Previous Target Table Column
     Author: Alamgir Kabir
     Date: 18-October-2022
     Modified: 18-October-2022
*/
import { Edit, FileText, MoreVertical, Trash2 } from 'react-feather';
import { Link } from 'react-router-dom';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { formattedDate } from 'utility/dateHelpers';

export const previousAssignTargetTableColumn = [
  {
    name: 'Actions',
    width: '5%',
    center: true,
    cell: row => (
      <UncontrolledDropdown>
        <DropdownToggle tag="div" className="btn btn-sm">
          <MoreVertical size={14} className="cursor-pointer" />
        </DropdownToggle>
        <DropdownMenu right>
          <Link to={{ pathname: '/assign-target-details', state: row }}>
            <DropdownItem className="w-100">
              <FileText color="skyBlue" size={14} className="mr-50" />
              <span color="primary" className="align-middle">
                Details
              </span>
            </DropdownItem>
          </Link>

          <Link to={{ pathname: '/assign-target-edit', state: row }}>
            <DropdownItem className="w-100">
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
    name: 'Floor ',
    minWidth: '10%',
    selector: 'floorName',
    sortable: true,
    cell: row => row.floorName
  },
  {
    name: 'Zone',
    minWidth: '10%',
    selector: 'zoneName',
    sortable: true,
    cell: row => row.zoneName
  },
  {
    name: 'Zone Owner',
    minWidth: '10%',
    selector: 'ownerName',
    sortable: true,
    cell: row => row.ownerName
  },
  {
    name: 'Line ',
    minWidth: '10%',
    selector: 'lineName',
    sortable: true,
    cell: row => row.lineName
  },

  {
    name: 'Machine',
    minWidth: '10%',
    selector: 'machineCount',
    sortable: true,
    cell: row => row.machineCount
  },
  {
    name: 'Assign Date',
    minWidth: '10%',
    selector: 'date',
    sortable: true,
    cell: row => formattedDate( row.date )
  },
  {
    name: 'Target',
    minWidth: '10%',
    selector: 'targetValue',
    sortable: true,
    cell: row => row.targetValue
  },

];
