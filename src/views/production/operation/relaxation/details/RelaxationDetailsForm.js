/*
     Title: Relaxation Details Form
     Description: Relaxation Details Form
     Author: Alamgir Kabir
     Date: 18-May-2023
     Modified: 18-May-2023
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
import { formattedDate, formattedTime } from 'utility/dateHelpers';
import { randomIdString } from 'utility/Utils';
import '../../../../../assets/scss/production/form-page-custom-table.scss';
import { fetch_relaxation_by_master_id, resetRelaxationDetails } from '../store/actions';
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
    id: 'relaxation-details',
    name: 'Relaxation Details',
    link: "/relaxation-details",
    isActive: true,
    hidden: false
  }
];
//#endregion

const RelaxationDetailsForm = () => {
  //#region Hooks
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const masterInfo = location.state;
  const masterId = location.state.id;
  const { selectedRelaxationItem } = useSelector( ( { relaxationReducer } ) => relaxationReducer );
  const { isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
  console.log( masterInfo );
  //#endregion

  //#region Effects
  useEffect( () => {
    if ( masterId ) {
      dispatch( fetch_relaxation_by_master_id( masterId ) );
    }
  }, [dispatch, masterId] );


  //#endregion
  /**
   * For Change Route
   */
  const handleCancel = () => {
    dispatch( resetRelaxationDetails() );
    history.goBack();
  };
  //#endregion

  return (
    <>
      <UILoader
        blocking={isDataProgressCM}
        loader={<ComponentSpinner />}>
        <ActionMenu breadcrumb={breadcrumb} title={masterInfo?.totalEndLength ? 'Complete Relaxation Details' : 'Running Relaxation Details'}>
          <NavItem className="mr-1">
            <NavLink tag={Button} size="sm" color="secondary" onClick={handleCancel}>
              Cancel
            </NavLink>
          </NavItem>
        </ActionMenu>
        <FormLayout className="general-form-container p-0">
          <Row className="p-1">
            <Col lg='12' className=''>
              <FormContentLayout title="Master Information">
                <Col lg='4' md='6' xl='4'>
                  <ErpDetailsInput
                    id={randomIdString()}
                    label=" Relaxation No"
                    classNames='mt-1'
                    value={masterInfo?.relaxationNo}
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
            <Col lg='12' className='mt-1'>
              <FormContentLayout title="Details">
                <div className='p-1'>
                  <Table bordered responsive className='table-container'>
                    <thead >
                      <tr className="text-center">
                        <th className="text-nowrap sm-width"> SL/No</th>
                        <th className="text-nowrap"> Fabric Type</th>
                        <th className="text-nowrap"> Color</th>
                        <th className="text-nowrap"> Roll/SL</th>
                        <th className="text-nowrap">Start Lenght(In Yards)</th>
                        <th className="text-nowrap">Start Width(In Yards)</th>
                        <th className="text-nowrap"> Start Date</th>
                        <th className="text-nowrap"> Start Time</th>
                        <th className="text-nowrap">End Lenght(In Yards)</th>
                        <th className="text-nowrap">End Width(In Yards)</th>
                        <th className="text-nowrap"> End Date</th>
                        <th className="text-nowrap"> End Time</th>
                      </tr>
                    </thead>
                    {
                      <tbody>
                        {selectedRelaxationItem?.map( ( pt, index ) => (
                          <Fragment key={index + 1}>
                            <tr className="text-center ">
                              <td className='td-width'>{index + 1}</td>
                              <td className="text-nowrap">{pt.fabricTypeName}</td>
                              <td className="text-nowrap">{pt.colorName}</td>
                              <td className="text-nowrap">{pt.rollSlNo}</td>
                              <td className="text-nowrap">{pt.startLengthInYard ? pt.startLengthInYard : 'NA'}</td>
                              <td className="text-nowrap">{pt.startWidthInYard ? pt.startWidthInYard : 'NA'}</td>
                              <td className="text-nowrap">{formattedDate( pt.startDate )}</td>
                              <td className="text-nowrap">{formattedTime( pt.startTime )}</td>
                              <td className="text-nowrap">{pt.endLengthInYard ? pt.endLengthInYard : 'NA'}</td>
                              <td className="text-nowrap">{pt.endWidthInYard ? pt.endWidthInYard : 'NA'}</td>
                              <td className="text-nowrap">{pt.endDate ? formattedDate( pt.endDate ) : 'NA'}</td>
                              <td className="text-nowrap">{pt.endTime ? formattedTime( pt.endTime ) : 'NA'}</td>
                            </tr>
                          </Fragment>
                        ) )}
                        <tr className="text-center">
                          <td colSpan={4} className="td-width text-right">Total</td>
                          <td >{masterInfo?.totalStartLength}</td>
                          <td >{masterInfo?.totalStartWidth}</td>
                          <td></td>
                          <td></td>
                          <td >{masterInfo?.totalEndLength}</td>
                          <td >{masterInfo?.totalEndWidth}</td>
                          <td></td>
                          <td></td>
                        </tr>
                      </tbody>
                    }
                  </Table>
                </div>
              </FormContentLayout>
            </Col>
          </Row>
        </FormLayout>
      </UILoader>
    </>
  );
};

export default RelaxationDetailsForm;
