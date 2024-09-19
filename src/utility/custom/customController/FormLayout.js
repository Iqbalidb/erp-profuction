import { Card, CardBody } from 'reactstrap';
import '../../../assets/scss/basic/formLayout.scss';

export default function FormLayout( props ) {
    return (
        <Card className='card-layout-container mt-3'>
            <CardBody className='card-body-container'>
                {props.children}
            </CardBody>
        </Card>
    );
}
