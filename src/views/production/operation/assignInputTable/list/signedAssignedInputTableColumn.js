/*
     Title: Signed Table Column
     Description: Signed Table Column
     Author: Alamgir Kabir
     Date: 14-September-2022
     Modified: 14-September-2022
*/
import { Edit, FileText, MoreVertical, Trash2 } from 'react-feather';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { formattedDate } from 'utility/dateHelpers';
export const signedTableColumn = [
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
          <DropdownItem className="w-100">
            <FileText color="skyBlue" size={14} className="mr-50" />
            <span color="primary" className="align-middle">
              Details
            </span>
          </DropdownItem>
          <DropdownItem className="w-100" onClick={() => { }}>
            <Edit color="green" size={14} className="mr-50" />
            <span className="align-middle">Edit</span>
          </DropdownItem>
          <DropdownItem className="w-100" onClick={() => { }}>
            <Trash2 color="red" size={14} className="mr-50" />
            <span className="align-middle">Delete</span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    )
  },
  {
    name: 'Assign Date',
    minWidth: '10%',
    selector: 'date',
    sortable: true,
    cell: row => formattedDate( row.date )
  },
  {
    name: 'Floor ',
    minWidth: '10%',
    selector: 'floorName',
    sortable: true,
    cell: row => row.floorName
  },
  {
    name: 'Zone ',
    minWidth: '10%',
    selector: 'zoneName',
    sortable: true,
    cell: row => row.zoneName
  },
  {
    name: 'Zone Owner ',
    minWidth: '20%',
    selector: 'ownerName',
    sortable: true,
    cell: row => `${row.ownerName}[${row.ownerEmpCode}]`
  },

  {
    name: 'Line ',
    minWidth: '10%',
    selector: 'lineName',
    sortable: true,
    cell: row => row.lineName
  },

  {
    name: 'Machine Count',
    minWidth: '10%',
    selector: 'machineCount',
    sortable: true,
    cell: row => row.machineCount
  },

];
