export default {
  workOrders: {
    permission: 'ramp.work-orders.manage',
    activated: true,
    authenticated: true,
    path: '/ramp/work-orders/index',
    name: 'qramp.admin.workOrders',
    crud: import('../_crud/workOrders'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'ifly.cms.sidebar.workOrders',
    icon: 'fa-light fa-briefcase',
    subHeader: {
      refresh: true,
    }
  },
  flightMap: {
    permission: 'ramp.map.manage',
    activated: true,
    authenticated: true,
    path: '/ramp/flight-map/index',
    name: 'qramp.admin.flightMap',
    page: () => import('../_components/flightMap/index.vue'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'ifly.cms.sidebar.map',
    icon: 'fa-light fa-map', 
    subHeader: {
      refresh: true,
    }
  },
  schedule: {
    permission: 'ramp.work-order-schedules.manage',
    activated: true,
    authenticated: true,
    path: '/ramp/schedule/index',
    name: 'qramp.admin.schedule',
    page: () => import('../_components/scheduleKanban'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'ifly.cms.sidebar.schedule',
    icon: 'fa-thin fa-calendar-days',
    subHeader: {
      refresh: true,
    }
  },
  publicSchedule: {
    //permission: 'ramp.work-orders.manage',
    activated: true,
    authenticated: false,
    path: '/ramp/schedule/public/index',
    name: 'qramp.admin.public.schedule',
    page: () => import('../_components/scheduleKanban/indexBlank.vue'),
    layout: () => import('@imagina/qsite/_layouts/blank.vue'),
    title: 'ifly.cms.sidebar.schedule',
    icon: 'fa-thin fa-calendar-days',
    subHeader: {
      refresh: true,
    }
  },
  /*scheduleStatus: {
    permission: 'ramp.schedule-statuses.manage',
    activated: true,
    authenticated: true,
    path: '/ramp/schedule-status/index',
    name: 'qramp.admin.scheduleStatus',
    crud: import('../_crud/scheduleStatus.vue'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'ifly.cms.sidebar.scheduleStatus',
    icon: 'fa-thin fa-calendar-days',
    subHeader: {
      refresh: true,
    }
  },*/
  workOrderStatuses: {
    permission: 'ramp.work-order-statuses.manage',
    activated: true,
    authenticated: true,
    path: '/ramp/schedule-status/index',
    name: 'qramp.admin.workOrderStatuses',
    crud: import('../_crud/workOrderStatuses.vue'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'ifly.cms.sidebar.workOrderStatuses',
    icon: 'fa-thin fa-calendar-days',
    subHeader: {
      refresh: true,
    }
  },
  oagStations: {
    //permission: 'isite.logs.manage',
    activated: false,
    path: '/oagStations/index',
    name: 'qsite.admin.oagStations.index',
    crud: import('../_crud/oagStations'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'isite.cms.sidebar.oagStations',
    icon: 'fa-light fa-building-flag',
    authenticated: true,
    subHeader: {
      refresh: true
    }
  },
  passenger: {
    permission: 'ramp.passenger-work-orders.manage',
    activated: true,
    authenticated: true,
    path: '/passenger/work-orders/index',
    name: 'qramp.admin.passenger',
    crud: import('../_crud/passengers'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'ifly.cms.sidebar.workOrders',
    icon: 'fa-light fa-briefcase',
    subHeader: {
      refresh: true,
    }
  },
  passengerFlightMap: {
    //permission: 'ramp.passenger-work-orders.manage',
    activated: false,
    authenticated: true,
    path: '/passenger/flight-map/index',
    name: 'qramp.admin.passengerFlightMap',
    page: () => import('../_components/flightMap/index.vue'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'ifly.cms.sidebar.map',
    icon: 'fa-light fa-map', 
    subHeader: {
      refresh: true,
    }
  },
  passengerSchedule: {
    permission: 'ramp.passenger-work-order-schedules.manage',
    activated: true,
    authenticated: true,
    path: '/passenger/schedule/index',
    name: 'qramp.admin.passengerSchedule',
    page: () => import('../_components/scheduleKanban'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'ifly.cms.sidebar.schedule',
    icon: 'fa-thin fa-calendar-days',
    subHeader: {
      refresh: true,
    }
  },
  passengerPublicSchedule: {
    //permission: 'ramp.work-orders.manage',
    activated: true,
    authenticated: false,
    path: '/passenger/schedule/public/index',
    name: 'qramp.admin.public.passengerSchedule',
    page: () => import('../_components/scheduleKanban/indexBlank.vue'),
    layout: () => import('@imagina/qsite/_layouts/blank.vue'),
    title: 'ifly.cms.sidebar.schedule',
    icon: 'fa-thin fa-calendar-days',
    subHeader: {
      refresh: true,
    }
  },
  kanbansSchedule: {
    //permission: 'ramp.work-orders.manage',
    activated: true,
    authenticated: false,
    path: '/kanban/schedule/index',
    name: 'qramp.admin.kanbansSchedule',
    page: () => import('../_components/scheduleKanban/index.vue'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'ifly.cms.sidebar.schedule',
    icon: 'fa-thin fa-calendar-days',
    subHeader: {
      refresh: true,
    }
  },
  scheduler: {
    permission: 'ramp.schedulers.manage',
    activated: true,
    authenticated: true,
    path: '/ramp/scheduler/index',
    name: 'qramp.admin.scheduler',
    crud: import('../_crud/scheduler.vue'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'ifly.cms.sidebar.scheduler',
    icon: 'fa-light fa-briefcase',
    subHeader: {
      refresh: true,
    }
  },
  /*passengerWorkOrderStatuses: {
    permission: 'ramp.work-order-statuses.manage',
    activated: true,
    authenticated: true,
    path: '/passenger/schedule-status/index',
    name: 'qramp.admin.workOrderStatuses',
    crud: import('../_crud/workOrderStatuses.vue'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'ifly.cms.sidebar.workOrderStatuses',
    icon: 'fa-thin fa-calendar-days',
    subHeader: {
      refresh: true,
    }
  },*/
}

