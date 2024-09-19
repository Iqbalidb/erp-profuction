/*
   Title: Production Process Table Column
   Description: Production Process Table Column
   Author: Alamgir Kabir
   Date: 28-March-2022
   Modified: 28-March-2022
*/
import { Edit, FileText, MoreVertical, Trash2 } from 'react-feather';
import { Link } from 'react-router-dom';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';

export const productionProcessGroupTableColumn = [
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
          <DropdownItem tag={Link} to={{ pathname: '/production-process-group-details', state: row.id }} className="w-100">
            <FileText color="skyBlue" size={14} className="mr-50" />
            <span color="primary" className="align-middle">
              Details
            </span>
          </DropdownItem>

          <Link to={{ pathname: '/production-process-group/edit', state: row.id }}>
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
    name: 'Group Name',
    minWidth: '45%',
    selector: 'groupName',
    sortable: true,
    cell: row => row.groupName
  },

  {
    name: 'Status',
    maxWidth: '45%',
    selector: 'status',
    width: '100px',
    center: true,
    cell: row => (
      <Badge pill className="text-capitalize" color={`${row.status ? 'light-success' : 'light-secondary'}`}>
        {row.status ? 'active' : 'inactive'}
      </Badge>
    )
  },

];