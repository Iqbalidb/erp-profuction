/*
     Title: Relaxation Requisition Details
     Description: Relaxation Requisition Details
     Author: Alamgir Kabir
     Date: 06-May-2023
     Modified: 06-May-2023
*/
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import ActionMenu from 'layouts/components/menu/action-menu';
import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Col, NavItem, NavLink, Row, Table } from 'reactstrap';
import ErpDetailsInput from 'utility/custom/customController/ErpDetailsInput';
import FormContentLayout from 'utility/custom/customController/FormContentLayout';
import FormLayout from 'utility/custom/customController/FormLayout';
import { formattedDate } from 'utility/dateHelpers';
// import '../style/requisitionAddFormTable.scss';
import '../../../../../assets/scss/production/form-page-custom-table.scss';
import { randomIdString } from '../../../../../utility/Utils';
import { fetch_requisition_by_master_id } from '../store/actions';

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
    id: 'requisition-list',
    name: 'Requisition',
    link: "/requisition-list",
    isActive: false,
    hidden: false
  },

  {
    id: 'requisition-details',
    name: 'Requisition Details',
    link: "/requisition-details",
    isActive: true,
    hidden: false
  }
];
const RelaxationRequisitionDetails = () => {
  //#region Hooks
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const masterInfo = location.state;
  const masterId = location.state.id;
  const { selectedRequisitionItem } = useSelector( ( { requisitionReducer } ) => requisitionReducer );
  const { isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
  //#endregion
  console.log( masterInfo?.receiveDate );

  //#region Effects
  useEffect( () => {
    if ( masterId ) {
      dispatch( fetch_requisition_by_master_id( masterId ) );
    }
  }, [dispatch, masterId] );

  //#endregion
  /**
   * For Change Route
   */
  const handleCancel = () => {
    history.goBack();
  };
  //#endregion
  return (
    <>
      <UILoader
        blocking={isDataProgressCM}
        loader={<ComponentSpinner />}>
        <ActionMenu breadcrumb={breadcrumb} title={masterInfo?.receiveDate ? 'Receive Requisition Details' : 'Requisition Details'}>
          <NavItem className="mr-1">
            <NavLink tag={Button} size="sm" color="secondary" onClick={handleCancel}>
              Cancel
            </NavLink>
          </NavItem>
        </ActionMenu>
        <FormLayout>
          <Col className='general-form-container p-0 ' lg='12'>
            <Row className="p-1">
              <Col lg='12' className=''>
                <FormContentLayout title="Master Information">
                  <Col lg='4' md='6' xl='4'>
                    <ErpDetailsInput
                      id={randomIdString()}
                      label={masterInfo?.receiveDate ? "Requisition Date" : "Received Date"}
                      classNames='mt-1'
                      value={masterInfo?.receiveDate ? formattedDate( masterInfo?.receiveDate ) : formattedDate( masterInfo?.requisitionDate )}
                    />
                  </Col>

                  <Col lg='4' md='6' xl='4'>
                    <ErpDetailsInput
                      id={randomIdString()}
                      label="Buyer"
                      classNames='mt-1'
                      value={masterInfo?.buyerName}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpDetailsInput
                      id={randomIdString()}
                      label="Style"
                      classNames='mt-1'
                      value={masterInfo?.styleNo}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpDetailsInput
                      id={randomIdString()}
                      label="Style Category"
                      classNames='mt-1'
                      value={masterInfo?.styleCategory}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpDetailsInput
                      id={randomIdString()}
                      label="Merchandiser"
                      classNames='mt-1'
                      value={masterInfo?.merchandiserName}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpDetailsInput
                      id={randomIdString()}
                      label="PO No"
                      classNames='mt-1'
                      value={masterInfo?.purchaseOrderNo}
                    />
                  </Col>
                  <Col lg='4' md='6' xl='4'>
                    <ErpDetailsInput
                      id={randomIdString()}
                      label="Remarks"
                      classNames='mt-1'
                      value={masterInfo?.remarks}
                    />
                  </Col>
                </FormContentLayout>
              </Col>
            </Row>
          </Col>
          <Col lg='12' className='mt-1'>
            <FormContentLayout title="Details">
              <div className='p-1'>
                {masterInfo?.receiveDate ? (
                  <Table bordered responsive className='table-container'>
                    <thead >
                      <tr className="text-center">
                        <th className="text-nowrap sm-width"> SL/No</th>
                        <th className="text-nowrap"> Fabric Type</th>
                        <th className="text-nowrap"> Color</th>
                        <th className="text-nowrap">Requisition Qty (In Yards)</th>
                        <th className="text-nowrap">Requisition Qty (In Roll)</th>
                        <th className="text-nowrap">Receive Qty (In Yards)</th>
                        <th className="text-nowrap">Receive Qty (In Roll)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRequisitionItem?.map( ( pt, index ) => (
                        <Fragment key={index + 1}>
                          <tr className="text-center ">
                            <td>{index + 1}</td>
                            <td>{pt.fabricTypeName}</td>
                            <td>{pt.colorName}</td>
                            <td>{pt.quantityYard}</td>
                            <td>{pt.quantityRoll}</td>
                            <td>{pt.receiveQuantityYard}</td>
                            <td>{pt.receiveQuantityRoll}</td>
                          </tr>
                        </Fragment>
                      ) )}
                      <tr >
                        <td colSpan={3} className="td-width text-right">Total</td>
                        <td className='text-center'>{masterInfo?.totalQuantityRoll}</td>
                        <td className='text-center'>{masterInfo?.totalQuantityYard}</td>
                        <td className='text-center'>{masterInfo?.totalReceiveYard}</td>
                        <td className='text-center'>{masterInfo?.totalReceiveRoll}</td>
                      </tr>
                    </tbody>
                  </Table>
                ) : (
                  <Table bordered responsive className='table-container'>
                    <thead >
                      <tr className="text-center">
                        <th className="text-nowrap"> SL/No</th>
                        <th className="text-nowrap"> Fabric Type</th>
                        <th className="text-nowrap"> Color</th>
                        <th className="text-nowrap">Requisition Qty (In Yards)</th>
                        <th className="text-nowrap">Requisition Qty (In Roll)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRequisitionItem?.map( ( pt, index ) => (
                        <Fragment key={index + 1}>
                          <tr className="text-center ">
                            <td>{index + 1}</td>
                            <td>{pt.fabricTypeName}</td>

                            <td>{pt.colorName}</td>
                            <td>{pt.quantityYard}</td>
                            <td>{pt.quantityRoll}</td>
                          </tr>
                        </Fragment>
                      ) )}
                      <tr >
                        <td colSpan={3} className="td-width text-right">Total</td>
                        <td className='text-center'>{masterInfo?.totalQuantityRoll}</td>
                        <td className='text-center'>{masterInfo?.totalQuantityYard}</td>
                      </tr>
                    </tbody>
                  </Table>
                )}
              </div>
            </FormContentLayout>
          </Col>
        </FormLayout>
      </UILoader>
    </>
  );
};

export default RelaxationRequisitionDetails;
