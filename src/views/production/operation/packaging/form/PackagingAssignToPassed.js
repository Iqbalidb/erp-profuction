import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Card, CardBody, Col, Form, FormFeedback, FormGroup, Input, Label, Row, Table } from 'reactstrap';
import CustomDatePicker from 'utility/custom/production/CustomDatePicker';
import CustomTimePicker from 'utility/custom/production/CustomTimePicker';
import classess from '../style/Packaging.module.scss';
const PackagingAssignToPassed = () => {
  const history = useHistory();
  const location = useLocation();
  //#region State
  const [date, setDate] = useState( new Date() );
  const [time, setTime] = useState( '' );

  const { errors, handleSubmit } = useForm();
  const [packagingInfo, setPackagingInfo] = useState( [] );

  //#endregion
  //#region Effects
  useEffect( () => {
    setPackagingInfo( location.state );
  }, [location] );

  //#endregion
  //#region Events
  const handleChangeQty = ( e, idx ) => {
    const { value } = e.target;
    const _packagingDetails = _.cloneDeep( packagingInfo );
    const clickedItem = _packagingDetails.details[idx];
    clickedItem.qty = Number( value );
    _packagingDetails[idx] = clickedItem;
    setPackagingInfo( _packagingDetails );
  };
  const handleSave = () => {
    history.push( '/packaging' );
  };
  const handleCancel = () => {
    history.push( '/packaging' );
  };
  return (
    <div>
      <Card>
        <CardBody>
          <Col xs={12} className="text-nowrap text-center">
            <Label className="h2 font-weight-bolder">Master Information</Label>
          </Col>
          <div className="rounded rounded-3 p-2">
            <Row className="mb-1">
              <Col xs={12} sm={6} md={6} lg={4} xl={4} className="text-nowrap text-left">
                <strong>Buyer Name: </strong>
                <Label className="h5 font-weight-bold" for="buyerName">
                  {' '}
                  {packagingInfo.buyer}
                </Label>
              </Col>
              <Col xs={12} sm={6} md={6} lg={4} xl={4} className="text-nowrap text-left">
                <strong>Style Number : </strong>
                <Label className="h5 font-weight-bold" for="styleNo">
                  {' '}
                  {packagingInfo.styleNo}
                </Label>
              </Col>
              <Col xs={12} sm={6} md={6} lg={4} xl={4} className="text-nowrap text-left">
                <strong>PO Number : </strong>
                <Label className="h5 font-weight-bold" for="poNo">
                  {' '}
                  {packagingInfo.po}
                </Label>
              </Col>
              <Col xs={12} sm={6} md={6} lg={4} xl={4} className="text-nowrap text-left">
                <strong>Destination : </strong>
                <Label className="h5 font-weight-bold" for="destination">
                  {' '}
                  {packagingInfo.destination}
                </Label>
              </Col>
              <Col xs={12} sm={6} md={6} lg={4} xl={4} className="text-nowrap text-left">
                <strong> Shipment Mode: </strong>
                <Label className="h5 font-weight-bold" for="shipmentMode">
                  {' '}
                  {packagingInfo.shipmentMode}
                </Label>
              </Col>
              <Col xs={12} sm={6} md={6} lg={4} xl={4} className="text-nowrap text-left">
                <strong> Shipment Date : </strong>
                <Label className="h5 font-weight-bold" for="shipmentDate">
                  {' '}
                  {packagingInfo.shipmentDate}
                </Label>
              </Col>
            </Row>
            <p style={{ width: '100%', borderBottom: '1px solid black', color: '#7367F0' }}></p>
          </div>
          <Form onSubmit={handleSubmit()}>
            {/* Packaging Master Start*/}

            <Row className="rounded rounded-3 mr-1">
              <FormGroup tag={Col} xs={6} sm={6} md={6} lg={6} xl={6}>
                <CustomDatePicker name="date" title="Date" value={date} onChange={date => setDate( date )} />
                {errors && errors.date && <FormFeedback>Date is Required</FormFeedback>}
              </FormGroup>
              <FormGroup tag={Col} xs={6} sm={6} md={6} lg={6} xl={6}>
                <CustomTimePicker id="time" title="Time" name="time" placeholder="Time" value={time} onChange={time => setTime( time )} />
              </FormGroup>
            </Row>
            {/* Packaging Master End*/}

            {/* Packaging Details Start*/}
            <Table size="sm" responsive bordered={true} className={classess.packagingTable}>
              <thead className={`thead-dark text-center table-bordered ${classess.stickyTableHead}`}>
                <tr>
                  <th rowSpan={2}>Colors</th>
                  <th colSpan={4} style={{ minWidth: '170px' }}>
                    Sizes
                  </th>
                  <th rowSpan={3}>Total Pcs</th>
                  <th rowSpan={3}>Quantity</th>
                </tr>
                <tr>
                  <th>S</th>
                  <th>M</th>
                  <th>L</th>
                  <th>XL</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {packagingInfo?.details?.map( ( item, idx ) => (
                  <tr key={item.id}>
                    <td>{item.color}</td>
                    {item.sizes.map( size => (
                      <td key={size.id}>{size.qty}</td>
                    ) )}

                    <td>{item.totalPcs}</td>
                    <td>
                      <Input
                        className="text-center"
                        type="number"
                        id="qty"
                        name="qty"
                        value={item.qty}
                        onSelect={e => e.target.select()}
                        onChange={e => handleChangeQty( e, idx )}
                      />
                    </td>
                  </tr>
                ) )}
              </tbody>
            </Table>
            {/* Packaging Details End*/}

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

export default PackagingAssignToPassed;
