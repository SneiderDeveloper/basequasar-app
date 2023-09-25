export default {
  moduleName: 'setup',
  quickCards: [
    {
      active: true,
      permission: 'setup.workday-sync.send-workday-sync',
      component: () => import('../_components/quick-cards/workdaySync.vue')
    }
  ]
}
