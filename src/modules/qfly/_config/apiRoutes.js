const moduleName = 'flight';
const setupModuleName = 'setup';
const moduleVersion = 'v1';
const urlBase = `/${moduleName}/${moduleVersion}`
const setupUrlBase = `/${setupModuleName}/${moduleVersion}`


export default {
  urlBase : urlBase,
  version: moduleVersion,
  aircraftTypes: `${urlBase}/aircraft-types`,
  airlines: `${urlBase}/airlines`,
  airports: `${urlBase}/airports`,
  flightSchedules: `${urlBase}/flight-schedules`,
  flightScheduleLegs: `${urlBase}/flight-schedule-legs`,
  flight: `${urlBase}/flights`,
  flightaware: `${urlBase}/flights/flightaware/search`,
  flightawareMap: `${urlBase}/flights/flightaware/map`,
  timezones: `${setupUrlBase}/timezones`,
  flightStatuses: `${urlBase}/flight-statuses`,
}
