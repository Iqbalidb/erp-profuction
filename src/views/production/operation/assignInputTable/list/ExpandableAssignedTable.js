import React, { useState } from 'react';
import { ChevronDown, Menu } from 'react-feather';
import CustomDataTable from 'utility/custom/production/CustomDataTable';

const ExpandableAssignedTable = ( { data } ) => {
  //#region States
  const [selectedRowId, setSelectedRowId] = useState( [] );
  //#endregion

  //#region Events
  /**
   * For Row Selection
   */
  const handleRowSelected = rows => {
    const rowsId = rows?.selectedRows?.map( item => item.id );
    setSelectedRowId( rowsId );
  };

  /**
   * Toggle Expansion
   */
  const onRowExpandToggled = ( boll, row ) => {
    console.log( { boll, row } );
  };
  //#endregion
  return (
    <div>
      <CustomDataTable
        style={{ padding: '0px 40px 40px 40px', maxHeight: '400px', overflow: 'scroll' }}
        // handleContextAction={() => onBundleAssignToExternal(selectedRowId)}
        onRowExpandToggled={onRowExpandToggled}
        onSelectedRowsChange={handleRowSelected}
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
            name: 'Current Process ',
            minWidth: '10%',
            selector: 'currentProcessName',
            sortable: true,
            cell: row => ( row.currentProcessName ? row.currentProcessName : '-' )
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
        selectedRowId={selectedRowId}
        // data={assignInputTableAssignedItems?.map( item => item?.bundles ).flat()}
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

export default ExpandableAssignedTable;
