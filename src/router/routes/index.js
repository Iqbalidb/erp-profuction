import { anonymousRoutes } from './anonymousRoutes';
import { productionRoutes } from './production';

const baseModule = localStorage.getItem( 'module' );

// ** Document title
const TemplateTitle = '%s - ERP';

// ** Default Route
// const DefaultRoute = `/home`;
const baseRoute = baseModule === "Merchandising" ? "/merchandising" : baseModule === "Inventory" ? "/inventory" : baseModule === "Users" ? "/auth" : "";
const Routes = [...anonymousRoutes, ...productionRoutes];

const DefaultRoute = `/home`;

// ** Merge Routes
// const Routes = [
//   ...authRoutes,
//   ...inventoryRoutes,
//   ...merchandisingRoutes,
//   ...productionRoutes
// ];

export { DefaultRoute, TemplateTitle, Routes, baseRoute };
