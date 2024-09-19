/*
     Title: Requisition Table Column
     Description: Requisition Table Column
     Author: Alamgir Kabir
     Date: 04-May-2023
     Modified: 04-May-2023
*/
import { Edit, FileText, MoreVertical, Settings, Trash2 } from 'react-feather';
import { Link } from 'react-router-dom';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { formattedDate } from 'utility/dateHelpers';
export const requisitionTableColumn = [
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
          <Link to={{ pathname: '/requisition-details', state: row }}>
            <DropdownItem className="w-100">
              <FileText color="green" size={14} className="mr-50" />
              <span color="primary" className="align-middle">
                Details
              </span>
            </DropdownItem>
          </Link>
          <Link to={{ pathname: '/requisition-edit', state: row }}>
            <DropdownItem className="w-100" onClick={() => { }}>
              <Edit color="green" size={14} className="mr-50" />
              <span className="align-middle">Edit</span>
            </DropdownItem>
          </Link>
          <Link to={{ pathname: '/requisition-receive', state: row }}>
            <DropdownItem className="w-100" onClick={() => { }}>
              <Settings color="green" size={14} className="mr-50" />
              <span className="align-middle">Receive</span>
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
    name: ' Date',
    width: '10%',
    selector: 'requisitionDate',
    sortable: true,
    cell: row => formattedDate( row.requisitionDate )
  },
  {
    name: 'Requisition No',
    width: '10%',
    selector: 'requisitionNo',
    sortable: true,
    cell: row => row.requisitionNo
  },
  {
    name: 'Merchandiser',
    width: '10%',
    selector: 'merchandiserName',
    sortable: true,
    cell: row => row.merchandiserName
  },
  {
    name: 'Buyer',
    width: '10%',
    selector: 'buyerName',
    sortable: true,
    cell: row => row.buyerName
  },

  {
    name: 'Style No',
    width: '10%',
    selector: 'styleNo',
    sortable: true,
    cell: row => row.styleNo
  },
  {
    name: 'Style Category',
    width: '10%',
    selector: 'styleCategory',
    sortable: true,
    cell: row => row.styleCategory
  },

  {
    name: 'PO No',
    width: '15%',
    selector: 'purchaseOrderNo',
    sortable: true,
    cell: row => row.purchaseOrderNo
  },
  {
    name: 'Req. Qty (In Yards)',
    width: '10%',
    selector: 'totalQuantityYard',
    sortable: true,
    cell: row => row.totalQuantityYard
  },

  {
    name: 'Req. Qty (In Roll)',
    width: '10%',
    selector: 'totalQuantityRoll',
    sortable: true,
    cell: row => row.totalQuantityRoll
  },

];
