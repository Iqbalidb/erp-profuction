import axios from 'axios';
import React, { useState } from 'react';
import { ChevronDown, Eye, Menu } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { CustomInput } from 'reactstrap';
import { baseAxios } from 'services';
import { DAMAGE_INFO_API } from 'services/api-end-points/production/v1/damageInfo';
import { notify } from 'utility/custom/notifications';
import Backdrop from 'utility/custom/production/Backdrop';
import CustomDataTable from 'utility/custom/production/CustomDataTable';
import { fetchProductionSubProcessByCurrentProcessAndStyle } from '../../bundle/store/actions';
import PanelCheckUnCheckedRejectInfo from '../../panelCheck/details/PanelCheckUnCheckedRejectInfo';
import { onUnCheckedDamageChange, setUnCheckedRejectBundle, toggleUncheckedRejectModalOpen } from '../../panelCheck/store/actions';
import ExternalProcessPassedModal from '../details/ExternalProcessPassedModal';
import { toggleExternalProcessPassedModal } from '../store/actions';
const ExpandableExpReceivedTable = ( { data, lastPageInfo } ) => {
  //#region Hooks
  const dispatch = useDispatch();
  const {
    externalProcessReducer: { selectedProductionSubProcess, isOpenExternalProcessPassedModal },
    bundleReducer: { styleInfo },
    panelCheckReducer: { isUnCheckedRejectModalOpen, showBackdrop }
  } = useSelector( state => state );
  //#endregion

  //#region States
  const [selectedRowId, setSelectedRowId] = useState( [] );
  const [clearSelectedRows, setClearSelectedRows] = useState( false );
  const [selectedPassedItems, setSelectedPassedItems] = useState( [] );
  const styleIds = styleInfo?.styleId;
  const [damageInfoList, setDamageInfoList] = useState( [] );
  //#endregion

  //#region Events
  const handleOpenExternalProcessPassedModal = () => {
    dispatch( toggleExternalProcessPassedModal() );
  };
  /**
   * @param {selected} rows
   */
  const handleRowSelected = rows => {
    if ( rows ) {
      const rowsId = rows?.selectedRows?.map( item => item.id );
      setSelectedPassedItems( rowsId );
      dispatch( fetchProductionSubProcessByCurrentProcessAndStyle( selectedProductionSubProcess?.id, styleIds, 'partial' ) );
    }
  };

  //For UnChecked Reject Modal Open
  const onUnCheckedRejectModalOpen = async row => {
    const damageSerialRequest = baseAxios.get( DAMAGE_INFO_API.fetch_rejected_serials( row.id ) );
    const damageInfoRequest = baseAxios.get( DAMAGE_INFO_API.fetch_damage_info_by_bundle_id( row.id ) );
    try {
      const [damageSerialResponse, damageInfoResponse] = await axios.all( [damageSerialRequest, damageInfoRequest] );
      setDamageInfoList( damageInfoResponse.data.data );
      const rejectedSerials = damageSerialResponse.data.data;
      const bundles = { ...row, rejectedSerials };
      dispatch( toggleUncheckedRejectModalOpen() );
      dispatch( setUnCheckedRejectBundle( bundles ) );
    } catch ( error ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
  //#endregion
  return (
    <div>
      <CustomDataTable
        style={{ padding: '0px 40px 40px 40px', maxHeight: '400px', overflow: 'scroll' }}
        handleContextAction={() => handleOpenExternalProcessPassedModal()}
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
            width: '5%',
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
            width: '5%',
            selector: 'sizeName',
            sortable: true,
            cell: row => row.sizeName
          },

          {
            name: 'Serial Start',
            minWidth: '5%',
            selector: 'serialStart',
            sortable: true,
            cell: row => row.serialStart
          },

          {
            name: 'Serial End',
            minWidth: '5%',
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
          },
          {
            name: 'Has Damage',
            minWidth: '10%',
            center: true,
            selector: 'hasReject',
            sortable: true,
            cell: row => (
              <CustomInput
                type="checkbox"
                className="custom-control-primary"
                id={`bundles-${row.id}`}
                checked={row.hasReject}
                inline
                onChange={() => {
                  dispatch( onUnCheckedDamageChange( row, onUnCheckedRejectModalOpen, selectedProductionSubProcess ) );
                }}
              />
            )
          },
          {
            name: 'Damage Info',
            minWidth: '10%',
            center: true,
            selector: 'rejectInfo',
            sortable: true,
            cell: row => (
              <div>
                {row.hasReject ? (
                  <Eye id={row.id} className="cursor-pointer" onClick={() => onUnCheckedRejectModalOpen( row )}>
                    {' '}
                  </Eye>
                ) : (
                  <Eye color="#E0E0E0"></Eye>
                )}
              </div>
            )
          }
        ]}
        sortIcon={<ChevronDown />}
        selectedRowId={selectedRowId}
        clearSelectedRows={clearSelectedRows}
        // data={partialBundleInfoForReceived?.map( item => item?.bundles ).flat()}
        data={data?.bundles.flat()}
        striped
        highlightOnHover
        pointerOnHover
        expandableRows={false}
      />
      {isOpenExternalProcessPassedModal && (
        <ExternalProcessPassedModal
          setClearSelectedRows={setClearSelectedRows}
          selectedPassedItems={selectedPassedItems}
          lastPageInfo={lastPageInfo}
          setSelectedRowId={setSelectedRowId}
        />
      )}

      {isUnCheckedRejectModalOpen && <PanelCheckUnCheckedRejectInfo damageInfoList={damageInfoList} />}
      <Backdrop show={showBackdrop} />
    </div>
  );
};

export default ExpandableExpReceivedTable;
