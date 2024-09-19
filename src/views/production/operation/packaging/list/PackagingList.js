/**
 * Title: Packaging Edit Form
 * Description: Packaging Edit Form
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
import classess from '../style/Packaging.module.scss';
const PackagingListPage = () => {
  const history = useHistory();
  //#region State
  const [searchTerm] = useState( '' );
  const [rowsPerPage] = useState( 5 );
  const [active, setActive] = useState( '1' );
  const [packagingInfo, setPackagingInfo] = useState( [
    {
      id: 203,
      buyer: 'Kuper',
      styleNo: 'AV68567',
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
          totalPcs: 6,
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
          ],
          qty: 420,
          rejectInfo: '',
          hasReject: false,
          stattus: 'passed'
        },
        {
          id: randomIdGenerator(),
          color: 'Red',
          totalPcs: 6,

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
          ],
          qty: 420,
          rejectInfo: '',
          hasReject: false,
          stattus: 'passed'
        }
      ]
    },
    {
      id: 208,
      buyer: 'IFG',
      styleNo: 'AV1873',
      po: 'PO-02',
      styleCategory: 'Shorts',
      orderQty: 500,
      shipmentMode: 'Air',
      destination: 'Canada',
      shipmentDate: '30/11/2021',
      isOpen: false,
      details: [
        {
          id: randomIdGenerator(),
          color: 'Green',
          totalPcs: 6,

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
          ],
          qty: 420,
          rejectInfo: '',
          hasReject: false,
          stattus: 'passed'
        },
        {
          id: randomIdGenerator(),
          color: 'Blue',
          totalPcs: 6,

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
          ],
          qty: 420,
          rejectInfo: '',
          hasReject: false,
          stattus: 'passed'
        }
      ]
    }
  ] );

  //#endregion

  //#region Events
  const toggle = tab => {
    if ( active !== tab ) {
      setActive( tab );
    }
  };
  //For Qty Change
  const handleChangeQty = ( e, pkId, idx ) => {
    const { value } = e.target;
    const _packagingDetails = _.cloneDeep( packagingInfo );
    const clickedItem = _packagingDetails[pkId];
    const clickedIndex = clickedItem.details[idx];
    clickedIndex.qty = Number( value );
    _packagingDetails[pkId] = clickedItem;
    setPackagingInfo( _packagingDetails );
  };
  const handleFilter = () => { };
  const handlePerPage = () => { };
  const togglePackagingDetails = pkId => {
    const _packagingDetails = _.cloneDeep( packagingInfo );
    const clickedItem = _packagingDetails[pkId];
    clickedItem.isOpen = !clickedItem.isOpen;
    setPackagingInfo( _packagingDetails );
  };
  //For Packaging Assign To Pass
  const handlePackagingAssignToPass = packagingDetails => {
    if ( packagingDetails ) {
      history.push( {
        pathname: '/packaging-assign-to-passed',
        state: packagingDetails
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
      id: 'packaging',
      name: 'Packaging',
      // link: "/bundle",
      isActive: true,
      hidden: false
    }
  ];
  //#endregion
  return (
    <>
      <ActionMenu
        breadcrumb={breadcrumb}
        title='Packaging'
        moreButton={false}
      // moreButton={isPermit( userPermission?.ItemGroupCreate, authPermissions )}
      >

      </ActionMenu>
      <FormLayout isNeedTopMargin={true}>
        <AdvancedSearchBox >
          <Row>
            <Col md={3}>
              <Input id="search-item" className="w-100 mt-50" placeholder="Search" type="text" value={searchTerm} onChange={e => handleFilter( e )} />
            </Col>
          </Row>
        </AdvancedSearchBox>

        <Row className="rounded rounded-3">
          {/* <CardTitle tag="h2" className="ml-2">
            Packaging
          </CardTitle> */}
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
              {/* Pending Section Start */}
              <TabPane tabId="1">
                <div className="border rounded rounded-3 p-1 mt-1">
                  <Row>
                    <FormGroup tag={Col} xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Table size="sm" responsive className={classess.packagingTable} bordered={true}>
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
                          {packagingInfo.map( ( pk, pkId ) => (
                            <Fragment key={pk.id}>
                              <tr>
                                <td style={{ minWidth: '4px' }}>
                                  <Button
                                    for="collapseId"
                                    tag={Label}
                                    className="btn-icon"
                                    color="flat-primary"
                                    onClick={() => togglePackagingDetails( pkId )}
                                  >
                                    {pk.isOpen ? (
                                      <Minimize2 id="collpaseId" size={15} color="#57C69D" />
                                    ) : (
                                      <Maximize2 id="collpaseId" size={15} color="#7367f0" />
                                    )}
                                  </Button>
                                </td>
                                <td>{pk.buyer}</td>
                                <td>{pk.styleNo}</td>
                                <td>{pk.po}</td>
                                <td>{pk.styleCategory}</td>
                                <td>{pk.orderQty}</td>
                                <td>{pk.shipmentDate}</td>
                                <td>{<Settings className="cursor-pointer" onClick={() => handlePackagingAssignToPass( pk )}></Settings>}</td>
                              </tr>
                              <tr>
                                <td
                                  colSpan={8}
                                  style={{
                                    padding: '2px 10px !important',
                                    backgroundColor: '#fff'
                                  }}
                                >
                                  <Collapse isOpen={pk.isOpen}>
                                    <Table size="sm" responsive bordered={true} className={classess.childTable}>
                                      <thead className="thead-light">
                                        <tr>
                                          <th rowSpan={2}>Colors</th>
                                          <th colSpan={4} style={{ minWidth: '170px' }}>
                                            Sizes
                                          </th>

                                          <th rowSpan={3}>Quantity</th>
                                        </tr>
                                        <tr>
                                          <th style={{ fontWeight: 'bold', fontSize: '15px' }}>S</th>
                                          <th style={{ fontWeight: 'bold', fontSize: '15px' }}>M</th>
                                          <th style={{ fontWeight: 'bold', fontSize: '15px' }}>L</th>
                                          <th style={{ fontWeight: 'bold', fontSize: '15px' }}>XL</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {pk?.details?.map( item => (
                                          <tr key={item.id}>
                                            <td>{item.color}</td>
                                            {/* <td>{item.sizeName}</td> */}
                                            {item.sizes.map( size => (
                                              <td key={size.id}>{size.qty}</td>
                                            ) )}

                                            <td>
                                              <Input
                                                readOnly
                                                className="text-center bg-white"
                                                type="number"
                                                id="ctn"
                                                name="ctn"
                                                value={item.qty}
                                                onSelect={e => e.target.select()}
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
              {/* Pending Section End*/}

              {/* Passed Section Start */}

              <TabPane tabId="2">
                <div className="border rounded rounded-3 p-1 mt-1">
                  <Row>
                    <FormGroup tag={Col} xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Table size="sm" responsive bordered className={classess.packagingTable}>
                        <thead className={`thead-dark table-bordered ${classess.childTable}`}>
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
                          {packagingInfo.map( ( pk, pkId ) => (
                            <Fragment key={pk.id}>
                              <tr>
                                <td style={{ minWidth: '4px' }}>
                                  <Button
                                    for="collapseId"
                                    tag={Label}
                                    className="btn-icon"
                                    color="flat-primary"
                                    onClick={() => togglePackagingDetails( pkId )}
                                  >
                                    {pk.isOpen ? (
                                      <Minimize2 id="collpaseId" size={15} color="#57C69D" />
                                    ) : (
                                      <Maximize2 id="collpaseId" size={15} color="#7367f0" />
                                    )}
                                  </Button>
                                </td>
                                <td>{pk.buyer}</td>
                                <td>{pk.styleNo}</td>
                                <td>{pk.po}</td>
                                <td>{pk.styleCategory}</td>
                                <td>{pk.orderQty}</td>
                                <td>{pk.shipmentDate}</td>
                              </tr>
                              <tr>
                                <td
                                  colSpan={8}
                                  style={{
                                    padding: '2px 10px !important',
                                    backgroundColor: '#fff'
                                  }}
                                >
                                  <Collapse isOpen={pk.isOpen}>
                                    <Table size="sm" responsive bordered={true} className={classess.childTable}>
                                      <thead className="thead-light">
                                        <tr>
                                          <th rowSpan={2}>Colors</th>
                                          <th colSpan={4} style={{ minWidth: '170px' }}>
                                            Sizes
                                          </th>
                                          <th rowSpan={3}>Total Pcs</th>
                                          <th rowSpan={3}>Quantity</th>
                                        </tr>
                                        <tr>
                                          <th style={{ fontWeight: 'bold', fontSize: '15px' }}>S</th>
                                          <th style={{ fontWeight: 'bold', fontSize: '15px' }}>M</th>
                                          <th style={{ fontWeight: 'bold', fontSize: '15px' }}>L</th>
                                          <th style={{ fontWeight: 'bold', fontSize: '15px' }}>XL</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {pk?.details?.map( ( item, idx ) => (
                                          <tr key={item.id}>
                                            <td>{item.color}</td>
                                            {item.sizes.map( size => (
                                              <td key={size.id}>{size.qty}</td>
                                            ) )}

                                            <td>{item.totalPcs}</td>
                                            <td>
                                              <Input
                                                className="text-center"
                                                type="number"
                                                id="qty"
                                                name="qty"
                                                value={item.qty}
                                                onSelect={e => e.target.select()}
                                                onChange={e => handleChangeQty( e, pkId, idx )}
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
              {/* Passed Section End */}
            </TabContent>
          </Col>
        </Row>
      </FormLayout>

    </>
  );
};

export default PackagingListPage;
