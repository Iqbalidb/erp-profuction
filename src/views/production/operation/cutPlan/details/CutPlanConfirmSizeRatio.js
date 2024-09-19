/*
     Title: Cut Plan Confirm Size Ratio
     Description: Cut Plan Confirm Size Ratio
     Author: Alamgir Kabir
     Date: 22-June-2022
     Modified: 22-June-2022
*/

import { PlusCircle } from 'react-feather';
import { Button, Card, CardBody, Col, FormGroup, Input, Label, Row, Table } from 'reactstrap';

const CutPlanConfirmSizeRatio = props => {
  const { openModal, setOpenModal, selectedCutPlanInfo, onShadeQuantityChange, shadeName, setShadeName, onAddShade } = props;

  //#region States

  //#endregion

  //#region  Events

  const handleMainModalToggleClose = () => {
    setOpenModal( !openModal );
  };

  const handleModalSubmit = () => {
    setOpenModal( !openModal );
  };

  //#endregion
  return (
    <div>
      <DualButtonModal
        modalTypeClass="vertically-centered-modal"
        className="modal-dialog-centered modal-lg"
        openModal={openModal}
        setOpenModal={setOpenModal}
        handleMainModelSubmit={handleModalSubmit}
        handleMainModalToggleClose={handleMainModalToggleClose}
        title="Cut Confirm Size Ratio"
      >
        <Card outline>
          <Row className="rounded rounded-3 ml-1">
            <FormGroup tag={Col} xs={8} sm={8} md={8} lg={8} xl={8}>
              <Label for="name">Name</Label>
              <Input id="name" name="Shade" type="text" placeholder="name" value={shadeName} onChange={e => setShadeName( e.target.value )} />
            </FormGroup>
            <FormGroup tag={Col} xs={1} sm={1} md={1} lg={1} xl={1}>
              <Button className="btn-icon " id="btn-save" style={{ marginTop: '15px', padding: '8px' }} color="primary" outline onClick={onAddShade}>
                <PlusCircle size={14} id="btn-save" />
              </Button>
            </FormGroup>
          </Row>
          <CardBody className="custom-table">
            <Table size="sm" bordered hover responsive className="tableThTd">
              <thead className="thead-dark">
                <tr className="text-center">
                  <th className="text-nowrap" style={{ width: '30px' }}>
                    Size
                  </th>
                  <th className="text-nowrap" style={{ width: '30px' }}>
                    Ratio
                  </th>
                  <th className="text-nowrap" style={{ width: '30px' }}>
                    Qty
                  </th>
                  {selectedCutPlanInfo[0]['shades']?.map( shade => (
                    <th key={shade.columnId} className="text-nowrap" style={{ width: '30px' }}>
                      {shade.productPartsShade}
                    </th>
                  ) )}

                  <th className="text-nowrap" style={{ width: '30px' }}>
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className="text-center" style={{ padding: '10px 0 !important' }}>
                {selectedCutPlanInfo?.map( ( size, sizeIndex ) => (
                  <tr key={size.sizeId}>
                    <td style={{ width: '30px' }}>{size.sizeName}</td>
                    <td style={{ width: '30px' }}>{size.ratio}</td>
                    <td style={{ width: '30px' }}>{size.ratioQty}</td>
                    {size.shades?.map( shade => {
                      return (
                        <td key={shade.columnId}>
                          <Input
                            style={{ width: '90px' }}
                            className="text-center"
                            id={`shadeQuantity_${sizeIndex}_${shade.columnId}`}
                            name={`shadeQuantity_${sizeIndex}_${shade.columnId}`}
                            type="text"
                            bsSize="sm"
                            placeholder="Shade Quantity"
                            value={shade.quantity}
                            onChange={e => {
                              onShadeQuantityChange( e, size.sizeId, shade.columnId );
                            }}
                          />
                        </td>
                      );
                    } )}
                    <td style={{ width: '30px' }}>{size.remainingQuantity}</td>
                  </tr>
                ) )}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </DualButtonModal>
    </div>
  );
};

export default CutPlanConfirmSizeRatio;

/** Change Log
 * 22-Jun-2022(Alamgir): Cut Plan Confirm Size Ratio Modal Create
 */
