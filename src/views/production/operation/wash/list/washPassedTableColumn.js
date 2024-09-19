/*
     Title: Wash Passed Table Column
     Description: Wash Passed Table Column
     Author: Alamgir Kabir
     Date: 14-February-2023
     Modified: 14-February-2023
*/

import { Edit, FileText, MoreVertical, Trash2 } from "react-feather";
import { Link } from "react-router-dom";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from "reactstrap";
import { formattedDate } from "utility/dateHelpers";
export const washPassedTableColumn = [

  {
    name: "Actions",
    width: "5%",
    center: true,
    cell: ( row ) => (
      <UncontrolledDropdown>
        <DropdownToggle tag="div" className="btn btn-sm">
          <MoreVertical size={14} className="cursor-pointer" />
        </DropdownToggle>
        <DropdownMenu right>
          <Link to={{ pathname: "", state: row }}>
            <DropdownItem className="w-100">
              <FileText color="skyBlue" size={14} className="mr-50" />
              <span color="primary" className="align-middle">
                Details
              </span>
            </DropdownItem>
          </Link>
          <Link to={{ pathname: "", state: row }}>
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
    name: "Receive Date",
    minWidth: '10%',
    selector: "date",
    sortable: true,
    cell: ( row ) => formattedDate( row.date )
  },

  {
    name: "Buyer",
    minWidth: '10%',
    selector: "buyerName",
    sortable: true,
    cell: ( row ) => row.buyerName
  },

  {
    name: "Style No",
    minWidth: '10%',
    selector: "styleNo",
    sortable: true,
    cell: ( row ) => row.styleNo
  },
  {
    name: "Style Category",
    minWidth: '10%',
    selector: "styleCategory",
    sortable: true,
    cell: ( row ) => row.styleCategory
  },

  {
    name: "Color",
    minWidth: '10%',
    selector: "colorName",
    sortable: true,
    cell: ( row ) => row.colorName
  },
  {
    name: "Passed Process",
    minWidth: '10%',
    selector: "passedProcessName",
    sortable: true,
    cell: ( row ) => row.passedProcessName
  },

  {
    name: "Received Qty",
    minWidth: '10%',
    selector: "totalReceive",
    sortable: true,
    cell: ( row ) => row.totalReceive
  },

  {
    name: "Reject Qty",
    minWidth: '10%',
    selector: "totalReject",
    sortable: true,
    cell: ( row ) => row.totalReject
  },
  {
    name: "Resend Qty",
    minWidth: '10%',
    selector: "totalResend",
    sortable: true,
    cell: ( row ) => row.totalResend
  },

];
