// ** React Imports
// ** Utils
import { getAllParents, search } from '@layouts/utils';
// ** Vertical Menu Array Of Items
import classnames from 'classnames';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { matchPath, NavLink, useLocation } from 'react-router-dom';
// ** Third Party Components
import { Badge } from 'reactstrap';


const VerticalNavMenuLink = ( {
  item,
  groupActive,
  setGroupActive,
  activeItem,
  setActiveItem,
  groupOpen,
  setGroupOpen,
  toggleActiveGroup,
  parentItem,
  routerProps,
  currentActiveItem
} ) => {
  // ** Conditional Link Tag, if item has newTab or externalLink props use <a> tag else use NavLink
  const LinkTag = item.externalLink ? 'a' : NavLink;
  const { verticalNavigation } = useSelector( ( { navbar } ) => navbar );


  // ** URL Vars
  const location = useLocation();
  const currentURL = location.pathname;

  // ** To match path
  const match = matchPath( currentURL, {
    path: `${item.navLink}/:param`,
    exact: true,
    strict: false
  } );

  // ** Search for current item parents
  const searchParents = ( verticalNavigation, currentURL ) => {
    const parents = search( verticalNavigation, currentURL, routerProps ); // Search for parent object
    const allParents = getAllParents( parents, 'id' ); // Parents Object to Parents Array
    return allParents;
  };

  // ** URL Vars
  const resetActiveGroup = navLink => {
    const parents = search( verticalNavigation, navLink, match );
    toggleActiveGroup( item.id, parents );
  };

  // ** Reset Active & Open Group Arrays
  const resetActiveAndOpenGroups = () => {
    setGroupActive( [] );
    setGroupOpen( [] );
  };

  // ** Checks url & updates active item
  useEffect( () => {
    if ( currentActiveItem !== null ) {
      setActiveItem( currentActiveItem );
      const arr = searchParents( verticalNavigation, currentURL );
      setGroupActive( [...arr] );
    }
  }, [location] );

  return (
    <li
      hidden={item?.hidden}

      className={classnames( {
        'nav-item': !item.children,
        disabled: item.disabled,
        active: item.navLink === activeItem
      } )}
    >
      <LinkTag
        className='d-flex align-items-center'
        target={item.newTab ? '_blank' : undefined}
        /*eslint-disable */
        {...( item.externalLink === true
          ? {
            href: item.navLink || '/'
          }
          : {
            to: item.navLink || '/',
            isActive: ( match, location ) => {
              if ( !match ) {
                return false
              }

              if ( match.url && match.url !== '' && match.url === item.navLink ) {
                currentActiveItem = item.navLink
              }
            }
          } )}
        /*eslint-enable */
        onClick={e => {
          if ( !item.navLink.length ) {
            e.preventDefault();
          }
          parentItem ? resetActiveGroup( item.navLink ) : resetActiveAndOpenGroups();
        }}
      >
        {item.icon}
        <span className='menu-item text-truncate'>{item.title}</span>

        {item.badge && item.badgeText ? (
          <Badge className='ml-auto mr-1' color={item.badge} pill>
            {item.badgeText}
          </Badge>
        ) : null}
      </LinkTag>
    </li>
  );
};

export default VerticalNavMenuLink;
