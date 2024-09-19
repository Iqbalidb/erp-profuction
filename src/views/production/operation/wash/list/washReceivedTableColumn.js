/*
     Title: Wash Received Table Column
     Description: Wash Received Table Column
     Author: Alamgir Kabir
     Date: 03-January-2023
     Modified: 03-January-2023
*/

import { Edit, FileText, MoreVertical, Trash2 } from 'react-feather';
import { Link } from 'react-router-dom';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { formattedDate } from 'utility/dateHelpers';
export const washReceivedTableColumn = [

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
          <Link to={{ pathname: '/wash-receive-details', state: row }}>
            <DropdownItem className="w-100">
              <FileText color="skyBlue" size={14} className="mr-50" />
              <span color="primary" className="align-middle">
                Details
              </span>
            </DropdownItem>
          </Link>
          <Link to={{ pathname: '/wash-receive-edit', state: row }}>
            <DropdownItem className="w-100" onClick={() => { }}>
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
    name: 'Receive Date',
    minWidth: '10%',
    selector: 'date',
    sortable: true,
    cell: row => formattedDate( row.date )
  },

  {
    name: 'Buyer',
    minWidth: '10%',
    selector: 'buyerName',
    sortable: true,
    cell: row => row.buyerName
  },

  {
    name: 'Style No',
    minWidth: '10%',
    selector: 'styleNo',
    sortable: true,
    cell: row => row.styleNo
  },
  {
    name: 'Style Category',
    minWidth: '10%',
    selector: 'styleCategory',
    sortable: true,
    cell: row => row.styleCategory
  },

  {
    name: 'Color',
    minWidth: '10%',
    selector: 'colorName',
    sortable: true,
    cell: row => row.colorName
  },
  {
    name: 'Process',
    minWidth: '10%',
    selector: 'processName',
    sortable: true,
    cell: row => row.processName
  },

  {
    name: 'Received Qty',
    minWidth: '10%',
    selector: 'totalReceive',
    sortable: true,
    cell: row => row.totalReceive
  },

  {
    name: 'Reject Qty',
    minWidth: '10%',
    selector: 'totalReject',
    sortable: true,
    cell: row => row.totalReject
  },
  {
    name: 'Resend Qty',
    minWidth: '10%',
    selector: 'totalResend',
    sortable: true,
    cell: row => row.totalResend
  },

];
