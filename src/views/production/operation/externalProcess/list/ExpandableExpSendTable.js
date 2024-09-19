import React, { useState } from 'react';
import { ChevronDown, Menu } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import CustomDataTable from 'utility/custom/production/CustomDataTable';
import ExternalProcessSendModal from '../details/ExternalProcessSendModal';
import { toggleExternalProcessSendModal } from '../store/actions';

const ExpandableExpSendTable = ( { data, lastPageInfo } ) => {
  //#region Hooks
  const dispatch = useDispatch();
  const { isOpenExternalProcessSendModal } = useSelector( ( { externalProcessReducer } ) => externalProcessReducer );
  //#endregion

  //#region States
  const [selectedRowId, setSelectedRowId] = useState( [] );
  const [clearSelectedRows, setClearSelectedRows] = useState( false );
  const [selectedReceiveItems, setSelectedReceiveItems] = useState( [] );
  //#endregion

  //#region Events
  /**
   * For Open External Process Modal
   */
  const handleOpenExternalProcessSendModal = () => {
    dispatch( toggleExternalProcessSendModal() );
  };
  /**
   * For Row Selection
   */
  const handleRowSelected = row => {
    const rowsId = row.selectedRows.map( row => row.id );
    setSelectedReceiveItems( rowsId );
  };
  //#endregion
  return (
    <div>
      <CustomDataTable
        style={{ padding: '0px 40px 40px 40px', maxHeight: '400px', overflow: 'scroll' }}
        handleContextAction={handleOpenExternalProcessSendModal}
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
            minWidth: '15%',
            selector: 'productPartsName',
            sortable: true,
            cell: row => row.productPartsName
          },
          {
            name: '  Shade',
            minWidth: '8%',
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
        // selectedRowId={selectedRowId}
        // data={partialBundleInfoForSend?.map( item => item?.bundles ).flat()}
        data={data?.bundles.flat()}
        striped
        highlightOnHover
        pointerOnHover
        selectedRowId={selectedRowId}
        clearSelectedRows={clearSelectedRows}
        expandableRows={false}
      />
      {isOpenExternalProcessSendModal && (
        <ExternalProcessSendModal
          selectedReceiveItems={selectedReceiveItems}
          setSelectedRowId={setSelectedRowId}
          lastPageInfo={lastPageInfo}
          setClearSelectedRows={setClearSelectedRows}
        />
      )}
    </div>
  );
};

export default ExpandableExpSendTable;
