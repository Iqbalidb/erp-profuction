/*
     Title: Operator Group Table Column
     Description: Operator Group Table Column
     Author: Alamgir Kabir
     Date: 15-December-2022
     Modified: 15-December-2022
*/
import { Badge } from 'reactstrap';
import { formattedDate } from 'utility/dateHelpers';
export const operatorGroupInActiveTableColumn = [
  {
    name: 'Name',
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
    name: 'In-Active Date',
    selector: 'deactivatedAt',
    sortable: true,
    cell: row => formattedDate( row.deactivatedAt )
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
    width: '10px'
  }
];
