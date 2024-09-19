import React, { useState } from 'react';
import { ChevronDown, Menu } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import CustomDataTable from 'utility/custom/production/CustomDataTable';
import ExternalProcessPendingModal from '../details/ExternalProcessPendingModal';
import { toggleExternalProcessPendingModal } from '../store/actions';

const ExpandableExpPendingTable = ( { data, lastPageInfo } ) => {
  //#region Hooks
  const dispatch = useDispatch();
  const { isOpenExternalProcessPendingModal, } = useSelector( ( { externalProcessReducer } ) => externalProcessReducer );
  //#endregion


  //#region States
  const [selectedRowId, setSelectedRowId] = useState( [] );
  const [clearSelectedRows, setClearSelectedRows] = useState( false );
  const [selectedSendItems, setSelectedSendItems] = useState( [] );
  //#endregion

  //#region Events
  const handleRowSelected = row => {
    const rowsId = row.selectedRows.map( row => row.id );
    setSelectedSendItems( rowsId );
  };
  // Function for modal open (Bundle Assigned Sewing)
  const handleOpenModalBundleAssigned = () => {
    dispatch( toggleExternalProcessPendingModal() );
  };

  //#endregion
  return (
    <div>
      <CustomDataTable
        style={{ padding: '0px 40px 40px 40px', maxHeight: '400px', overflow: 'scroll' }}
        handleContextAction={() => handleOpenModalBundleAssigned()}
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
            minWidth: '5%',
            selector: 'quantity',
            sortable: true,
            cell: row => row.quantity
          }
        ]}
        sortIcon={<ChevronDown />}
        selectedRowId={selectedRowId}
        clearSelectedRows={clearSelectedRows}
        // data={partialBundleInfoForPending?.map( item => item?.bundles ).flat()}
        data={data?.bundles.flat()}
        striped
        highlightOnHover
        pointerOnHover
        expandableRows={false}
      />
      {isOpenExternalProcessPendingModal && (
        <ExternalProcessPendingModal
          selectedSendItems={selectedSendItems}
          lastPageInfo={lastPageInfo}
          setSelectedRowId={setSelectedRowId}
          setClearSelectedRows={setClearSelectedRows}
        />
      )}
    </div>
  );
};

export default ExpandableExpPendingTable;
