export default {
  companies: {
    permission: 'setup.companies.manage',
    activated: true,
    authenticated: true,
    path: '/setup/companies',
    name: 'qsetupagione.admin.companies',
    crud: import('../_crud/companies'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'isetup.cms.sidebar.companies',
    icon: 'fal fa-building',
    subHeader: {
      refresh: true,
    }
  },
  stations: {
    permission: 'setup.stations.manage',
    activated: true,
    authenticated: true,
    path: '/setup/stations',
    name: 'qsetupagione.admin.stations',
    crud: import('../_crud/stations'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'isetup.cms.sidebar.stations',
    icon: 'fal fa-building',
    subHeader: {
      refresh: true,
    }
  },
  buildings: {
    permission: 'setup.buildings.manage',
    activated: true,
    authenticated: true,
    path: '/setup/buildings',
    name: 'qsetupagione.admin.buildings',
    crud: import('../_crud/buildings'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'isetup.cms.sidebar.buildings',
    icon: 'fal fa-building',
    subHeader: {
      refresh: true,
    }
  },
  contractRules: {
    permission: 'setup.contract-rules.manage',
    activated: true,
    authenticated: true,
    path: '/setup/contract-rules',
    name: 'qsetupagione.admin.contract-rules',
    crud: import('../_crud/contractRules'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'setupagione.cms.sidebar.contractRules',
    icon: 'fal fa-tasks',
    subHeader: {
      refresh: true,
    }
  },
  customers: {
    permission: 'setup.customers.manage',
    activated: true,
    authenticated: true,
    path: '/setup/customers',
    name: 'qsetupagione.admin.customers',
    crud: import('../_crud/customers'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'isetup.cms.sidebar.customers',
    icon: 'fal fa-users',
    subHeader: {
      refresh: true,
    }
  },
  costCenters: {
    permission: 'setup.cost-centers.manage',
    activated: true,
    authenticated: true,
    path: '/setup/cost-centers',
    name: 'qsetupagione.admin.costCenters',
    crud: import('../_crud/costCenters'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'isetup.cms.sidebar.costCenters',
    icon: 'fal fa-building',
    subHeader: {
      refresh: true,
    }
  },
  gates: {
    permission: 'setup.gates.manage',
    activated: true,
    authenticated: true,
    path: '/setup/parking-spots',
    name: 'qsetupagione.admin.gates',
    crud: import('../_crud/gates'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'isetup.cms.sidebar.gates',
    icon: 'fal fa-warehouse',
    subHeader: {
      refresh: true,
    }
  },
  areas: {
    permission: 'setup.areas.manage',
    activated: true,
    authenticated: true,
    path: '/setup/areas',
    name: 'qsetupagione.admin.areas',
    crud: import('../_crud/areas'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'isetup.cms.sidebar.areas',
    icon: 'fa-light fa-chart-area',
    subHeader: {
      refresh: true,
    }
  },
  passengerCarrierStations: {
    permission: 'setup.passenger-carrier-stations.manage',
    activated: true,
    authenticated: true,
    path: '/setup/passengerCarrierStations',
    name: 'qsetupagione.admin.passengerCarrierStations',
    crud: import('../_crud/passengerCarrierStation'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'isetup.cms.sidebar.passengerCarrierStations',
    icon: 'fal fa-building',
    subHeader: {
      refresh: true,
    }
  },
  contracts: {
    permission: 'setup.contracts.manage',
    activated: true,
    authenticated: true,
    path: '/setup/contracts',
    name: 'qsetupagione.admin.contracts',
    crud: import('../_crud/contracts.vue'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'isetup.cms.sidebar.contracts',
    icon: 'fal fa-building',
    subHeader: {
      refresh: true,
    }
  },
}
