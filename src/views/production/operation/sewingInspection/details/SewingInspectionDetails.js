/*
   Title: SewingInspection Details
   Description: SewingInspection Details
   Author: Iqbal Hossain
   Date: 05-January-2022
   Modified: 05-January-2022
*/

import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import ActionMenu from 'layouts/components/menu/action-menu';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Col, NavItem, NavLink, Row, Table } from 'reactstrap';
import ErpDetailsInput from 'utility/custom/customController/ErpDetailsInput';
import FormContentLayout from 'utility/custom/customController/FormContentLayout';
import FormLayout from 'utility/custom/customController/FormLayout';
import CustomPreLoader from 'utility/custom/CustomPreLoader';
import { formattedDate } from 'utility/dateHelpers';
import '../../../../../assets/scss/production/form-page-custom-table.scss';
import { randomIdString } from '../../../../../utility/Utils';
import { fetchSewingInspectionByMasterId, resetSewingInspectionDetails } from '../store/actions';
const SewingInspectionDetails = () => {
  //#region Hooks
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { sewingInspectionDetails } = useSelector( ( { sewingInspectionReducer } ) => sewingInspectionReducer );
  const { isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
  const selectedRow = location.state;
  //#endregion

  //#region Effects
  useEffect( () => {
    if ( selectedRow ) {
      dispatch( fetchSewingInspectionByMasterId( selectedRow.id ) );
    }
  }, [dispatch, selectedRow] );
  //#endregion

  //Handle Cancel
  const handleCancel = () => {
    dispatch( resetSewingInspectionDetails() );
    history.goBack();
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
      id: 'sewing-inspection-details',
      name: 'Sewing Inspection Details',
      link: "/sewing-inspection-details",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion
  if ( !sewingInspectionDetails ) {
    return (
      <div>
        <CustomPreLoader />
      </div>
    );
  }
  return (
    <>
      <UILoader
        blocking={isDataProgressCM}
        loader={<ComponentSpinner />}>
        <ActionMenu breadcrumb={breadcrumb} title={!moment( selectedRow?.date ).isBefore( new Date(), 'day' ) ? "Todays Sewing Inspection Details" : 'Previous Sewing Inspection Details'}>
          <NavItem className="mr-1">
            <NavLink tag={Button} size="sm" color="secondary" onClick={handleCancel}>
              Cancel
            </NavLink>
          </NavItem>
        </ActionMenu>
        <FormLayout className='general-form-container p-0 '>

          <Row className="p-1">
            <Col lg='12' className=''>
              <FormContentLayout title="Master Information">
                <Col lg='4' md='6' xl='4'>
                  <ErpDetailsInput
                    id={randomIdString()}
                    label="Line"
                    classNames='mt-1'
                    value={selectedRow?.lineName}
                  />
                  <ErpDetailsInput
                    id={randomIdString()}
                    label="Buyer"
                    classNames='mt-1'
                    value={selectedRow?.buyerName}
                  />
                  <ErpDetailsInput
                    id={randomIdString()}
                    label="Inspection Date"
                    classNames='mt-1'
                    value={formattedDate( selectedRow?.date )}
                  />
                  <ErpDetailsInput
                    id={randomIdString()}
                    label="Machine"
                    classNames='mt-1'
                    value={selectedRow?.machineCount}
                  />
                </Col>
                <Col lg='4' md='6' xl='4'>
                  <ErpDetailsInput
                    id={randomIdString()}
                    label="Floor"
                    classNames='mt-1'
                    value={selectedRow?.floorName}
                  />
                  <ErpDetailsInput
                    id={randomIdString()}
                    label="Style"
                    classNames='mt-1'
                    value={selectedRow?.styleNo}
                  />
                  <ErpDetailsInput
                    id={randomIdString()}
                    label="Time"
                    classNames='mt-1'
                    value={selectedRow?.time}
                  />
                  <ErpDetailsInput
                    id={randomIdString()}
                    label="Remarks"
                    classNames='mt-1'
                    value={selectedRow?.remark}
                  />
                </Col>
                <Col lg='4' md='6' xl='4'>
                  <ErpDetailsInput
                    id={randomIdString()}
                    label="  Zone Owner"
                    classNames='mt-1'
                    value={selectedRow?.ownerName}
                  />
                  <ErpDetailsInput
                    id={randomIdString()}
                    label="Style Category"
                    classNames='mt-1'
                    value={selectedRow?.styleCategory}
                  />
                  <ErpDetailsInput
                    id={randomIdString()}
                    label="Taget Qty"
                    classNames='mt-1'
                    value={selectedRow?.targetValue}
                  />
                </Col>

              </FormContentLayout>
            </Col>
            <Col lg='12' className='mt-1'>
              <FormContentLayout title="Details">
                <div className='p-1'>

                  <Table bordered responsive className='table-container'>
                    <thead >
                      <tr>
                        <th>Process Name</th>
                        <th>Process Type</th>
                        <th>Production/Hour</th>
                        <th>Previous Repair</th>
                        <th>Inspection</th>
                        <th>Passed Quantity</th>
                        <th>Defect Quantity</th>
                        <th>Reject Quantity</th>
                      </tr>
                    </thead>
                    <tbody className="text-center text-nowrap">
                      {sewingInspectionDetails?.map( sid => (
                        <tr key={sid.criticalProcessId}>
                          <td className='td-width'>{sid.criticalProcessName}</td>
                          <td>{sid.processType}</td>
                          <td>{sid.hourProduction}</td>
                          <td>{sid.previousProduction}</td>
                          <td>{sid.inspectionQuantity}</td>
                          <td>{sid.passedQuantity}</td>
                          <td>{sid.defectQuantity}</td>
                          <td>{sid.rejectQuantity}</td>
                        </tr>
                      ) )}
                    </tbody>
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

export default SewingInspectionDetails;
