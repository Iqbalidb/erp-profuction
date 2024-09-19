/*
     Title: Sewing Out Table Column
     Description: Sewing Out Table Column
     Author: Alamgir Kabir
     Date: 09-November-2022
     Modified: 09-November-2022
*/
import { Edit, FileText, MoreVertical, Trash2 } from 'react-feather';
import { Link } from 'react-router-dom';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { formattedDate } from 'utility/dateHelpers';

export const sewingOutPassedTableColumn = [
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
          <Link to={{ pathname: '/sewing-out-details', state: row }}>
            <DropdownItem className="w-100">
              <FileText color="skyBlue" size={14} className="mr-50" />
              <span color="primary" className="align-middle">
                Details
              </span>
            </DropdownItem>
          </Link>
          <Link to={{ pathname: '/sewing-out-edit', state: row }}>
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
    width: '8%',
    selector: 'date',
    sortable: true,
    cell: row => formattedDate( row.date )
  },
  {
    name: 'Time',
    width: '8%',
    selector: 'time',
    sortable: true,
    cell: row => row.time
  },
  {
    name: 'Floor ',
    width: '8%',
    selector: 'floorName',
    sortable: true,
    cell: row => row.floorName
  },
  {
    name: 'Line ',
    minWidth: '8%',
    selector: 'lineName',
    sortable: true,
    cell: row => row.lineName
  },
  {
    name: 'Zone Owner',
    minWidth: '8%',
    selector: 'ownerName',
    sortable: true,
    cell: row => row.ownerName
  },
  {
    name: 'Buyer',
    minWidth: '8%',
    selector: 'buyerName',
    sortable: true,
    cell: row => row.buyerName
  },
  {
    name: 'Style',
    minWidth: '8%',
    selector: 'styleNo',
    sortable: true,
    cell: row => row.styleNo
  },
  {
    name: 'Style Category ',
    minWidth: '8%',
    selector: 'styleCategory',
    sortable: true,
    cell: row => row.styleCategory
  },
  {
    name: 'Color',
    minWidth: '8%',
    selector: 'colorName',
    sortable: true,
    cell: row => row.colorName
  },
  {
    name: 'Passed Process',
    minWidth: '8%',
    selector: 'passedProcessName',
    sortable: true,
    cell: row => row.passedProcessName
  },
  {
    name: 'Total',
    minWidth: '8%',
    selector: 'totalQuantity',
    sortable: true,
    cell: row => row.totalQuantity
  },


];
