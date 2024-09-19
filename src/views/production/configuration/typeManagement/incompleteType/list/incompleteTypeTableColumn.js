/*
   Title: RejectType Table Column
   productionProcess: RejectType Table Column
   Author: Iqbal Hossain
   Date: 11-January-2022
   Modified: 11-January-2022
*/

import React from 'react';
import { Edit, FileText, MoreVertical, Trash2 } from 'react-feather';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { store } from 'redux/storeConfig/store';
import { deleteIncompleteType, fetchIncompleteTypeById, toggleIncompleteTypeSidebar } from '../store/actions';

const statusObj = {
  active: 'light-success',
  inactive: 'light-secondary'
};

export const incompleteTypeTableColumn = [
  {
    name: 'Incomplete Type Name',
    minWidth: '170px',
    selector: 'incompleteTypeName',
    sortable: true,
    cell: row => row.incompleteTypeName
  },
  {
    name: 'Production Process',
    minWidth: '150px',
    selector: 'productionProcess',
    sortable: true,
    cell: row => row.productionProcess
  },
  {
    name: 'Status',
    maxWidth: '120px',
    selector: 'status',
    sortable: true,
    cell: row => (
      <Badge className="text-capitalize" color={statusObj[row.status]} pill>
        {row.status}
      </Badge>
    )
  },
  {
    name: 'Actions',
    maxWidth: '100px',
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
          <DropdownItem
            className="w-100"
            onClick={() => {
              store.dispatch( fetchIncompleteTypeById( row.id ) );
              store.dispatch( toggleIncompleteTypeSidebar( true ) );
            }}
          >
            <Edit color="green" size={14} className="mr-50" />
            <span className="align-middle">Edit</span>
          </DropdownItem>
          <DropdownItem
            className="w-100"
            onClick={() => {
              store.dispatch( deleteIncompleteType( row.id ) );
            }}
          >
            <Trash2 color="red" size={14} className="mr-50" />
            <span className="align-middle">Delete</span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    )
  }
];
