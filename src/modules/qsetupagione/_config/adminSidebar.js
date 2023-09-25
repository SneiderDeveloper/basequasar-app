const pages = config('pages') // Get Pages from config
export default [
  {
    title: 'isetup.cms.sidebar.setupInfo',
    icon: 'fal fa-landmark',
    children: [
      pages.qsetupagione.companies,
      pages.qsetupagione.stations,
      pages.qsetupagione.buildings,
      pages.qsetupagione.contractRules,
      pages.qsetupagione.customers,
      pages.qsetupagione.costCenters,
      pages.qsetupagione.gates,
      pages.qsetupagione.areas,
      pages.qsetupagione.passengerCarrierStations,
      pages.qsetupagione.contracts
    ]
  },
]
