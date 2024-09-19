import Select from 'react-select';
import { Label } from 'reactstrap';
import { selectThemeColors } from 'utility/Utils';
import '../../../assets/scss/basic/erp-input.scss';

export default function ErpSelect( props ) {
    const { label, classNames, onChange, component, menuPlacement = 'auto', sideBySide = true, secondaryOption, ...rest } = props;
    return (

        <>
            {
                sideBySide ? <div className={`${classNames} erp-input-container`} >
                    <Label size='sm' className='font-weight-bolder'>{label}</Label>
                    <div className='d-flex align-items-center'>
                        <span className='mr-1 font-weight-bolder'>:</span>
                        {
                            component ? <Select
                                {...rest}
                                menuPlacement={menuPlacement}
                                className='w-100'
                                classNamePrefix='dropdown'
                                components={{ MenuList: component }}
                                theme={selectThemeColors}

                            /> : <Select
                                {...rest}
                                maxMenuHeight={200}
                                menuPlacement={menuPlacement}
                                className='w-100'
                                classNamePrefix='dropdown'
                                theme={selectThemeColors}
                                onChange={( data, e ) => {
                                    onChange( data, e );
                                }}

                            />
                        }

                        {secondaryOption && secondaryOption}
                    </div>
                </div > : <div className={`${classNames}`} >
                    {label && <Label size='sm' className='font-weight-bolder'>{label}</Label>}
                    <div className=''>
                        {
                            component ? <Select
                                {...rest}
                                menuPlacement={menuPlacement}
                                className='w-100'
                                classNamePrefix='dropdown'
                                components={{ MenuList: component }}
                                theme={selectThemeColors}

                            /> : <Select
                                {...rest}
                                maxMenuHeight={200}
                                menuPlacement={menuPlacement}
                                className='w-100'
                                classNamePrefix='dropdown'
                                theme={selectThemeColors}
                                onChange={( data, e ) => {
                                    onChange( data, e );
                                }}
                            />
                        }

                        {secondaryOption && secondaryOption}
                    </div>
                </div >
            }
        </>


    );
}
