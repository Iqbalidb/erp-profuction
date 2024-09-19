/**
 * Title: Table Columns for Critical Process
 * Description: Table Columns for Critical Process
 * Author: Nasir Ahmed
 * Date: 10-January-2022
 * Modified: 10-January-2022
 **/

import { Edit, FileText, MoreVertical, Trash2 } from "react-feather";
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from "reactstrap";
import { store } from "redux/storeConfig/store";
import {
  deleteCriticalProcess,
  fetchCriticalProcessById
} from "../store/actions";

export const criticalProcessTableColumn = [
  {
    name: "Actions",
    maxWidth: "5%",
    center: true,
    cell: ( row ) => (
      <UncontrolledDropdown>
        <DropdownToggle tag="div" className="btn btn-sm">
          <MoreVertical size={14} className="cursor-pointer" />
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem
            className="w-100"
          >
            <FileText color="skyBlue" size={14} className="mr-50" />
            <span color="primary" className="align-middle">
              Details
            </span>
          </DropdownItem>
          <DropdownItem
            className="w-100"
            onClick={() => store.dispatch( fetchCriticalProcessById( row.id ) )}
          >
            <Edit color="green" size={14} className="mr-50" />
            <span className="align-middle">Edit</span>
          </DropdownItem>
          <DropdownItem
            className="w-100"
            onClick={() => {
              store.dispatch( deleteCriticalProcess( row.id ) );
            }}
          >
            <Trash2 color="red" size={14} className="mr-50" />
            <span className="align-middle">Delete</span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    )
  },
  {
    name: "Process Name",
    minWidth: "40%",
    selector: "name",
    sortable: true,
    cell: ( row ) => row.name
  },
  {
    name: "Process Type",
    minWidth: "30%",
    selector: "processType",
    sortable: true,
    cell: ( row ) => row.processType
  },
  {
    name: "Status",
    width: '100px',
    selector: "status",
    center: true,
    cell: ( row ) => (
      <Badge
        pill
        className="text-capitalize"
        color={`${row.status ? "light-success" : "light-secondary"}`}
      >
        {row.status ? "active" : "inactive"}
      </Badge>
    )
  },

];
