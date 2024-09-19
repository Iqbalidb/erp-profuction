/*
     Title: Relaxation Edit Form
     Description: Relaxation Edit Form
     Author: Alamgir Kabir
     Date: 17-May-2023
     Modified: 17-May-2023
*/
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import ActionMenu from 'layouts/components/menu/action-menu';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Col, Input, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { RELAXATION_API } from 'services/api-end-points/production/v1/relaxation';
import { errorResponse } from 'utility/Utils';
import { stringifyConsole } from 'utility/commonHelper';
import { ErpInput } from 'utility/custom/customController/ErpInput';
import FormContentLayout from 'utility/custom/customController/FormContentLayout';
import FormLayout from 'utility/custom/customController/FormLayout';
import { notify } from 'utility/custom/notifications';
import { formattedDate, formattedTime, serverDate, serverTime } from 'utility/dateHelpers';
import '../../../../../assets/scss/production/form-page-custom-table.scss';
import '../../../../../assets/scss/production/general.scss';
import { fetch_relaxation_by_master_id, resetRelaxationDetails } from '../store/actions';
const RelaxationCompleteForm = () => {
  //#region Hooks
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const masterInfo = location.state;
  const masterId = location.state.id;
  const { selectedRelaxationItem } = useSelector( ( { relaxationReducer } ) => relaxationReducer );
  const { iSubmitProgressCM, isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );

  //#endregion

  //#region States
  const [relaxationDetails, setRelaxationDetails] = useState( [] );
  const [remark, setRemark] = useState( '' );
  const [isLoadingTableData] = useState( false );
  const [totalStartLengthYard, setTotalStartLengthYard] = useState( 0 );
  const [totalStartWidthYard, setTotalStartWidthYard] = useState( 0 );
  const [totalEndLengthYard, setTotalEndLengthYard] = useState( 0 );
  const [totalEndWidthYard, setTotalEndWidthYard] = useState( 0 );
  //#endregion

  //#region UDF's

  //#region Effects
  useEffect( () => {
    if ( masterId ) {
      dispatch( fetch_relaxation_by_master_id( masterId ) );
    }
  }, [dispatch, masterId] );

  useEffect( () => {
    if ( selectedRelaxationItem.length > 0 ) {
      const modifiedRelaxationDetails = selectedRelaxationItem?.map( ri => ( {
        ...ri, endLengthInYard: ri.startLengthInYard, endWidthInYard: ri.startWidthInYard, endDate: new Date(), endTime: serverTime( new Date() )
      } ) );
      setRelaxationDetails( modifiedRelaxationDetails );
      setTotalStartLengthYard( masterInfo?.totalStartLength );
      setTotalStartWidthYard( masterInfo?.totalStartWidth );
      setTotalEndLengthYard( masterInfo?.totalStartLength );
      setTotalEndWidthYard( masterInfo?.totalStartWidth );
      setRemark( masterInfo?.remarks );
    }
  }, [masterInfo.remarks, masterInfo.totalStartLength, masterInfo.totalStartWidth, selectedRelaxationItem] );
  //#endregion

  //#region Events
  /**
* For Change Length
*/
  const onEndLengthChange = ( e, index ) => {
    const _relaxationDetails = [...relaxationDetails];

    const selectedItem = _relaxationDetails[index];
    selectedItem.endLengthInYard = Number( e.target.value );

    const _totalEndLengthInyard = _relaxationDetails.reduce( ( acc, curr ) => acc + curr.endLengthInYard, 0 );
    setTotalEndLengthYard( _totalEndLengthInyard );

    _relaxationDetails[index] = selectedItem;
    setRelaxationDetails( _relaxationDetails );
  };
  /**
* For Change Width
*/
  const onEndWidthChange = ( e, index ) => {
    const _relaxationDetails = [...relaxationDetails];

    const selectedItem = _relaxationDetails[index];
    selectedItem.endWidthInYard = Number( e.target.value );

    const _totalEndWidthInyard = _relaxationDetails.reduce( ( acc, curr ) => acc + curr.endWidthInYard, 0 );
    setTotalEndWidthYard( _totalEndWidthInyard );

    _relaxationDetails[index] = selectedItem;
    setRelaxationDetails( _relaxationDetails );
  };
  /**
 * For Change End Date
 */
  const onEndDateChange = ( e, index ) => {
    const _relaxationDetails = [...relaxationDetails];

    const selectedItem = _relaxationDetails[index];

    selectedItem.endDate = e.target.value;
    _relaxationDetails[index] = selectedItem;
    setRelaxationDetails( _relaxationDetails );
  };
  /**
* For Change End Time
*/
  const onEndTimeChange = ( e, index ) => {
    const _relaxationDetails = [...relaxationDetails];
    const selectedItem = _relaxationDetails[index];
    selectedItem.endTime = e.target.value;
    _relaxationDetails[index] = selectedItem;
    setRelaxationDetails( _relaxationDetails );
  };
  /**
   * For Change Route
   */
  const handleCancel = () => {
    dispatch( resetRelaxationDetails() );
    history.goBack();
  };
  /**
   * For Submission
   */
  const handleSubmit = async () => {
    const payload = {
      relaxationNo: masterInfo?.relaxationNo,
      styleId: masterInfo?.styleId,
      styleNo: masterInfo?.styleNo,
      styleCategoryId: masterInfo?.styleCategoryId,
      styleCategory: masterInfo?.styleCategory,
      buyerId: masterInfo?.buyerId,
      buyerName: masterInfo?.buyerName,
      purchaseOrderId: masterInfo?.purchaseOrderId,
      purchaseOrderNo: masterInfo?.purchaseOrderNo,
      merchandiserName: masterInfo?.merchandiserName,
      merchandiserId: masterInfo?.merchandiserId,
      totalStartLength: masterInfo?.totalStartLength,
      totalStartWidth: masterInfo?.totalStartWidth,
      totalEndLength: totalEndLengthYard,
      totalEndWidth: totalEndWidthYard,
      remarks: remark,
      list: relaxationDetails?.map( rqd => ( {
        id: rqd?.id,
        relaxationMasterId: masterId,
        colorId: rqd?.colorId,
        colorName: rqd?.colorName,
        fabricTypeId: rqd?.fabricTypeId,
        fabricTypeName: rqd?.fabricTypeName,
        quantityYard: rqd?.quantityYard,
        quantityRoll: rqd?.quantityRoll,
        rollSlNo: rqd?.rollSlNo,
        startDate: serverDate( rqd?.startDate ),
        startTime: rqd?.startTime,
        startLengthInYard: rqd?.startLengthInYard,
        startWidthInYard: rqd?.startWidthInYard,
        endLengthInYard: rqd?.endLengthInYard,
        endWidthInYard: rqd?.endWidthInYard,
        endDate: serverDate( rqd?.endDate ),
        endTime: rqd?.endTime
      } ) )
    };
    stringifyConsole( payload );
    const isValidPayload = payload.list.some(
      rq => rq.endLengthInYard !== null || rq.endWidthInYard !== null || rq.endDate !== null || rq.endTime !== ''
    );
    if ( masterId !== null && isValidPayload ) {
      dispatch( dataSubmitProgressCM( true ) );
      try {
        const res = await baseAxios.put( RELAXATION_API.update, payload, {
          params: {
            id: masterId
          }
        } );
        notify( 'success', 'Relaxation has been updated Successfully' );
        dispatch( dataSubmitProgressCM( false ) );
        handleCancel();
      } catch ( error ) {
        errorResponse( error );
        dispatch( dataSubmitProgressCM( false ) );
      }
    } else {
      notify( 'warning', 'Please Provide all data!!!' );
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
      id: 'relaxation-list',
      name: 'Relaxation ',
      link: "/relaxation-list",
      isActive: false,
      hidden: false
    },

    {
      id: 'relaxation-complete',
      name: 'Edit Relaxation',
      link: "/relaxation-complete",
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

        <ActionMenu breadcrumb={breadcrumb} title="Complete Relaxation ">
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
          <FormLayout>
            <Row className="">
              <Col lg='12' className=''>
                <FormContentLayout title="Master Information">

                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Relaxation No"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={masterInfo?.relaxationNo}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Style"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={masterInfo?.styleNo}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="PO"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={masterInfo?.purchaseOrderNo}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Buyer"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={masterInfo?.buyerName}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Style Category"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={masterInfo?.styleCategory ? masterInfo.styleCategory : ''}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpInput
                      classNames='mt-1'
                      label="Merchandiser"
                      disabled={true}
                      bsSize="sm"
                      defaultValue={masterInfo?.merchandiserName}
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
                        <th className="text-nowrap serial-number"> SL</th>
                        <th className="text-nowrap"> Fabric Type</th>
                        <th className="text-nowrap"> Color</th>
                        <th className="text-nowrap"> Roll.SL</th>
                        <th className="text-nowrap">Length(In Yards)</th>
                        <th className="text-nowrap">Width(In Yards)</th>
                        <th className="text-nowrap"> Start Date</th>
                        <th className="text-nowrap"> Start Time</th>
                        <th className="text-nowrap">End Length(In Yards)</th>
                        <th className="text-nowrap">End Width(In Yards)</th>
                        <th className="text-nowrap"> End Date</th>
                        <th className="text-nowrap"> End Time</th>
                      </tr>
                    </thead>
                    {isLoadingTableData ? (
                      <div style={{ height: '150px' }}>
                        <ComponentSpinner colSpanNo={8} />
                      </div>
                    ) : (
                      <>
                        <tbody>
                          {relaxationDetails.length > 0 ? (
                            relaxationDetails?.map( ( rqd, index ) => (
                              <Fragment key={index + 1}>
                                <tr className="text-center">
                                  <td >{index + 1}</td>
                                  <td>
                                    <span className='text-nowrap'> {rqd.fabricTypeName}</span>
                                  </td>
                                  <td>
                                    <span className='text-nowrap'> {rqd.colorName}</span>
                                  </td>
                                  <td>
                                    <span className='text-nowrap'> {rqd.rollSlNo}</span>
                                  </td>
                                  <td>
                                    <span className='text-nowrap'> {rqd.startLengthInYard}</span>
                                  </td>
                                  <td>
                                    <span className='text-nowrap'> {rqd.startWidthInYard}</span>
                                  </td>
                                  <td>
                                    <span className='text-nowrap'> {formattedDate( rqd.startDate )}</span>
                                  </td>
                                  <td>
                                    <span className='text-nowrap'> {formattedTime( rqd.startTime )}</span>
                                  </td>
                                  <td>
                                    <Input
                                      id="endLengthInYard"
                                      className="w-100 text-center"
                                      bsSize="sm"
                                      type="number"
                                      value={rqd?.endLengthInYard}
                                      onSelect={e => e.target.select()}
                                      onChange={e => onEndLengthChange( e, index )}
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      id="endWidthInYard"
                                      className="w-100 text-center"
                                      type="number"
                                      bsSize="sm"
                                      value={rqd?.endWidthInYard}
                                      onSelect={e => e.target.select()}
                                      onChange={e => onEndWidthChange( e, index )}
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      id="startDate"
                                      className="w-100 text-center"
                                      type="date"
                                      bsSize="sm"
                                      name="startDate"
                                      value={moment( rqd.endDate ).format( 'YYYY-MM-DD' )}
                                      onChange={e => onEndDateChange( e, index )}
                                    />
                                  </td>
                                  <td >
                                    <Input
                                      id="criticalProcessName"
                                      className="w-100 text-center"
                                      type="time"
                                      bsSize="sm"
                                      value={rqd.endTime}
                                      onChange={e => onEndTimeChange( e, index )}
                                    />
                                  </td>
                                </tr>
                              </Fragment>
                            ) )
                          ) : (
                            <tr className='text-center'>
                              <td colSpan={9} className='td-width'>There is no record to display</td>
                            </tr>
                          )
                          }
                        </tbody>
                        {relaxationDetails.length > 0 && (
                          <tbody style={{ borderBottom: '2px solid #EBE9F1' }}>
                            <tr className=" text-center">
                              <td colSpan={4} className="text-right">
                                <Label for="name" className="td-width">
                                  Total
                                </Label>
                              </td>
                              <td >
                                <Label for="name" >
                                  {totalStartLengthYard}
                                </Label>
                              </td>
                              <td>
                                <Label for="name" >
                                  {totalStartWidthYard}
                                </Label>
                              </td>
                              <td></td>
                              <td></td>
                              <td >
                                <Label for="name" >
                                  {totalEndLengthYard}
                                </Label>
                              </td>
                              <td >
                                <Label for="name" >
                                  {totalEndWidthYard}
                                </Label>
                              </td>
                            </tr>
                          </tbody>
                        )}
                      </>
                    )}
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

export default RelaxationCompleteForm;
/** Change Log
 *
 */
