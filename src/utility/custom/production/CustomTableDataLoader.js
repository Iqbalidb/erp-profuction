/*
     Title: Custom Table Data Loader
     Description: Custom Table Data Loader
     Author: Alamgir Kabir
     Date: 17-May-2023
     Modified: 17-May-2023
*/
import React from 'react';
import { Spinner } from 'reactstrap';

const CustomTableDataLoader = props => {
  const { colSpanNo } = props;
  return (
    <tbody>
      <tr>
        <td colSpan={colSpanNo} style={{ alignItems: 'center', textAlign: 'center', gap: '5px' }}>
          <Spinner color="primary" size="sm" type="grow" style={{ marginRight: '2px' }} />
          <Spinner color="primary" size="sm" type="grow" style={{ marginRight: '2px' }} />
          <Spinner color="primary" size="sm" type="grow" />
        </td>
      </tr>
    </tbody>
  );
};

export default CustomTableDataLoader;
