/*
     Title:
     Description: Sewing Inspection Table Column
     Author: Alamgir Kabir
     Date: 23-October-2022
     Modified: 23-October-2022
*/

import { Edit, FileText, MoreVertical, Trash2 } from 'react-feather';
import { Link } from 'react-router-dom';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { formattedDate } from 'utility/dateHelpers';

export const sewingInspectionTableColumn = [
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
          <Link to={{ pathname: '/sewing-inspection-details', state: row }}>
            <DropdownItem className="w-100">
              <FileText color="skyBlue" size={14} className="mr-50" />
              <span color="primary" className="align-middle">
                Details
              </span>
            </DropdownItem>
          </Link>
          <Link to={{ pathname: '/sewing-inspection-edit', state: row }}>
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
    name: 'Inspection Date',
    minWidth: '10%',
    selector: 'date',
    sortable: true,
    cell: row => formattedDate( row.date )
  },
  {
    name: 'Time',
    minWidth: '5%',
    selector: 'time',
    sortable: true,
    cell: row => row.time
  },
  {
    name: 'Floor ',
    minWidth: '10%',
    selector: 'floorName',
    sortable: true,
    cell: row => row.floorName
  },
  {
    name: 'Line ',
    minWidth: '10%',
    selector: 'lineName',
    sortable: true,
    cell: row => row.lineName
  },
  {
    name: 'Zone Owner',
    minWidth: '10%',
    selector: 'ownerName',
    sortable: true,
    cell: row => row.ownerName
  },
  {
    name: 'Buyer',
    minWidth: '10%',
    selector: 'buyerName',
    sortable: true,
    cell: row => row.buyerName
  },
  {
    name: 'Style',
    minWidth: '10%',
    selector: 'styleNo',
    sortable: true,
    cell: row => row.styleNo
  },
  {
    name: 'Style Category ',
    minWidth: '10%',
    selector: 'styleCategory',
    sortable: true,
    cell: row => row.styleCategory
  },

  {
    name: 'Target',
    minWidth: '5%',
    selector: 'targetValue',
    sortable: true,
    cell: row => row.targetValue
  },
  {
    name: 'Machine',
    minWidth: '5%',
    selector: 'machineCount',
    sortable: true,
    cell: row => row.machineCount
  },
];
