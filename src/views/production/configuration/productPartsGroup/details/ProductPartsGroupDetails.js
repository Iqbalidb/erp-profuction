/*
     Title: Product Parts Group Details Form
     Description: Product Parts Group Details Form
     Author: Alamgir Kabir
     Date: 30-May-2022
     Modified: 30-May-2022
*/
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import axios from 'axios';
import ActionMenu from 'layouts/components/menu/action-menu';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Card, Col, FormGroup, Label, NavItem, NavLink, Row } from 'reactstrap';
import { baseAxios } from 'services';
import { STYLE_WISE_PRODUCT_PARTS_GROUP_API } from 'services/api-end-points/production/v1';
import { notify } from 'utility/custom/notifications';

const ProductPartsGroupDetails = () => {
  //#region Hooks
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const id = location.state;
  //#region States
  const [selectedColor, setSelectedColor] = useState();
  const productPartsList = selectedColor?.colorList?.map( cl => cl?.list );

  const flattenedProductParts = productPartsList?.flat();
  const uniQueProductParts = [...new Set( flattenedProductParts?.map( m => m?.productPartsName ) )];
  const productParts = uniQueProductParts.toString();
  const [isDataLoading, setIsDataLoading] = useState( false );
  //#endregion

  //#region Effects
  /**
   * Get Style,Product Parts and Garments Color with Single  Request
   */

  useEffect( () => {
    const fetchDependencies = async () => {
      const selectedProductPartsGroupRequest = baseAxios.get( STYLE_WISE_PRODUCT_PARTS_GROUP_API.fetch_by_id, { params: { id } } );
      setIsDataLoading( true );
      try {
        const [selectedProductPartsGroupResponse] = await axios.all( [selectedProductPartsGroupRequest] );

        setSelectedColor( selectedProductPartsGroupResponse.data.data );
        setIsDataLoading( false );

      } catch ( err ) {
        notify( 'error', 'Something went wrong!! Please try again' );
        setIsDataLoading( false );
        history.goBack();
      }
    };
    fetchDependencies();
  }, [id] );
  //#endregion
  /**
   * Back to prev route
   */
  const onCancel = () => {
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
      id: 'product-parts-group',
      name: 'Product Part Group',
      link: "/product-parts-group",
      isActive: false,
      hidden: false
    },
    {
      id: 'product-parts-group-details',
      name: 'Product Parts Group Details',
      link: "/product-parts-group-details",
      isActive: true,
      hidden: false
    },
  ];
  //#endregion
  return (
    <div className="p-1 mt-3">

      <UILoader
        blocking={isDataLoading}
        loader={<ComponentSpinner />}>
        <ActionMenu breadcrumb={breadcrumb} title=" Product Parts Group Details ">
          <NavItem className="mr-1">
            <NavLink tag={Button} size="sm" color="secondary" onClick={onCancel}>
              Cancel
            </NavLink>
          </NavItem>
        </ActionMenu>
        <Card className="p-2">
          <Row>
            <Col xs="12" sm="12" md="12" lg="4" xl="4">
              <FormGroup tag={Col} xs="12">
                <Label className="text-dark font-weight-bold" for="style">
                  Style
                </Label>
                <p>{selectedColor?.styleNo}</p>
              </FormGroup>
            </Col>
            <Col xs="12" sm="12" md="12" lg="4" xl="4">
              <FormGroup tag={Col} xs="12">
                <Label className="text-dark font-weight-bold" for="colorStatus">
                  Color Status
                </Label>
                <p>{selectedColor?.colorStatus}</p>
              </FormGroup>
            </Col>
            <Col xs="12" sm="12" md="12" lg="4" xl="4">
              <FormGroup tag={Col} xs="12">
                <Label className="text-dark font-weight-bold" for="productParts">
                  Product Parts
                </Label>
                <p>{productParts}</p>
              </FormGroup>
            </Col>
          </Row>
        </Card>
        <Row>
          {selectedColor?.colorList?.map( ( styleColor, styleColorIndex ) => {
            return (
              <Col lg={4} key={styleColorIndex}>
                <Card body className="p-2">
                  <FormGroup row className="mb-0 lign-items-center">
                    <Label sm={3}>Color</Label>
                    <Label sm={9}>{` : ${styleColor.styleColorName}`}</Label>
                  </FormGroup>
                  <FormGroup row className="mb-0 table-primary text-dark">
                    <Label sm={3}>Parts Name</Label>
                    <Label sm={6}>Color Name</Label>
                    <Label sm={3}>Part Group</Label>
                  </FormGroup>
                  {styleColor?.list?.map( ( pp, productPartsIndex ) => {
                    return (
                      <FormGroup key={productPartsIndex} row className="align-items-center">
                        <Label for={`productParts_${styleColorIndex}_${productPartsIndex}`} sm={3}>
                          {pp?.productPartsName}
                        </Label>
                        <Col sm={6}>{pp?.colorName}</Col>
                        <Col sm={3}>{pp?.partGroupsName}</Col>
                      </FormGroup>
                    );
                  } )}
                </Card>
              </Col>
            );
          } )}
        </Row>
      </UILoader>
    </div>
  );
};

export default ProductPartsGroupDetails;
