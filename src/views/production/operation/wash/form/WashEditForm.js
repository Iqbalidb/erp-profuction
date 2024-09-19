/**
 * Title: Wash Edit Form
 * Description: Wash Edit Form
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
import { Button, Col, Input, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { WASH_API } from 'services/api-end-points/production/v1';
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
import { fetchWashByMasterId } from '../store/actions';
const WashEditForm = () => {
  //#region Hooks
  const history = useHistory();
  const location = useLocation();
  const selectedRow = location.state;
  const dispatch = useDispatch();
  const { selectedWashItemByMasterId } = useSelector( ( { washReducer } ) => washReducer );
  const { iSubmitProgressCM, isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );

  //#endregion

  //#region State
  const [washingSendDetails, setWashingSendDetails] = useState( [] );
  const [totalSizeQty, setTotalSizeQty] = useState( 0 );
  const [totalProcessQty, setTotalProcessQty] = useState( 0 );
  const [totalAssignQty, setTotalAssignQty] = useState( 0 );
  const [remark, setRemark] = useState( selectedRow?.remark );
  //#endregion

  //#region Effects
  useEffect( () => {
    if ( selectedRow ) {
      dispatch( fetchWashByMasterId( selectedRow.id ) );
    }
  }, [dispatch, selectedRow] );

  useEffect( () => {
    if ( selectedWashItemByMasterId.length > 0 ) {
      const _totalSizeQty = selectedWashItemByMasterId.reduce( ( acc, curr ) => acc + curr.dayQuantity, 0 );
      const _totalProcessQty = selectedWashItemByMasterId.reduce( ( acc, curr ) => acc + curr.processedQuantity, 0 );
      const _totalAssignQty = selectedWashItemByMasterId.reduce( ( acc, curr ) => acc + curr.assignedQuantity, 0 );
      setTotalSizeQty( _totalSizeQty );
      setTotalProcessQty( _totalProcessQty );
      setTotalAssignQty( _totalAssignQty );
      setWashingSendDetails( selectedWashItemByMasterId );
    }
  }, [selectedWashItemByMasterId] );
  //#endregion

  /**
   * For onChange Quantity
   */
  const onSizeQuantityChange = ( e, index ) => {
    const { value } = e.target;
    const _washingSendDetails = [...washingSendDetails];
    const selectedItem = _washingSendDetails[index];
    const assignQty = selectedItem.assignedQuantity;
    const processQty = selectedItem.processedQuantity;
    const validQty = assignQty - processQty;
    let inputQuantity = +value;
    if ( inputQuantity > validQty ) {
      inputQuantity = 0;
      notify( 'warning', 'limit exceeds!!!' );
    }
    selectedItem.dayQuantity = inputQuantity;
    _washingSendDetails[index] = selectedItem;
    const totalQty = _washingSendDetails.reduce( ( acc, curr ) => acc + curr.dayQuantity, 0 );
    setTotalSizeQty( totalQty );
    setWashingSendDetails( _washingSendDetails );
  };
  //Handle Cancel
  const handleCancel = () => {
    history.goBack();
  };
  /**
   * For Washing Form Submit
   */
  const handleSubmit = async () => {
    const payload = {
      date: serverDate( selectedRow?.date ),
      processId: selectedRow?.processId,
      processName: selectedRow?.processName,
      styleId: selectedRow?.styleId,
      styleNo: selectedRow?.styleNo,
      styleCategoryId: selectedRow?.styleCategoryId,
      styleCategory: selectedRow?.styleCategory,
      buyerId: selectedRow?.buyerId,
      buyerName: selectedRow?.buyerName,
      colorId: selectedRow?.colorId,
      colorName: selectedRow?.colorName,
      floorId: selectedRow?.floorId,
      floorName: selectedRow?.floorName,
      lineId: selectedRow?.lineId,
      lineName: selectedRow?.lineName,

      totalQuantity: totalSizeQty,

      remark,
      list: washingSendDetails?.map( wsd => ( {
        id: wsd?.id,
        washingMasterId: selectedRow?.id,
        sizeId: wsd?.sizeId,
        sizeName: wsd?.sizeName,
        dayQuantity: wsd?.dayQuantity
      } ) )
    };
    stringifyConsole( payload );
    const isMasterData = payload.processId && payload.styleCategoryId && payload.date;
    if ( isMasterData ) {
      const isInspectQty = payload.list.some( s => s.dayQuantity !== 0 );
      if ( isInspectQty ) {
        dispatch( dataSubmitProgressCM( true ) );
        try {
          const res = await baseAxios.put( WASH_API.update, payload, { params: { id: selectedRow?.id } } );
          notify( 'success', 'Data Updated Successfully!!!' );
          // resetWashingState();
          dispatch( dataSubmitProgressCM( false ) );
          handleCancel();
        } catch ( error ) {
          errorResponse( error );
          dispatch( dataSubmitProgressCM( false ) );
        }
      } else {
        notify( 'warning', 'Inspect quantity and others value not matched!!!' );
      }
    } else {
      notify( 'warning', 'Please fill all fields!!!' );
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
      id: 'wash',
      name: 'Wash',
      link: "/wash",
      isActive: false,
      hidden: false
    },
    {
      id: 'wash-received',
      name: 'Wash Send Edit',
      link: "/wash-received",
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
        <ActionMenu breadcrumb={breadcrumb} title="Wash Send Edit">
          <NavItem className="mr-1">
            <NavLink tag={Button} size="sm" color="primary" type="submit" onClick={handleSubmit}>
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
            <Row>
              <Col lg='12'>
                <FormContentLayout title="Master Information">
                  <Col lg='3' md='6' xl='3'>
                    <ErpInput
                      classNames='mt-1'
                      label=" Send Date"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={formattedDate( selectedRow?.date )}
                    />
                    <ErpInput
                      classNames='mt-1'
                      label="Line"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={selectedRow?.lineName}
                    />
                  </Col>
                  <Col lg='3' md='6' xl='3'>
                    <ErpInput
                      classNames='mt-1'
                      label="Buyer"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={selectedRow?.buyerName}
                    />
                    <ErpInput
                      classNames='mt-1'
                      label="Floor"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={selectedRow?.floorName}
                    />
                  </Col>
                  <Col lg='3' md='6' xl='3'>
                    <ErpInput
                      classNames='mt-1'
                      label="Style"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={selectedRow?.styleNo}
                    />
                    <ErpInput
                      classNames='mt-1'
                      label="Color"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={selectedRow?.colorName}
                    />
                  </Col>
                  <Col lg='3' md='6' xl='3'>
                    <ErpInput
                      classNames='mt-1'
                      label="Style Category"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={selectedRow?.styleCategory}
                    />
                    <ErpInput
                      classNames='mt-1'
                      label="Process"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={selectedRow?.processName}
                    />
                  </Col>
                </FormContentLayout>
              </Col>
            </Row>
            <div className='p-1'>
              <FormContentLayout title="Details">
                <div className='p-1'>
                  <Table bordered className='table-container'>
                    <thead >
                      <tr className="text-center">
                        <th className="text-nowrap sm-width"> SL</th>
                        <th className="text-nowrap"> Size</th>
                        <th className="text-nowrap"> Assigned Quantity</th>
                        <th className="text-nowrap"> Processed Quantity</th>
                        <th className="text-nowrap"> Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {washingSendDetails.length > 0 &&
                        washingSendDetails?.map( ( pt, index ) => (
                          <Fragment key={pt.sizeId}>
                            <tr className="text-center">
                              <td className='sm-width'>{index + 1}</td>

                              <td className='td-width'>
                                <Input
                                  bsSize="sm"
                                  id="criticalProcessName" className="w-100 text-center" type="text" value={pt?.sizeName} disabled />
                              </td>
                              <td>
                                <Input id="criticalProcessName"
                                  bsSize="sm"
                                  className="w-100 text-center" type="text" value={pt?.assignedQuantity} disabled />
                              </td>
                              <td>
                                <Input id="criticalProcessName"
                                  bsSize="sm"
                                  className="w-100 text-center" type="text" value={pt?.processedQuantity} disabled />
                              </td>
                              <td>
                                <Input
                                  id="rejectQty"
                                  className="w-100 text-center"
                                  type="number"
                                  bsSize="sm"
                                  value={pt?.dayQuantity}
                                  onSelect={e => e.target.select()}
                                  onChange={e => onSizeQuantityChange( e, index )}
                                />
                              </td>
                            </tr>
                          </Fragment>
                        ) )}
                    </tbody>
                    <tbody >
                      {washingSendDetails.length > 0 && (
                        <>
                          {washingSendDetails.length > 0 && (
                            <tr className="text-center  " >
                              <td className='td-width text-right mr-1' colSpan={2}>
                                <Label for="name" >
                                  Total
                                </Label>
                              </td>
                              <td>
                                <Label for="totalAssignQty" >
                                  {totalAssignQty}
                                </Label>
                              </td>
                              <td>
                                <Label for="totalProcssQty" >
                                  {totalProcessQty}
                                </Label>
                              </td>

                              <td>
                                <Label for="totalSizeQty" >
                                  {totalSizeQty}
                                </Label>
                              </td>
                            </tr>
                          )}
                        </>
                      )}
                    </tbody>
                  </Table>
                  <div className='mt-2'>
                    <CustomInputRemarks label="Remaks" name="remark" value={remark} onChange={( e ) => setRemark( e.target.value )} />
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

export default WashEditForm;
