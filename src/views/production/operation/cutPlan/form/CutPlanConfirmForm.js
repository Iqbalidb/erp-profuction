/* eslint-disable no-unreachable */
/* eslint-disable semi */
/*
   Title: Cut Plan Confirm Modal
   Description: Cut Plan Confirm Modal
   Author: Alamgir Kabir
   Date: 23-March-2022
   Modified: 23-March-2022
*/
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { default as classnames } from 'classnames';
import ActionMenu from 'layouts/components/menu/action-menu';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { PlusCircle, Pocket } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Badge, Button, Card, Col, FormFeedback, FormGroup, Input, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { CONFIRM_CUTS_API, CONTRAST_PARTS_API } from 'services/api-end-points/production/v1';
import { stringifyConsole } from 'utility/commonHelper';
import { notify } from 'utility/custom/notifications';
import CustomDatePicker from 'utility/custom/production/CustomDatePicker';
import { formattedDate, serverDate } from 'utility/dateHelpers';
import { cuttingType } from 'utility/enums';
import { errorResponse } from 'utility/Utils';
import { fetchCutPlanById } from '../store/actions';
import { RESET_SELECTED_ITEM } from '../store/actionType';
import classess from '../styles/CutPlanConfirmForm.module.scss';
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
    id: 'cut-plan',
    name: 'Cut Plan',
    link: "/cut-plan",
    isActive: false,
    hidden: false
  },
  {
    id: 'cut-plan-confirm',
    name: 'Confirm Cutting',
    link: "/cut-plan-confirm",
    isActive: true,
    hidden: false
  }
];
//#endregion
const CutPlanConfirmModal = () => {
  //#region Hooks
  const history = useHistory();
  const location = useLocation();
  const row = location.state;
  const dispatch = useDispatch();
  const { selectedItem } = useSelector( ( { cutPlanReducer } ) => cutPlanReducer );
  const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );

  const { register, errors } = useForm();
  //#endregion

  //#region state
  const [date, setDate] = useState( new Date() );
  const [selectedCutDetails, setSelectedCutDetails] = useState( null );
  const [groupName, setGroupName] = useState( '' );
  //#endregion

  //#region Effects
  useEffect( () => {
    let isMounted = true;
    if ( row ) {
      isMounted && dispatch( fetchCutPlanById( row ) );
    }
    return () => {
      isMounted = false;
      dispatch( { type: RESET_SELECTED_ITEM } );
    };
  }, [dispatch, row] );

  useEffect( () => {
    if ( selectedItem ) {
      const { marker } = selectedItem;

      const newListMarkerSize = marker.listMarkerSize.map( lms => ( {
        id: lms.id,
        ratio: lms.ratio,
        sizeId: lms.sizeId,
        sizeName: lms.sizeName,
        balance: 0,
        groups: [{ groupName: 'A', groupRatio: lms.ratio }]
      } ) );
      marker.listMarkerSize = newListMarkerSize;
      setSelectedCutDetails( { ...selectedItem, marker } );
    }
  }, [selectedItem] );
  //#endregion

  //#region Events
  /**
   * For Cut Date Change
   */
  const onCutDateChange = date => {
    const dates = date[0];
    setDate( dates );
  };
  /**
   * For Table No Change
   */
  const onTableNoChange = e => {
    const { value } = e.target;
    const _cutDetails = _.cloneDeep( selectedCutDetails );
    _cutDetails.masterData.tableNo = value;
    setSelectedCutDetails( _cutDetails );
  };
  /**
   * For Combo Quantity Change
   */
  const onComboQtyChange = e => {
    const { value } = e.target;
    const _cutDetails = _.cloneDeep( selectedCutDetails );
    _cutDetails.masterData.comboQty = +value;
    setSelectedCutDetails( _cutDetails );
  };
  /**
   * For Add Group
   */
  const onAddGroup = () => {
    if ( groupName ) {
      const hasSameGroup = Boolean( selectedCutDetails.marker.listMarkerSize[0]['groups']?.some( gr => gr.groupName === groupName ) );
      if ( !hasSameGroup ) {
        const _cutdetails = { ...selectedCutDetails };
        const newCutDetails = _cutdetails.marker.listMarkerSize.map( size => {
          const groupObj = { groupName, groupRatio: 0 };
          if ( size.groups ) {
            size.groups.push( groupObj );
          } else {
            size.groups = [{ ...groupObj }];
          }
          return size;
        } );
        _cutdetails.marker.listMarkerSize = newCutDetails;
        setSelectedCutDetails( _cutdetails );
        setGroupName( '' );
      } else {
        notify( 'warning', 'Group name can not be same', 1500 );
      }
    } else {
      notify( 'warning', 'Group name can not be empty', 1500 );
    }
  };
  /**
   * For Group ration Quantity Change
   */
  const onGroupRatioQuantityChange = ( e, sizeId, groupName ) => {
    const { value } = e.target;
    const _cutDetails = { ...selectedCutDetails };
    const updatedListMarkerSize = _cutDetails.marker.listMarkerSize.map( size => {
      if ( size.id === sizeId ) {
        size.groups.map( group => {
          if ( group.groupName === groupName ) {
            group['groupRatio'] = value ? Number( value ) : 0;
            size['balance'] = size['ratio'] - size.groups.reduce( ( acc, curr ) => ( acc += curr.groupRatio ), 0 );
          }
          return group;
        } );
      }
      return size;
    } );
    _cutDetails.marker.listMarkerSize = updatedListMarkerSize;
    setSelectedCutDetails( _cutDetails );
  };
  /**
 * Back to Prev route
 */
  const handleCancel = () => {
    history.goBack();
  };

  /**
 * For Submission
 */
  const handleSave = async () => {
    const { masterData, marker, productParts } = selectedCutDetails;
    const hasCoverAllSizeRation = marker.listMarkerSize.every( item => item.balance === 0 );
    if ( hasCoverAllSizeRation ) {
      const listCutting = masterData.cuttingDetailsList
        .map( cdl => {
          const listMarkerSize = marker.listMarkerSize
            .map( lms => {
              const markerWithGroup = lms.groups
                .map( group => {
                  const obj = {
                    cutPlanId: masterData.cutPlanId,
                    cutPlanNo: masterData.cutPlanNo,
                    cuttingId: masterData.cuttingId,
                    cutNo: masterData.cutNo,
                    styleId: masterData.styleId,
                    styleNo: masterData.styleNo,
                    buyerId: masterData.buyerId,
                    buyerName: masterData.buyerName,
                    styleCategoryId: masterData.styleCategoryId,
                    styleCategory: masterData.styleCategory,
                    poNo: cdl.poNo,
                    poId: cdl.poId,
                    destination: cdl.destination,
                    shipmentDate: cdl.shipmentDate,
                    shipmentMode: cdl.shipmentMode,
                    colorId: cdl.colorId,
                    colorName: cdl.colorName,
                    partGroupId: cdl.partGroupId,
                    partGroupName: cdl.partGroupName,
                    sizeId: lms.sizeId,
                    sizeName: lms.sizeName,
                    productPartsShade: group.groupName.toUpperCase(),
                    quantity: ( cdl.totalQty / marker.totalQty ) * group.groupRatio,
                    status: 'Pending'
                  };
                  delete obj.groups;
                  return obj;
                } )
                .flat();
              return markerWithGroup;
            } )
            .flat();
          return listMarkerSize;
        } )
        .flat()
        .filter( item => item.quantity > 0 );

      if ( masterData.cuttingType === cuttingType.contrast ) {
        dispatch( dataSubmitProgressCM( true ) );
        try {
          const contrastPayload = {
            cuttingId: masterData.cuttingId,
            cuttingDate: serverDate( date ),
            cuttingType: masterData.cuttingType,
            tableNo: masterData.tableNo,
            comboSize: masterData.comboQty,
            mergePoint: 9,
            totalQuantity: masterData.totalQuantityInCuttingDetails,
            listContrastParts: listCutting
              .map( lc => {
                const listCuttingWithParts = productParts.map( pp => ( {
                  ...lc,
                  productPartsId: pp.productPartsId,
                  productPartsName: pp.productPartsName,
                  quantityIn: lc.quantity,
                  quantityOut: 0
                } ) );
                return listCuttingWithParts;
              } )
              .flat()
          };
          stringifyConsole( contrastPayload, null, 2 )
          const res = await baseAxios.post( CONTRAST_PARTS_API.create, contrastPayload );

          notify( 'success', "Cut plan has been confirmed" );
          dispatch( dataSubmitProgressCM( false ) );
          handleCancel();
        } catch ( error ) {
          errorResponse( error );
          dispatch( dataSubmitProgressCM( false ) );
        }
      } else {
        if ( masterData.comboQty > 0 && masterData.tableNo !== '' ) {
          dispatch( dataSubmitProgressCM( true ) );
          try {
            const shellPayload = {
              cuttingId: masterData.cuttingId,
              cuttingDate: serverDate( date ),
              cuttingType: masterData.cuttingType,
              tableNo: masterData.tableNo,
              comboSize: masterData.comboQty,
              mergePoint: 9,
              totalQuantity: masterData.totalQuantityInCuttingDetails,
              listShellParts: listCutting
            };
            stringifyConsole( shellPayload, null, 2 )
            const res = await baseAxios.post( CONFIRM_CUTS_API.create, shellPayload );
            notify( 'success', "Cut plan has been confirmed" );
            dispatch( dataSubmitProgressCM( false ) );
            handleCancel();

          } catch ( error ) {
            errorResponse( error );
            dispatch( dataSubmitProgressCM( false ) );
          }
        } else {
          notify( 'warning', 'Please Provide all data!!!' );
        }
      }
    } else {
      notify( 'warning', 'Incorrect ratio' );
    }
  };

  //#endregion

  return (
    <div className="p-1 mt-2">
      <UILoader
        blocking={iSubmitProgressCM || !selectedCutDetails}
        loader={<ComponentSpinner />}>
        <ActionMenu breadcrumb={breadcrumb} title="Confirm Cutting">
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

        <Card className="mb-1 pt-2 pr-3 pl-3">
          <Row className="mb-0">
            <FormGroup tag={Col} xs={12} sm={12} md={12} lg={12} xl={12} className="mt-n1 p-0">
              <Badge color="primary">{`Master Information`}</Badge>
            </FormGroup>
            <Col xs={12} sm={6} md={6} lg={3} xl={3} className="text-nowrap text-left">
              <Label className="text-dark font-weight-bold " for="styleNo">
                Buyer Name
              </Label>
              <p className="h4 font-weight-bold ">{selectedCutDetails?.masterData?.buyerName}</p>
            </Col>
            <Col xs={12} sm={6} md={6} lg={3} xl={3} className="text-nowrap text-left">
              <Label className="text-dark font-weight-bold " for="styleNo">
                Style No
              </Label>
              <p className="h4 font-weight-bold ">{selectedCutDetails?.masterData?.styleNo}</p>
            </Col>
            <Col xs={12} sm={6} md={6} lg={3} xl={3} className="text-nowrap text-left">
              <Label className="text-dark font-weight-bold " for="styleCategory">
                Style Category
              </Label>
              <p className="h4 font-weight-bold "> {selectedCutDetails?.masterData?.styleCategory}</p>
            </Col>
            <Col xs={12} sm={6} md={6} lg={3} xl={3} className="text-nowrap text-left">
              <Label className="text-dark font-weight-bold " for="cutPlanNo">
                Cut Plan No
              </Label>
              <p className="h4 font-weight-bold ">{selectedCutDetails?.masterData?.cutPlanNo}</p>
            </Col>
            <Col xs={12} sm={6} md={6} lg={3} xl={3} className="text-nowrap text-left">
              <Label className="text-dark font-weight-bold " for="cutNo">
                Cut No
              </Label>
              <p className="h4 font-weight-bold ">{selectedCutDetails?.masterData?.cutNo}</p>
            </Col>
            <Col xs={12} sm={6} md={6} lg={3} xl={3} className="text-nowrap text-left">
              <Label className="text-dark font-weight-bold " for="cuttingType">
                Cutting Type
              </Label>
              <p className="h4 font-weight-bold ">{selectedCutDetails?.masterData?.cuttingType}</p>
            </Col>
            <Col xs={12} sm={6} md={6} lg={3} xl={3} className="text-nowrap text-left">
              <Label className="text-dark font-weight-bold " for="startDate">
                Start Date
              </Label>
              <p className="h4 font-weight-bold ">{formattedDate( selectedCutDetails?.masterData?.startDate )}</p>
            </Col>
            <Col xs={12} sm={6} md={6} lg={3} xl={3} className="text-nowrap text-left">
              <Label className="text-dark font-weight-bold " for="status">
                Status
              </Label>
              <p className="h4 font-weight-bold ">{selectedCutDetails?.masterData?.status}</p>
            </Col>
          </Row>
        </Card>
        <Card className="pt-2 pr-3 pl-3 mb-1">
          <FormGroup tag={Col} xs={12} sm={12} md={12} lg={12} xl={12} className="mt-n1 p-0">
            <Badge color="primary">{`Cut Info`}</Badge>
          </FormGroup>
          <Row>
            <Col xs={12} sm={12} md={12} lg={6} xl={6}>
              <Card className="p-2">
                <Row>
                  <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                    <FormGroup>
                      <Label className=" text-dark font-weight-bold" for="cutDate">
                        Cut Date
                      </Label>
                      <CustomDatePicker
                        minDate={moment( new Date() ).format( 'yyyy-MM-DD' )}
                        value={date}
                        id="cutDate"
                        name="cutDate"
                        onChange={onCutDateChange}
                        {...register( 'cutDate', { required: true } )}
                        className={classnames( {
                          'is-invalid': date
                        } )}
                      />
                      {errors && errors.cutDate && <FormFeedback>Cut Date is required!</FormFeedback>}
                    </FormGroup>
                    <FormGroup className=" ">
                      <Label className="text-dark font-weight-bold" for="lay">
                        Lay
                      </Label>
                      <Input
                        readOnly
                        id="lay"
                        type="text"
                        name="lay"
                        bsSize="sm"
                        placeholder="lay"
                        defaultValue={selectedCutDetails?.masterData?.totalLayPerCut}
                        innerRef={register( { required: false } )}
                        onChange={() => { }}
                        invalid={errors.lay && true}
                      />
                      {errors && errors.lay && <FormFeedback>Lay is required!</FormFeedback>}
                    </FormGroup>
                  </Col>
                  <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                    <FormGroup className="">
                      <Label className="text-dark font-weight-bold" for="tableNo">
                        Table No
                      </Label>
                      <Input
                        id="tableNo"
                        type="text"
                        name="tableNo"
                        bsSize="sm"
                        placeholder="Table No"
                        defaultValue={selectedCutDetails?.masterData?.tableNo}
                        onChange={onTableNoChange}
                        innerRef={register( { required: false } )}
                        invalid={errors.tableNo && true}
                      />
                      {errors && errors.tableNo && <FormFeedback>Table No is required!</FormFeedback>}
                    </FormGroup>
                    <FormGroup className=" ">
                      <Label className="text-dark font-weight-bold" for="width">
                        Width
                      </Label>
                      <Input
                        readOnly
                        id="width"
                        type="text"
                        name="width"
                        bsSize="sm"
                        placeholder="Width"
                        defaultValue={selectedCutDetails?.marker?.width}
                        innerRef={register( { required: false } )}
                        onChange={() => { }}
                        invalid={errors.width && true}
                      />
                      {errors && errors.width && <FormFeedback>Width is required!</FormFeedback>}
                    </FormGroup>
                  </Col>
                  <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                    <FormGroup className="">
                      <Label className="text-dark font-weight-bold" for="comboQty">
                        Combo Quantity
                      </Label>
                      <Input
                        id="comboQty"
                        type="number"
                        name="comboQty"
                        bsSize="sm"
                        placeholder="Combo Quantity"
                        defaultValue={selectedCutDetails?.masterData?.comboQty === 0 ? '' : selectedCutDetails?.masterData?.comboQty}
                        onChange={onComboQtyChange}
                        innerRef={register( { required: true, min: 1 } )}
                        invalid={errors.selectedCutDetails?.masterData?.comboQty && true}
                        className={classnames( {
                          'is-invalid': errors[`${selectedCutDetails?.masterData?.comboQty}`]
                        } )}
                      />
                      {errors && errors.comboQty && <FormFeedback>Combo Quantity is required!</FormFeedback>}
                    </FormGroup>
                    <FormGroup className=" ">
                      <Label className="text-dark font-weight-bold" for="length">
                        Length
                      </Label>
                      <Input
                        readOnly
                        id="length"
                        type="text"
                        name="length"
                        bsSize="sm"
                        placeholder="length"
                        defaultValue={selectedCutDetails?.marker?.length}
                        innerRef={register( { required: false } )}
                        onChange={() => { }}
                        invalid={errors.length && true}
                      />
                      {errors && errors.length && <FormFeedback>Length is required!</FormFeedback>}
                    </FormGroup>
                  </Col>
                  <FormGroup className="mb-0" tag={Col} xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div className="divider divider-start" style={{ textAlign: 'left' }}>
                      <div className="divider-text text-dark font-weight-bold" style={{ padding: '0 0.5rem 0 0' }}>
                        Product Parts:
                      </div>
                    </div>
                    <div>
                      {selectedCutDetails?.productParts?.map( pp => (
                        <span key={pp.productPartsId} style={{ marginRight: '5px' }}>
                          <Pocket size={16} /> {pp.productPartsName}
                        </span>
                      ) )}
                    </div>
                  </FormGroup>
                </Row>
              </Card>
            </Col>

            <Col xs={12} sm={12} md={12} lg={6} xl={6}>
              <Card className="p-2 ">
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Row className="rounded rounded-3">
                      <FormGroup tag={Col} xs={11}>
                        <Label for="group">Group</Label>
                        <Input
                          id="group"
                          name="Shade"
                          type="text"
                          bsSize="sm"
                          placeholder="group"
                          value={groupName}
                          onChange={e => setGroupName( e.target.value.toUpperCase() )}
                        />
                      </FormGroup>
                      <FormGroup tag={Col} xs={1}>
                        <Button
                          className="btn-icon "
                          id="btn-save"
                          style={{ marginTop: '22px', padding: '8px' }}
                          color="primary"
                          outline
                          onClick={onAddGroup}
                        >
                          <PlusCircle size={14} id="btn-save" />
                        </Button>
                      </FormGroup>
                    </Row>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Table size="sm" bordered hover responsive className="tableThTd">
                      <thead>
                        <tr className="text-center">
                          <th className="text-nowrap" style={{ width: '30px' }}>
                            Size
                          </th>
                          <th className="text-nowrap" style={{ width: '30px' }}>
                            Ratio
                          </th>
                          {selectedCutDetails?.marker?.listMarkerSize[0]['groups']?.map( group => {
                            return (
                              <th key={group.groupName} className="text-nowrap" style={{ width: '30px' }}>
                                {group.groupName}
                              </th>
                            );
                          } )}
                          <th className="text-nowrap" style={{ width: '30px' }}>
                            Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-center" style={{ padding: '10px 0 !important' }}>
                        {selectedCutDetails?.marker?.listMarkerSize.map( size => {
                          return (
                            <tr key={size.id}>
                              <td style={{ padding: '0px' }}>{size.sizeName}</td>
                              <td style={{ padding: '0px' }}>{size.ratio}</td>
                              {size.groups?.map( group => {
                                return (
                                  <td key={group.groupName} style={{ padding: '0px' }}>
                                    <Input
                                      className="text-center"
                                      id="groupname"
                                      name="groupname"
                                      type="number"
                                      onSelect={e => e.target.select()}
                                      value={group.groupRatio}
                                      onKeyDown={e => {
                                        if ( e.key === '.' || e.key === 'e' ) {
                                          e.preventDefault();
                                        }
                                      }}
                                      onChange={e => onGroupRatioQuantityChange( e, size.id, group.groupName )}
                                    />
                                  </td>
                                );
                              } )}
                              <td>{size.balance}</td>
                            </tr>
                          );
                        } )}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Card>
        <Card>
          <Row className="pt-2 pr-3 pl-3 pb-1">
            <FormGroup tag={Col} xs={12} sm={12} md={12} lg={12} xl={12} className="mt-n1 p-0">
              <Badge color="primary">{`Cut Details`}</Badge>
            </FormGroup>
            <Table size="sm" bordered={true} className={classess.poDetailsTable} responsive={true}>
              <thead className={` text-center text-nowrap table-bordered ${classess.stickyTableHead}`}>
                <tr>
                  <th>Color</th>
                  <th>PO No</th>
                  <th>Destination</th>
                  <th>Shipment Mode</th>
                  <th>Shipment Date</th>
                  <th>Color Qty</th>
                  <th>Extra %</th>
                  <th>With Extra</th>
                  <th>Lay Per Cut</th>
                  <th>Total Qty</th>
                </tr>
              </thead>
              <tbody className="text-center text-nowrap">
                {selectedCutDetails?.masterData?.cuttingDetailsList?.map( cd => (
                  <tr key={cd.id}>
                    <td>{cd.colorName}</td>
                    <td>{cd.poNo}</td>
                    <td>{cd.destination}</td>
                    <td>{cd.shipmentMode}</td>
                    <td>{formattedDate( cd.shipmentDate )}</td>
                    <td>{cd.colorQty}</td>
                    <td>{cd.extraPercentage}</td>
                    <td>{cd.withExtra}</td>
                    <td>{cd.layPerCut}</td>
                    <td>{cd.totalQty}</td>
                  </tr>
                ) )}
              </tbody>
            </Table>
          </Row>
        </Card>
      </UILoader>
    </div>
  );
};

export default CutPlanConfirmModal;
