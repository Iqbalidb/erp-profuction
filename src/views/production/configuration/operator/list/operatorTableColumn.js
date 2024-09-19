import { Edit, FileText, MoreVertical, Trash2 } from 'react-feather';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { store } from 'redux/storeConfig/store';
import { formattedDate } from 'utility/dateHelpers';
import { fetchOperatorById } from '../store/actions';

/*
     Title: Operator Table Column
     Description: Operator Table Column
     Author: Alamgir Kabir
     Date: 12-December-2022
     Modified: 12-December-2022
*/

const handleOpenEditModal = operatorId => {
  store.dispatch( fetchOperatorById( operatorId ) );
};
export const operatorTableColumn = [
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
          <DropdownItem className="w-100" onClick={() => handleOpenEditModal( row.id )}>
            <Edit color="green" size={14} className="mr-50" />
            <span color="primary" className="align-middle">
              Edit
            </span>
          </DropdownItem>
          <DropdownItem className="w-100">
            <Trash2 color="red" size={14} className="mr-50" />
            <span color="primary" className="align-middle">
              Delete
            </span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    )
  },
  {
    name: 'Employee Code',
    minWidth: '12%',
    selector: 'employeeCode',
    sortable: true,
    cell: row => row.employeeCode
  },
  {
    name: 'Name',
    minWidth: '10%',
    selector: 'name',
    sortable: true,
    cell: row => row.name
  },
  {
    name: 'Phone No',
    minWidth: '10%',
    selector: 'phoneNumber',
    sortable: true,
    cell: row => row.phoneNumber
  },
  {
    name: 'Email',
    minWidth: '12%',
    selector: 'email',
    sortable: true,
    cell: row => row.email
  },
  {
    name: 'Gender',
    minWidth: '8%',
    selector: 'gender',
    sortable: true,
    cell: row => row.gender
  },
  {
    name: 'Blood Group',
    minWidth: '10%',
    selector: 'bloodGroup',
    sortable: true,
    cell: row => row.bloodGroup
  },
  {
    name: 'NID',
    minWidth: '10%',
    selector: 'nationalID',
    sortable: true,
    cell: row => row.nationalID
  },
  {
    name: 'Joining Date',
    minWidth: '10%',
    selector: 'joiningDate',
    sortable: true,
    cell: row => formattedDate( row.joiningDate )
  },

  {
    name: 'Status',
    width: '100px',
    selector: 'status',
    center: true,
    // sortable: true,
    cell: row => (
      <Badge pill className="text-capitalize" color={`${row.status ? 'light-success' : 'light-secondary'}`}>
        {row.status ? 'active' : 'inactive'}
      </Badge>
    )
  },

];
