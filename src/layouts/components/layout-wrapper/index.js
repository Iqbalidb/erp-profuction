// ** React Imports
// ** Store & Actions
import { handleLogout } from '@src/redux/actions/auth';
import { handleContentWidth, handleMenuCollapsed, handleMenuHidden } from '@store/actions/layout';
// ** Styles
import 'animate.css/animate.css';
// ** Third Party Components
import classnames from 'classnames';
// import { cookieName } from 'utility/enums';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { daysToMilliseconds } from 'utility/Utils';
import { openInstantLoginModal } from '../../../redux/actions/auth';
import { confirmDialog } from '../../../utility/custom/ConfirmDialog';
import { confirmObj, cookieName } from '../../../utility/enums';


const LayoutWrapper = props => {
  // ** Props
  const { layout, children, appLayout, wrapperClass, transition, routeMeta } = props;
  const [isToken, setIsToken] = useState( false );
  const dispatch = useDispatch();
  const { push } = useHistory();

  // console.log( isOpenInstantLoginModal );

  const store = useSelector( state => state );
  const navbarStore = store.navbar;
  // const authfsf = store.auth;
  // console.log( authfsf );
  const contentWidth = store.layout.contentWidth;

  const Tag = layout === 'HorizontalLayout' && !appLayout ? 'div' : Fragment;


  const cleanUp = () => {
    if ( routeMeta ) {
      if ( routeMeta.contentWidth ) {
        dispatch( handleContentWidth( 'full' ) );
      }
      if ( routeMeta.menuCollapsed ) {
        dispatch( handleMenuCollapsed( !routeMeta.menuCollapsed ) );
      }
      if ( routeMeta.menuHidden ) {
        dispatch( handleMenuHidden( !routeMeta.menuHidden ) );
      }
    }
  };

  // const token = JSON.parse( localStorage.getItem( cookieName ) );
  const token = JSON.parse( localStorage.getItem( cookieName ) );
  const isTokenExpired = token?.expires_in < ( Date.now() - token?.tokenStorageTime ) / 1000;
  const tokenExpiredTime = token?.expires_in ? token?.expires_in * 1000 : daysToMilliseconds( 365 );


  // console.log( token?.expires_in );
  useEffect( () => {
    if ( token ) {
      // dispatch( getAuthUserPermission() );
      if ( isTokenExpired ) {
        // dispatch( getAuthUser() );
        dispatch( handleLogout() );

      }
    }
  }, [] );

  const updateAuthUser = () => {
    confirmDialog(
      {
        ...confirmObj,
        title: 'Your Session is Out!',
        text: `<h5 class="text-primary mb-0">Do you want to instant Login here? </h5> `
      }
    ).then( async e => {
      if ( e.isConfirmed ) {
        console.log( 'Yes I do' );
        dispatch( openInstantLoginModal( true ) );
      } else {
        dispatch( handleLogout() );
      }
    } );
  };


  const [setTimer, setSetTimer] = useState( 0 );

  // useEffect( () => {
  //   const getTime = ( ( Date.now() - token?.tokenStorageTime ) / 1000 ); //seconds;


  //   const clear = setInterval( () => {
  //     if ( !isNaN( getTime ) ) {
  //       const ms = Math.round( ( token?.expires_in - getTime ) * 1000 );  // milliseconds
  //       const remainingTime = Math.round( ( token?.expires_in - getTime ) );
  //       dispatch( bindSessionTime( convertToMilliseconds( ms ) ) );
  //       setSetTimer( remainingTime );
  //     }
  //   }, 1000 );
  //   return () => clearInterval( clear );
  // }, [setTimer] );


  // ** ComponentDidMount
  useEffect( () => {
    if ( routeMeta ) {
      if ( routeMeta.contentWidth ) {
        dispatch( handleContentWidth( routeMeta.contentWidth ) );
      }
      if ( routeMeta.menuCollapsed ) {
        dispatch( handleMenuCollapsed( routeMeta.menuCollapsed ) );
      }
      if ( routeMeta.menuHidden ) {
        dispatch( handleMenuHidden( routeMeta.menuHidden ) );
      }
    }
    return () => cleanUp();
  }, [] );


  return (
    <div
      className={classnames( 'app-content content overflow-hidden', {
        [wrapperClass]: wrapperClass,
        'show-overlay': 0
      } )}
    >
      <div className='content-overlay'></div>
      <div className='header-navbar-shadow' />
      <div
        className={classnames( {
          'content-wrapper': !appLayout,
          'content-area-wrapper': appLayout,
          'container p-0': contentWidth === 'boxed',
          [`animate__animated animate__${transition}`]: transition !== 'none' && transition.length
        } )}
      >
        <Tag
          /*eslint-disable */
          {...( layout === 'HorizontalLayout' && !appLayout
            ? { className: classnames( { 'content-body': !appLayout } ) }
            : {} )}
        /*eslint-enable */
        >
          {children}
        </Tag>
      </div>
      {
        // isOpenInstantLoginModal
      }
      {/* <InstantLoginModal /> */}
    </div>
  );
};

export default LayoutWrapper;
