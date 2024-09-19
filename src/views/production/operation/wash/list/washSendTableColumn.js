/*
     Title: Wash Send Table Column
     Description: Wash Send Table Column
     Author: Alamgir Kabir
     Date: 03-January-2023
     Modified: 03-January-2023
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
export const washSendTableColumn = [
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
          <Link to={{ pathname: "/wash-details", state: row }}>
            <DropdownItem className="w-100">
              <FileText color="skyBlue" size={14} className="mr-50" />
              <span color="primary" className="align-middle">
                Details
              </span>
            </DropdownItem>
          </Link>
          <Link to={{ pathname: "/wash-edit", state: row }}>
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
    name: "Send Date",
    minWidth: '10%',
    selector: "date",
    sortable: true,
    cell: ( row ) => formattedDate( row.date )
  },
  {
    name: "Floor",
    minWidth: '10%',
    selector: "floorName",
    sortable: true,
    cell: ( row ) => row.floorName
  },
  {
    name: "Line",
    minWidth: '10%',
    selector: "lineName",
    sortable: true,
    cell: ( row ) => row.lineName
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
    minWidth: '15%',
    selector: "colorName",
    sortable: true,
    cell: ( row ) => row.colorName
  },
  {
    name: "Process",
    minWidth: '10%',
    selector: "processName",
    sortable: true,
    cell: ( row ) => row.processName
  },

  {
    name: "Send Qty",
    width: "8%",
    selector: "totalQuantity",
    sortable: true,
    cell: ( row ) => row.totalQuantity
  },

];
