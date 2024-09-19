/*
     Title: Relaxation Table Column
     Description: Relaxation Table Column
     Author: Alamgir Kabir
     Date: 15-May-2023
     Modified: 15-May-2023
*/
import { CheckSquare, FileText, MoreVertical, Trash2 } from 'react-feather';
import { Link } from 'react-router-dom';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
export const relaxationTableColumn = [
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
          <Link to={{ pathname: '/relaxation-details', state: row }}>
            <DropdownItem className="w-100">
              <FileText color="green" size={14} className="mr-50" />
              <span color="primary" className="align-middle">
                Details
              </span>
            </DropdownItem>
          </Link>
          <Link to={{ pathname: '/relaxation-complete', state: row }}>
            <DropdownItem className="w-100" onClick={() => { }}>
              <CheckSquare color="green" size={14} className="mr-50" />
              <span className="align-middle">Complete</span>
            </DropdownItem>
          </Link>
          {/* <Link to={{ pathname: '/requisition-receive', state: row }}>
            <DropdownItem className="w-100" onClick={() => {}}>
              <Settings color="green" size={14} className="mr-50" />
              <span className="align-middle">Receive</span>
            </DropdownItem>
          </Link> */}
          <DropdownItem className="w-100" onClick={() => { }}>
            <Trash2 color="red" size={14} className="mr-50" />
            <span className="align-middle">Delete</span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    )
  },
  {
    name: 'Relaxation No',
    minWidth: '10%',
    selector: 'relaxationNo',
    sortable: true,
    cell: row => row.relaxationNo
  },
  {
    name: 'Merchandiser',
    minWidth: '10%',
    selector: 'merchandiserName',
    sortable: true,
    cell: row => row.merchandiserName
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
    name: 'PO No',
    minWidth: '10%',
    selector: 'purchaseOrderNo',
    sortable: true,
    cell: row => row.purchaseOrderNo
  },
  {
    name: 'Length (In Yards)',
    minWidth: '10%',
    selector: 'totalStartLength',
    sortable: true,
    cell: row => row.totalStartLength
  },

  {
    name: 'Width (In Roll)',
    minWidth: '10%',
    selector: 'totalStartWidth',
    sortable: true,
    cell: row => row.totalStartWidth
  },
];
