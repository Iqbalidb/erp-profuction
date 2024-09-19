/*
     Title: Operator Group Table Column
     Description: Operator Group Table Column
     Author: Alamgir Kabir
     Date: 15-December-2022
     Modified: 15-December-2022
*/
import { CheckSquare, Trash2 } from 'react-feather';
import { Badge, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { store } from 'redux/storeConfig/store';
import { formattedDate } from 'utility/dateHelpers';
import { editActiveOperatorGroup } from '../store/actions';
export const operatorGroupTableColumn = [
  {
    name: 'Action',
    width: '15%',
    center: true,
    cell: row => (
      <UncontrolledDropdown>
        <DropdownToggle tag="div" className="btn btn-sm" id="btnDisable" onClick={() => store.dispatch( editActiveOperatorGroup( row ) )}>
          {row?.status ? (
            <Trash2 className="text-danger cursor-pointer" size={20} color="red" id="btnDisable" />
          ) : (
            <CheckSquare className="text-danger cursor-pointer" size={20} color="green" id="btnDisable" />
          )}
        </DropdownToggle>
      </UncontrolledDropdown>
    )
  },
  {
    name: 'Name5555',
    selector: 'operatorName',
    sortable: true,
    cell: row => row.operatorName
  },
  {
    name: 'Process',
    selector: 'productionProcessName',
    sortable: true,
    cell: row => row.productionProcessName
  },
  {
    name: 'Active Date',
    selector: 'activatedAt',
    sortable: true,
    cell: row => formattedDate( row.activatedAt )
  },

  {
    name: 'Status',
    selector: 'status',
    // sortable: true,
    cell: row => (
      <Badge pill className="text-capitalize" color={`${row.status ? 'light-success' : 'light-secondary'}`}>
        {row.status ? 'active' : 'inactive'}
      </Badge>
    ),
    width: '10px',
  },

];
