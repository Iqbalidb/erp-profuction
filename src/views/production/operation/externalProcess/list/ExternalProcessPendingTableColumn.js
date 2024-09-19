/*
   Title: External Process Pending Table Column
   Description: External Process Pending Table Column
   Author: Alamgir Kabir
   Date: 31-August-2022
   Modified: 31-August-2022
*/
import { Edit, FileText, MoreVertical, Trash2 } from 'react-feather';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { formattedDate } from 'utility/dateHelpers';
export const externalProcessPendingTableColumn = [
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
    name: 'PO No',
    minWidth: '10%',
    selector: 'poNo',
    sortable: true,
    cell: row => row.poNo
  },
  {
    name: 'Destination',
    minWidth: '10%',
    selector: 'destination',
    sortable: true,
    cell: row => row.destination
  },
  {
    name: 'Shipment Mode',
    minWidth: '7%',
    selector: 'shipmentMode',
    sortable: true,
    cell: row => row.shipmentMode
  },
  {
    name: 'Shipment Date',
    minWidth: '10%',
    selector: 'shipmentDate',
    sortable: true,
    cell: row => formattedDate( row.shipmentDate )
  },
  {
    name: 'Cut No',
    minWidth: '10%',
    selector: 'cutNo',
    sortable: true,
    cell: row => row.cutNo
  },

  {
    name: 'Total Quantity',
    minWidth: '10%',
    selector: 'totalQuantity',
    sortable: true,
    cell: row => row.totalQuantity
  },


];
