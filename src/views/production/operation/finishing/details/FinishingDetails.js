/*
   Title:SewingOut Details
   Description:SewingOut Details
   Author: Iqbal Hossain
   Date: 05-January-2022
   Modified: 05-January-2022
*/

import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import ActionMenu from 'layouts/components/menu/action-menu';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Col, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import ErpDetailsInput from 'utility/custom/customController/ErpDetailsInput';
import FormContentLayout from 'utility/custom/customController/FormContentLayout';
import FormLayout from 'utility/custom/customController/FormLayout';
import { formattedDate, formattedTime } from 'utility/dateHelpers';
import { randomIdString } from 'utility/Utils';
import '../../../../../assets/scss/production/form-page-custom-table.scss';
import { fetchFinishingDetailsByMasterId, resetFinishingState } from '../store/actions';
const FinishingDetails = () => {
  //#region Hooks
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { selectedItems } = useSelector( ( { finishingReducer } ) => finishingReducer );
  const { isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );

  const selectedRow = location.state;
  console.log( selectedRow );
  //#endregion

  //#region Effects
  useEffect( () => {
    if ( selectedRow ) {
      dispatch( fetchFinishingDetailsByMasterId( selectedRow.id ) );
    }
  }, [dispatch, selectedRow] );
  //#endregion

  //Handle Cancel
  const handleCancel = () => {
    dispatch( resetFinishingState() );
    history.goBack();
  };


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
      id: 'finishing',
      name: 'Finishing',
      link: "/finishing",
      isActive: false,
      hidden: false
    },

    {
      id: 'finishing-details',
      name: 'Finishing Details  ',
      link: "/finishing-details",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion
  return (
    <>
      <UILoader
        blocking={isDataProgressCM}
        loader={<ComponentSpinner />}>
        <ActionMenu breadcrumb={breadcrumb} title="Finishing Details">
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
                    label="Process Name"
                    classNames='mt-1'
                    value={selectedRow?.passedProcessName}
                  />
                  <ErpDetailsInput
                    id={randomIdString()}
                    label="Style Category"
                    classNames='mt-1'
                    value={selectedRow?.styleCategory}
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
                </Col>
                <Col lg='4' md='6' xl='4'>
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
                    value={formattedTime( selectedRow?.time )}
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
                        <th className="text-nowrap sm-width"> SL</th>
                        <th className="text-nowrap"> Operator Name</th>

                        <th className="text-nowrap">Inspection/hour</th>
                        <th className="text-nowrap">Passed Quantity</th>
                        <th className="text-nowrap">Defect Quantity</th>
                        <th className="text-nowrap">Reject Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedItems?.map( ( pt, index ) => (
                        <tr className="text-center" key={index}>
                          <td className='sm-width'>{index + 1}</td>
                          <td className='td-width'>{pt.operatorName}</td>
                          <td>{pt.inspactionQuantity}</td>
                          <td>{pt.passedQuantity}</td>
                          <td>{pt.defectQuantity}</td>
                          <td>{pt.rejectQuantity}</td>
                        </tr>
                      ) )}
                    </tbody>
                    <tbody className="border-bottom">
                      {selectedItems.length > 0 && (
                        <tr >
                          <td className="text-center" colSpan={2}>
                            <Label for="name" >
                              Total
                            </Label>
                          </td>
                          <td className="text-center">{selectedRow?.totalInspaction}</td>
                          <td className="text-center">{selectedRow?.totalPassed}</td>
                          <td className="text-center">{selectedRow?.totalDefect}</td>
                          <td className="text-center">{selectedRow?.totalReject}</td>
                        </tr>
                      )}
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

export default FinishingDetails;
