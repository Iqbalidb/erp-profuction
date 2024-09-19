/* eslint-disable no-unreachable */
/* eslint-disable prettier/prettier */
/*
   Title: Zone Group Edit Form
   Description: Zone Group Edit Form
   Author: Alamgir Kabir
   Date: 29-March-2022
   Modified: 29-March-2022
*/
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
  Card,
  CardBody,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  NavItem,
  NavLink,
  Row
} from "reactstrap";
import { baseAxios } from "services";
import { ZONE_GROUP_API } from "services/api-end-points/production/v1/zoneGroup";
import { sleep, stringifyConsole } from "utility/commonHelper";
import { notify } from "utility/custom/notifications";
import { selectThemeColors } from "utility/Utils";
import { v4 as uuid } from "uuid";
import { fillLineDdl } from "../../line/store/actions";
import { fillZoneDdl } from "../../zone/store/actions";
import { fetchZoneGroupById } from "../store/action";
import { RESET_SELECTED_ZONE_GROUP } from "../store/actionTypes";
import classes from "../styles/ZoneGroupAddForm.module.scss";

const ZoneGroupEditForm = () => {
  //#region Hooks
  const history = useHistory();
  const id = history.location.state;
  const dispatch = useDispatch();
  const {
    zoneGroupReducer: { selectedItem },
    zoneReducer: { dropDownItems: ddlZone },
    lineReducer: { dropDownItems: ddlLine }
  } = useSelector( ( state ) => state );
  const { register, errors, handleSubmit } = useForm();
  //#endregion

  //#region State
  const [zoneGroupCombination, setZoneGroupCombination] = useState( {
    ...selectedItem
  } );
  const [isPageLoaded, setIsPageLoaded] = useState( false );
  //#endregion

  //#region Effects

  //For Dropdown Data
  useEffect( () => {

    dispatch( fetchZoneGroupById( id ) );
    dispatch( fillZoneDdl() );
    dispatch( fillLineDdl() );
  }, [dispatch, id] );

  //For Set Dropdown Data
  useEffect( () => {
    if ( selectedItem && ddlZone?.length && ddlLine?.length ) {
      const selectedZone = ddlZone?.find(
        ( item ) => item.label === selectedItem?.zoneName
      );
      const updatedList = selectedItem?.list?.map( ( ss ) => {
        const selectedLine = ddlLine?.find( ( item ) => item?.id === ss?.lineId );
        const lineObj = {
          groupDetailsId: ss.groupDetailsId,
          lines: ddlLine,
          line: selectedLine,
          status: ss.status
        };
        return lineObj;
      } );
      setZoneGroupCombination( {
        ...selectedItem,
        zones: ddlZone,
        selectedZone,
        list: updatedList
      } );
      setIsPageLoaded( true );
    }
  }, [ddlLine, ddlZone, selectedItem] );

  //For Add New Row
  const onAddCombination = () => {
    const newItem = {
      rowId: uuid(),
      lines: ddlLine,
      line: null,
      status: false
    };
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

  //For Status Change
  const handleStatusChange = ( e, idx ) => {
    const { checked } = e.target;
    const _combo = [...zoneGroupCombination.list];
    const clickedItem = _combo[idx];
    clickedItem.status = checked;
    _combo[idx] = clickedItem;
    setZoneGroupCombination( { ...zoneGroupCombination, list: _combo } );
  };

  const onStatusChange = ( e ) => {
    const { checked } = e.target;
    const _combo = _.clone( zoneGroupCombination );
    _combo.status = checked;
    setZoneGroupCombination( _combo );
  };
  //For Cancel
  const handleCancel = () => {
    dispatch( {
      type: RESET_SELECTED_ZONE_GROUP
    } );
    history.goBack();
  };

  const onSubmit = async () => {
    const payload = {
      zoneId: zoneGroupCombination?.zoneId,
      zoneName: zoneGroupCombination?.zoneName,
      ownerEmpCode: zoneGroupCombination?.ownerEmpCode,
      ownerName: zoneGroupCombination?.ownerName,
      status: zoneGroupCombination?.status,
      list: zoneGroupCombination?.list?.map( ( comb ) => ( {
        lineId: comb?.line?.value,
        lineName: comb?.line?.label,
        status: comb?.status
      } ) )
    };
    stringifyConsole( payload, null, 2 );
    const isValid = payload.list.every( ( e ) => e.lineName );
    if ( isValid ) {
      try {
        const res = await baseAxios.put( ZONE_GROUP_API.update, payload, {
          params: { id }
        } );
        if ( res.data ) {
          notify( "success", "Data Updated Successfully" );
          sleep( handleCancel(), 1000 );
          // setTimeout(() => {

          //   handleCancel();
          // }, 1000);
        }
      } catch ( error ) {
        notify( "error", "Something went wrong!! Please try again" );
      }
    } else {
      notify( "warning", "Please provide all information!!!" );
    }
  };

  //For Loader
  if ( !isPageLoaded ) {
    return <div>Loading...</div>;
  }
  return (
    <Card className="p-1 mt-3 ss">
      <Form autoComplete="off" onSubmit={handleSubmit( onSubmit )}>
        <CardBody>
          <ActionMenu title=" Zone Group Edit">
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
          <Row className="border rounded rounded-3 mt-1 ">
            <FormGroup
              tag={Col}
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              className="mt-n1"
            ></FormGroup>
            <FormGroup tag={Col} xs={12} sm={12} md={12} lg={12} xl={12}>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <Row style={{ alignItems: "center" }}>
                  <FormGroup tag={Col} xs={11}>
                    <Label for="zone">Zone</Label>
                    <Select
                      readOnly
                      id="zone"
                      isSearchable
                      // isClearable
                      theme={selectThemeColors}
                      classNamePrefix="select"
                      options={zoneGroupCombination.zones}
                      value={zoneGroupCombination.selectedZone}
                    // onChange={e => onChangeZone(e)}
                    />
                  </FormGroup>
                  <FormGroup tag={Col} xs={1} className="mt-2">
                    <Label for="status">
                      <Input
                        name="status"
                        id="status"
                        type="checkbox"
                        style={{ marginLeft: "5px" }}
                        checked={zoneGroupCombination?.status}
                        onChange={( e ) => onStatusChange( e )}
                      />
                      <span
                        className="text-nowrap"
                        style={{ marginLeft: "25px" }}
                      >
                        Is Active
                      </span>
                    </Label>
                  </FormGroup>
                </Row>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <Row>
                  <FormGroup tag={Col} xs={12} xl={6} lg={6} sm={12} md={12}>
                    <Label for="empCode">Employee Code</Label>
                    <Input
                      id="empCode"
                      name="empCode"
                      type="text"
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
                    />
                    {errors && errors.empCode && (
                      <FormFeedback>Employee code is required!</FormFeedback>
                    )}
                  </FormGroup>
                  <FormGroup tag={Col} xs={12} xl={6} lg={6} sm={12} md={12}>
                    <Label for="empName">Employee Name</Label>
                    <Input
                      id="empName"
                      type="text"
                      name="empName"
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
                    {errors && errors.empName && (
                      <FormFeedback>Employee name is required!</FormFeedback>
                    )}
                  </FormGroup>
                </Row>
              </Col>
            </FormGroup>
          </Row>
        </CardBody>
        <Card style={{ margin: "0.5rem" }}>
          <CardBody>
            <table className={classes.zoneGroupTable}>
              <thead className={`${classes.stickyTableHead}`}>
                <tr>
                  <th>Line</th>
                  <th>Status</th>
                  <th>Action</th>
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
                        classNamePrefix="select"
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
                          style={{ marginLeft: "5px" }}
                          checked={zg.status}
                          onChange={( e ) => handleStatusChange( e, idx )}
                        />
                        <span style={{ marginLeft: "25px" }}>Is Active</span>
                      </Label>
                    </td>

                    <td style={{ textAlign: "center" }}>
                      <Button
                        size="sm"
                        id="btnRemove"
                        type="button"
                        disabled={!zg.rowId}
                        outline
                        color={`${zg.rowId ? "danger" : "secondary"}`}
                        onClick={() => handleRemoveItem( idx )}
                      >
                        <MinusCircle id="btnRemove" size={16} />
                      </Button>
                    </td>
                  </tr>
                ) )}
              </tbody>
            </table>
            <FormGroup
              tag={Col}
              xs={2}
              xl={2}
              lg={2}
              sm={6}
              md={6}
              className="mt-2 mb-0"
            >
              <Button
                color="primary"
                size="sm"
                id="btnAdd"
                type="button"
                outline
                onClick={onAddCombination}
              >
                <PlusCircle id="btnAdd" size={16} />
              </Button>
            </FormGroup>
          </CardBody>
        </Card>
      </Form>
    </Card>
  );
};

export default ZoneGroupEditForm;
