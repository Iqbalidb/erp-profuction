/* eslint-disable no-tabs */
/*
   Title: Custom Date Picker
   Description: Custom Date Picker
   Author: Iqbal Hossain
   Date: 06-February-2022
   Modified: 06-February-2022
*/

import '@styles/react/libs/flatpickr/flatpickr.scss';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import Flatpickr from 'react-flatpickr';
import { Label } from 'reactstrap';

const CustomDatePicker = props => {
  const { name, defaultValue, title, value, onChange, minDate, maxDate } = props;
  return (
    <Fragment>
      <Label for={title}>{title}</Label>
      <Flatpickr
        name={name}
        value={value}
        defaultValue={defaultValue}
        id="hf-picker"
        className="form-control-sm form-control"
        //className=" form-control"
        onChange={onChange}
        options={{
          allowInput: true,
          altInput: true,
          altFormat: 'F j, Y',
          dateFormat: 'Y-m-d',
          maxDate,
          minDate
        }}
      />
    </Fragment>
  );
};
CustomDatePicker.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired
};

export default CustomDatePicker;

/** Change Log
 // eslint-disable-next-line no-tabs
 * 	 06-February-2022 (Iqbal): Custom Date Picker
 */
