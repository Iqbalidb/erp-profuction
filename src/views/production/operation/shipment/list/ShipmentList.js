/**
 * Title: Shipment Edit Form
 * Description: Shipment Edit Form
 * Author: Iqbal Hossain
 * Date: 05-January-2022
 * Modified: 05-January-2022
 */

import ActionMenu from 'layouts/components/menu/action-menu';
import _ from 'lodash';
import { Fragment, useState } from 'react';
import { Maximize2, Minimize2, Settings } from 'react-feather';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Col,
  Collapse,
  FormGroup,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Table
} from 'reactstrap';
import { randomIdGenerator } from 'utility/Utils';
import AdvancedSearchBox from 'utility/custom/AdvancedSearchBox';
import FormLayout from 'utility/custom/FormLayout';
import TableCustomerHeader from 'utility/custom/TableCustomerHeader';
import classess from '../style/Shipment.module.scss';
const ShipmentListPage = () => {
  const history = useHistory();
  //#region State
  const [searchTerm] = useState( '' );
  const [active, setActive] = useState( '1' );
  const [rowsPerPage] = useState( 5 );
  const [shipmentInfo, setShipmentInfo] = useState( [
    {
      id: 203,
      buyer: 'John',
      styleNo: 'AV68562',
      po: 'PO-01',
      styleCategory: 'T-Shirt',
      orderQty: 2520,
      shipmentMode: 'Air',
      destination: 'USA',
      shipmentDate: '30/11/2021',
      isOpen: false,
      details: [
        {
          id: randomIdGenerator(),
          color: 'Red',
          totalBlister: 6,
          totalCarton: 2,
          totalPcsCarton: 12,
          ctn: 100,
          shipmentQty: 100,
          sizes: [
            {
              id: randomIdGenerator(),
              sizeName: 'S',

              qty: 1
            },
            {
              id: randomIdGenerator(),
              sizeName: 'M',
              qty: 2
            },
            {
              id: randomIdGenerator(),
              sizeName: 'L',
              qty: 2
            },
            {
              id: randomIdGenerator(),
              sizeName: 'XL',
              qty: 1
            }
          ]
        },
        {
          id: 11,
          color: 'Green',
          totalBlister: 6,
          totalCarton: 1,
          totalPcsCarton: 12,
          ctn: 50,
          shipmentQty: 50,
          sizes: [
            {
              id: randomIdGenerator(),
              sizeName: 'S',
              qty: 2
            },
            {
              id: randomIdGenerator(),
              sizeName: 'M',
              qty: 1
            },
            {
              id: randomIdGenerator(),
              sizeName: 'L',
              qty: 1
            },
            {
              id: randomIdGenerator(),
              sizeName: 'XL',
              qty: 2
            }
          ]
        }
      ]
    },
    {
      id: 208,
      buyer: 'IFG',
      styleNo: 'AV1873',
      po: 'PO-02',
      styleCategory: 'Jeans',
      orderQty: 2520,
      shipmentMode: 'Air',
      destination: 'Canada',
      shipmentDate: '30/11/2021',
      isOpen: false,
      details: [
        {
          id: randomIdGenerator(),
          color: 'Blue',
          totalBlister: 6,
          totalCarton: 4,
          totalPcsCarton: 12,
          ctn: 20,
          shipmentQty: 20,
          sizes: [
            {
              id: randomIdGenerator(),
              sizeName: 'S',
              qty: 1
            },
            {
              id: randomIdGenerator(),
              sizeName: 'M',
              qty: 2
            },
            {
              id: randomIdGenerator(),
              sizeName: 'L',
              qty: 2
            },
            {
              id: randomIdGenerator(),
              sizeName: 'XL',
              qty: 1
            }
          ]
        },
        {
          id: 11,
          color: 'Black',
          totalBlister: 5,
          totalCarton: 2,
          totalPcsCarton: 12,
          ctn: 20,
          shipmentQty: 20,
          sizes: [
            {
              id: randomIdGenerator(),
              sizeName: 'S',
              qty: 0
            },
            {
              id: randomIdGenerator(),
              sizeName: 'M',
              qty: 2
            },
            {
              id: randomIdGenerator(),
              sizeName: 'L',
              qty: 2
            },
            {
              id: randomIdGenerator(),
              sizeName: 'XL',
              qty: 1
            }
          ]
        }
      ]
    }
  ] );

  //#endregion

  //#region Events
  const handleFilter = () => { };
  const handlePerPage = () => { };

  //For toggle collapse
  const toggleShipmentDetails = spIdx => {
    const _shipmentInfo = _.cloneDeep( shipmentInfo );
    const clickedItem = _shipmentInfo[spIdx];
    clickedItem.isOpen = !clickedItem.isOpen;
    setShipmentInfo( _shipmentInfo );
  };

  //For CTN Qty Change
  const handleChangeCtnQty = ( e, masterIdx, detailsIdx ) => {
    const { value } = e.target;
    const _shipmentInfo = [...shipmentInfo];
    const clickedItem = _shipmentInfo[masterIdx];
    const detailsItem = clickedItem.details;
    const detailsIndex = detailsItem[detailsIdx];
    detailsIndex.ctn = Number( value );
    _shipmentInfo[masterIdx] = clickedItem;
    setShipmentInfo( _shipmentInfo );
  };

  //For Tab Panel Change
  const toggle = tab => {
    if ( active !== tab ) {
      setActive( tab );
    }
  };

  //For Shipment Assign To Pass
  const handleShipmentAssignToPass = shipmentDetails => {
    if ( shipmentDetails ) {
      history.push( {
        pathname: '/shipment-assign-to-passed',
        state: shipmentDetails
      } );
    }
  };
  const breadcrumb = [
    {
      id: 'home',
      name: 'Home',
      link: "/home",
      isActive: false,
      hidden: false
    },

    {
      id: 'shipment',
      name: 'Shipment',
      // link: "/bundle",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion

  return (
    <div>
      <ActionMenu
        breadcrumb={breadcrumb}
        title='Shipment'
        moreButton={false}
      // moreButton={isPermit( userPermission?.ItemGroupCreate, authPermissions )}
      >

      </ActionMenu>
      <FormLayout isNeedTopMargin={true}>
        <AdvancedSearchBox>
          <Row>
            <Col md={3}>
              <Input id="search-item" className="w-100 mt-50" placeholder="Search" type="text" value={searchTerm} onChange={e => handleFilter( e )} />
            </Col>
          </Row>
        </AdvancedSearchBox>

        <Row className="rounded rounded-3">

          <Col xs={12} sm={12} md={12} lg={12} xl={12}>
            <Nav tabs>
              <NavItem>
                <NavLink
                  active={active === '1'}
                  onClick={() => {
                    toggle( '1' );
                  }}
                >
                  Pending
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={active === '2'}
                  onClick={() => {
                    toggle( '2' );
                  }}
                >
                  Passed
                </NavLink>
              </NavItem>
            </Nav>
            <TableCustomerHeader handlePerPage={handlePerPage} searchTerm={searchTerm} rowsPerPage={rowsPerPage}></TableCustomerHeader>
            <TabContent activeTab={active}>
              {/* Tab Panel for Pending */}
              <TabPane tabId="1">
                <div className="border rounded rounded-3 p-1 mt-1">
                  <Row>
                    <FormGroup tag={Col} xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Table size="sm" responsive bordered={true} className={classess.shipmentTable}>
                        <thead className={`thead-dark table-bordered ${classess.stickyTableHead}`}>
                          <tr className="text-center">
                            <th style={{ minWidth: '4px' }}>#</th>
                            <th>Buyer</th>
                            <th>Style</th>
                            <th>PO</th>
                            <th>Style Category Name</th>
                            <th>Order Quantity</th>
                            <th>Shipment Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody className="text-center">
                          {shipmentInfo.map( ( sp, spIdx ) => (
                            <Fragment key={sp.id}>
                              <tr>
                                <td style={{ minWidth: '4px' }}>
                                  <Button
                                    for="collapseId"
                                    tag={Label}
                                    className="btn-icon"
                                    color="flat-primary"
                                    onClick={() => toggleShipmentDetails( spIdx )}
                                  >
                                    {sp.isOpen ? (
                                      <Minimize2 id="collpaseId" size={15} color="#57C69D" />
                                    ) : (
                                      <Maximize2 id="collpaseId" size={15} color="#7367f0" />
                                    )}
                                  </Button>
                                </td>
                                <td>{sp.buyer}</td>
                                <td>{sp.styleNo}</td>
                                <td>{sp.po}</td>
                                <td>{sp.styleCategory}</td>
                                <td>{sp.orderQty}</td>
                                <td>{sp.shipmentDate}</td>
                                <td>{<Settings className="cursor-pointer" onClick={() => handleShipmentAssignToPass( sp )}></Settings>}</td>
                              </tr>
                              <tr>
                                <td colSpan={8} style={{ padding: '2px 10px !important' }}>
                                  <Collapse isOpen={sp.isOpen}>
                                    <Table size="sm" responsive bordered={true} className={classess.childTable}>
                                      <thead className="thead-light">
                                        <tr>
                                          <th rowSpan={2}>Colors</th>
                                          <th colSpan={4} style={{ minWidth: '170px' }}>
                                            Sizes
                                          </th>
                                          <th rowSpan={3}>T. Blister/Carton</th>
                                          <th rowSpan={3}>Total Pcs/Carton</th>
                                          <th rowSpan={3}>CTN</th>
                                        </tr>
                                        <tr>
                                          <th style={{ fontWeight: 'bold', fontSize: '15px' }}>S</th>
                                          <th style={{ fontWeight: 'bold', fontSize: '15px' }}>M</th>
                                          <th style={{ fontWeight: 'bold', fontSize: '15px' }}>L</th>
                                          <th style={{ fontWeight: 'bold', fontSize: '15px' }}>XL</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {sp.details.map( ( item, idx ) => (
                                          <tr key={item.id}>
                                            <td>{item.color}</td>
                                            {item.sizes.map( size => (
                                              <td key={size.id}>{size.qty}</td>
                                            ) )}

                                            <td>{item.totalBlister}</td>
                                            <td>{item.totalCarton}</td>
                                            <td>
                                              <Input
                                                className="text-center"
                                                type="number"
                                                id="ctn"
                                                name="ctn"
                                                value={item.ctn}
                                                onSelect={e => e.target.select()}
                                                onChange={e => handleChangeCtnQty( e, spIdx, idx )}
                                              />
                                            </td>
                                          </tr>
                                        ) )}
                                      </tbody>
                                    </Table>
                                  </Collapse>
                                </td>
                              </tr>
                            </Fragment>
                          ) )}
                        </tbody>
                      </Table>
                    </FormGroup>
                  </Row>
                </div>
              </TabPane>
              {/* Tab Panel for Pending */}

              {/* Tab Panel for Passed */}
              <TabPane tabId="2">
                <div className="border rounded rounded-3 p-1 mt-1">
                  <Row>
                    <FormGroup tag={Col} xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Table size="sm" responsive bordered={true} className={classess.shipmentTable}>
                        <thead className={`thead-dark table-bordered ${classess.stickyTableHead}`}>
                          <tr className="text-center">
                            <th style={{ minWidth: '4px' }}>#</th>
                            <th>Buyer</th>
                            <th>Style</th>
                            <th>PO</th>
                            <th>Style Category Name</th>
                            <th>Order Quantity</th>
                            <th>Shipment Date</th>
                          </tr>
                        </thead>
                        <tbody className="text-center">
                          {shipmentInfo.map( ( sp, spIdx ) => (
                            <Fragment key={sp.id}>
                              <tr>
                                <td style={{ minWidth: '4px' }}>
                                  <Button
                                    for="collapseId"
                                    tag={Label}
                                    className="btn-icon"
                                    color="flat-primary"
                                    onClick={() => toggleShipmentDetails( spIdx )}
                                  >
                                    {sp.isOpen ? (
                                      <Minimize2 id="collpaseId" size={15} color="#57C69D" />
                                    ) : (
                                      <Maximize2 id="collpaseId" size={15} color="#7367f0" />
                                    )}
                                  </Button>
                                </td>
                                <td>{sp.buyer}</td>
                                <td>{sp.styleNo}</td>
                                <td>{sp.po}</td>
                                <td>{sp.styleCategory}</td>
                                <td>{sp.orderQty}</td>
                                <td>{sp.shipmentDate}</td>
                              </tr>
                              <tr>
                                <td colSpan={8} style={{ padding: '2px 10px !important' }}>
                                  <Collapse isOpen={sp.isOpen}>
                                    <Table size="sm" responsive bordered={true} className={classess.childTable}>
                                      <thead className="thead-light">
                                        <tr>
                                          <th rowSpan={2}>Colors</th>
                                          <th colSpan={4} style={{ minWidth: '170px' }}>
                                            Sizes
                                          </th>
                                          <th rowSpan={3}>T. Blister/Carton</th>
                                          <th rowSpan={3}>T. Pcs/Blister</th>
                                          <th rowSpan={3}>Total Pcs/Carton</th>
                                          <th rowSpan={3}>CTN</th>
                                          <th colSpan={2}>Shipment Qty</th>
                                        </tr>
                                        <tr>
                                          <th style={{ fontWeight: 'bold', fontSize: '15px' }}>S</th>
                                          <th style={{ fontWeight: 'bold', fontSize: '15px' }}>L</th>
                                          <th style={{ fontWeight: 'bold', fontSize: '15px' }}>M</th>
                                          <th style={{ fontWeight: 'bold', fontSize: '15px' }}>XL</th>
                                          <th>CTN</th>
                                          <th>PCs</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {sp.details.map( item => (
                                          <tr key={item.id}>
                                            <td>{item.color}</td>
                                            {item.sizes.map( size => (
                                              <td key={size.id}>{size.qty}</td>
                                            ) )}

                                            <td>{item.totalBlister}</td>
                                            <td>{item.totalCarton}</td>
                                            <td>{item.totalPcsCarton}</td>
                                            <td>
                                              <Input
                                                readOnly
                                                className="text-center"
                                                style={{ backgroundColor: 'white' }}
                                                type="number"
                                                id="ctn"
                                                name="ctn"
                                                value={item.ctn}
                                                onSelect={e => e.target.select()}
                                              />
                                            </td>
                                            <td>{item.ctn}</td>
                                            <td>{item.totalPcsCarton * item.ctn}</td>
                                          </tr>
                                        ) )}
                                      </tbody>
                                    </Table>
                                  </Collapse>
                                </td>
                              </tr>
                            </Fragment>
                          ) )}
                        </tbody>
                      </Table>
                    </FormGroup>
                  </Row>
                </div>
              </TabPane>
              {/* Tab Panel for Passed */}
            </TabContent>
          </Col>
        </Row>
      </FormLayout>
    </div>
  );
};

export default ShipmentListPage;
