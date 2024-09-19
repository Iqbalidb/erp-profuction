/*
     Title: Requisition Receive Table Column
     Description:Requisition Receive Table Column
     Author: Alamgir Kabir
     Date: 10-May-2023
     Modified: 10-May-2023
*/

import { FileText, MoreVertical } from 'react-feather';
import { Link } from 'react-router-dom';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { formattedDate } from 'utility/dateHelpers';
export const requisitionreceiveTableColumn = [
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
              <FileText color="skyBlue" size={14} className="mr-50" />
              <span color="primary" className="align-middle">
                Details
              </span>
            </DropdownItem>
          </Link>
        </DropdownMenu>
      </UncontrolledDropdown>
    )
  },
  {
    name: ' Date',
    width: '10%',
    selector: 'receiveDate',
    sortable: true,
    cell: row => formattedDate( row.receiveDate )
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
    width: '15%',
    selector: 'styleNo',
    sortable: true,
    cell: row => row.styleNo
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
  {
    name: 'Rec. Qty (In Yards)',
    width: '10%',
    selector: 'totalReceiveYard',
    sortable: true,
    cell: row => row.totalReceiveYard
  },
  {
    name: 'Rec. Qty (In Roll)',
    width: '10%',
    selector: 'totalReceiveRoll',
    sortable: true,
    cell: row => row.totalReceiveRoll
  },

];
