/*
     Title: Production process Group Details
     Description: Production process Group Details
     Author: Alamgir Kabir
     Date: 02-January-2023
     Modified: 02-January-2023
*/

import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import ActionMenu from 'layouts/components/menu/action-menu';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Col, NavItem, NavLink, Row, Table } from 'reactstrap';
import ErpDetailsInput from 'utility/custom/customController/ErpDetailsInput';
import FormContentLayout from 'utility/custom/customController/FormContentLayout';
import FormLayout from 'utility/custom/customController/FormLayout';
import { randomIdString } from 'utility/Utils';
import '../../../../../assets/scss/production/form-page-custom-table.scss';
import { fetchProductionProcessGroupById } from '../store/action';

const ProductionProcessGroupDetails = () => {
  //#region Hooks
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const productionProcessGroupId = location.state;
  const { selectedItem } = useSelector( ( { productionProcessGroupReducer } ) => productionProcessGroupReducer );
  const { isDataProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
  //#endregion

  //#region Effects
  useEffect( () => {
    if ( productionProcessGroupId ) {
      dispatch( fetchProductionProcessGroupById( productionProcessGroupId ) );
    }
  }, [dispatch, productionProcessGroupId] );

  //For Cancel
  const handleCancel = () => {
    history.push( '/production-process-group' );
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
      id: 'production-process-group',
      name: 'Production Process Group',
      link: "/production-process-group",
      isActive: false,
      hidden: false
    },
    {
      id: 'production-process-group-details',
      name: 'Production Process Group Details ',
      link: "/production-process-group-details",
      isActive: true,
      hidden: false
    },
  ];
  //#endregion
  return (
    <>
      <UILoader
        blocking={isDataProgressCM}
        loader={<ComponentSpinner />}>
        <ActionMenu breadcrumb={breadcrumb} title=" Production Process Group Details">
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
                <Col lg='6' md='6' xl='6'>
                  <ErpDetailsInput
                    id={randomIdString()}
                    label=" Group Name"
                    classNames='mt-1'
                    value={selectedItem?.groupName}
                  />
                </Col>
                <Col lg='6' md='6' xl='6'>
                  <ErpDetailsInput
                    id={randomIdString()}
                    label=" Status"
                    classNames='mt-1'
                    value={selectedItem?.status ? 'Active' : 'Inactive'}
                  />
                </Col>

              </FormContentLayout>
            </Col>
            <Col lg='12' className='mt-1'>
              <FormContentLayout title="Details">
                <div className='p-1'>
                  <Table bordered responsive className='table-container'>
                    <thead >
                      <tr className="text-center" >
                        <th className="text-nowrap sm-width"> SL</th>

                        <th>sort order</th>
                        <th>Production process</th>
                        <th>Production Sub Process</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedItem?.list?.map( ( item, itemIndex ) => {
                        return (
                          <tr key={itemIndex + 1} className="text-center" >
                            <td className='sm-width'>{itemIndex + 1}</td>

                            <td className='td-width'>{item.sortOrder}</td>
                            <td>{item.processName}</td>
                            <td>{item.subProcessName}</td>
                          </tr>
                        );
                      } )}
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

export default ProductionProcessGroupDetails;
