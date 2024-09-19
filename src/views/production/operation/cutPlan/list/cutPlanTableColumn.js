/*
     Title: Cut Plan Table Column
     startDate: Cut Plan Table Column
     Author: Iqbal Hossain
     Date: 18-January-2022
     Modified: 18-January-2022
*/

import { Edit, FileText, MoreVertical, Trash2 } from 'react-feather';
import { Link } from 'react-router-dom';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { store } from 'redux/storeConfig/store';
import { formattedDate } from 'utility/dateHelpers';
import { deleteCutPlan, toggleCutPlanConfirmModal } from '../store/actions';

export const cutPlanTableColumn = [
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
          <Link to={{ pathname: '/cut-plan-details', state: row }}>
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
          <DropdownItem
            className="w-100"
            onClick={() => {
              store.dispatch( deleteCutPlan( row.id ) );
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
    name: 'Cut Plan No',
    minWidth: '15%',
    selector: 'cutPlanNo',
    sortable: true,
    cell: row => row.cutPlanNo
  },
  {
    name: 'Start Date',
    minWidth: '10%',
    selector: 'startDate',
    sortable: true,
    cell: row => formattedDate( row.startDate )
  },
  {
    name: 'Buyer',
    minWidth: '10%',
    selector: 'buyerName',
    sortable: true,
    cell: row => row.buyerName
  },
  {
    name: 'Style',
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
    name: 'Total Lay',
    minWidth: '10%',
    selector: 'totalLay',
    sortable: true,
    cell: row => row.totalLay
  },
  {
    name: 'Total Quantity',
    minWidth: '10%',
    selector: 'totalQuantity',
    sortable: true,
    cell: row => row.totalQuantity
  },
  {
    name: 'Status',
    width: '100px',
    selector: 'status',
    center: true,
    cell: row => (
      <Badge className="text-capitalize" color={`${row.status ? 'light-success' : 'light-secondary'}`} pill>
        {row.status ? 'active' : 'inactive'}
      </Badge>
    )
  },

];

export const cutPlanDetailsTablecolumn = [
  {
    name: 'Cut Number',
    minWidth: '170px',
    selector: 'cutNumber',
    sortable: true,
    cell: row => row.cutNumber
  },
  {
    name: 'P.O.',
    minWidth: '150px',
    selector: 'po',
    sortable: true,
    cell: row => row.po
  },
  {
    name: 'Color',
    minWidth: '150px',
    selector: 'color',
    sortable: true,
    cell: row => row.color
  },
  {
    name: 'Width',
    minWidth: '150px',
    selector: 'width',
    sortable: true,
    cell: row => row.width
  },
  {
    name: 'Length',
    minWidth: '150px',
    selector: 'length',
    sortable: true,
    cell: row => row.length
  },
  {
    name: 'Lay',
    minWidth: '150px',
    selector: 'lay',
    sortable: true,
    cell: row => row.lay
  },
  {
    name: 'Quantity',
    minWidth: '150px',
    selector: 'quantity',
    sortable: true,
    cell: row => row.quantity
  },
  {
    name: 'Actions',
    maxWidth: '100px',
    cell: row => (
      <Badge id={row.id} className="cursor-pointer text-white" color="primary" onClick={() => store.dispatch( toggleCutPlanConfirmModal() )}>
        Confirm
      </Badge>
    )
  }
];

export const cutPlanPoDetailsTablecolumn = [
  {
    name: 'PO No',
    minWidth: '170px',
    selector: 'poNo',
    sortable: true,
    cell: row => row.poNo
  },
  {
    name: 'Destination',
    minWidth: '150px',
    selector: 'destination',
    sortable: true,
    cell: row => row.destination
  },
  {
    name: 'Shipment Date',
    minWidth: '150px',
    selector: 'shipmentDate',
    sortable: true,
    cell: row => row.shipmentDate
  },
  {
    name: 'Shipment Mode',
    minWidth: '150px',
    selector: 'shipmentMode',
    sortable: true,
    cell: row => row.shipmentMode
  },
  {
    name: 'Inspection Date',
    minWidth: '150px',
    selector: 'inspectionDate',
    sortable: true,
    cell: row => row.inspectionDate
  },
  {
    name: 'Order Qty',
    minWidth: '150px',
    selector: 'orderQty',
    sortable: true,
    cell: row => row.orderQty
  },
  {
    name: 'Order UOM',
    minWidth: '150px',
    selector: 'orderUOM',
    sortable: true,
    cell: row => row.orderUOM
  },
  {
    name: 'Excess',
    minWidth: '150px',
    selector: 'excess',
    sortable: true,
    cell: row => row.excess
  },
  {
    name: 'Wastage',
    minWidth: '150px',
    selector: 'wastage',
    sortable: true,
    cell: row => row.wastage
  }
];

export const cutPlanPoDetailsClupsTablecolumn = [
  {
    name: 'Colors',
    minWidth: '170px',
    selector: 'colors',
    sortable: true,
    cell: row => row.colors
  },
  {
    name: 'Order Quantity',
    minWidth: '150px',
    selector: 'orderQuantity',
    sortable: true,
    cell: row => row.orderQuantity
  },
  {
    name: 'Extra %',
    minWidth: '150px',
    selector: 'extra',
    sortable: true,
    cell: row => row.extra
  },
  {
    name: 'With Extra',
    minWidth: '150px',
    selector: 'withExtra',
    sortable: true,
    cell: row => row.withExtra
  },
  {
    name: 'Previous Qty',
    minWidth: '150px',
    selector: 'previousQty',
    sortable: true,
    cell: row => row.previousQty
  },
  {
    name: 'Lay Count',
    minWidth: '150px',
    selector: 'layCount',
    sortable: true,
    cell: row => row.layCount
  },
  {
    name: 'Total Qty',
    minWidth: '150px',
    selector: 'totalQty',
    sortable: true,
    cell: row => row.totalQty
  },
  {
    name: 'RC',
    minWidth: '150px',
    selector: 'rc',
    sortable: true,
    cell: row => row.rc
  },
  {
    name: 'Blance',
    minWidth: '150px',
    selector: 'blance',
    sortable: true,
    cell: row => row.blance
  }
];
