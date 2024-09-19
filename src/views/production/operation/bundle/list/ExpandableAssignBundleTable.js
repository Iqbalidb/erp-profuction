/*
   Title: Expandable Bundle Assign Table
   Description: Expandable Bundle Assign Table
   Author: Alamgir Kabir
   Date: 31-August-2022
   Modified: 31-August-2022
*/
import React from 'react';
import { ChevronDown, Menu } from 'react-feather';
import { useSelector } from 'react-redux';
import CustomDataTable from 'utility/custom/production/CustomDataTable';

export const ExpandableAssignBundleTable = ( { data, } ) => {
  //#region Hooks
  const { bundlePartialItemsForAssigned } = useSelector( ( { bundleReducer } ) => bundleReducer );
  //#endregion Hooks
  return (
    <div>
      <CustomDataTable
        style={{ padding: '0px 40px 40px 40px', maxHeight: '400px', overflow: 'scroll' }}
        contextActionButton={<Menu size={24} />}
        contextActionButtonColor="flat-primary"
        columns={[

          {
            name: 'Bundle No',
            minWidth: '10%',
            selector: 'bundleNumber',
            sortable: true,
            cell: row => row.bundleNumber
          },

          {
            name: ' Parts',
            minWidth: '10%',
            selector: 'productPartsName',
            sortable: true,
            cell: row => row.productPartsName
          },
          {
            name: '  Shade',
            minWidth: '10%',
            selector: 'productPartsShade',
            sortable: true,
            cell: row => row.productPartsShade
          },
          {
            name: 'Color ',
            minWidth: '20%',
            selector: 'colorName',
            sortable: true,
            cell: row => row.colorName
          },
          {
            name: 'Size ',
            minWidth: '10%',
            selector: 'sizeName',
            sortable: true,
            cell: row => row.sizeName
          },
          {
            name: 'Next Process ',
            minWidth: '10%',
            selector: 'nextProcessName',
            sortable: true,
            cell: row => ( row.nextProcessName ? row.nextProcessName : '-' )
          },
          {
            name: 'Serial Start',
            minWidth: '10%',
            selector: 'serialStart',
            sortable: true,
            cell: row => row.serialStart
          },

          {
            name: 'Serial End',
            minWidth: '10%',
            selector: 'serialEnd',
            sortable: true,
            cell: row => row.serialEnd
          },
          {
            name: 'Quantity',
            minWidth: '10%',
            selector: 'quantity',
            sortable: true,
            cell: row => row.quantity
          }
        ]}
        sortIcon={<ChevronDown />}
        // data={bundlePartialItemsForAssigned?.map( item => item?.bundles ).flat()}
        data={data?.bundles.flat()}
        striped
        highlightOnHover
        pointerOnHover
        expandableRows={false}
        selectableRows={false}
      />
    </div>
  );
};
