export default {
    awbTracking: {
        //permission: 'page.pages.manage',
        activated: true,
        authenticated: true,
        path: '/awb-tracking/index',
        name: 'qcargoagione.admin.cargoAdmin',
        crud : import('../_crud/cargo.vue'),
        page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
        layout: () => import('@imagina/qsite/_layouts/master.vue'),
        title: 'icargo.cms.sidebar.awbTracking',
        icon: 'fa-light fa-plane-departure', 
        subHeader: {
          refresh: true,
        }
    }
}
