/**
 * Title: SewingOut Edit Form
 * Description: SewingOut Edit Form
 * Author: Iqbal Hossain
 * Date: 05-January-2022
 * Modified: 05-January-2022
 */

import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import ActionMenu from 'layouts/components/menu/action-menu';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Col, Input, NavItem, NavLink, Row, Table } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { SEWING_OUT_API } from 'services/api-end-points/production/v1/sewingOut';
import { errorResponse } from 'utility/Utils';
import { stringifyConsole } from 'utility/commonHelper';
import FormContentLayout from 'utility/custom/FormContentLayout';
import FormLayout from 'utility/custom/FormLayout';
import { ErpInput } from 'utility/custom/customController/ErpInput';
import { notify } from 'utility/custom/notifications';
import { CustomInputRemarks } from 'utility/custom/production/CustomInputRemarks';
import { formattedDate, serverDate } from 'utility/dateHelpers';
import '../../../../../assets/scss/production/form-page-custom-table.scss';
import '../../../../../assets/scss/production/general.scss';
import { fetchSewingOutByMasterId } from '../store/actions';
const SewingOutEditForm = () => {
  //#region Hooks
  const history = useHistory();
  const location = useLocation();
  const masterId = location.state.id;
  const sewingOutMasterInfo = location.state;
  const dispatch = useDispatch();
  const {
    sewingOutReducer: { sewingOutDetails },
    commonReducers: { iSubmitProgressCM, isDataProgressCM },
  } = useSelector( state => state );
  //#endregion

  //#region State
  const [sewingOutSizeInfo, setSewingOutSizeInfo] = useState( [] );
  const [totalSizeQty, setTotalSizeQty] = useState( 0 );
  const [remarks, setRemarks] = useState( '' );

  //#endregion

  //#region Effects
  useEffect( () => {
    dispatch( fetchSewingOutByMasterId( masterId ) );
    setTotalSizeQty( sewingOutMasterInfo.totalQuantity );
    setRemarks( sewingOutMasterInfo.remark );
  }, [dispatch, masterId, sewingOutMasterInfo.remark, sewingOutMasterInfo.totalQuantity] );

  useEffect( () => {
    if ( sewingOutDetails.length > 0 ) {
      setSewingOutSizeInfo( sewingOutDetails );
    }
  }, [dispatch, sewingOutDetails] );

  //on Change Reject Quantity
  const onSizeQuantityChange = ( e, index ) => {
    const { value } = e.target;
    const _sewingOutSizeInfo = [...sewingOutSizeInfo];
    const selectedItem = _sewingOutSizeInfo[index];
    selectedItem.hourQuantity = +value;
    _sewingOutSizeInfo[index] = selectedItem;
    const totalQty = _sewingOutSizeInfo.reduce( ( acc, curr ) => acc + curr.hourQuantity, 0 );
    setTotalSizeQty( totalQty );
    setSewingOutSizeInfo( _sewingOutSizeInfo );
  };
  //handle Cancel
  const handleCancel = () => {
    history.goBack();
  };
  //For Submission
  const handleSave = async () => {
    const payload = {
      date: serverDate( sewingOutMasterInfo.date ),
      time: sewingOutMasterInfo?.time,
      styleId: sewingOutMasterInfo?.styleId,
      styleNo: sewingOutMasterInfo?.styleNo,
      styleCategoryId: sewingOutMasterInfo?.styleCategoryId,
      styleCategory: sewingOutMasterInfo?.styleCategory,
      buyerId: sewingOutMasterInfo?.buyerId,
      buyerName: sewingOutMasterInfo?.buyerName,
      colorId: sewingOutMasterInfo?.colorId,
      colorName: sewingOutMasterInfo?.colorName,

      floorId: sewingOutMasterInfo?.floorId,
      floorName: sewingOutMasterInfo?.floorName,
      lineId: sewingOutMasterInfo?.lineId,
      lineName: sewingOutMasterInfo?.lineName,
      zoneId: sewingOutMasterInfo?.zoneId,
      zoneName: sewingOutMasterInfo?.zoneName,
      ownerEmpCode: sewingOutMasterInfo?.ownerEmpCode,
      ownerName: sewingOutMasterInfo?.ownerName,
      machineCount: sewingOutMasterInfo?.machineCount,
      targetValue: sewingOutMasterInfo?.targetValue,
      totalQuantity: totalSizeQty,
      remark: remarks,
      list: sewingOutSizeInfo?.map( so => ( {
        id: so.id,
        sewingOutMasterId: masterId,
        sizeId: so.sizeId,
        sizeName: so.sizeName,
        hourQuantity: so.hourQuantity
      } ) )
    };
    stringifyConsole( payload );

    if ( payload.buyerId && payload.styleId && payload.date && payload.time && payload.colorId && payload.totalQuantity > 0 ) {
      dispatch( dataSubmitProgressCM( true ) );

      try {
        const res = await baseAxios.put( SEWING_OUT_API.update, payload, { params: { id: masterId } } );

        notify( 'success', 'Sewing out item has been updated' );
        dispatch( dataSubmitProgressCM( false ) );

        handleCancel();

      } catch ( error ) {
        errorResponse( error );
        dispatch( dataSubmitProgressCM( false ) );
      }
    } else {
      notify( 'warning', 'Please all information!!!' );
    }
  };
  //#endregion

  //#region Breadcrumb
  const breadcrumb = [
    {
      id: 'home',
      name: 'Home',
      link: "/",
      isActive: false,
      hidden: false
    },

    {
      id: 'sewing-out',
      name: 'Sewing Out ',
      link: "/sewing-out",
      isActive: false,
      hidden: false
    },

    {
      id: 'sewing-out-edit',
      name: 'Sewing Out Edit ',
      link: "/sewing-out-edit",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion
  return (
    <>
      <UILoader
        blocking={iSubmitProgressCM || isDataProgressCM}
        loader={<ComponentSpinner />}>

        <ActionMenu breadcrumb={breadcrumb} title="Sewing Out Edit">
          <NavItem className="mr-1">
            <NavLink tag={Button} size="sm" color="primary" type="submit" onClick={handleSave}>
              Save
            </NavLink>
          </NavItem>
          <NavItem className="mr-1">
            <NavLink tag={Button} size="sm" color="secondary" onClick={handleCancel}>
              Cancel
            </NavLink>
          </NavItem>
        </ActionMenu>
        <div className='general-form-container'>
          <FormLayout isNeedTopMargin={true}>
            <Row >
              <Col lg='12' >
                <FormContentLayout title="Master Information">
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Floor"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={sewingOutMasterInfo?.floorName}
                    />
                    <ErpInput
                      classNames='mt-1'
                      label="Sewing Out Date"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={formattedDate( sewingOutMasterInfo?.date )}
                    />
                    <ErpInput
                      classNames='mt-1'
                      label="Style"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={sewingOutMasterInfo?.styleNo} />

                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Line"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={sewingOutMasterInfo?.lineName}
                    />
                    <ErpInput
                      classNames='mt-1'
                      label="Time"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={sewingOutMasterInfo?.time}
                    />
                    <ErpInput
                      classNames='mt-1'
                      label="Style Category"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={sewingOutMasterInfo?.styleCategory}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Zone Owner"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={sewingOutMasterInfo?.ownerName}
                    />
                    <ErpInput
                      classNames='mt-1'
                      label="Buyer"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={sewingOutMasterInfo?.buyerName}
                    />
                    <ErpInput
                      classNames='mt-1'
                      label="Color"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={sewingOutMasterInfo?.colorName}
                    />
                  </Col>
                </FormContentLayout>
              </Col>
            </Row>
            <div className='p-1'>
              <FormContentLayout title="Details">
                <div className='p-1'>
                  <Table bordered responsive className='table-container'>
                    <thead >
                      <tr className="text-center">
                        <th className="text-nowrap md-width"> SL</th>
                        <th className="text-nowrap"> Size</th>
                        <th className="text-nowrap"> Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sewingOutSizeInfo?.map( ( pt, index ) => (
                        <Fragment key={pt.sizeId}>
                          <tr className="text-center">
                            <td className='md-width'>{index + 1}</td>
                            <td className='td-width'>
                              <Input id="criticalProcessName" bsSize="sm" className="w-100 text-center" type="text" defaultValue={pt.sizeName} disabled />
                            </td>
                            <td>
                              <Input
                                id="rejectQty"
                                className="w-100 text-center"
                                type="number"
                                bsSize="sm"
                                value={pt.hourQuantity}
                                onSelect={e => e.target.select()}
                                onChange={e => onSizeQuantityChange( e, index )}
                              />
                            </td>
                          </tr>
                        </Fragment>
                      ) )}
                    </tbody>
                    {
                      sewingOutSizeInfo.length > 0 &&
                      (
                        <tbody >
                          <tr>
                            <td colSpan={2} className="text-right td-width">Total</td>
                            <td className="text-center ">{totalSizeQty}</td>
                          </tr>
                        </tbody>
                      )
                    }
                  </Table>
                  <div className='mt-2'>
                    <CustomInputRemarks label="Remaks" name="remarks" value={remarks} onChange={e => setRemarks( e.target.value )} />
                  </div>
                </div>
              </FormContentLayout>
            </div>
          </FormLayout>
        </div>

      </UILoader>

    </>
  );
};

export default SewingOutEditForm;
