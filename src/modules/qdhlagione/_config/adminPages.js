export default {
  scoreCards: {
    permission: 'idhl.score-cards.manage',
    activated: true,
    authenticated: true,
    path: '/dhl/score-cards',
    name: 'qdh-lagione.admin.scoreCards',
    crud: import('../_crud/scoreCards'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'idhl.cms.sidebar.scoreCards',
    icon: 'fal fa-building',
    subHeader: {
      refresh: true,
    }
  },
  staffs: {
    permission: 'idhl.staffs.manage',
    activated: true,
    authenticated: true,
    path: '/dhl/staffs',
    name: 'qdhl-agione.admin.staffs',
    crud: import('../_crud/staffs.vue'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'idhl.cms.sidebar.staffs',
    icon: 'fal fa-building',
    subHeader: {
      refresh: true,
    }
  }
}
