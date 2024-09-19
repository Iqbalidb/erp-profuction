/*
     Title: Zone Group Details
     Description: Zone Group Details
     Author: Alamgir Kabir
     Date: 28-June-2022
     Modified: 28-June-2022
*/
import { useDispatch, useSelector } from 'react-redux';
import { Badge, Col, FormGroup, Label, Row, Table } from 'reactstrap';
import DualButtonModal from 'utility/custom/DualButtonModal';
import { RESET_SELECTED_ZONE_GROUP, TOGGLE_ZONE_GROUP_DETAILS_MODAL } from '../store/actionTypes';
import classess from '../styles/ZoneGroupAddForm.module.scss';

const ZoneGroupDetails = () => {
  //#region Hooks
  const dispatch = useDispatch();
  const { selectedItem, isOpenModal } = useSelector( ( { zoneGroupReducer } ) => zoneGroupReducer );
  //#endregion

  //#region Events
  /**
   * For Modal Submission
   */
  const handleModalSubmit = () => {
    dispatch( {
      type: TOGGLE_ZONE_GROUP_DETAILS_MODAL,
      payload: {
        toggleDirection: false
      }
    } );
    dispatch( {
      type: RESET_SELECTED_ZONE_GROUP
    } );
  };
  /**
   * For Modal Submission
   */
  const handleMainModelSubmit = () => {
    dispatch( {
      type: TOGGLE_ZONE_GROUP_DETAILS_MODAL,
      payload: {
        toggleDirection: false
      }
    } );
    dispatch( {
      type: RESET_SELECTED_ZONE_GROUP
    } );
  };
  /**
 * For Modal Close
 */
  const handleMainModalToggleClose = () => {
    dispatch( {
      type: TOGGLE_ZONE_GROUP_DETAILS_MODAL,
      payload: {
        toggleDirection: false
      }
    } );
    dispatch( {
      type: RESET_SELECTED_ZONE_GROUP
    } );
  };
  return (
    <DualButtonModal
      modalTypeClass="vertically-centered-modal"
      className="modal-dialog-centered modal-lg"
      openModal={isOpenModal}
      // setOpenModal={setOpenModal}
      handleModalSubmit={handleModalSubmit}
      handleMainModelSubmit={handleMainModelSubmit}
      handleMainModalToggleClose={handleMainModalToggleClose}
      title="Zone Group Details"
    >
      <Row className=" text-center">
        <FormGroup tag={Col} xs={3} sm={3} md={3} lg={3} xl={3}>
          <Label className="text-dark font-weight-bold text-nowrap" for="zoneName">
            Zone Name:{selectedItem?.zoneName}
          </Label>
        </FormGroup>
        <FormGroup tag={Col} xs={3} sm={3} md={3} lg={3} xl={3}>
          <Label className="text-dark font-weight-bold text-nowrap " for="ownerName">
            Employee Name:{selectedItem?.ownerName}
          </Label>
        </FormGroup>
        <FormGroup tag={Col} xs={3} sm={3} md={3} lg={3} xl={3}>
          <Label className="text-dark font-weight-bold text-nowrap" for="ownerEmpCode">
            Employee Code:{selectedItem?.ownerEmpCode}
          </Label>
        </FormGroup>
        <FormGroup tag={Col} xs={3} sm={3} md={3} lg={3} xl={3}>
          <Label className="text-dark font-weight-bold " for="status">
            Status:{selectedItem?.status ? (
              <Badge color="light-success" pill>
                Active
              </Badge>
            ) : (
              <Badge color="light-warning" pill>
                Inactive
              </Badge>
            )}
          </Label>
        </FormGroup>
      </Row>
      <Row className=" pr-1 pl-1 ">
        <Table size="sm" bordered={true} className={classess.poDetailsTable}>
          <thead className={` text-center table-bordered ${classess.stickyTableHead}`}>
            <tr>
              <th>SL/No</th>
              <th>Line</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {selectedItem?.list?.map( ( zg, idx ) => (
              <tr key={idx + 1}>
                <td>{idx + 1}</td>
                <td>{zg.lineName}</td>
                <td>
                  {zg.status ? (
                    <Badge color="light-success" pill>
                      Active
                    </Badge>
                  ) : (
                    <Badge color="light-warning" pill>
                      Inactive
                    </Badge>
                  )}
                </td>
              </tr>
            ) )}
          </tbody>
        </Table>
      </Row>
    </DualButtonModal>
  );
};

export default ZoneGroupDetails;
/** Change Log
 *
 */
