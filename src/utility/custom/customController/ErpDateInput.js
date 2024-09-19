import moment from 'moment';
import React from 'react';
import { Label } from 'reactstrap';
import CustomDatePicker from 'utility/custom/production/CustomDatePicker';
import '../../../assets/scss/basic/erp-input.scss';

export default function ErpDateInput( props ) {
    const { classNames, label, type, onChange, value, name, ...rest } = props;
    const updatedDate = value ? moment( value, "DD-MM-YYYY" ) : new Date();


    return (
        <div className={`${classNames} erp-input-container `}>
            <Label size='sm' className='font-weight-bolder'>{label}</Label>
            <div className='d-flex align-items-center'>
                <span className='mr-1 font-weight-bolder'>:</span>
                <CustomDatePicker
                    {...rest}
                    value={moment( updatedDate ).format( 'YYYY-MM-DD' )}
                    label={label}
                    name={name}
                    onChange={( e ) => onChange( e, name )}
                />
            </div>
        </div>
    );
}
