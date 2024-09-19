import defaultImage from "@custom-assets/images/avatars/avatar-blank.png";
import errorImage from "@custom-assets/images/avatars/placeholder-image.jpg";
import _ from "lodash";
import { notify } from "./custom/notifications";

// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = obj => Object.keys( obj ).length === 0;
export const isArrayEmpty = obj => obj.length === 0;


// ** Returns K format from a number
export const kFormatter = num => ( num > 999 ? `${( num / 1000 ).toFixed( 1 )}k` : num );

// ** Converts HTML to string
export const htmlToString = html => html.replace( /<\/?[^>]+(>|$)/g, '' );

// ** Checks if the passed date is today
export const isToday = date => {
  const today = new Date();
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  );
};

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = ( value, formatting = { month: 'short', day: 'numeric', year: 'numeric' } ) => {
  if ( !value ) return value;
  return new Intl.DateTimeFormat( 'en-US', formatting ).format( new Date( value ) );
};

// ** Returns short month of passed date
export const formatDateToMonthShort = ( value, toTimeForCurrentDay = true ) => {
  const date = new Date( value );
  let formatting = { month: 'short', day: 'numeric' };

  if ( toTimeForCurrentDay && isToday( date ) ) {
    formatting = { hour: 'numeric', minute: 'numeric' };
  }

  return new Intl.DateTimeFormat( 'en-US', formatting ).format( new Date( value ) );
};

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem( 'userData' );
export const getUserData = () => JSON.parse( localStorage.getItem( 'userData' ) );

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = userRole => {
  if ( userRole === 'admin' ) return '/';
  if ( userRole === 'client' ) return '/access-control';
  return '/login';
};

//** Random Id Generator */

export const randomIdGenerator = () => {
  const id = Math.floor( Math.random() * Date.now() );
  return id;
};

//** Random Id Generator: String */

export const randomIdString = () => {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( let i = 0; i < 4; i++ ) {
    result += `set-${characters.charAt( Math.floor( Math.random() *
      charactersLength ) )}`;
  }
  return result;
};

//** Random Id Generator: Field */

export const randomFieldId = () => {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( let i = 0; i < 2; i++ ) {
    result += `fid-${characters.charAt( Math.floor( Math.random() *
      charactersLength ) )}`;
  }
  return result;
};

/// Convert Query String
export const convertQueryString = ( params ) => {
  const searchParams = new URLSearchParams( params );
  return searchParams;
};

export const comparerForDelete = ( inputValue ) => {
  console.log( inputValue );
  return function ( newExistingStyleProductCategory ) {
    return inputValue.filter( function ( other ) {
      return other.value === newExistingStyleProductCategory.value;
    } ).length === 0;
  };
};
/// Get ID from URL Path
export const getIdFromUrl = () => {
  const urlSearchParams = new URLSearchParams( window.location );
  const params = Object.fromEntries( urlSearchParams.entries() );

  // const params = useLocation();
  const id = params.pathname.substring( params.pathname.lastIndexOf( '/' ) + 1 );
  return id;
};


export const replaceImage = ( error ) => {
  error.target.src = defaultImage;
};
export const replaceErrorImage = ( error ) => {
  error.target.src = errorImage;
};
// Is it Devepment Mode
// export const isDevelopmentMode = () => {
//   const development = process.env.NODE_ENV === 'development';
//   return development;
// };
// export const isProductionMode = () => {
//   const production = process.env.NODE_ENV === 'production';
//   return production;
// };

// export const productionMode = () => {
//   if ( process.env.NODE_ENV === 'development' || !process.env.NODE_ENV === 'production' ) {
//     return true;
//   } else {
//     return false;
//   }
// };
export const totalRowSpan = ( value, array, key ) => {
  const updatedData = array.filter( s => s[key] === value );
  return updatedData.length;
};

export const rowSpanData = ( index, array, colKey ) => {
  const returnArray = {};
  const rowSpan = array.reduce( ( result, item, key ) => {
    if ( returnArray[item[colKey]] === undefined ) {
      returnArray[item[colKey]] = key;
      result[key] = 1;
    } else {
      const firstIndex = returnArray[item[colKey]];
      if (
        firstIndex === key - 1 ||
        ( item[colKey] === array[key - 1].colKey && result[key - 1] === 0 )
      ) {
        result[firstIndex]++;
        result[key] = 0;
      } else {
        result[key] = 1;
        returnArray[item[colKey]] = key;
      }
    }
    return result;
  }, [] );
  return rowSpan[index];
};
export const createOption = ( label, id ) => ( {
  label,
  value: id
} );

///FOr Formating JSON Data
export const showJsonHtml = ( tagId, data ) => {
  const element = document.querySelector( `#${tagId}` );
  if ( element ) {
    element.textContent = JSON.stringify( data, null, 2 );
  }
  //  const getJSON = document.getElementById( `${tagId}` ).textContent = JSON.stringify( data, null, 2 );
  return element;
};

export const reverseString = ( str ) => {
  return str.split( '' ).reverse().join( '' );
};

export const arrayMove = ( arr, old_index, new_index ) => {
  if ( new_index >= arr.length ) {
    let k = new_index - arr.length + 1;
    while ( k-- ) {
      arr.push( undefined );
    }
  }
  arr.splice( new_index, 0, arr.splice( old_index, 1 )[0] );
  return arr; // for testing
};

export const insertAfterItemOfArray = ( array, fromIndex, newItem ) => {
  array.splice( fromIndex + 1, 0, newItem );
  return array;
};

export const isHaveDuplicateObj = ( filterBy, array ) => {
  const duplicateIds = array
    .map( e => e[filterBy] )
    .map( ( e, i, final ) => final.indexOf( e ) !== i && i )
    .filter( obj => array[obj] )
    .map( e => array[e][filterBy] );
  const isTrue = !!duplicateIds.length;
  return isTrue;
};

export const isHaveDeferentObj = ( filterBy, array ) => {
  const modifiedArray = _.unionBy( array, filterBy );
  const lookup = modifiedArray.reduce( ( a, e ) => {
    a[e[filterBy]] = ++a[e[filterBy]] || 0;
    return a;
  }, {} );
  const isTrue = Object.keys( lookup ).length > 1;
  return isTrue;
};

export const duplicateItemsOfArray = ( filterBy, array ) => {
  const lookup = array.reduce( ( a, e ) => {
    a[e[filterBy]] = ++a[e[filterBy]] || 0;
    return a;
  }, {} );

  const duplicateObj = array.filter( e => lookup[e[filterBy]] );
  return duplicateObj;
};

export const isZeroToFixed = ( value, how ) => {
  if ( value === 0 ) {
    return value.toString();
  } else {
    return value.toFixed( how );
  }
};
export const isZeroToFixedNumber = ( value, how ) => {
  if ( value === 0 ) {
    return value.toString();
  } else {
    return Number( value.toFixed( how ) );
  }
};

export const removeAllFromString = ( value ) => {
  const removeSpaceAndHyphen = value.replace( /-|\s/g, "" ).toLowerCase();
  const removeSpecialCharacter = removeSpaceAndHyphen.replace( /[^a-zA-Z ]/g, "" );
  const removeNumber = removeSpecialCharacter.replace( /[0-9]/g, '' );
  return removeNumber;
};

///Button Level Permission
export const isPermit = ( selectedPermission, authPermission ) => {
  const isSelected = authPermission.some( permission => permission === selectedPermission );
  return isSelected;
};

//Navigation Level Permission
export const isPermitNav = ( selectedPermission, authPermission ) => {
  const isSelected = !authPermission.some( permission => permission === selectedPermission );
  return isSelected;
};

//Navigation Level Permission
export const isPermitRoute = ( selectedPermission, authPermission ) => {
  const isSelected = authPermission.some( permission => permission === selectedPermission );
  return isSelected;
};


export const validateEmail = ( email ) => {
  return String( email )
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const handleNavigationRoutePermit = ( routes, navPermission ) => {
  const permittedRoute = routes.map( pRoute => {
    // console.log( 'rtu', navPermission );
    if ( navPermission.some( permission => permission.code === pRoute.permission ) || ( pRoute.permission === 'antonymous' ) ) {
      pRoute['hidden'] = false;
    } else {
      pRoute['hidden'] = true;
    }
    return pRoute;
  } );
  return permittedRoute;
};
export const handleRoutePermit = ( routes, navPermission ) => {
  const permittedRoute = routes.filter( pRoute => navPermission.some( permission => permission.code === pRoute.permission ) || ( pRoute.permission === 'antonymous' ) );
  // console.log( permittedRoute );
  return permittedRoute;
};
export const handleNavigationPermit = ( routes, navPermission ) => {
  const permittedRoute = routes.map( pRoute => {
    // console.log( 'rtu', navPermission );
    if ( navPermission.some( permission => permission.code === pRoute.permission ) || ( pRoute.permission === 'antonymous' ) ) {
      pRoute['hidden'] = false;
    } else {
      pRoute['hidden'] = true;
    }
    return pRoute;
  } );
  return permittedRoute;
};

export const daysToMilliseconds = ( days ) => {
  // 👇️        hour  min  sec  ms
  return days * 24 * 60 * 60 * 1000;
};

export const convertToMilliseconds = ( x ) => {
  let milliseconds = x;
  let hr = 0;
  let min = 0;
  let sec = 0;
  let day = 0;
  while ( milliseconds >= 1000 ) {
    milliseconds = ( milliseconds - 1000 );
    sec = sec + 1;
    if ( sec >= 60 ) min = min + 1;
    if ( sec === 60 ) sec = 0;
    if ( min >= 60 ) hr = hr + 1;
    if ( min === 60 ) min = 0;
    if ( hr >= 24 ) {
      hr = ( hr - 24 );
      day = day + 1;
    }
  }

  const time = {
    millisecond: x,
    second: sec,
    minute: min,
    hour: hr,
    day
  };
  return time;
};


export const paginatedData = ( array, perPage, page ) => array.slice( ( page - 1 ) * perPage, page * perPage );
// ** React Select Theme Colors
export const selectThemeColors = theme => ( {
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#7367f01a', // for option hover bg-color
    primary: '#7367f0', // for selected option bg-color
    neutral10: '#7367f0', // for tags bg-color
    neutral20: '#ededed', // for input border-color
    neutral30: '#ededed' // for input hover border-color
  }
} );

//Production

// Is it Devepment Mode
export const isDevelopmentMode = () => {
  const development = process.env.NODE_ENV === 'development';
  return development;
};
export const isProductionMode = () => {
  const production = process.env.NODE_ENV === 'production';
  return production;
};

export const productionMode = () => {
  if ( process.env.NODE_ENV === 'development' || !process.env.NODE_ENV === 'production' ) {
    return true;
  } else {
    return false;
  }
};

/**
 * Cookie Set Function
 */
export const setCookie = ( name, value, expDays = 1 ) => {
  const date = new Date();
  date.setTime( date.getTime() + ( expDays * 24 * 60 * 60 * 1000 ) );
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};`;
};

/**
 * Get Cookie Function
 */
export const getCookie = cname => {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent( document.cookie );
  const ca = decodedCookie.split( ';' );
  for ( let i = 0; i < ca.length; i++ ) {
    let c = ca[i];
    while ( c.charAt( 0 ) === ' ' ) {
      c = c.substring( 1 );
    }
    if ( c.indexOf( name ) === 0 ) {
      return c.substring( name.length, c.length );
    }
  }
  return '';
};
/**
 * For Error Message
 */
export const errorResponse = ( response ) => {
  if ( response?.status === status?.severError ) {
    notify( 'error', 'Please contact the support team!!! ' );
  } else if ( response?.status === status.badRequest ) {
    notify( 'errors', response?.data?.errors );
  } else {
    notify( 'warning', `${response?.data?.errors?.join( ', ' )}` );
  }
};
