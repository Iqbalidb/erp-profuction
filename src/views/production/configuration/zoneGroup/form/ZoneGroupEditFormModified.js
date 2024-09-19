/* eslint-disable no-unused-vars */
/* eslint-disable no-unreachable */
/* eslint-disable prettier/prettier */
/*
   Title: Zone Group Edit Form
   Description: Zone Group Edit Form
   Author: Alamgir Kabir
   Date: 29-March-2022
   Modified: 29-March-2022
*/
import ComponentSpinner from "@core/components/spinner/Loading-spinner";
import UILoader from "@core/components/ui-loader";
import classnames from "classnames";
import ActionMenu from "layouts/components/menu/action-menu";
import _ from "lodash";
import { useEffect, useState } from "react";
import { MinusCircle, PlusCircle } from "react-feather";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import {
  Button,
  Col,
  Input,
  Label,
  NavItem,
  NavLink,
  Row,
  Table
} from "reactstrap";
import { dataSubmitProgressCM } from "redux/actions/common";
import { baseAxios } from "services";
import { ZONE_GROUP_API } from "services/api-end-points/production/v1/zoneGroup";
import { errorResponse, selectThemeColors } from "utility/Utils";
import { stringifyConsole } from "utility/commonHelper";
import FormContentLayout from "utility/custom/FormContentLayout";
import FormLayout from "utility/custom/FormLayout";
import { ErpInput } from "utility/custom/customController/ErpInput";
import { notify } from "utility/custom/notifications";
import { v4 as uuid } from "uuid";
import { fetchZoneGroupById } from "../store/action";
import { RESET_SELECTED_ZONE_GROUP } from "../store/actionTypes";
import classes from "../styles/ZoneGroupAddForm.module.scss";

const ZoneGroupEditForm = () => {
  //#region Hooks
  const history = useHistory();
  const id = history.location.state;
  const dispatch = useDispatch();
  const {
    selectedItem,
    lineDropdown

  } = useSelector( ( { zoneGroupReducer } ) => zoneGroupReducer );
  const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
  const { register, errors, handleSubmit } = useForm();
  //#endregion

  //#region State
  const [zoneGroupCombination, setZoneGroupCombination] = useState( {
    ...selectedItem
  } );
  //#endregion

  //#region Effects
  useEffect( () => {
    if ( id ) {
      dispatch( fetchZoneGroupById( id ) );
    }

  }, [dispatch, id] );

  useEffect( () => {
    if ( selectedItem && lineDropdown?.length ) {
      const updatedList = selectedItem?.list?.map( ( ss ) => {
        const selectedLine = lineDropdown?.find( ( item ) => item?.id === ss?.lineId );
        const lineObj = {
          groupDetailsId: ss.groupDetailsId,
          lines: lineDropdown,
          line: selectedLine,
          status: ss.status
        };
        return lineObj;
      } );
      setZoneGroupCombination( {
        ...selectedItem,
        list: updatedList
      } );
    }
  }, [lineDropdown, selectedItem] );

  //For Add New Row
  const onAddCombination = () => {
    const newItem = {
      rowId: uuid(),
      lines: lineDropdown,
      line: null,
      status: false
    };
    const lineIds = zoneGroupCombination.list.map( ( item ) => item?.line?.id );
    const filteredLines = newItem.lines.filter( item => !lineIds.includes( item.id ) );
    newItem.lines = filteredLines;

    setZoneGroupCombination( {
      ...zoneGroupCombination,
      list: [...zoneGroupCombination.list, newItem]
    } );
  };

  //For Remove New Row
  const handleRemoveItem = ( idx ) => {
    const _combo = [...zoneGroupCombination.list];
    _combo.splice( idx, 1 );
    setZoneGroupCombination( { ...zoneGroupCombination, list: _combo } );
  };


  //For Line Change
  const onChangeLine = ( item, idx ) => {
    const _combo = [...zoneGroupCombination.list];
    const clickedItem = _combo[idx];
    clickedItem.line = item;
    setZoneGroupCombination( { ...zoneGroupCombination, list: _combo } );
  };

  //For master Status Change
  const handleStatusChange = ( e, idx ) => {
    const { checked } = e.target;
    const _combo = [...zoneGroupCombination.list];
    const clickedItem = _combo[idx];
    clickedItem.status = checked;
    _combo[idx] = clickedItem;
    setZoneGroupCombination( { ...zoneGroupCombination, list: _combo } );
  };
  /**
   * For List Status Change
   */
  const onStatusChange = ( e ) => {
    const { checked } = e.target;
    const _combo = _.clone( zoneGroupCombination );
    _combo.status = checked;
    setZoneGroupCombination( _combo );
  };

  //duplicate line check
  const duplicateLineCheck = lineArray => {
    const lineIds = lineArray.map( item => {
      return item.lineId;
    } );
    const isDuplicate = lineIds.some( ( item, idx ) => {
      return lineIds.indexOf( item ) !== idx;
    } );
    return isDuplicate;
  };
  //For back to prev route
  const handleCancel = () => {
    dispatch( {
      type: RESET_SELECTED_ZONE_GROUP
    } );
    history.goBack();
  };

  // For Submission
  const onSubmit = async () => {
    const payload = {
      zoneId: zoneGroupCombination?.zoneId,
      zoneName: zoneGroupCombination?.zoneName,
      ownerEmpCode: zoneGroupCombination?.ownerEmpCode,
      ownerName: zoneGroupCombination?.ownerName,
      status: zoneGroupCombination?.status,
      list: zoneGroupCombination?.list?.map( ( comb ) => ( {
        id: comb.groupDetailsId,
        zoneGroupId: zoneGroupCombination.id,
        lineId: comb?.line?.value,
        lineName: comb?.line?.label,
        status: comb?.status
      } ) )
    };
    stringifyConsole( payload, null, 2 );
    if ( duplicateLineCheck( payload.list ) ) {
      notify( 'warning', 'Please remove duplicate line!!!' );
      return;
    }
    const isValid = payload.list.every( ( e ) => e.lineName );
    if ( isValid ) {
      dispatch( dataSubmitProgressCM( true ) );
      try {
        const res = await baseAxios.put( ZONE_GROUP_API.update, payload, {
          params: { id }
        } );

        notify( "success", "Zone group has been updated Successfully!!!" );
        dispatch( dataSubmitProgressCM( false ) );
        handleCancel();

      } catch ( error ) {
        errorResponse( error );
        dispatch( dataSubmitProgressCM( false ) );
      }
    } else {
      notify( "warning", "Please provide all information!!!" );
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
      id: 'zone-group',
      name: 'Zone Group',
      link: "/zone-group",
      isActive: false,
      hidden: false
    },
    {
      id: 'zone-group-edit',
      name: 'Zone Group Edit ',
      link: "/zone-group-edit",
      isActive: true,
      hidden: false
    },
  ];
  //#endregion
  return (
    <>
      <UILoader
        blocking={iSubmitProgressCM}
        loader={<ComponentSpinner />}>
        <ActionMenu breadcrumb={breadcrumb} title=" Zone Group Edit">
          <NavItem className="mr-1">
            <NavLink tag={Button} size="sm" color="primary" type="submit">
              Save
            </NavLink>
          </NavItem>
          <NavItem className="mr-1">
            <NavLink
              tag={Button}
              size="sm"
              color="secondary"
              onClick={handleCancel}
            >
              Cancel
            </NavLink>
          </NavItem>
        </ActionMenu>
        <FormLayout isNeedTopMargin={true}>
          <FormContentLayout title="Master Information">
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Row>
                <Col xs={12} sm={12} md={12} lg={4} xl={3}>
                  <ErpInput
                    id="zone" type="text"
                    name="zone"
                    placeholder="Zone"
                    readOnly value={zoneGroupCombination?.zoneName}
                    label='Zone'
                  />
                </Col>
                <Col xs={12} sm={12} md={12} lg={4} xl={1}>
                  <Input
                    name="status"
                    id="status"
                    type="checkbox"
                    style={{ marginLeft: "5px", marginTop: "7px" }}
                    checked={zoneGroupCombination?.status}
                    onChange={( e ) => onStatusChange( e )}
                  />
                  <h6
                    className="text-nowrap"
                    style={{ marginTop: '7px', marginLeft: "30px", }}
                  >
                    Is Active
                  </h6>
                </Col>
                <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                  <ErpInput
                    id="empCode"
                    name="empCode"
                    type="text"
                    bsSize="sm"
                    defaultValue={zoneGroupCombination?.ownerEmpCode}
                    onChange={( e ) => setZoneGroupCombination( {
                      ...zoneGroupCombination,
                      ownerEmpCode: e.target.value
                    } )
                    }
                    innerRef={register( { required: true } )}
                    invalid={errors.empCode && true}
                    className={classnames( {
                      "is-invalid": errors["empCode"]
                    } )}
                    label='Employee Code'
                  />
                </Col>
                <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                  <ErpInput
                    label='Employee Name'
                    id="empName"
                    type="text"
                    name="empName"
                    bsSize="sm"
                    defaultValue={zoneGroupCombination?.ownerName}
                    onChange={( e ) => setZoneGroupCombination( {
                      ...zoneGroupCombination,
                      ownerName: e.target.value
                    } )
                    }
                    innerRef={register( { required: true } )}
                    invalid={errors.empName && true}
                    className={classnames( {
                      "is-invalid": errors["empName"]
                    } )}
                  />
                </Col>
              </Row>
            </Col>
          </FormContentLayout>
          <FormContentLayout title="Details" marginTop>

            <Table size="sm" className={classes.zoneGroupTable}>
              <thead className={`table-bordered${classes.stickyTableHead}`}>
                <tr>
                  <th>Line</th>
                  <th>Status</th>
                  <th style={{ width: '200px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {zoneGroupCombination?.list?.map( ( zg, idx ) => (
                  <tr key={idx + 1}>
                    <td>
                      <Select
                        id={`line${idx}`}
                        isSearchable
                        isClearable
                        theme={selectThemeColors}
                        className="erp-dropdown-select"
                        classNamePrefix="dropdown"
                        options={zg.lines}
                        value={zg.line}
                        onChange={( item ) => onChangeLine( item, idx )}
                      />
                    </td>
                    <td>
                      {" "}
                      <Label for="status">
                        <Input
                          name="status"
                          id={`status ${zg.rowId}`}
                          type="checkbox"
                          style={{ marginLeft: "5px", marginTop: "1px" }}
                          checked={zg.status}
                          onChange={( e ) => handleStatusChange( e, idx )}
                        />
                        <span style={{ marginLeft: "25px" }}>Is Active</span>
                      </Label>
                    </td>
                    <td style={{ width: '200px' }}>
                      <div className="d-flex justify-content-start ml-5" >
                        <Button
                          size="sm"
                          id="btnRemove"
                          type="button"
                          disabled={!zg.rowId}
                          outline
                          color={`${zg.rowId ? "danger" : "secondary"}`}
                          onClick={() => handleRemoveItem( idx )}
                        >
                          <MinusCircle id="btnRemove" size={14} />
                        </Button>
                        {
                          idx === zoneGroupCombination?.list?.length - 1 && (
                            <Button
                              className="ml-1"
                              color="primary"
                              size="sm"
                              id="btnAdd"
                              type="button"
                              outline
                              disabled={zg.line === null}
                              onClick={onAddCombination}
                            >
                              <PlusCircle id="btnAdd" size={14} />
                            </Button>
                          )
                        }
                      </div>
                    </td>
                  </tr>
                ) )}
              </tbody>
            </Table>
          </FormContentLayout>
        </FormLayout>
      </UILoader>
    </>

  );
};

export default ZoneGroupEditForm;
