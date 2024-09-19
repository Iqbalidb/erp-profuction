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
import PanelCheckUnCheckedInfo from '../details/PanelCheckUnCheckedInfo';
import PanelCheckUnCheckedRejectInfo from '../details/PanelCheckUnCheckedRejectInfo';
import {
  onUnCheckedDamageChange,
  setUnCheckedBundle,
  setUnCheckedRejectBundle,
  toggleUncheckedModal,
  toggleUncheckedRejectModalOpen
} from '../store/actions';
const ExpandableUnCheckTable = ( { data, lastPageInfo, nestedDataLoading } ) => {
  //#region Hooks
  const dispatch = useDispatch();
  const { showBackdrop, isUnCheckedRejectModalOpen, isUnCheckedModalOpen } = useSelector(
    ( { panelCheckReducer } ) => panelCheckReducer
  );
  //#endregion

  //#region States
  const [selectedRowId, setSelectedRowId] = useState( [] );
  const [damageInfoList, setDamageInfoList] = useState( [] );
  const [clearSelectedRows, setClearSelectedRows] = useState( false );
  //#endregion

  //#region Events
  //For Checked Row
  const handleRowSelected = rows => {
    const rowsId = rows.selectedRows.map( item => item.id );
    setSelectedRowId( rowsId );
  };

  //For UnChecked Reject Modal Open
  const onUnCheckedRejectModalOpen = async row => {
    if ( row ) {
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
    }
  };

  //For UnChecked Modal Open
  const onUnCheckedModalOpen = selectedRowId => {
    if ( selectedRowId ) {
      dispatch( setUnCheckedBundle( selectedRowId ) );
      dispatch( toggleUncheckedModal() );
    }
  };
  //#endregion
  return (
    <div>
      <CustomDataTable
        progressPending={nestedDataLoading}
        subHeader={false}
        style={{ padding: '0px 40px 40px 40px', maxHeight: '400px', overflow: 'scroll' }}
        onSelectedRowsChange={handleRowSelected}
        handleContextAction={() => onUnCheckedModalOpen( selectedRowId )}
        contextActionButton={<Menu size={24} />}
        clearSelectedRows={clearSelectedRows}
        contextActionButtonColor="flat-primary"
        columns={[
          {
            name: 'Bundle No',
            width: '10%',
            selector: 'bundleNumber',
            sortable: true,
            cell: row => row.bundleNumber
          },

          {
            name: 'Parts',
            width: '10%',
            selector: 'productPartsName',
            sortable: true,
            cell: row => row.productPartsName
          },
          {
            name: 'Shade',
            width: '5%',
            selector: 'productPartsShade',
            sortable: true,
            cell: row => row.productPartsShade
          },
          {
            name: 'Color ',
            width: '18%',
            selector: 'colorName',
            sortable: true,
            cell: row => row.colorName
          },
          {
            name: 'Size ',
            width: '10%',
            selector: 'sizeName',
            sortable: true,
            cell: row => row.sizeName
          },

          {
            name: 'Serial Start',
            width: '8%',
            selector: 'serialStart',
            sortable: true,
            cell: row => row.serialStart
          },

          {
            name: 'Serial End',
            width: '8%',
            selector: 'serialEnd',
            sortable: true,
            cell: row => row.serialEnd
          },
          {
            name: 'Quantity',
            width: '8%',
            selector: 'quantity',
            sortable: true,
            cell: row => row.quantity
          },
          {
            name: 'Has Damage',
            width: '10%',
            selector: 'hasReject',
            sortable: true,
            center: true,
            cell: row => (
              <CustomInput
                type="checkbox"
                className="custom-control-primary"
                id={`bundles-${row.id}`}
                checked={row.hasReject}
                inline
                onChange={() => {
                  dispatch( onUnCheckedDamageChange( row, onUnCheckedRejectModalOpen ) );
                }}
              />
            )
          },
          {
            name: 'Damage Info',
            width: '10%',
            selector: 'rejectInfo',
            sortable: true,
            center: true,
            cell: row => (
              <div>
                {row.hasReject ? (
                  <Eye id={`damage${row.id}`} className="cursor-pointer" onClick={() => onUnCheckedRejectModalOpen( row )}>
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
        // data={uncheckedItems?.map( ui => ui?.bundles ).flat()}
        data={data?.bundles.flat()}
        striped
        highlightOnHover
        pointerOnHover
        expandableRows={false}
      />
      {isUnCheckedModalOpen && <PanelCheckUnCheckedInfo lastPageInfo={lastPageInfo} setSelectedRowId={setSelectedRowId} setClearSelectedRows={setClearSelectedRows} />}
      {isUnCheckedRejectModalOpen && <PanelCheckUnCheckedRejectInfo damageInfoList={damageInfoList} />}
      <Backdrop show={showBackdrop} />
    </div>
  );
};

export default ExpandableUnCheckTable;
