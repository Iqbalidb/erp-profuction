import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Spinner } from 'reactstrap';
const Backdrop = props => {
  const { show } = props;
  return (
    <Fragment>
      {show ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'fixed',
            zIndex: 9999999999999999,
            left: 0,
            top: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Spinner
            color="light"
            style={{
              height: '3rem',
              width: '3rem'
            }}
          />
        </div>
      ) : null}
    </Fragment>
  );
};
Backdrop.propTypes = {
  show: PropTypes.bool
};

Backdrop.defaultProps = {
  show: false
};

export default Backdrop;
