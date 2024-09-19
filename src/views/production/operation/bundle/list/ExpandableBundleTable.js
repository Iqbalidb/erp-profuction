/*
   Title: Expandable Bundle Table
   Description: Expandable Bundle Table
   Author: Alamgir Kabir
   Date: 31-August-2022
   Modified: 31-August-2022
*/
import React, { useState } from 'react';
import { ChevronDown, Menu } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import CustomDataTable from 'utility/custom/production/CustomDataTable';
import BundleAssignToExternalModal from '../details/BundleAssignToExternalModal';
import { fetchProductionSubProcessByCurrentProcessAndStyle, toggleAssignToExternalModalOpen } from '../store/actions';
import { ASSIGN_TO_SELECTED_ROW } from '../store/actionType';

const ExpandableBundleTable = ( { data, lastPageInfo } ) => {
  //#region Hooks
  const dispatch = useDispatch();
  const { selectedProductionProcess, isBundleAssignToExternalModalOpen, styleInfo } = useSelector(
    ( { bundleReducer } ) => bundleReducer
  );
  console.log( styleInfo );
  //#endregion Hooks

  //#region States
  const [selectedRowId, setSelectedRowId] = useState( [] );
  const [clearSelectedRows, setClearSelectedRows] = useState( false );

  //#endregion States
  const styleIds = styleInfo?.styleId;
  //#region Events
  /**
   *Get Production sub process ddl
   * Open Modal
   */
  const onBundleAssignToExternal = selectedRow => {
    if ( selectedRow ) {
      dispatch( fetchProductionSubProcessByCurrentProcessAndStyle( selectedProductionProcess?.id, styleIds, 'partial' ) );
      dispatch( toggleAssignToExternalModalOpen( selectedRow ) );
    }
  };

  /**
   * @param {selected} rows
   */
  const handleRowSelected = rows => {
    const rowsId = rows?.selectedRows?.map( item => item.id );
    dispatch( {
      type: ASSIGN_TO_SELECTED_ROW,
      payload: { rowsId }
    } );
    setSelectedRowId( rowsId );
  };

  //#endregion

  return (
    <div>
      <CustomDataTable
        style={{ padding: '0px 40px 40px 40px', maxHeight: '400px', overflow: 'scroll' }}
        handleContextAction={() => onBundleAssignToExternal( selectedRowId )}
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
            minWidth: '15%',
            selector: 'colorName',
            sortable: true,
            cell: row => row.colorName
          },
          {
            name: 'Size ',
            minWidth: '8%',
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
        clearSelectedRows={clearSelectedRows}
        // data={bundlePartialItemsForPass?.map( item => item?.bundles ).flat()}
        data={data?.bundles.flat()}
        striped
        highlightOnHover
        pointerOnHover
        expandableRows={false}
      />
      {isBundleAssignToExternalModalOpen && <BundleAssignToExternalModal lastPageInfo={lastPageInfo} processInfo={selectedProductionProcess} setSelectedRowId={setSelectedRowId}
        setClearSelectedRows={setClearSelectedRows} />}
    </div>
  );
};

export default ExpandableBundleTable;
