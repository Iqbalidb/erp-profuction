import { Edit, FileText, MoreVertical, Trash2 } from 'react-feather';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';

export const partsStockTableColumn = [
  {
    name: 'Actions',
    maxWidth: '5%',
    cell: () => (
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
    name: 'Color',
    minWidth: '10%',
    selector: 'colorName',
    sortable: true,
    cell: row => row.colorName
  },
  {
    name: 'Group Name',
    minWidth: '10%',
    selector: 'partGroupName',
    sortable: true,
    cell: row => row.partGroupName
  },
  {
    name: 'Size',
    minWidth: '10%',
    selector: 'sizeName',
    sortable: true,
    cell: row => row.sizeName
  },
  {
    name: 'Product Parts',
    minWidth: '10%',
    selector: 'productPartsName',
    sortable: true,
    cell: row => row.productPartsName
  },
  {
    name: 'Quantity',
    minWidth: '10%',
    selector: 'quantityBalance',
    sortable: true,
    cell: row => row.quantityBalance
  },

];
