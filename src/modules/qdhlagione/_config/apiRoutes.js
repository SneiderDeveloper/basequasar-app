const moduleName = 'dhl';
const moduleVersion = 'v1';
const urlBase = `/${moduleName}/${moduleVersion}`


export default {
  urlBase: urlBase,
  version: moduleVersion,
  scoreCards: `${urlBase}/score-cards`,
  staffs: `${urlBase}/staffs`,
  
}