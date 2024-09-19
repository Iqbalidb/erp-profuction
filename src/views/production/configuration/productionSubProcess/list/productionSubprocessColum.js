/**
 * Title: Production Sub process Column
 * Description: Production Sub process Column
 * Author: Nasir Ahmed
 * Date: 07-February-2022
 * Modified: 07-February-2022
 **/

import { Edit, MoreVertical, Trash2 } from 'react-feather';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { store } from 'redux/storeConfig/store';
import { fetchProductionSubProcessById } from '../store/actions';

export const productionSubProcessColumn = [

  {
    name: 'Actions',
    maxWidth: '5%',
    center: true,
    cell: row => (
      <UncontrolledDropdown>
        <DropdownToggle tag="div" className="btn btn-sm">
          <MoreVertical size={14} className="cursor-pointer" />
        </DropdownToggle>
        <DropdownMenu right>
          {/* <DropdownItem className="w-100">
            <FileText color="skyBlue" size={14} className="mr-50" />
            <span color="primary" className="align-middle">
              Details
            </span>
          </DropdownItem> */}
          <DropdownItem className="w-100" onClick={() => store.dispatch( fetchProductionSubProcessById( row.id ) )}>
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
    name: 'Name',
    minWidth: '20%',
    selector: 'name',
    sortable: true,
    cell: row => row.name
  },
  {
    name: 'Short Code',
    minWidth: '20%',
    selector: 'shortCode',
    sortable: true,
    cell: row => row.shortCode
  },
  {
    name: 'Main Process',
    minWidth: '20%',
    selector: 'parentProcessName',
    sortable: true,
    cell: row => row.parentProcessName
  },
  {
    name: 'Process type',
    minWidth: '20%',
    selector: 'processType',
    sortable: true,
    cell: row => row.processType
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
