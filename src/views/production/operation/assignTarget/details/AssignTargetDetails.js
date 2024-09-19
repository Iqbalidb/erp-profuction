import ActionMenu from 'layouts/components/menu/action-menu';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Col, NavItem, NavLink, Row } from 'reactstrap';
import ErpDetailsInput from 'utility/custom/customController/ErpDetailsInput';
import FormContentLayout from 'utility/custom/customController/FormContentLayout';
import FormLayout from 'utility/custom/customController/FormLayout';
import { formattedDate } from 'utility/dateHelpers';
import { randomIdString } from 'utility/Utils';
import '../../../../../assets/scss/production/form-page-custom-table.scss';
const AssignTargetDetails = () => {
  //#region hooks
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const selectedRow = location.state;
  //#endregion

  //#region Events
  /**
   * For Cancel Route
   */
  const handleCancel = () => {
    history.goBack();
  };
  //#endregion

  //#region Breadcrumb
  const breadcrumb = [
    {
      id: 'home',
      name: 'Home',
      link: "/",
      isActive: false,
      hidden: false
    },

    {
      id: 'assign-target',
      name: 'Assign Target',
      link: "/assign-target",
      isActive: false,
      hidden: false
    },

    {
      id: 'assign-target-details',
      name: 'Assign Target Details',
      link: "/assign-target-details",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion

  return (
    <>

      <ActionMenu breadcrumb={breadcrumb} title={!moment( selectedRow?.date ).isBefore( new Date(), 'day' ) ? "Todays Assign Target Details" : 'Previous Assign Target Details'}>
        <NavItem className="mr-1">
          <NavLink tag={Button} size="sm" color="secondary" onClick={handleCancel}>
            Cancel
          </NavLink>
        </NavItem>
      </ActionMenu>
      <FormLayout className="general-form-container p-0">
        <Row className="p-1">
          <Col lg='12' className=''>
            <FormContentLayout title="Master Information">
              <Col lg='4' md='6' xl='4'>
                <ErpDetailsInput
                  id={randomIdString()}
                  label="  Assign Date"
                  classNames='mt-1'
                  value={formattedDate( selectedRow?.date )}
                />
              </Col>
              <Col lg='4' md='6' xl='4'>
                <ErpDetailsInput
                  id={randomIdString()}
                  label="Floor"
                  classNames='mt-1'
                  value={selectedRow?.floorName}
                />
              </Col>
              <Col lg='4' md='6' xl='4'>
                <ErpDetailsInput
                  id={randomIdString()}
                  label="Zone"
                  classNames='mt-1'
                  value={selectedRow?.zoneName}
                />
              </Col>
              <Col lg='4' md='6' xl='4'>
                <ErpDetailsInput
                  id={randomIdString()}
                  label="Line"
                  classNames='mt-1'
                  value={selectedRow?.lineName}
                />
              </Col>
              <Col lg='4' md='6' xl='4'>
                <ErpDetailsInput
                  id={randomIdString()}
                  label=" Zone Owner"
                  classNames='mt-1'
                  value={selectedRow?.ownerName}
                />
              </Col>
              <Col lg='4' md='6' xl='4'>
                <ErpDetailsInput
                  id={randomIdString()}
                  label="Working Minute"
                  classNames='mt-1'
                  value={selectedRow?.machineCount}
                />
              </Col>
              <Col lg='4' md='6' xl='4'>
                <ErpDetailsInput
                  id={randomIdString()}
                  label="Working Minute"
                  classNames='mt-1'
                  value={selectedRow?.workingMinute}
                />
              </Col>
              <Col lg='4' md='6' xl='4'>
                <ErpDetailsInput
                  id={randomIdString()}
                  label="Efficiency"
                  classNames='mt-1'
                  value={selectedRow?.efficiency}
                />
              </Col>
              <Col lg='4' md='6' xl='4'>
                <ErpDetailsInput
                  id={randomIdString()}
                  label="SMV"
                  classNames='mt-1'
                  value={selectedRow?.standardMinuteValue}
                />
              </Col>
              <Col lg='4' md='6' xl='4'>
                <ErpDetailsInput
                  id={randomIdString()}
                  label="Target"
                  classNames='mt-1'
                  value={selectedRow?.targetValue}
                />
              </Col>
              <Col lg='4' md='6' xl='4'>
                <ErpDetailsInput
                  id={randomIdString()}
                  label="Remarks"
                  classNames='mt-1'
                  value={selectedRow?.remark ? selectedRow?.remark : 'NA'}
                />
              </Col>
            </FormContentLayout>
          </Col>
        </Row>
      </FormLayout>
    </>
  );
};

export default AssignTargetDetails;
