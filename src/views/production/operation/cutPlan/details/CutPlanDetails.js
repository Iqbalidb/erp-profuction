/*
   Title: Cut Plan Details
   Description: Cut Plan Details
   Author: Iqbal Hossain
   Date: 05-January-2022
   Modified: 05-January-2022
*/

import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import ActionMenu from 'layouts/components/menu/action-menu';
import { useEffect, useState } from 'react';
import { CheckSquare } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Col, Label, NavItem, NavLink, Table } from 'reactstrap';
import { baseAxios } from 'services';
import { CUTTINGS_API } from 'services/api-end-points/production/v1';
import FormContentLayout from 'utility/custom/FormContentLayout';
import FormLayout from 'utility/custom/FormLayout';
import { ErpInput } from 'utility/custom/customController/ErpInput';
import { formattedDate } from 'utility/dateHelpers';
import { fetchCutPlanById } from '../store/actions';
import classess from '../styles/CutPlanConfirmForm.module.scss';

const CutPlanDetails = () => {
  //#region hooks
  const history = useHistory();
  const location = useLocation();
  const selectedRow = location.state;
  const dispatch = useDispatch();
  const { selectedItem } = useSelector( ( { cutPlanReducer } ) => cutPlanReducer );
  //#endregion

  //#region state
  const [cuttingDetails, setCuttingDetails] = useState( { ...selectedItem } );
  //#endregion

  //#region Effects
  useEffect( () => {
    if ( selectedRow ) {
      const GetCutPlanDetails = async () => {
        const res = await baseAxios.get( CUTTINGS_API.fetch_cuttings_by_cut_plan, {
          params: { id: selectedRow.id }
        } );
        const masterData = res.data.data;
        if ( masterData ) {
          const item = masterData.find( m => m );
          dispatch( fetchCutPlanById( item ) );
        }
      };
      GetCutPlanDetails();
    }
  }, [dispatch, selectedRow] );

  useEffect( () => {
    if ( selectedItem ) {
      setCuttingDetails( selectedItem );
    }
  }, [selectedItem] );
  //#endregion
  /**
   * Back to prev route
   */
  const handleCancel = () => {
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
      id: 'cut-plan',
      name: 'Cut Plan',
      link: "/cut-plan",
      isActive: false,
      hidden: false
    },
    {
      id: 'cut-plan-details',
      name: 'Cut Plan Details ',
      link: "/cut-plan-details",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion
  /**
   * Loader
   */
  if ( !selectedItem ) {
    return (
      <div>
        <ComponentSpinner />
      </div>
    );
  }
  return (
    <div className="">
      <ActionMenu breadcrumb={breadcrumb} title="Cut Plan Details">

        <NavItem className="mr-1">
          <NavLink tag={Button} size="sm" color="secondary" onClick={handleCancel}>
            Cancel
          </NavLink>
        </NavItem>
      </ActionMenu>
      <FormLayout isNeedTopMargin={true}>
        <FormContentLayout title='Master Information'>
          <Col xs={12} sm={6} md={6} lg={4} xl={2} className="text-nowrap text-left">
            {/* <Label className="text-dark font-weight-bold " for="styleNo">
              Buyer Name
            </Label> */}
            <ErpInput label='Buyer Name' value={cuttingDetails?.masterData?.buyerName} disabled />
            {/* <p className="h4 font-weight-bold ">{}</p> */}
          </Col>
          <Col xs={12} sm={6} md={6} lg={4} xl={2} className="text-nowrap text-left">
            <ErpInput label=' Style No' value={cuttingDetails?.masterData?.styleNo} disabled />
          </Col>

          <Col xs={12} sm={6} md={6} lg={4} xl={2} className="text-nowrap text-left">
            <ErpInput label='Style Category' value={cuttingDetails?.masterData?.styleCategory} disabled />
          </Col>

          <Col xs={12} sm={6} md={6} lg={4} xl={2} className="text-nowrap text-left">
            <ErpInput label=' Cut Plan No' value={cuttingDetails?.masterData?.cutPlanNo} disabled />
          </Col>

          <Col xs={12} sm={6} md={6} lg={4} xl={2} className="text-nowrap text-left">
            <ErpInput label=' Cut No' value={cuttingDetails?.masterData?.cutNo} disabled />
          </Col>

          <Col xs={12} sm={6} md={6} lg={4} xl={2} className="text-nowrap text-left">
            <ErpInput label='  Start Date' value={formattedDate( cuttingDetails?.masterData?.startDate )} disabled />
          </Col>
        </FormContentLayout>

        <FormContentLayout title='Cut Info' marginTop>
          <Table size="sm" bordered={true} responsive={true}>
            <thead className={` text-center table-bordered `}>
              <tr>
                <th>Size</th>
                {cuttingDetails?.marker?.listMarkerSize?.map( s => (
                  <th key={s.id}> {s.sizeName}</th>
                ) )}
                <th>Total</th>
                <th>Width</th>
                <th>Length</th>
              </tr>
            </thead>
            <tbody className="text-center">
              <tr>
                <td className="text-dark font-weight-bold">Ratio</td>
                {cuttingDetails?.marker?.listMarkerSize?.map( r => (
                  <td key={r.id}>{r.ratio}</td>
                ) )}
                <td className="text-dark font-weight-bold">{cuttingDetails?.marker?.totalQty}</td>
                <td>{cuttingDetails?.marker?.width}</td>
                <td>{cuttingDetails?.marker?.length}</td>
              </tr>
            </tbody>
          </Table>
          <div className="mt-1 grid">
            <Label className="text-dark font-weight-bolder g-col-2" for="productParts">
              Product Parts:
            </Label>
            {cuttingDetails?.productParts?.map( pp => (
              // <ul key={pp.productPartsId} style={{ listStyleType: 'square' }}>
              //   <li className="text-nowrap">{pp.productPartsName}</li>
              // </ul>
              <Label className="text-dark font-weight-bold g-col-10 px-1" key={pp.productPartsId}>
                {' '}
                <CheckSquare size={14} /> {pp.productPartsName}
              </Label>
            ) )}
          </div>
        </FormContentLayout>

        <FormContentLayout title='Cut Details' marginTop>
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
              {cuttingDetails?.masterData?.cuttingDetailsList?.map( cd => (
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
        </FormContentLayout>
      </FormLayout>

    </div>
  );
};

export default CutPlanDetails;
