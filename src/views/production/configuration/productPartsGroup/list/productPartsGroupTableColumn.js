/*
     Title: Production Parts Group Table Column
     Description: Production Parts Group Table Column
     Author: Alamgir Kabir
     Date: 14-May-2022
     Modified: 14-May-2022
*/

import React from 'react';
import { Edit, FileText, MoreVertical, Trash2 } from 'react-feather';
import { Link } from 'react-router-dom';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';

export const productPartsGroupTableColumn = [
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
          <Link to={{ pathname: '/product-parts-group-details', state: row.id }}>
            <DropdownItem className="w-100">
              <FileText color="skyBlue" size={14} className="mr-50" />
              <span color="primary" className="align-middle">
                Details
              </span>
            </DropdownItem>
          </Link>
          <Link to={{ pathname: '/product-parts-group-edit', state: row.id }}>
            <DropdownItem className="w-100">
              <Edit color="green" size={14} className="mr-50" />
              <span className="align-middle">Edit</span>
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
    name: 'Style No',
    minWidth: '45%',
    selector: 'styleNo',
    sortable: true,
    cell: row => row.styleNo
  },
  {
    name: 'Color Status',
    minWidth: '45%',
    selector: 'colorStatus',
    sortable: true,
    cell: row => row.colorStatus
  },

];
