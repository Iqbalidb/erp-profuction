
/**
 * Title: SewingInspection Edit Form
 * Description: SewingInspection Edit Form
 * Author: Iqbal Hossain
 * Date: 05-January-2022
 * Modified: 05-January-2022
 */

import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import ActionMenu from 'layouts/components/menu/action-menu';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Col, Input, NavItem, NavLink, Row, Table } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { SEWING_INSPECTION_API } from 'services/api-end-points/production/v1';
import { errorResponse } from 'utility/Utils';
import { stringifyConsole } from 'utility/commonHelper';
import FormContentLayout from 'utility/custom/FormContentLayout';
import FormLayout from 'utility/custom/FormLayout';
import { ErpInput } from 'utility/custom/customController/ErpInput';
import { notify } from 'utility/custom/notifications';
import { formattedDate, serverDate } from 'utility/dateHelpers';
import '../../../../../assets/scss/production/form-page-custom-table.scss';
import '../../../../../assets/scss/production/general.scss';
import { fetchSewingInspectionByMasterId, resetSewingInspectionState } from '../store/actions';
const SewingInspectionEditForm = () => {
  //#region Hooks
  const history = useHistory();
  const location = useLocation();
  const masterId = location.state.id;
  const sewingInspectionMasterInfo = location.state;
  const dispatch = useDispatch();
  const {
    sewingInspectionReducer: { sewingInspectionDetails },
    commonReducers: { iSubmitProgressCM, isDataProgressCM },
  } = useSelector( state => state );
  const { errors } = useForm();
  //#endregion

  //#region State
  const [processTypes, setProcessTypes] = useState( [] );
  const [remarks, setRemarks] = useState( '' );
  //#endregion

  //#region Effects

  /**
   * For Time Ddl
   * For Buyer Ddl
   * Get Process type by line id
   */
  useEffect( () => {
    if ( masterId ) {
      dispatch( fetchSewingInspectionByMasterId( masterId ) );
      setRemarks( sewingInspectionMasterInfo?.remark );
    }
  }, [dispatch, masterId] );

  useEffect( () => {
    if ( sewingInspectionDetails.length > 0 ) {
      setProcessTypes( sewingInspectionDetails );
    }
  }, [dispatch, sewingInspectionDetails] );

  //#endregion

  //#region Events

  //on Change Production Per hour
  const onChangeProductionPerHour = ( e, index ) => {
    const { value } = e.target;
    const _processTypes = [...processTypes];
    const selectedProcessType = _processTypes[index];
    selectedProcessType.hourProduction = +value;
    _processTypes[index] = selectedProcessType;
    setProcessTypes( _processTypes );
  };

  //on Change previour Production
  const onPreviourProductionChange = ( e, index ) => {
    const { value } = e.target;
    const _processTypes = [...processTypes];
    const selectedProcessType = _processTypes[index];
    selectedProcessType.previousProduction = +value;
    _processTypes[index] = selectedProcessType;
    setProcessTypes( _processTypes );
  };

  //on Change Inspection/Check Qty
  const onTotalCheckChange = ( e, index ) => {
    const { value } = e.target;
    const _processTypes = [...processTypes];
    const selectedProcessType = _processTypes[index];
    selectedProcessType.inspectionQuantity = +value;
    _processTypes[index] = selectedProcessType;
    setProcessTypes( _processTypes );
  };
  //Sum of Pass,Defect and Reject Quantity
  const sumofPassDefectAndRejectQty = ( passQty, defectQty, rejectQty ) => {
    const passedQuantity = Number( passQty );
    const defectQuantity = Number( defectQty );
    const rejectQuantity = Number( rejectQty );
    const sumQty = passedQuantity + defectQuantity + rejectQuantity;
    return sumQty;
  };
  //on Change Passed Quantity
  const onPassQtyChange = ( e, index ) => {
    const { value } = e.target;
    const _processTypes = [...processTypes];
    const selectedProcessType = _processTypes[index];
    let passQty = ( selectedProcessType.passedQuantity = +value );
    const inspectionQuantity = selectedProcessType.inspectionQuantity;
    const defectQuantity = selectedProcessType.defectQuantity;
    const rejectQuantity = selectedProcessType.rejectQuantity;

    const compareInputValueWithInspectQty = sumofPassDefectAndRejectQty( passQty, defectQuantity, rejectQuantity );

    if ( compareInputValueWithInspectQty > inspectionQuantity ) {
      passQty = 0;
      notify( 'warning', 'limit exceeds!!!' );
    }
    selectedProcessType.passedQuantity = passQty;
    _processTypes[index] = selectedProcessType;
    setProcessTypes( _processTypes );
  };

  //on Change Defect Quantity
  const onDefectQtyChange = ( e, index ) => {
    const { value } = e.target;
    const _processTypes = [...processTypes];
    const selectedProcessType = _processTypes[index];
    let defectQty = ( selectedProcessType.defectQuantity = +value );
    const inspectionQuantity = selectedProcessType.inspectionQuantity;
    const passQuantity = selectedProcessType.passedQuantity;
    const rejectQuantity = selectedProcessType.rejectQuantity;

    const compareInputValueWithInspectQty = sumofPassDefectAndRejectQty( passQuantity, defectQty, rejectQuantity );

    if ( compareInputValueWithInspectQty > inspectionQuantity ) {
      defectQty = 0;
      notify( 'warning', 'limit exceeds!!!' );
    }
    selectedProcessType.defectQuantity = defectQty;
    _processTypes[index] = selectedProcessType;
    setProcessTypes( _processTypes );
  };

  //on Change Reject Quantity
  const onRejectQtyChange = ( e, index ) => {
    const { value } = e.target;
    const _processTypes = [...processTypes];
    const selectedProcessType = _processTypes[index];
    let rejectQuantity = ( selectedProcessType.rejectQuantity = +value );
    const inspectionQuantity = selectedProcessType.inspectionQuantity;
    const passQuantity = selectedProcessType.passedQuantity;
    const defectQuantity = selectedProcessType.defectQuantity;

    const compareInputValueWithInspectQty = sumofPassDefectAndRejectQty( passQuantity, defectQuantity, rejectQuantity );

    if ( compareInputValueWithInspectQty > inspectionQuantity ) {
      rejectQuantity = 0;
      notify( 'warning', 'limit exceeds!!!' );
    }
    selectedProcessType.rejectQuantity = rejectQuantity;
    _processTypes[index] = selectedProcessType;
    setProcessTypes( _processTypes );
  };

  //handle Cancel
  const handleCancel = () => {
    dispatch( resetSewingInspectionState() );
    history.goBack();
  };
  //For Submission
  const handleSave = async () => {
    const payload = {
      date: serverDate( sewingInspectionMasterInfo.date ),
      time: sewingInspectionMasterInfo?.time,
      styleId: sewingInspectionMasterInfo?.styleId,
      styleNo: sewingInspectionMasterInfo?.styleNo,
      styleCategoryId: sewingInspectionMasterInfo?.styleCategoryId,
      styleCategory: sewingInspectionMasterInfo?.styleCategory,
      buyerId: sewingInspectionMasterInfo?.buyerId,
      buyerName: sewingInspectionMasterInfo?.buyerName,
      floorId: sewingInspectionMasterInfo?.floorId,
      floorName: sewingInspectionMasterInfo?.floorName,
      lineId: sewingInspectionMasterInfo?.lineId,
      lineName: sewingInspectionMasterInfo?.lineName,
      zoneId: sewingInspectionMasterInfo?.zoneId,
      zoneName: sewingInspectionMasterInfo?.zoneName,
      ownerEmpCode: sewingInspectionMasterInfo?.ownerEmpCode,
      ownerName: sewingInspectionMasterInfo?.ownerName,
      machineCount: sewingInspectionMasterInfo?.machineCount,
      targetValue: sewingInspectionMasterInfo?.targetValue,
      remark: remarks,
      list: processTypes?.map( pt => ( {
        id: pt.id,
        sewingInspectionMasterId: pt.sewingInspectionMasterId,
        criticalProcessId: pt.criticalProcessId,
        criticalProcessName: pt.criticalProcessName,
        processType: pt.processType,
        hourProduction: pt.hourProduction,
        previousProduction: pt.previousProduction,
        inspectionQuantity: pt.inspectionQuantity,
        passedQuantity: pt.passedQuantity,
        defectQuantity: pt.defectQuantity,
        rejectQuantity: pt.rejectQuantity
      } ) )
    };
    stringifyConsole( payload );
    const isInpectQuantityValid = payload?.list.every( e => e.inspectionQuantity === e.passedQuantity + e.defectQuantity + e.rejectQuantity );

    if ( payload.buyerId && payload.styleId && payload.date && payload.time && isInpectQuantityValid ) {
      dispatch( dataSubmitProgressCM( true ) );

      try {
        const res = await baseAxios.put( SEWING_INSPECTION_API.update, payload, { params: { id: masterId } } );
        notify( 'success', 'Sewing Inspection has been updated successfully' );
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
      id: 'sewing-inspection',
      name: 'Sewing Inspection ',
      link: "/sewing-inspection",
      isActive: false,
      hidden: false
    },
    {
      id: 'sewing-inspection-edit',
      name: 'Edit Sewing Inspection ',
      link: "/sewing-inspection-edit",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion
  return (
    <>


      <ActionMenu breadcrumb={breadcrumb} title="Edit Sewing Inspection ">
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

      <UILoader
        blocking={iSubmitProgressCM || isDataProgressCM}
        loader={<ComponentSpinner />}>
        <div className='general-form-container'>
          <FormLayout isNeedTopMargin={true} >
            <Row >
              <Col lg='12' >
                <FormContentLayout title="Master Information">
                  <Col lg='3' md='6' xl='3'>
                    <ErpInput
                      classNames='mt-1'
                      label="Line"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={sewingInspectionMasterInfo?.lineName}
                    />
                    <ErpInput
                      classNames='mt-1'
                      label="Inspection Date"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={formattedDate( sewingInspectionMasterInfo?.date )}
                    />
                    <ErpInput
                      classNames='mt-1'
                      label="Machine"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={sewingInspectionMasterInfo?.machineCount}
                    />
                  </Col>
                  <Col lg='3' md='6' xl='3'>
                    <ErpInput
                      classNames='mt-1'
                      label="Floor"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={sewingInspectionMasterInfo?.floorName}
                    />
                    <ErpInput
                      classNames='mt-1'
                      label="Time"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={sewingInspectionMasterInfo?.time}
                    />
                    <ErpInput
                      classNames='mt-1'
                      label="Style Category"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={sewingInspectionMasterInfo?.styleCategory}
                    />
                  </Col>
                  <Col lg='3' md='6' xl='3'>
                    <ErpInput
                      classNames='mt-1'
                      label="Zone Owner"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={sewingInspectionMasterInfo?.ownerName}
                    />
                    <ErpInput
                      classNames='mt-1'
                      label="Buyer"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={sewingInspectionMasterInfo?.buyerName}
                    />
                  </Col>
                  <Col lg='3' md='6' xl='3'>
                    <ErpInput
                      classNames='mt-1'
                      label="Target Qty"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={sewingInspectionMasterInfo?.targetValue}
                    />
                    <ErpInput
                      classNames='mt-1'
                      label="Style"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={sewingInspectionMasterInfo?.styleNo}
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
                        <th className="text-nowrap"> Process Name</th>
                        <th className="text-nowrap"> Process Type</th>
                        <th className="text-nowrap">Production/hour</th>
                        <th className="text-nowrap"> Previous Repair</th>
                        <th className="text-nowrap">Inspection</th>
                        <th className="text-nowrap">Passed Quantity</th>
                        <th className="text-nowrap">Defect Quantity</th>
                        <th className="text-nowrap">Reject Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processTypes?.map( ( pt, index ) => (
                        <tr className="text-center" key={pt.id}>
                          <td>
                            <Input bsSize="sm" id="criticalProcessName" className="w-100" type="text" defaultValue={pt.criticalProcessName} disabled />
                          </td>
                          <td>
                            <Input bsSize="sm" id="processType" className="w-100" type="text" defaultValue={pt.processType} disabled />
                          </td>

                          <td className='td-width'>
                            <Input
                              bsSize="sm"
                              id="totalProduction"
                              className="w-100 text-center"
                              type="number"
                              onSelect={e => e.target.select()}
                              value={pt.hourProduction}
                              onChange={e => onChangeProductionPerHour( e, index )}
                            />
                          </td>
                          <td>
                            <Input
                              bsSize="sm"
                              id="repariFromLastHour"
                              className="w-100 text-center"
                              type="number"
                              onSelect={e => e.target.select()}
                              value={pt.previousProduction}
                              onChange={e => onPreviourProductionChange( e, index )}
                            />
                          </td>
                          <td>
                            <Input
                              id="totalCheck"
                              bsSize="sm"
                              className="w-100 text-center"
                              type="number"
                              onSelect={e => e.target.select()}
                              value={pt.inspectionQuantity}
                              onChange={e => onTotalCheckChange( e, index )}
                            />
                          </td>
                          <td>
                            <Input
                              id="passQty"
                              bsSize="sm"
                              className="w-100 text-center"
                              type="number"
                              value={pt.passedQuantity}
                              onSelect={e => e.target.select()}
                              onChange={e => onPassQtyChange( e, index )}
                            />
                          </td>
                          <td>
                            <Input
                              id="defectQty"
                              bsSize="sm"
                              className="w-100 text-center"
                              type="number"
                              value={pt.defectQuantity}
                              onSelect={e => e.target.select()}
                              onChange={e => onDefectQtyChange( e, index )}
                            />
                          </td>
                          <td className='td-width'>
                            <Input
                              id="rejectQty"
                              bsSize="sm"
                              className="w-100 text-center"
                              type="number"
                              value={pt.rejectQuantity}
                              onSelect={e => e.target.select()}
                              onChange={e => onRejectQtyChange( e, index )}
                            />
                          </td>
                        </tr>
                      ) )}
                    </tbody>
                  </Table>
                </div>
              </FormContentLayout>
            </div>
          </FormLayout>
        </div>

      </UILoader>

    </>
  );
};

export default SewingInspectionEditForm;
