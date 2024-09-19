/**
 * Title: Shipment Add Form
 * Description: Shipment Add Form
 * Author: Iqbal Hossain
 * Date: 05-January-2022
 * Modified: 05-January-2022
 */

import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Card, CardBody, Col, Form, FormFeedback, FormGroup, Input, Label, Row, Table } from 'reactstrap';
import CustomDatePicker from 'utility/custom/production/CustomDatePicker';
import CustomTimePicker from 'utility/custom/production/CustomTimePicker';
import classess from '../style/Shipment.module.scss';
const ShipmentAddForm = () => {
  const history = useHistory();
  const location = useLocation();

  //#region State
  const [date, setDate] = useState( new Date() );
  const [time, setTime] = useState( '' );
  const [shipmentInfo, setShipmentInfo] = useState( [] );

  //#endregion

  //#region Effects
  useEffect( () => {
    setShipmentInfo( location.state );
  }, [location] );
  //#endregion
  //#region Events
  const { errors, handleSubmit } = useForm();

  // Cartor Input Change
  const handleChangeQty = ( e, idx ) => {
    const { value } = e.target;
    const _shipmentDetails = _.cloneDeep( shipmentInfo );
    const clickedItem = _shipmentDetails.details[idx];
    clickedItem.shipmentQty = Number( value );
    _shipmentDetails[idx] = clickedItem;
    setShipmentInfo( _shipmentDetails );
  };

  // Handle save for data store
  const handleSave = () => {
    history.push( '/shipment' );
  };

  // Handle Cancel for move list Page
  const handleCancel = () => {
    history.push( '/shipment' );
  };
  //#endregion

  return (
    <div>
      <Card>
        <CardBody>
          {/* Master Section */}
          <Col xs={12} className="text-nowrap text-center">
            <Label className="h2 font-weight-bolder">Master Information</Label>
          </Col>
          <div className="rounded rounded-3 p-2">
            <Row className="mb-1">
              <Col xs={12} sm={6} md={6} lg={4} xl={4} className="text-nowrap text-left">
                <strong>Buyer Name: </strong>
                <Label className="h5 font-weight-bold" for="buyerName">
                  {' '}
                  {shipmentInfo.buyer}
                </Label>
              </Col>
              <Col xs={12} sm={6} md={6} lg={4} xl={4} className="text-nowrap text-left">
                <strong>Style Number : </strong>
                <Label className="h5 font-weight-bold" for="styleNo">
                  {' '}
                  {shipmentInfo.styleNo}
                </Label>
              </Col>
              <Col xs={12} sm={6} md={6} lg={4} xl={4} className="text-nowrap text-left">
                <strong>PO Number : </strong>
                <Label className="h5 font-weight-bold" for="poNo">
                  {' '}
                  {shipmentInfo.po}
                </Label>
              </Col>
              <Col xs={12} sm={6} md={6} lg={4} xl={4} className="text-nowrap text-left">
                <strong>Destination : </strong>
                <Label className="h5 font-weight-bold" for="destination">
                  {' '}
                  {shipmentInfo.destination}
                </Label>
              </Col>
              <Col xs={12} sm={6} md={6} lg={4} xl={4} className="text-nowrap text-left">
                <strong> Shipment Mode: </strong>
                <Label className="h5 font-weight-bold" for="shipmentMode">
                  {' '}
                  {shipmentInfo.shipmentMode}
                </Label>
              </Col>
              <Col xs={12} sm={6} md={6} lg={4} xl={4} className="text-nowrap text-left">
                <strong> Shipment Date : </strong>
                <Label className="h5 font-weight-bold" for="shipmentDate">
                  {' '}
                  {shipmentInfo.shipmentDate}
                </Label>
              </Col>
            </Row>
            <p style={{ width: '100%', borderBottom: '1px solid black', color: '#7367F0' }}></p>
          </div>
          {/* Master Section */}

          {/* Details Section */}
          <Form onSubmit={handleSubmit()}>
            <Row className="rounded rounded-3 mr-1">
              <FormGroup tag={Col} xs={6} sm={6} md={6} lg={6} xl={6}>
                <CustomDatePicker name="date" title="Date" value={date} onChange={date => setDate( date )} />
                {errors && errors.date && <FormFeedback>Date is Required</FormFeedback>}
              </FormGroup>
              <FormGroup tag={Col} xs={6} sm={6} md={6} lg={6} xl={6}>
                <CustomTimePicker id="time" title="Time" name="time" placeholder="Time" value={time} onChange={time => setTime( time )} />
              </FormGroup>
            </Row>
            <Table size="sm" responsive bordered={true} className={classess.packagingTable}>
              <thead className={`thead-dark text-center table-bordered ${classess.stickyTableHead}`}>
                <tr>
                  <th rowSpan={2}>Colors</th>
                  <th colSpan={4} style={{ minWidth: '170px' }}>
                    Sizes
                  </th>
                  <th rowSpan={3}>Total Pcs/Blister</th>
                  <th rowSpan={3}>Total Blister/Carton</th>
                  <th rowSpan={3}>CTN</th>
                  <th rowSpan={3}>Shipment Quantity</th>
                </tr>
                <tr>
                  <th style={{ fontWeight: 'bold', fontSize: '15px' }}>S</th>
                  <th style={{ fontWeight: 'bold', fontSize: '15px' }}>M</th>
                  <th style={{ fontWeight: 'bold', fontSize: '15px' }}>L</th>
                  <th style={{ fontWeight: 'bold', fontSize: '15px' }}>XL</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {shipmentInfo?.details?.map( ( item, idx ) => (
                  <tr key={item.id}>
                    <td>{item.color}</td>
                    {item.sizes.map( size => (
                      <td key={size.id}>{size.qty}</td>
                    ) )}

                    <td>{item.totalBlister}</td>
                    <td>{item.totalCarton}</td>
                    <td>
                      <Input readOnly className="text-center" type="number" id="ctn" name="ctn" value={item.ctn} onSelect={e => e.target.select()} />
                    </td>
                    <td>
                      <Input
                        className="text-center"
                        type="number"
                        id="shipmentQty"
                        name="shipmentQty"
                        value={item.shipmentQty}
                        onSelect={e => e.target.select()}
                        onChange={e => handleChangeQty( e, idx )}
                      />
                    </td>
                  </tr>
                ) )}
              </tbody>
            </Table>
            {/* Details Section */}

            <div className="float-right mt-3">
              <Button type="submit" color="primary" className="mr-1" onClick={handleSave}>
                Save
              </Button>
              <Button type="cancel" color="danger" outline onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default ShipmentAddForm;
