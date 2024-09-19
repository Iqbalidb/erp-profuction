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
import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Col, NavItem, NavLink, Row, Table } from 'reactstrap';
import ErpDetailsInput from 'utility/custom/customController/ErpDetailsInput';
import FormContentLayout from 'utility/custom/customController/FormContentLayout';
import FormLayout from 'utility/custom/customController/FormLayout';
import CustomPreLoader from 'utility/custom/CustomPreLoader';
import { formattedDate, formattedTime } from 'utility/dateHelpers';
import { randomIdString } from 'utility/Utils';
import '../../../../../assets/scss/production/form-page-custom-table.scss';
import { fetchSewingOutByMasterId } from '../store/actions';
const SewingOutDetails = () => {
  //#region Hooks
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { sewingOutDetails } = useSelector( ( { sewingOutReducer } ) => sewingOutReducer );
  const { isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
  const selectedRow = location.state;
  //#endregion
  console.log( selectedRow );
  //#region Effects
  useEffect( () => {
    if ( selectedRow ) {
      dispatch( fetchSewingOutByMasterId( selectedRow.id ) );
    }
  }, [dispatch, selectedRow] );
  //#endregion

  //For Cancel Route
  const handleCancel = () => {
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
      id: 'sewing-out',
      name: 'Sewing Out ',
      link: "/sewing-out",
      isActive: false,
      hidden: false
    },

    {
      id: 'sewing-out-details',
      name: 'Sewing Out Details',
      link: "/sewing-out-details",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion
  /**
   * Loader
   */
  if ( !sewingOutDetails ) {
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
        <ActionMenu breadcrumb={breadcrumb} title={selectedRow?.passedProcessName !== null ? "Passed Sewing Out Details" : "Sewing Out Details"}>
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
                    value={selectedRow?.lineName}
                  />
                  <ErpDetailsInput
                    id={randomIdString()}
                    label=" Buyer"
                    classNames='mt-1'
                    value={selectedRow?.buyerName}
                  />
                  <ErpDetailsInput
                    id={randomIdString()}
                    label="  Inspection Date"
                    classNames='mt-1'
                    value={formattedDate( selectedRow?.date )}
                  />
                  <ErpDetailsInput
                    id={randomIdString()}
                    label=" Machine"
                    classNames='mt-1'
                    value={selectedRow?.machineCount}
                  />
                </Col>
                <Col lg='4' md='6' xl='4'>
                  <ErpDetailsInput
                    id={randomIdString()}
                    label=" Floor"
                    classNames='mt-1'
                    value={selectedRow?.floorName}
                  />
                  <ErpDetailsInput
                    id={randomIdString()}
                    label=" Style"
                    classNames='mt-1'
                    value={selectedRow?.styleNo}
                  />
                  <ErpDetailsInput
                    id={randomIdString()}
                    label=" Time"
                    classNames='mt-1'
                    value={formattedTime( selectedRow?.time )}
                  />
                  <ErpDetailsInput
                    id={randomIdString()}
                    label=" Remarks"
                    classNames='mt-1'
                    value={selectedRow?.remark}
                  />
                </Col>
                <Col lg='4' md='6' xl='4'>
                  <ErpDetailsInput
                    id={randomIdString()}
                    label=" Zone Owner"
                    classNames='mt-1'
                    value={selectedRow?.ownerName}
                  />
                  <ErpDetailsInput
                    id={randomIdString()}
                    label=" Style Category"
                    classNames='mt-1'
                    value={selectedRow?.styleCategory}
                  />
                  <ErpDetailsInput
                    id={randomIdString()}
                    label=" Taget Qty"
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
                    <thead>
                      <tr className="text-center">
                        <th className="text-nowrap sm-width"> SL</th>
                        <th className="text-nowrap"> Size</th>

                        <th className="text-nowrap"> Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sewingOutDetails?.map( ( pt, index ) => (
                        <Fragment key={pt.sizeId}>
                          <tr className="text-center ">
                            <td className='md-width'>{index + 1}</td>
                            <td className='td-width'>{pt.sizeName}</td>

                            <td>{pt.hourQuantity}</td>
                          </tr>
                        </Fragment>
                      ) )}
                      <tr>
                        <td className="text-right" colSpan={2}>Total</td>
                        <td className=" text-center">{selectedRow?.totalQuantity}</td>
                      </tr>
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

export default SewingOutDetails;
