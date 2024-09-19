import React, { useCallback, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, XSquare } from 'react-feather';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Badge, Button } from 'reactstrap';
import { baseAxios } from 'services';
import { CUTTINGS_API } from 'services/api-end-points/production/v1';
import CustomPreLoader from 'utility/custom/CustomPreLoader';
import { deleteCutPlanByRange, fetchCutPlansByQuery } from '../store/actions';

const CutPlanExpandTable = props => {
  //#region Hooks
  const history = useHistory();
  const dispatch = useDispatch();
  //#endregion

  //#region States
  const [clearSelectedRow, setClearSelectedRow] = useState( false );
  const [selectedRowId, setSelectedRowId] = useState( [] );
  const [cuttingDetails, setCuttingDetails] = useState( [] );
  //#endregion

  //#region UDFs
  /**
   * Get Cut Plan Details
   */
  const GetCutPlanDetails = useCallback( async () => {
    const res = await baseAxios.get( CUTTINGS_API.fetch_cuttings_by_cut_plan, {
      params: { id: props.data.id }
    } );
    const cutDetails = res.data.data;
    setCuttingDetails( cutDetails );
  }, [props.data.id] );

  //#region Effects
  useEffect( () => {
    setTimeout( () => {
      GetCutPlanDetails();
    }, 500 );
  }, [GetCutPlanDetails] );
  //#endregion

  //#region Events
  // ** Start For Multiple Rows for Get IDs
  const handleRowSelected = () => {
    setClearSelectedRow( false );
  };
  /**
   *For Sorting
   */
  const handleSort = ( column, direction ) => {
    const { selector } = column;
    dispatch( fetchCutPlansByQuery( { sortedBy: direction, sortedColumn: selector } ) );
  };

  // **Cut Plan Details By Ids
  const handleGetCutPlanDetailsById = row => {
    history.push( {
      pathname: '/cut-plan-confirm',
      state: row
    } );
  };
  // **Clear Delete Ids
  const handleClearSelected = () => {
    setClearSelectedRow( true );
  };

  // ** Delete Rang
  const handleDeleteByRange = () => {
    dispatch( deleteCutPlanByRange( selectedRowId ) );
    setSelectedRowId( [] );
    handleClearSelected();
  };
  //#endregion

  return (
    <>
      <div>
        <DataTable
          style={{ padding: '0px 40px 40px 40px', maxHeight: '400px', overflow: 'scroll' }}
          onSelectedRowsChange={handleRowSelected}
          onSort={handleSort}
          progressPending={!cuttingDetails?.length}
          progressComponent={<CustomPreLoader />}
          contextActions={
            <Button onClick={handleDeleteByRange} className="btn-icon " color="flat-danger">
              <XSquare size={24} />
            </Button>
          }
          dense
          subHeader={false}
          // noHeader={true}
          highlightOnHover
          selectableRows={false}
          clearSelectedRows={clearSelectedRow}
          responsive={true}
          paginationServer
          columns={[
            {
              name: 'Cut Number',
              minWidth: '270px',
              selector: 'cutNo',
              sortable: true,
              cell: row => row.cutNo
            },
            {
              name: 'P.O.',
              minWidth: '250px',
              selector: 'poNo',
              sortable: true,
              cell: row => row.poNo
            },
            {
              name: 'Color',
              minWidth: '250px',
              selector: 'colorName',
              sortable: true,
              cell: row => row.colorName
            },
            {
              name: 'Cutting Type',
              minWidth: '150px',
              selector: 'cuttingType',
              sortable: false,
              cell: row => row.cuttingType
            },
            {
              name: 'Width',
              minWidth: '150px',
              selector: 'width',
              sortable: true,
              cell: row => row.width
            },
            {
              name: 'Length',
              minWidth: '150px',
              selector: 'length',
              sortable: true,
              cell: row => row.length
            },
            {
              name: 'Lay',
              minWidth: '150px',
              selector: 'layPerCut',
              sortable: true,
              cell: row => row.layPerCut
            },
            {
              name: 'Quantity',
              minWidth: '150px',
              selector: 'totalQuantity',
              sortable: true,
              cell: row => row.totalQuantity
            },
            {
              name: 'Actions',
              maxWidth: '100px',
              cell: row => ( row.status === 'Pending' ? (
                <Badge className="cursor-pointer text-white" color="primary" onClick={() => handleGetCutPlanDetailsById( row )}>
                  Confirm
                </Badge>
              ) : (
                <Badge className="text-white" color="success">
                  Confirmed
                </Badge>
              ) )
            }
          ]}
          sortIcon={<ChevronDown />}
          data={cuttingDetails}
        />
      </div>
    </>
  );
};

export default CutPlanExpandTable;
