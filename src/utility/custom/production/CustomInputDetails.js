/*
     Title: Details page Custom Input Component
     Description: Details page Custom Input Component
     Author: Alamgir Kabir
     Date: 24-August-2023
     Modified: 24-August-2023
*/
import { Label } from "reactstrap";
import '../../../assets/scss/production/general.scss';

export const CustomDetailsInput = ( props ) => {
    const { label, type, marginTop, classNames, disabled, value } = props;
    return (
        <div className={`${classNames} custom-input-container `}>
            <Label size='sm' className='font-weight-bolder'>{label}</Label>
            <div className='d-flex align-items-center'>
                <span className='mr-1 font-weight-bolder'>:</span>
                <span style={{ fontSize: '12px' }}>{value}</span>
            </div>
        </div>
    );
};