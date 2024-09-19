/* eslint-disable no-unreachable */
/* eslint-disable prettier/prettier */
/*
   Title: Zone Group Add Form
   Description: Zone Group Add Form
   Author: Alamgir Kabir
   Date: 29-March-2022
   Modified: 29-March-2022
*/
import classnames from "classnames";
import ActionMenu from "layouts/components/menu/action-menu";
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
import { selectThemeColors } from "utility/Utils";
import FormLayout from "utility/custom/FormLayout";
import { notify } from "utility/custom/notifications";
import { v4 as uuid } from "uuid";
import { fillLineDdl } from "../../line/store/actions";
import { fillZoneDdl } from "../../zone/store/actions";
import classes from "../styles/ZoneGroupAddForm.module.scss";

const ZoneGroupAddForm = () => {
  //#region Hooks
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    zoneReducer: { dropDownItems: ddlZone },
    lineReducer: { dropDownItems: ddlLine }
  } = useSelector( ( state ) => state );
  const { register, errors, handleSubmit } = useForm();
  //#endregion
  const initialState = {
    rowId: uuid(),
    lines: ddlLine,
    line: null,
    status: false
  };

  //#region State

  const [zone, setZone] = useState( null );
  const [zoneGroupCombination, setZoneGroupCombination] = useState( [initialState] );
  const [isPageLoaded, setIsPageLoaded] = useState( false );
  //#endregion

  useEffect( () => {
    dispatch( fillZoneDdl() );
    dispatch( fillLineDdl() );
  }, [dispatch] );

  useEffect( () => {
    setZoneGroupCombination( ( prev ) => {
      prev.forEach( ( item ) => ( item.lines = ddlLine ) );
      setIsPageLoaded( true );
      return prev;
    } );
  }, [ddlLine] );

  const onAddCombination = () => {
    setZoneGroupCombination( ( prev ) => [...prev, initialState] );
  };

  const handleRemoveItem = ( idx ) => {
    const combo = [...zoneGroupCombination];
    combo.splice( idx, 1 );
    setZoneGroupCombination( combo );
  };

  //For Zone Change
  const onChangeZone = ( item ) => {
    if ( item === null ) {
      setZone( [] );
      setZoneGroupCombination( [initialState] );

    } else if ( item ) {
      setZoneGroupCombination( [initialState] );

      setZone( item );
    }
  };

  //For Line Change
  const onChangeLine = ( item, index ) => {
    const _combo = [...zoneGroupCombination];
    const targetItem = _combo[index];
    targetItem.line = item;
    _combo[index] = targetItem;
    setZoneGroupCombination( _combo );
  };

  //For Status Chante
  const handleStatusChange = ( e, index ) => {
    const _combo = [...zoneGroupCombination];
    const targetItem = _combo[index];
    targetItem.status = e.target.checked;
    _combo[index] = targetItem;
    setZoneGroupCombination( _combo );
  };
  //For Cancel
  const handleCancel = () => {
    history.goBack();
  };
  //For Submit Data
  const onSubmit = async ( values ) => {
    const { empName, empCode } = values;
    const payload = {
      zoneId: zone?.value,
      zoneName: zone?.label,
      ownerEmpCode: empCode,
      ownerName: empName,
      status: true,
      list: zoneGroupCombination?.map( ( comb ) => ( {
        lineId: comb?.line?.value,
        lineName: comb?.line?.label,
        status: comb?.status
      } ) )
    };
    const isValid = payload.list.every( ( e ) => e.lineName );
    if ( isValid && zone?.value ) {
      try {

        const res = await baseAxios.post( ZONE_GROUP_API.add, payload );
        if ( res.data ) {
          notify( "success", "Data Submitted Successfully" );
          handleCancel();
        }
      } catch ( error ) {
        notify( "error", "Something went wrong!! Please try again" );
      }
    } else {
      notify( "warning", "Please provide all information!!!" );
    }
  };
  if ( !isPageLoaded ) {
    return <div>Loading....</div>;
  }


  return (
    <>
      <CardBody>
        <ActionMenu title="New Zone Group">
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
        <FormLayout>
          <Col xs={12} sm={12} md={12} lg={12} xl={12}>
            <Row style={{ alignItems: "center" }}>
              <FormGroup tag={Col} xs={12}>
                <Label for="zone">Zone</Label>
                <Select
                  id="zone"
                  isSearchable
                  isClearable
                  className={`${!zone ? "bg-red" : 'bg-dark'}`}
                  isSelected={true}
                  theme={selectThemeColors}
                  classNamePrefix="select"
                  options={ddlZone}
                  value={zone}
                  onChange={onChangeZone}
                // {...register('zone', { required: true })}
                // className={classnames({ 'is-invalid': ddlZone !== null && zone === null })}
                />
                {errors && errors.zone && (
                  <FormFeedback>Style is required!</FormFeedback>
                )}
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
                  innerRef={register( { required: true } )}
                  invalid={errors.empCode && true}
                  className={classnames( { "is-invalid": errors["empCode"] } )}
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
                  innerRef={register( { required: true } )}
                  invalid={errors.empName && true}
                  className={classnames( { "is-invalid": errors["empName"] } )}
                />
                {errors && errors.empName && (
                  <FormFeedback>Employee name is required!</FormFeedback>
                )}
              </FormGroup>
            </Row>
          </Col>
        </FormLayout>
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
              {zoneGroupCombination?.map( ( zg, idx ) => (
                <tr key={zg.rowId}>
                  <td style={{ width: "50%" }}>
                    <Select
                      id={`line${idx}`}
                      isSearchable
                      isClearable
                      name="line"
                      theme={selectThemeColors}
                      classNamePrefix="select"
                      options={zg.lines}
                      value={zg.line}
                      onChange={( item ) => onChangeLine( item, idx )}
                    // {...register('line', { required: true })}
                    // className={classnames({
                    //   'is-invalid': zg.lines !== null && zg.line === null
                    // })}
                    />
                    {errors && errors.line && (
                      <FormFeedback>Line is required!</FormFeedback>
                    )}
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
                      outline
                      disabled={zoneGroupCombination.length === 1}
                      color={`${zoneGroupCombination.length > 1 ? "danger" : "secondary"
                        }`}
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
    </>
  );
};

export default ZoneGroupAddForm;
