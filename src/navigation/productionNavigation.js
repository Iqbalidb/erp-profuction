/**
 * Title: Navigation Menu
 * Description: Navigation Menu
 * Author: Nasir Ahmed
 * Date: 04-January-2022
 * Modified: 09-February-2022
 **/

import {
  Activity,
  Airplay,
  AlignCenter,
  AtSign,
  Box,
  Briefcase,
  Codesandbox,
  Command,
  Cpu,
  Crop,
  Film,
  Gift,
  GitCommit,
  GitPullRequest,
  Grid,
  Layers,
  Link2,
  Music,
  Navigation,
  Package,
  PenTool,
  Scissors,
  Share2,
  Slack,
  Sliders,
  Speaker,
  Target,
  Trello,
  TrendingUp,
  Truck,
  User,
  Users,
  Watch,
  Wind,
  Zap
} from 'react-feather';

export const productionNavigation = [
  {
    id: 'configuration',
    title: 'Configuration',
    icon: <GitCommit size={20} />,
    hidden: false,
    children: [
      {
        id: 'Operators',
        title: 'Operators',
        icon: <User size={20} />,
        hidden: false,
        children: [
          {
            id: 'Operator',
            title: 'Operator',
            icon: <User size={20} />,
            navLink: '/operator',
            hidden: false
          },
          {
            id: 'Operator Group',
            title: 'Operator Group',
            icon: <Users size={20} />,
            navLink: '/operator-group',
            hidden: false

          }
        ]
      },
      {
        id: 'product-part',
        title: 'Product Parts',
        icon: <Grid size={20} />,
        hidden: false,
        children: [
          {
            id: 'product-parts',
            title: 'Product Parts',
            icon: <Command size={20} />,
            navLink: '/product-parts',
            hidden: false
          },
          {
            id: 'part-groups',
            title: 'Fabric Type',
            icon: <Activity size={20} />,
            navLink: '/part-groups',
            hidden: false
          },
          {
            id: 'product-parts-group',
            title: 'Product Parts Group',
            icon: <Gift size={20} />,
            navLink: '/product-parts-group',
            hidden: false
          }
        ]
      },
      {
        id: 'production-process',
        title: 'Production Process',
        icon: <Slack size={20} />,
        hidden: false,
        children: [
          {
            id: 'production-main-process',
            title: 'Main Process',
            icon: <Share2 size={20} />,
            navLink: '/production-main-process',
            hidden: false
          },
          {
            id: 'production-sub-process',
            title: 'Sub Process',
            icon: <GitPullRequest size={20} />,
            navLink: '/production-sub-process',
            hidden: false
          },
          {
            id: 'production-process-group',
            title: 'Production Process Group',
            icon: <Briefcase size={20} />,
            navLink: '/production-process-group',
            hidden: false
          },
          {
            id: 'style-wise-production-process-group',
            title: 'Style Wise Production Process Group',
            icon: <AtSign size={20} />,
            navLink: '/style-wise-production-process-group',
            hidden: false
          }
        ]
      },

      {
        id: 'critical-process-sewing',
        title: 'Critical Process (Sewing)',
        icon: <Codesandbox size={20} />,
        navLink: '/critical-process',
        hidden: false
      },
      {
        id: 'type-management',
        title: 'Type Management',
        icon: <Wind size={20} />,
        hidden: false,
        children: [
          {
            id: 'reject-type',
            title: 'Reject Type',
            icon: <PenTool size={20} />,
            navLink: '/reject-type',
            hidden: false
          }
          // {
          //   id: 'incomplete-type',
          //   title: 'Incomplete Type',
          //   icon: <PenTool size={20} />,
          //   navLink: '/incomplete-type'
          // },
          // {
          //   id: 'sample-type',
          //   title: 'Sample Type',
          //   icon: <PenTool size={20} />,
          //   navLink: '/sample-type'
          // }
        ]
      },

      {
        id: 'floor',
        title: 'Floor',
        icon: <AlignCenter size={20} />,
        navLink: '/floor',
        hidden: false
      },
      {
        id: 'line',
        title: 'Line',
        icon: <Link2 size={20} />,
        navLink: '/line',
        hidden: false
      },
      {
        id: 'zone',
        title: 'Zone',
        icon: <Film size={20} />,
        hidden: false,
        children: [
          {
            id: 'zon',
            title: 'Main Zone',
            icon: <Music size={20} />,
            navLink: '/zone',
            hidden: false
          },
          {
            id: 'zone-group',
            title: 'Zone Group',
            icon: <GitPullRequest size={20} />,
            navLink: '/zone-group',
            hidden: false
          }
        ]
      },
      {
        id: 'timeSlots',
        title: 'Time Slots',
        icon: <Watch size={20} />,
        navLink: '/time-slots',
        hidden: false
      }
    ]
  },
  {
    id: 'operation',
    title: 'Operation',
    icon: <Zap size={20} />,
    hidden: false,
    children: [
      {
        id: 'requisition',
        title: 'Requisition',
        icon: <Cpu size={20} />,
        navLink: '/requisition-list',
        hidden: false
      },
      {
        id: 'relaxation',
        title: 'Relaxation',
        icon: <Crop size={20} />,
        navLink: '/relaxation-list',
        hidden: false
      },
      {
        id: 'cut-plan',
        title: 'Cut Plan',
        icon: <Scissors size={20} />,
        navLink: '/cut-plan',
        hidden: false
      },
      {
        id: 'parts-stock',
        title: 'Parts Stock',
        icon: <Layers size={20} />,
        navLink: '/parts-stock',
        hidden: false
      },

      {
        id: 'panel-check',
        title: 'Panel Check',
        icon: <Airplay size={20} />,
        navLink: '/panel-check',
        hidden: false
      },
      {
        id: 'bundle',
        title: 'Bundle',
        icon: <Box size={20} />,
        navLink: '/bundle',
        hidden: false
      },
      {
        id: 'external-process',
        title: 'External Process',
        icon: <TrendingUp size={20} />,
        navLink: '/external-process',
        hidden: false
      },
      {
        id: 'assign-input-table',
        title: 'Assign Input Table',
        icon: <Package size={20} />,
        navLink: '/assign-input-table',
        hidden: false
      },
      {
        id: 'assign-target',
        title: 'Assign Target',
        icon: <Target size={20} />,
        navLink: '/assign-target',
        hidden: false
      },
      {
        id: 'sewing-inspection',
        title: 'Sewing Inspection',
        icon: <Sliders size={20} />,
        navLink: '/sewing-inspection',
        hidden: false
      },
      {
        id: 'sewing-out',
        title: 'Sewing Out',
        icon: <Navigation size={20} />,
        navLink: '/sewing-out',
        hidden: false
      },
      {
        id: 'wash',
        title: 'Wash',
        icon: <Speaker size={20} />,
        navLink: '/wash',
        hidden: false
      },
      {
        id: 'finishing',
        title: 'Finishing',
        icon: <Trello size={20} />,
        navLink: '/finishing',
        hidden: false
      },
      {
        id: 'packaging',
        title: 'Packaging',
        icon: <Briefcase size={20} />,
        navLink: '/packaging',
        hidden: false
      },
      {
        id: 'shipment',
        title: 'Shipment',
        icon: <Truck size={20} />,
        navLink: '/shipment',
        hidden: false
      }
    ]
  }
];

/** Change Log
 * 05-Jan-2022(Iqbal): add menu in operation
 * 09-Feb-2022(Nasir): all menu icon change, prod. proc and prod. sub proc. re-arranged
 */
