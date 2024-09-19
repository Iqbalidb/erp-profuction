/*
   Title: Product Parts Group Edit Form
   Description: Product Parts Group Edit Form
   Author: Alamgir Kabir
   Date: 15-May-2022
   Modified: 15-May-2022
*/
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import axios from 'axios';
import ActionMenu from 'layouts/components/menu/action-menu';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import Select from 'react-select';
import { Button, Card, Col, FormGroup, Label, NavItem, NavLink, Row } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios, merchandisingAxiosInstance } from 'services';
import { GARMENT_COLORS_API } from 'services/api-end-points/merchandising/v1';
import { PART_GROUPS_API, PRODUCT_PARTS_API, STYLE_WISE_PRODUCT_PARTS_GROUP_API } from 'services/api-end-points/production/v1';
import { mapArrayToDropdown } from 'utility/commonHelper';
import { ErpInput } from 'utility/custom/customController/ErpInput';
import ErpSelect from 'utility/custom/customController/ErpSelect';
import FormContentLayout from 'utility/custom/FormContentLayout';
import FormLayout from 'utility/custom/FormLayout';
import { notify } from 'utility/custom/notifications';
import { errorResponse, selectThemeColors } from 'utility/Utils';
import { v4 as uuid } from 'uuid';

const ProductPartsGroupEditForm = () => {
  //#region Hooks
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const id = location.state;
  const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
  //#region States
  const [productPart, setProductPart] = useState( null );
  const [productParts, setProductParts] = useState( [] );
  const [garmentColors, setGarmentColors] = useState();
  const [colorStatus, setColorStatus] = useState( null );
  const [colorStatuses] = useState( [
    { value: 'Mixed', label: 'Mixed' },
    { value: 'Solid', label: 'Solid' }
  ] );
  const [selectedProductParts, setSelectedProductParts] = useState();
  const [partGroups, setPartGroups] = useState( [] );
  //#endregion

  //#region Effects
  /**
   * Get Style,Product Parts and Garments Color with Single  Request
   */
  useEffect( () => {
    const fetchDependencies = async () => {
      const productPartsRequest = baseAxios.get( PRODUCT_PARTS_API.fetch_all_active );
      const garmentColorRequest = merchandisingAxiosInstance.get( GARMENT_COLORS_API.fetch_all );
      const selectedProductPartsGroupRequest = baseAxios.get( STYLE_WISE_PRODUCT_PARTS_GROUP_API.fetch_by_id, { params: { id } } );
      const partGroupsRequest = baseAxios.get( PART_GROUPS_API.fetch_all_active );
      try {
        const [productPartsResponse, garmentColorResponse, selectedProductPartsGroupResponse, partGroupsResponse] = await axios.all( [
          productPartsRequest,
          garmentColorRequest,
          selectedProductPartsGroupRequest,
          partGroupsRequest
        ] );
        const productPartsDdl = mapArrayToDropdown( productPartsResponse.data.data, 'name', 'id' );
        const garmentColorsDdl = mapArrayToDropdown( garmentColorResponse.data.data, 'name', 'id' );
        const partGroupsDdl = mapArrayToDropdown( partGroupsResponse.data.data, 'name', 'id' );
        const productPartsDetails = selectedProductPartsGroupResponse.data.data;

        productPartsDetails.colorList.map( cl => {
          cl.boxId = uuid();
          cl.list.map( l => {
            const selectedColor = garmentColorsDdl.find( gc => gc.id === l.colorId );
            const selectedPartGroup = partGroupsDdl.find( gc => gc.id === l.partGroupsId );
            l.colors = garmentColorsDdl;
            l.color = {
              ...selectedColor,
              value: l.colorId,
              label: l.colorName
            };
            l.partGroups = partGroupsDdl;
            l.partGroup = {
              ...selectedPartGroup,
              value: l.partGroupsId,
              label: l.partGroupsName
            };
            l.uniId = uuid();
            return l;
          } );
          return cl;
        } );
        const selectedColorStatus = colorStatuses.find( cs => cs.value === productPartsDetails.colorStatus );

        const uniqueProductParts = [...new Set( productPartsDetails.colorList.map( cl => cl.list.map( l => l.productPartsName ) ).flat() )];

        const filteredProductParts = productPartsDdl.filter( item => uniqueProductParts.indexOf( item.name ) > -1 );

        setGarmentColors( garmentColorsDdl );
        setProductParts( productPartsDdl );
        setProductPart( filteredProductParts );
        setColorStatus( selectedColorStatus );
        setSelectedProductParts( productPartsDetails );
        setPartGroups( partGroupsDdl );
      } catch ( err ) {
        notify( 'error', 'Dependencies not loaded!!' );
      }
    };
    fetchDependencies();
  }, [colorStatuses, id] );
  //#endregion

  //#region Events

  /**
   * For Color Status Change
   * @param {item} item dropdown
   */
  const onColorStatusChange = item => {
    if ( item ) {
      const _selectedProductParts = _.cloneDeep( selectedProductParts );
      _selectedProductParts.colorList.forEach( sc => sc.list.forEach( pp => ( pp.color = { label: sc.styleColorName, value: sc.styleColorId } ) ) );
      setColorStatus( item );
      setSelectedProductParts( _selectedProductParts );
    }
  };

  /**
   * For Product Parts Change
   * @param items => dropdown items[]
   * @param manupulatedItem => either new added item in ddl or removed item from ddl
   */
  const onProductPartsChange = ( items, manupulatedItem ) => {
    if ( items ) {
      const _selectedProductParts = _.cloneDeep( selectedProductParts );
      if ( manupulatedItem.action === 'select-option' ) {
        const _colorList = _selectedProductParts?.colorList?.map( cl => {
          const uniqueId = uuid();
          const newProductPart = {
            ...manupulatedItem.option,
            productPartsId: manupulatedItem.option.id,
            productPartsName: manupulatedItem.option.name,
            color: colorStatus?.value === 'Solid' ? { value: cl.styleColorId, label: cl.styleColorName } : null,
            colors: garmentColors,
            styleColorId: cl.styleColorId,
            styleColorName: cl.styleColorName,
            partGroups,
            partGroup: null,
            uniId: `${cl.styleColorName}_${manupulatedItem.option.name}_${uniqueId}`
          };
          return {
            ...cl,
            list: [...cl.list, newProductPart]
          };
        } );
        _selectedProductParts.colorList = _colorList;
      } else {
        const _colorList = _selectedProductParts?.colorList?.map( cl => {
          const removeItem = cl.list.filter( l => l.productPartsId !== manupulatedItem.removedValue.id );
          return {
            ...cl,
            list: removeItem
          };
        } );
        _selectedProductParts.colorList = _colorList;
      }
      setSelectedProductParts( _selectedProductParts );
      setProductPart( items );
    }
  };

  /**
   * For Product Parts Color Change
   */
  const onProductPartsColorChange = ( colorItem, boxId, ppUniId ) => {
    if ( colorItem ) {
      const newProductPartDetails = {
        ...selectedProductParts,
        colorList: selectedProductParts?.colorList?.map( sc => {
          if ( sc.boxId === boxId ) {
            return {
              ...sc,
              list: sc.list.map( pp => {
                if ( pp.uniId === ppUniId ) {
                  return { ...pp, color: colorItem };
                }
                return pp;
              } )
            };
          }
          return sc;
        } )
      };
      setSelectedProductParts( newProductPartDetails );
    }
  };

  /**
   * For PartGroup  Change
   */
  const onPartGroupChange = ( partItem, boxId, ppUniId ) => {
    if ( partItem ) {
      const newProductPartDetails = {
        ...selectedProductParts,
        colorList: selectedProductParts?.colorList?.map( sc => {
          if ( sc.boxId === boxId ) {
            return {
              ...sc,
              list: sc.list.map( pp => {
                if ( pp.uniId === ppUniId ) {
                  return { ...pp, partGroup: partItem };
                }
                return pp;
              } )
            };
          }
          return sc;
        } )
      };
      setSelectedProductParts( newProductPartDetails );
    }
  };
  /**
   * For Cancel
   */
  const onCancel = () => {
    history.goBack();
  };
  /**
   *   For Product Parts Submission
   */
  const onSubmit = async () => {
    const styleColorList = selectedProductParts?.colorList
      ?.map( sc => sc?.list?.map( pp => ( {
        ...pp,
        id,
        styleColorId: sc.styleColorId,
        styleColorName: sc.styleColorName
      } ) )
      )
      .flat();
    const payload = {
      styleId: selectedProductParts?.styleId,
      styleNo: selectedProductParts?.styleNo,
      colorStatus: colorStatus?.label,
      list: styleColorList.map( sc => ( {
        styleWiseProductPartsGroupsId: sc?.id,
        styleColorId: sc?.styleColorId,
        styleColorName: sc?.styleColorName,
        productPartsId: sc?.productPartsId,
        productPartsName: sc?.productPartsName,
        colorId: sc?.color?.value,
        colorName: sc?.color?.label,
        partGroupsId: sc?.partGroup?.value,
        partGroupsName: sc?.partGroup?.label
      } ) )
    };
    const isValid = payload.list.every( item => item.colorId );
    const selectedProductPart = productPart?.map( m => m?.label );
    const selectedProductPartColor = selectedProductParts?.colorList?.map( sc => sc?.list?.map( cc => cc?.color ) );
    const flattenedSelectedProductPartColor = selectedProductPartColor?.flat();
    const isSelectedProductPartsColor = flattenedSelectedProductPartColor?.includes( null );
    if ( isValid && colorStatus?.value && selectedProductPart?.length && !isSelectedProductPartsColor ) {
      dispatch( dataSubmitProgressCM( true ) );

      try {
        const res = await baseAxios.put( STYLE_WISE_PRODUCT_PARTS_GROUP_API.update, payload, { params: { id: selectedProductParts.id } } );
        notify( 'success', 'Product part group has been updated Successfully' );
        dispatch( dataSubmitProgressCM( false ) );
        onCancel();
      } catch ( error ) {
        errorResponse( error );
        dispatch( dataSubmitProgressCM( false ) );
      }
    } else {
      notify( 'warning', 'Please provide all information!!!' );
    }
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
      id: 'product-parts-group',
      name: 'Product Part Group',
      link: "/product-parts-group",
      isActive: false,
      hidden: false
    },
    {
      id: 'product-parts-group-edit',
      name: 'Edit Product Parts Group',
      link: "/product-parts-group-edit",
      isActive: true,
      hidden: false
    },

  ];
  //#endregion
  /**
 * Loader
 */
  if ( !selectedProductParts ) {
    return (
      <div>
        <ComponentSpinner />
      </div>
    );
  }
  return (
    <div >
      <UILoader
        blocking={iSubmitProgressCM}
        loader={<ComponentSpinner />}>
        <ActionMenu breadcrumb={breadcrumb} title="Edit Product Parts Group ">
          <NavItem className="mr-1">
            <NavLink tag={Button} size="sm" color="primary" type="submit" onClick={onSubmit}>
              Save
            </NavLink>
          </NavItem>
          <NavItem className="mr-1">
            <NavLink tag={Button} size="sm" color="secondary" onClick={onCancel}>
              Cancel
            </NavLink>
          </NavItem>
        </ActionMenu>
        <FormLayout isNeedTopMargin={true}>
          <FormContentLayout title='Basic Information' >
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Row>
                <Col xs={12} sm={12} md={12} lg={3} xl={3}>
                  <ErpInput
                    defaultValue={selectedProductParts?.styleNo}
                    disabled
                    label='Style'
                  />
                </Col>

                <Col xs={12} sm={12} md={12} lg={3} xl={3}>
                  <ErpSelect
                    label='Color Status'
                    id="colorStatus"
                    theme={selectThemeColors}
                    options={colorStatuses}
                    className="erp-dropdown-select"
                    classNamePrefix="dropdown"
                    value={colorStatus}
                    onChange={onColorStatusChange}
                  />
                </Col>

                <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                  <ErpSelect
                    label='Product Parts'
                    isMulti
                    id="productParts"
                    name="productParts"
                    isSearchable
                    isClearable
                    theme={selectThemeColors}
                    options={productParts}
                    className="erp-dropdown-select"
                    classNamePrefix="dropdown"
                    value={productPart}
                    onChange={onProductPartsChange}
                  />
                </Col>
              </Row>
            </Col>
          </FormContentLayout>

        </FormLayout>
        <Row style={{ marginBottom: '120px' }}>
          {selectedProductParts?.colorList?.map( ( styleColor, styleColorIndex ) => {
            return (
              <Col lg={4} key={styleColorIndex}>
                <Card body className="p-2">
                  <FormGroup row className="mb-0">
                    <Label for="productParts" sm={4}>
                      Color
                    </Label>
                    <Col sm={8}>
                      <p>{styleColor.styleColorName}</p>
                    </Col>
                  </FormGroup>
                  {styleColor?.list?.map( ( pp, productPartsIndex ) => {
                    return (
                      <FormGroup key={productPartsIndex} row>
                        <Label for={`productParts_${styleColorIndex}_${productPartsIndex}`} sm={2}>
                          {pp?.productPartsName}
                        </Label>
                        <Col sm={6}>
                          <Select
                            id={`productParts_${styleColorIndex}_${productPartsIndex}`}
                            isSearchable
                            // isClearable
                            maxMenuHeight="200px"
                            isDisabled={colorStatus?.value === 'Solid'}
                            theme={selectThemeColors}
                            options={pp?.colors}
                            className="erp-dropdown-select"
                            classNamePrefix="dropdown"
                            value={pp?.color}
                            onChange={colorItem => onProductPartsColorChange( colorItem, styleColor.boxId, pp.uniId )}
                          />
                        </Col>
                        <Col sm={4}>
                          <Select
                            id={`partGroup_${styleColorIndex}_${productPartsIndex}`}
                            isSearchable
                            // isClearable
                            maxMenuHeight="200px"
                            theme={selectThemeColors}
                            options={pp?.partGroups}
                            className="erp-dropdown-select"
                            classNamePrefix="dropdown"
                            value={pp?.partGroup}
                            onChange={partItem => onPartGroupChange( partItem, styleColor.boxId, pp.uniId )}
                          />
                        </Col>
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

export default ProductPartsGroupEditForm;
