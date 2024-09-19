import React, { useState } from 'react';
import { ChevronDown, Menu } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import CustomDataTable from 'utility/custom/production/CustomDataTable';
import AssignInputTableInfo from '../details/AssignInputTableInfo';
import { assignInputTablePendingModalOpen, selectedBundleRow } from '../store/actions';

const ExpandablePendingAssignInputTable = ( { data, lastPageInfo } ) => {
  //#region Hooks
  const dispatch = useDispatch();
  const { isOpenAssignInputPendingModal } = useSelector( ( { assignInputTableReducer } ) => assignInputTableReducer );
  //#endregion

  //#region States
  const [selectedRowId, setSelectedRowId] = useState( [] );

  //#region Events
  /**
   * For Row Selection
   */
  const handleRowSelected = rows => {
    // const rowsId = rows?.selectedRows?.map(item => item.id);
    setSelectedRowId( rows );
  };

  /**
   * For Submit Modal
   */
  const onAssignInputPendingModalOpen = () => {
    dispatch( assignInputTablePendingModalOpen() );
    dispatch( selectedBundleRow( selectedRowId ) );
  };
  //#endregion
  return (

    <div>
      <CustomDataTable
        style={{ padding: '0px 40px 40px 40px', maxHeight: '400px', overflow: 'scroll' }}
        handleContextAction={onAssignInputPendingModalOpen}
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
            minWidth: '5%',
            selector: 'productPartsShade',
            sortable: true,
            cell: row => row.productPartsShade
          },
          {
            name: 'Color ',
            minWidth: '15%',
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
            name: 'S. Start',
            minWidth: '10%',
            selector: 'serialStart',
            sortable: true,
            cell: row => row.serialStart
          },

          {
            name: 'S. End',
            minWidth: '10%',
            selector: 'serialEnd',
            sortable: true,
            cell: row => row.serialEnd
          },
          {
            name: 'Quantity',
            minWidth: '5%',
            selector: 'quantity',
            sortable: true,
            cell: row => row.quantity
          }
        ]}
        sortIcon={<ChevronDown />}
        selectedRowId={selectedRowId}
        // data={assignInputTablePendingItems?.map( item => item?.bundles ).flat()}
        data={data?.bundles.flat()}
        striped
        highlightOnHover
        pointerOnHover
        expandableRows={false}
      />
      {isOpenAssignInputPendingModal && <AssignInputTableInfo lastPageInfo={lastPageInfo} />}
    </div>

  );
};

export default ExpandablePendingAssignInputTable;
