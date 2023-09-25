const moduleName = 'ramp';
const moduleVersion = 'v1';
const urlBase = `/${moduleName}/${moduleVersion}`

const setupModuleName = 'setup';
const setupUrlBase = `/${setupModuleName}/${moduleVersion}`

export default {
  urlBase: urlBase,
  version: moduleVersion,
  workOrders: `${urlBase}/work-orders`,
  workOrdersStatistics: `${urlBase}/work-orders/schedule/statistics`,
  workOrderChangeStatus: `${urlBase}/work-orders/change-status`,
  workOrderStatuses: `${urlBase}/work-order-statuses`,
  operationTypes: `${urlBase}/operation-types`,
  setupContracts: `${setupUrlBase}/contracts`,
  setupCustomers: `${setupUrlBase}/customers`,
  setupCompanies: `${setupUrlBase}/companies`,
  setupBuildings: `${setupUrlBase}/buildings`,
  setupStations: `${setupUrlBase}/stations`,
  workOrderDelays: `${urlBase}/work-order-delays`,
  products: `${urlBase}/products`,
  attributes: `${urlBase}/attributes`,
  workOrderTransactions: `${urlBase}/workday-transactions`,
  contractRules: `${urlBase}/contract-rules`,
  setupBusinessUnitTypes: `${setupUrlBase}/business-unit-types`,
  setupBusinessUnits: `${setupUrlBase}/business-units`,
  simpleWorkOrders: `${urlBase}/work-orders/simple-work-orders`,
  flightPosition: `${urlBase}/work-orders/flight-position`,
  scheduleStatuses: `${urlBase}/schedule-statuses`,
  schedule: `${urlBase}/work-orders/schedule`,
  workOrdersByStatus: `${urlBase}/dashboard/work-orders-by-status`,
  percentageWorkOrdersPosted: `${urlBase}/dashboard/percentage-work-orders-posted`,
  workOrdersByStatusLines: `${urlBase}/dashboard/work-orders-by-status-lines`,
  comments: `${urlBase}/comments`,
  categories: `${urlBase}/categories`,
  schedulers: `${urlBase}/schedulers`
}
