/*
     Title: Remarks Input Custom Component
     Description: Remarks Input Custom Component
     Author: Alamgir Kabir
     Date: 24-August-2023
     Modified: 24-August-2023
*/
import { Input, Label } from "reactstrap";

export const CustomInputRemarks = ( props ) => {
    const { label, ...rest } = props;
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 8.2fr', alignItems: 'center' }} >
            <Label for="name">{label}</Label>
            <div className='d-flex align-items-center '>
                <span className='mr-1 font-weight-bolder'>:</span>
                <Input type="textarea" rows="1" bsSize='sm' {...rest} />
            </div>
        </div>
    );
};