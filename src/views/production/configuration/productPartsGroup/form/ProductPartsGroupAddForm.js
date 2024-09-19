/*
     Title: Product Parts Group Add Form
     Description: Product Parts Group Add Form
     Author: Alamgir Kabir
     Date: 11-May-2022
     Modified: 02-July-2022
*/
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import axios from 'axios';
import ActionMenu from 'layouts/components/menu/action-menu';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Button, Card, Col, FormGroup, Label, NavItem, NavLink, Row } from 'reactstrap';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios, merchandisingAxiosInstance } from 'services';
import { GARMENT_COLORS_API, STYLES_API } from 'services/api-end-points/merchandising/v1';
import { PART_GROUPS_API, PRODUCT_PARTS_API, STYLE_USE_INFO_API, STYLE_WISE_PRODUCT_PARTS_GROUP_API } from 'services/api-end-points/production/v1';
import { mapArrayToDropdown } from 'utility/commonHelper';
import ErpSelect from 'utility/custom/customController/ErpSelect';
import FormContentLayout from 'utility/custom/FormContentLayout';
import FormLayout from 'utility/custom/FormLayout';
import { notify } from 'utility/custom/notifications';
import { errorResponse, selectThemeColors } from 'utility/Utils';
import { v4 as uuid } from 'uuid';

const ProductPartsGroupAddForm = () => {
  //#region Hooks
  const dispatch = useDispatch();
  const history = useHistory();
  const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
  //#endregion

  //#region States
  const [styles, setStyles] = useState( [] );
  const [style, setStyle] = useState( null );
  const [styleDetails, setStyleDetails] = useState( null );
  const [productPart, setProductPart] = useState( null );
  const [productParts, setProductParts] = useState( [] );
  const [garmentColors, setGarmentColors] = useState();
  const [colorStatus, setColorStatus] = useState( null );
  const [colorStatuses] = useState( [
    { value: 'Mixed', label: 'Mixed' },
    { value: 'Solid', label: 'Solid' }
  ] );
  const [partGroups, setPartGroups] = useState( [] );
  const [isLoadingTableData, setIsLoadingTableData] = useState( false );

  //#endregion

  /**
   * Get Style Details
   */
  /** */
  const fetchStyleDetails = async styleId => {
    setIsLoadingTableData( true );
    try {
      const styleDetailsRes = await merchandisingAxiosInstance.get( `${STYLES_API.fetch_by_id}/${styleId}` );
      const styleDetails = {
        ...styleDetailsRes.data,
        styleColors: styleDetailsRes.data.styleColors.map( item => ( {
          ...item,
          boxId: uuid(),
          productParts: []
        } ) )
      };
      setStyleDetails( styleDetails );
      setIsLoadingTableData( false );

    } catch ( err ) {
      notify( 'warning', 'Style details not found!!!' );
      setIsLoadingTableData( false );

    }
  };
  //#endregion

  //#region Effects
  /**
   * Get Style,Product Parts and Garments Color with Single  Request
   */
  useEffect( () => {
    const fetchDependencies = async () => {
      const styleRequest = merchandisingAxiosInstance.get( STYLES_API.fetch_all );
      const productPartsRequest = baseAxios.get( PRODUCT_PARTS_API.fetch_all_active );
      const garmentColorRequest = merchandisingAxiosInstance.get( GARMENT_COLORS_API.fetch_all );
      const existingStyleRequest = baseAxios.get( STYLE_USE_INFO_API.fetch_style_use_info );
      const partGroupsRequest = baseAxios.get( PART_GROUPS_API.fetch_all_active );
      try {
        const [styleResponse, productPartsResponse, garmentColorResponse, existingStyleResponse, partGroupsResponse] = await axios.all( [
          styleRequest,
          productPartsRequest,
          garmentColorRequest,
          existingStyleRequest,
          partGroupsRequest
        ] );
        const stylesDdl = mapArrayToDropdown( styleResponse.data.data, 'styleNo', 'id' );
        const existingStyleDdl = mapArrayToDropdown( existingStyleResponse.data.data, 'styleNo', 'id' );

        const remainStyleDdl = stylesDdl.filter( st => {
          return existingStyleDdl.every( exs => st.id !== exs.styleId );
        } );

        const productPartsDdl = mapArrayToDropdown( productPartsResponse.data.data, 'name', 'id' );
        const garmentColorsDdl = mapArrayToDropdown( garmentColorResponse.data.data, 'name', 'id' );
        const partGroupsDdl = mapArrayToDropdown( partGroupsResponse.data.data, 'name', 'id' );
        setStyles( remainStyleDdl );
        setGarmentColors( garmentColorsDdl );
        setProductParts( productPartsDdl );
        setPartGroups( partGroupsDdl );
      } catch ( err ) {
        notify( 'error', 'Dependencies not loaded!!' );
      }
    };
    fetchDependencies();
  }, [] );
  //#endregion

  //#region Events
  /**
   * For Style Change
   */
  const onStyleChange = ( item, styleDetailsCallback ) => {
    if ( item ) {
      setStyle( item );
      styleDetailsCallback( item.id );
      setProductPart( null );
    } else {
      setStyleDetails( null );
      setStyle( null );
      setColorStatus( null );
      setProductPart( null );
      setStyleDetails( [] );
    }
  };

  /**
   * For Color Status Change
   */
  const onColorStatusChange = item => {
    if ( item ) {
      const _styleDetails = _.cloneDeep( styleDetails );
      _styleDetails?.styleColors?.forEach( sc => sc.productParts?.forEach( pp => ( pp.color = { label: sc.name, value: sc.id } ) ) );
      setColorStatus( item );
      setStyleDetails( _styleDetails );
    }
  };

  /**
   * For Product Parts Change
   */
  const onProductPartsChange = newItem => {
    if ( newItem ) {
      const _styleDetails = _.cloneDeep( styleDetails );
      const _styleColors = _styleDetails.styleColors.map( item => {
        const uniqueId = uuid();
        return {
          ...item,
          productParts: newItem.map( pp => ( {
            ...pp,
            uniId: `${item.name}_${pp.name}_${uniqueId}`,
            colors: garmentColors,
            color: colorStatus?.value === 'Solid' ? { value: item.id, label: item.name } : null,
            partGroups,
            partGroup: null
          } ) )
        };
      } );
      _styleDetails.styleColors = _styleColors;
      setProductPart( newItem );
      setStyleDetails( _styleDetails );
    }
  };

  /**
   *   For Product Parts Color Change
   */

  const onProductPartsColorChange = ( colorItem, boxId, ppUniId ) => {
    if ( colorItem ) {
      const newStyleDetails = {
        ...styleDetails,
        styleColors: styleDetails.styleColors.map( sc => {
          if ( sc.boxId === boxId ) {
            return {
              ...sc,
              productParts: sc.productParts.map( pp => {
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

      setStyleDetails( newStyleDetails );
    }
  };

  /**
   *   For Parts Group Change
   */

  const onPartGroupChange = ( partItem, boxId, ppUniId ) => {
    if ( partItem ) {
      const newStyleDetails = {
        ...styleDetails,
        styleColors: styleDetails.styleColors.map( sc => {
          if ( sc.boxId === boxId ) {
            return {
              ...sc,
              productParts: sc.productParts.map( pp => {
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
      setStyleDetails( newStyleDetails );
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
    const styleColor = styleDetails?.styleColors
      ?.map( sc => sc?.productParts?.map( pp => ( { ...pp, styleColorId: sc.id, styleColorName: sc?.name } ) ) )
      .flat();
    const payload = {
      styleId: styleDetails?.id,
      styleNo: styleDetails?.styleNo,
      colorStatus: colorStatus?.value,
      list: styleColor?.map( sc => ( {
        styleColorId: sc?.styleColorId,
        styleColorName: sc?.styleColorName,
        productPartsId: sc?.id,
        productPartsName: sc?.name,
        partGroupsId: sc?.partGroup?.value,
        partGroupsName: sc?.partGroup?.label,
        colorId: sc?.color?.value,
        colorName: sc?.color?.label
      } ) )
    };
    const isValid = payload?.list?.every( item => item );
    const selectedProductPart = productPart?.map( m => m?.label );
    const selectedProductPartColor = styleDetails?.styleColors?.map( sc => sc?.productParts?.map( cc => cc?.color ) );
    const flattenedSelectedProductPartColor = selectedProductPartColor?.flat();
    const isSelectedProductPartsColor = flattenedSelectedProductPartColor?.includes( null );
    if ( isValid && colorStatus?.value && selectedProductPart?.length && !isSelectedProductPartsColor ) {
      dispatch( dataSubmitProgressCM( true ) );

      try {
        const res = await baseAxios.post( STYLE_WISE_PRODUCT_PARTS_GROUP_API.add, payload );

        notify( 'success', 'Product part group has been added' );
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
      id: 'product-parts-group-new',
      name: 'New Product Parts Group',
      link: "/product-parts-group-new",
      isActive: true,
      hidden: false
    },

  ];
  //#endregion
  return (
    <div className="p-1 mt-3">
      <UILoader
        blocking={iSubmitProgressCM}
        loader={<ComponentSpinner />}>
        <ActionMenu
          breadcrumb={breadcrumb}
          title="New Product Parts Group">
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
        <FormLayout >
          <FormContentLayout title='Product Parts Group Information'>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Row>
                <Col xs={12} sm={12} md={12} lg={3} xl={3}>
                  <ErpSelect
                    label='Style'
                    id="style"
                    isSearchable
                    isClearable
                    isLoading={!styles.length}
                    theme={selectThemeColors}
                    options={styles}
                    className="erp-dropdown-select"
                    classNamePrefix="dropdown"
                    value={style}
                    onChange={item => onStyleChange( item, fetchStyleDetails )}
                  />
                </Col>

                <Col xs={12} sm={12} md={12} lg={3} xl={3}>
                  <ErpSelect
                    label='Color Status'
                    id="colorStatus"
                    isDisabled={!style}
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
                    isSearchable
                    isClearable
                    isDisabled={!styleDetails}
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
        {isLoadingTableData ? (
          <div style={{ height: '150px', marginTop: '200px' }}>
            <ComponentSpinner />
          </div>
        ) : (
          <Row style={{ marginBottom: '120px' }}>
            {styleDetails?.styleColors?.map( ( styleColor, styleColorIndex ) => (
              <Col lg={4} key={styleColor.boxId}>
                <Card body className="p-2">
                  <FormGroup row className="mb-0">
                    <Label for="productParts" sm={4}>
                      Color
                    </Label>
                    <Col sm={8}>
                      <p>{styleColor.name}</p>
                    </Col>
                  </FormGroup>
                  {styleColor?.productParts?.map( ( pp, productPartsIndex ) => {
                    return (
                      <FormGroup key={pp?.id} row>
                        <Label for={`productParts_${styleColorIndex}_${productPartsIndex}`} sm={2}>
                          {pp?.name}
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
                            maxMenuHeight="200px"
                            menuPosition="fixed"
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
            ) )}
          </Row>
        )}

      </UILoader>
    </div>
  );
};

export default ProductPartsGroupAddForm;

/** Change Log
 *(2nd July-2022)-Iqbal: Add partGroups Dropdown
 */
