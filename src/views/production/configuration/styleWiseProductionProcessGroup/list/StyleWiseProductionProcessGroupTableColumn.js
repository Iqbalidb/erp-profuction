/*
     Title: Style Wise Production Process Group Column
     Description: Style Wise Production Process Group Column
     Author: Alamgir Kabir
     Date: 31-July-2022
     Modified: 31-July-2022
*/
import React from 'react';
import { Edit, FileText, MoreVertical, Trash2 } from 'react-feather';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { store } from 'redux/storeConfig/store';
import { fetchStyleWiseProductionProcessGroupById } from '../store/actions';
export const styleWiseProductionProcessGroupColumn = [
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
          <DropdownItem className="w-100" onClick={() => store.dispatch( fetchStyleWiseProductionProcessGroupById( row.id ) )}>
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
    minWidth: '45%',
    selector: 'styleNo',
    sortable: true,
    cell: row => row.styleNo
  },
  {
    name: 'Production Process Group',
    minWidth: '45%',
    selector: 'productionProcessGroupName',
    sortable: true,
    cell: row => row.productionProcessGroupName
  },

];
