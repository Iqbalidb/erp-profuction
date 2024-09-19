/**
 * Title: Line Form
 * Description: Form page for Line
 * Author: Nasir Ahmed
 * Date: 21-November-2021
 * Modified: 21-November-2021
 */

import Sidebar from "@core/components/sidebar";
import ComponentSpinner from "@core/components/spinner/Loading-spinner";
import UILoader from "@core/components/ui-loader";
import classnames from "classnames";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { isObjEmpty, selectThemeColors } from "utility/Utils";
import { stringifyConsole } from "utility/commonHelper";
import { notify } from "utility/custom/notifications";
import CustomSelect from "utility/custom/production/CustomSelect";
import { ProcessTypes } from "utility/enums";
import {
  addCriticalProcess,
  toggleCritcalProcessSidebar,
  updateCriticalProcess
} from "../store/actions";

const CriticalProcessForm = ( props ) => {
  const { selectedItem, lastPageInfo } = props;
  //#region Hooks
  const dispatch = useDispatch();
  const { isOpenSidebar } = useSelector(
    ( { criticalProcessReducer } ) => criticalProcessReducer
  );
  const { iSubmitProgressCM } = useSelector( ( { commonReducers } ) => commonReducers );
  const { register, errors, handleSubmit } = useForm();
  //#endregion

  //#region State
  const [processType, setProcessType] = useState( null );
  //#endregion

  //#region Effects
  useEffect( () => {
    if ( selectedItem ) {
      setProcessType( selectedItem.processType );
    }
  }, [selectedItem] );
  //#endregion

  //#region Events
  //Submit method for data save
  const onSubmit = ( values ) => {
    if ( isObjEmpty( errors ) && processType !== null ) {
      const { name, status } = values;
      const data = {
        name,
        processType: processType.value,
        status
      };
      stringifyConsole( data );
      if ( selectedItem ) {
        dispatch(
          updateCriticalProcess( { ...data, id: selectedItem.id }, lastPageInfo )
        );
      } else {
        dispatch( addCriticalProcess( data, lastPageInfo ) );
      }
    } else {
      notify( 'warning', 'Please provide all information!!' );

    }
  };
  //#endregion
  return (
    <Sidebar
      size="lg"
      open={isOpenSidebar}
      title={selectedItem ? "Edit Critical Process" : "Critical Process"}
      style={{ transition: "0.5s all ease" }}
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={() => dispatch( toggleCritcalProcessSidebar( !isOpenSidebar ) )
      }
    >
      <UILoader
        blocking={iSubmitProgressCM}
        loader={<ComponentSpinner />}>
        <FormGroup>
          <Label for="lineNumber">Process Name</Label>
          <Input
            name="name"
            id="name"
            bsSize="sm"
            placeholder="Process Name"
            innerRef={register( { required: true } )}
            defaultValue={selectedItem ? selectedItem.name : ""}
            invalid={errors.name && true}
            className={classnames( { "is-invalid": errors["name"] } )}
          />
          {/* {errors && errors.name && (
            <FormFeedback>Critical Process is Required!</FormFeedback>
          )} */}
        </FormGroup>

        <FormGroup>
          <CustomSelect
            title="Process Type"
            theme={selectThemeColors}
            className="erp-dropdown-select"
            classNamePrefix="dropdown"
            options={ProcessTypes}
            value={processType}
            onChange={( item ) => setProcessType( item )}
          />
        </FormGroup>
        <FormGroup>
          <Label for="status">
            <Input
              style={{ marginLeft: "5px" }}
              id="status"
              name="status"
              type="checkbox"
              defaultChecked={selectedItem ? selectedItem.status : false}
              innerRef={register( { required: false } )}
            />
            <span style={{ marginLeft: "25px" }}> Is Active </span>
          </Label>
        </FormGroup>

        <div className='d-flex align-items-center justify-content-between mt-2'>
          <Button
            color='primary '
            size='sm'
            onClick={handleSubmit( onSubmit )}
          >
            Save
          </Button>

          <div className='d-flex '>
            <Button
              color='success '
              outline
              size='sm'
              hidden={selectedItem?.id}
            // onClick={() => { handleReset(); }}
            >
              Reset
            </Button>

            <Button
              color='danger ml-1'
              outline size='sm'
              onClick={() => dispatch( toggleCritcalProcessSidebar() )}
            >
              Cancel
            </Button>
          </div>
        </div>
      </UILoader>

    </Sidebar >
  );
};

export default CriticalProcessForm;
