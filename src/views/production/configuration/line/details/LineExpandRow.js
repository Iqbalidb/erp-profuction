import React from 'react';

const LineExpandRow = ( { data } ) => {
  return (
    <div style={{ backgroundColor: 'white', color: 'black' }} className="expandable-content p-2">
      <p>
        <span>
          <strong>Line Number : </strong>
          {data.lineNumber},{' '}
        </span>

        <span>
          <strong>Description :</strong> {data.description},{' '}
        </span>

        <span>
          <strong>Status :</strong> {data.status}
        </span>
      </p>
    </div>
  );
};

export default LineExpandRow;
