/*
   Title: Custom Date Picker
   Description: Custom Date Picker
   Author: Iqbal Hossain
   Date: 06-February-2022
   Modified: 06-February-2022
*/

import '@styles/react/libs/flatpickr/flatpickr.scss';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import Flatpickr from 'react-flatpickr';
import { Label } from 'reactstrap';

const CustomDatePicker = props => {
  const { name, title, value, onChange, minDate, maxDate, invalid = false, ...rest } = props;
  return (
    <Fragment>
      <Label for={title}>{title}</Label>
      <div className={`${invalid ? 'border-danger rounded' : ''}`}>
        <Flatpickr
          name={name}
          value={value}
          id="hf-picker"
          className="form-control-sm form-control"
          onChange={onChange}

          options={{
            altInput: true,
            altFormat: 'F j, Y',
            dateFormat: 'Y-m-d',
            maxDate,
            minDate
          }}
          {...rest}
        />
      </div>

    </Fragment>
  );
};
CustomDatePicker.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired
};

export default CustomDatePicker;
