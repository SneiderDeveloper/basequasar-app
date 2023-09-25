const pages = config('pages') // Get Pages from config

export default [
  {
    title: 'idhl.cms.sidebar.dhlInfo',
    icon: 'fal fa-landmark',
    children: [
      pages.qdhlagione.scoreCards,
      pages.qdhlagione.staffs,
    ]
  },
]

