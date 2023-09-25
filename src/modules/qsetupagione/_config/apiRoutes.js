const moduleName = 'setup';
const moduleVersion = 'v1';
const urlBase = `/${moduleName}/${moduleVersion}`

const flightModuleName = 'flight';
const flightUrlBase = `/${flightModuleName}/${moduleVersion}`

export default {
  urlBase: urlBase,
  version: moduleVersion,
  setupCompanies: `${urlBase}/companies`,
  setupBuildings: `${urlBase}/buildings`,
  setupStations: `${urlBase}/stations`,
  airports: `${flightUrlBase}/airports`,
  contractRules: `${urlBase}/contract-rules`,
  contractLines: `${urlBase}/contract-lines`,
  setupCustomers: `${urlBase}/customers`,
  customerStatuses: `${urlBase}/customer-statuses`,
  airlines: `${flightUrlBase}/airlines`,
  contracts: `${urlBase}/contracts`,
  contractType: `${urlBase}/contract-types`,
  setupCostCenters: `${urlBase}/cost-centers`,
  businessUnitTypes: `${urlBase}/business-unit-types`,
  gates: `${urlBase}/gates`,
  areas: `${urlBase}/areas`,
  passengerCarrierStations: `${urlBase}/passenger-carrier-stations`,
  businessUnits: `${urlBase}/business-units`,
  workdaySync: `/isite/v1/settings/setup::workdaySync`,
  workdaySyncPost: `/setup/v1/workday-sync`
}
