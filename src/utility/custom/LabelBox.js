import React from 'react';
import './label.scss';
const LabelBox = ( { text, isInvalid = false } ) => {
    return (
        <div className={isInvalid ? `invalid-label-box` : `label-box w-100`}>
            {text ?? ''}
        </div>
        // <Input
        //     disabled
        //     bsSize="sm"
        //     value={text ?? ''}
        //     onChange={( e ) => { e.preventDefault(); }}
        // />
    );
};

export default LabelBox;