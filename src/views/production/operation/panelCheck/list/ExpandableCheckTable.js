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
import PanelCheckRejectInfo from '../details/PanelCheckRejectInfo';
import { checkedItemsDamaggeChange, setCheckedBundle, setUnCheckedBundle, toggleRejectModal, toggleUncheckedModal } from '../store/actions';

const ExpandableCheckTable = ( { data, nestedDataLoading } ) => {

  //#region Hooks
  const dispatch = useDispatch();
  const { showBackdrop, isRejectModalOpen } = useSelector( ( { panelCheckReducer } ) => panelCheckReducer );
  //#endregion

  //#region States
  const [selectedRowId, setSelectedRowId] = useState( [] );
  const [rejectInfoList, setRejectInfoList] = useState( [] );
  //#endregion

  //#region Events
  //For Checked Row
  const handleRowSelected = rows => {
    const rowsId = rows.selectedRows.map( item => item.id );
    setSelectedRowId( rowsId );
  };

  //Open UnChecked Modal
  const onUnCheckedModalOpen = async () => {
    if ( selectedRowId ) {
      dispatch( setUnCheckedBundle( selectedRowId ) );
      dispatch( toggleUncheckedModal() );
    }
  };

  //Open Reject Modal
  const onRejectModalOpen = async row => {
    const rejectSerialRequest = baseAxios.get( DAMAGE_INFO_API.fetch_rejected_serials( row.id ) );
    const rejectInfoRequest = baseAxios.get( DAMAGE_INFO_API.fetch_damage_info_by_bundle_id( row.id ) );
    try {
      const [rejectSerialResponse, rejectInfoResponse] = await axios.all( [rejectSerialRequest, rejectInfoRequest] );
      setRejectInfoList( rejectInfoResponse.data.data );
      const rejectedSerials = rejectSerialResponse.data.data;
      const bundles = { ...row, rejectedSerials };
      dispatch( toggleRejectModal() );
      dispatch( setCheckedBundle( bundles ) );
    } catch ( error ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };

  //#endregion
  return (
    <div>
      <CustomDataTable
        progressPending={nestedDataLoading}
        style={{ padding: '0px 40px 40px 40px', maxHeight: '400px', overflow: 'scroll' }}
        onSelectedRowsChange={handleRowSelected}
        handleContextAction={() => onUnCheckedModalOpen( selectedRowId )}
        contextActionButton={<Menu size={24} />}
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
            width: '10%',
            selector: 'productPartsShade',
            sortable: true,
            cell: row => row.productPartsShade
          },
          {
            name: 'Color ',
            width: '15%',
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
            width: '10%',
            selector: 'serialStart',
            sortable: true,
            cell: row => row.serialStart
          },

          {
            name: 'Serial End',
            width: '10%',
            selector: 'serialEnd',
            sortable: true,
            cell: row => row.serialEnd
          },
          {
            name: 'Quantity',
            width: '5%',
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
                id={`bundle-${row.id}`}
                checked={row.hasReject}
                inline
                onChange={() => {
                  dispatch( checkedItemsDamaggeChange( row, onRejectModalOpen ) );
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
                  <Eye id={`damagebundle-${row.id}`} className="cursor-pointer" onClick={() => onRejectModalOpen( row )}></Eye>
                ) : (
                  <Eye color="#E0E0E0"></Eye>
                )}
              </div>
            )
          }
        ]}
        sortIcon={<ChevronDown />}
        selectedRowId={selectedRowId}
        // data={checkedItems?.map( ui => ui?.bundles ).flat()}
        data={data?.bundles.flat()}
        striped
        highlightOnHover
        pointerOnHover
        expandableRows={false}
        selectableRows={false}
      />
      {isRejectModalOpen && <PanelCheckRejectInfo rejectInfoList={rejectInfoList} />}
      <Backdrop show={showBackdrop} />
    </div>
  );
};

export default ExpandableCheckTable;
