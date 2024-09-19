/*
   Title: External Process Add Form
   Description: External Process Add Form
   Author: Alamgir Kabir
   Date: 22-February-2023
   Modified: 22-February-2023
*/
import ActionMenu from 'layouts/components/menu/action-menu';
import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Badge, Button, Card, CardBody, Col, FormGroup, Input, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import CustomDatePicker from 'utility/custom/production/CustomDatePicker';
import { selectThemeColors } from 'utility/Utils';
import classes from '../style/ExternalProcessList.module.scss';
const ExternalProcessAddForm = () => {
  const history = useHistory();
  const handleSubmit = () => { };
  const handleCancel = () => {
    history.goBack();
  };
  return (
    <div>
      <Card className="p-1 mt-3 h-100">
        <CardBody>
          <ActionMenu title="External Process Send New">
            <NavItem className="mr-1">
              <NavLink tag={Button} size="sm" color="primary" type="submit" onClick={handleSubmit}>
                Save
              </NavLink>
            </NavItem>
            <NavItem className="mr-1">
              <NavLink tag={Button} size="sm" color="secondary" onClick={handleCancel}>
                Cancel
              </NavLink>
            </NavItem>
          </ActionMenu>

          <Row className="border rounded rounded-3">
            <FormGroup tag={Col} xs={12} sm={12} md={12} lg={12} xl={12} className="mt-n1">
              <Badge color="primary">{`Details`}</Badge>
            </FormGroup>

            <FormGroup tag={Col} xs={6} sm={6} md={4} lg={4} xl={4}>
              <Label for="process">Process Name</Label>
              <Select
                menuPosition="fixed"
                id="process"
                bsSize="sm"
                isClearable
                isSearchable
                theme={selectThemeColors}
                options={[]}
                classNamePrefix="select"
                value={[]}
                onChange={() => { }}
              />
            </FormGroup>
            <FormGroup tag={Col} xs={6} sm={6} md={4} lg={4} xl={4}>
              <Label className="text-dark font-weight-bold" for="floor">
                Floor
              </Label>
              <Select
                className="w-100 mt-50"
                id="cutPlan"
                bsSize="sm"
                isClearable
                isSearchable
                theme={selectThemeColors}
                options={[]}
                classNamePrefix="select"
                value={[]}
                onChange={() => { }}
              />
            </FormGroup>
            <FormGroup tag={Col} xs={6} sm={6} md={4} lg={4} xl={4}>
              <Label className="text-dark font-weight-bold" for="line">
                Line
              </Label>
              <Select
                className="w-100 mt-50"
                id="line"
                bsSize="sm"
                isClearable
                isSearchable
                theme={selectThemeColors}
                options={[]}
                classNamePrefix="select"
                value={[]}
                onChange={() => { }}
              />
            </FormGroup>
            <FormGroup tag={Col} xs={6} sm={6} md={4} lg={4} xl={4}>
              <CustomDatePicker name="wash" title="Send Date" value={new Date()} onChange={() => { }} />
            </FormGroup>

            <FormGroup tag={Col} xs={6} sm={6} md={4} lg={4} xl={4}>
              <Label for="buyer">Buyer</Label>
              <Select
                id="buyer"
                isSearchable
                isClearable
                bsSize="sm"
                theme={selectThemeColors}
                options={[]}
                classNamePrefix="select"
                value={[]}
                onChange={() => { }}
              />
            </FormGroup>
            <FormGroup tag={Col} xs={6} sm={6} md={4} lg={4} xl={4}>
              <Label for="style">Style</Label>
              <Select
                id="style"
                isSearchable
                isClearable
                bsSize="sm"
                theme={selectThemeColors}
                options={[]}
                classNamePrefix="select"
                value={[]}
                onChange={() => { }}
              />
            </FormGroup>
            <FormGroup tag={Col} xs={6} sm={6} md={6} lg={6} xl={6}>
              <Label for="styleCategory">Style Category</Label>
              <Input name="styleCategory" id="styleCategory" defaultValue="Style Category" disabled />
            </FormGroup>
            <FormGroup tag={Col} xs={6} sm={6} md={6} lg={6} xl={6}>
              <Label for="color">Color</Label>
              <Select
                id="color"
                isSearchable
                isClearable
                bsSize="sm"
                theme={selectThemeColors}
                options={[]}
                classNamePrefix="select"
                value={[]}
                onChange={() => { }}
              />
            </FormGroup>

            <FormGroup tag={Col} xs={12} sm={12} md={12} lg={12} xl={12}>
              <Table size="sm" className={classes.washTable}>
                <thead className={`thead-dark table-bordered ${classes.stickyTableHead} `}>
                  <tr className="text-center">
                    <th className="text-nowrap"> Size</th>
                    <th className="text-nowrap"> Assigned Quantity</th>
                    <th className="text-nowrap"> Processed Quantity</th>

                    <th className="text-nowrap"> Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {[].length > 0 &&
                    []?.map( pt => (
                      <Fragment key={pt.sizeId}>
                        <tr className="text-center">
                          <td>
                            <Input id="criticalProcessName" className="w-100 text-center" type="text" value={pt?.sizeName} disabled />
                          </td>
                          <td>
                            <Input id="criticalProcessName" className="w-100 text-center" type="text" value={pt?.assignedQuantity} disabled />
                          </td>
                          <td>
                            <Input id="criticalProcessName" className="w-100 text-center" type="text" value={pt?.processedQuantity} disabled />
                          </td>

                          <td>
                            <Input
                              id="rejectQty"
                              className="w-100 text-center"
                              type="number"
                              value={0}
                              onSelect={e => e.target.select()}
                              onChange={() => { }}
                            />
                          </td>
                        </tr>
                      </Fragment>
                    ) )}
                </tbody>
                <tbody>
                  {[].length > 0 && (
                    <>
                      {[].length > 0 && (
                        <tr className="text-center  " style={{ height: '30px', background: 'lightGray' }}>
                          <td>
                            <Label for="name" style={{ fontSize: '15px', color: 'black', fontWeight: 'bold' }}>
                              Total
                            </Label>
                          </td>
                          <td>
                            <Label for="totalAssignQty" style={{ fontSize: '15px', color: 'black', fontWeight: 'bold' }}>
                              {0}
                            </Label>
                          </td>
                          <td>
                            <Label for="totalProcssQty" style={{ fontSize: '15px', color: 'black', fontWeight: 'bold' }}>
                              {0}
                            </Label>
                          </td>

                          <td>
                            <Label for="totalSizeQty" style={{ fontSize: '15px', color: 'black', fontWeight: 'bold' }}>
                              {0}
                            </Label>
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </Table>
            </FormGroup>

            <FormGroup tag={Col} xs={12} className="">
              <Label for="name">Remarks</Label>
              <Input name="remarks" id="remarks" placeholder="Remarks" onChange={() => { }} />
            </FormGroup>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default ExternalProcessAddForm;
