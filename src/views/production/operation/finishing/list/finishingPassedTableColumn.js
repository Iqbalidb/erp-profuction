/*
     Title: Finishing Previous Table Column
     Description: Finishing Previous Table Column
     Author: Alamgir Kabir
     Date: 11-December-2022
     Modified: 11-December-2022
*/
import { Edit, FileText, MoreVertical, Trash2 } from 'react-feather';
import { Link } from 'react-router-dom';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { formattedDate } from 'utility/dateHelpers';
export const finishingPreviousTableColumn = [

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
          <Link to={{ pathname: '/finishing-details', state: row }}>
            <DropdownItem className="w-100">
              <FileText color="skyBlue" size={14} className="mr-50" />
              <span color="primary" className="align-middle">
                Details
              </span>
            </DropdownItem>
          </Link>

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
    name: 'Buyer',
    minWidth: '10%',
    selector: 'buyerName',
    sortable: true,
    cell: row => row.buyerName
  },
  {
    name: 'Style Category',
    minWidth: '10%',
    selector: 'styleCategory',
    sortable: true,
    cell: row => row.styleCategory
  },

  {
    name: 'Style No',
    minWidth: '10%',
    selector: 'styleNo',
    sortable: true,
    cell: row => row.styleNo
  },

  {
    name: 'Inspect Date',
    minWidth: '10%',
    selector: 'date',
    sortable: true,
    cell: row => formattedDate( row.date )
  },
  {
    name: ' Time',
    minWidth: '8%',
    selector: 'time',
    sortable: true,
    cell: row => row.time
  },
  {
    name: 'Passed Process',
    minWidth: '10%',
    selector: 'nextPassedProcessName',
    sortable: true,
    cell: row => row.nextPassedProcessName
  },
  {
    name: 'Inspect Qty',
    minWidth: '10%',
    selector: 'totalInspaction',
    sortable: true,
    cell: row => row.totalInspaction
  },
  {
    name: 'Passed Qty',
    minWidth: '8%',
    selector: 'totalPassed',
    sortable: true,
    cell: row => row.totalPassed
  },
  {
    name: 'Defect Qty',
    minWidth: '8%',
    selector: 'totalDefect',
    sortable: true,
    cell: row => row.totalDefect
  },

  {
    name: 'Reject Qty',
    minWidth: '8%',
    selector: 'totalReject',
    sortable: true,
    cell: row => row.totalReject
  },

];
