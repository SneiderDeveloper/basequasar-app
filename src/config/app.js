import coreApp from '@imagina/qsite/_config/master/application/app'

export default {
  ...coreApp,
  //version: '2.3.29', //Version
  //git submodule foreach --recursive git merge dev
  //baseUrl: 'https://localhost:7116',//Define base url
  //baseUrl: 'https://app-agione-stag-use2-01.azurewebsites.net',//Define base url
  baseUrl: 'https://agionedev.azurewebsites.net',//Define base url
  //baseUrl: 'https://app-agione-prod-use2-01.azurewebsites.net',//Define base url
  modules: [
    'qcrud',
    'qblog',
    'qmedia',
    'qgamification',
    'qchat',
    'quser',
    'qnotification',
    'qform',
    'qpage',
    'qmenu',
    'qtranslation',
    'qsite',
    'qfly',
    'qramp',
    'qsetupagione',
    'qcargoagione',
    'qdhlagione',
    'qoffline',
    'qreports'
  ],
  useLocalTranslations: true,
  disableTours: true,
  //mode: 'ipanel', //Define load mode
  //forceRoleAndDepartment : false,//Force to select role and department
  //UI Languages
  /*languages : {
    default : 'es',
    availables : ['en-us','es']
  },*/
  //Modules
  //modules : [],
  //Cache
  /*saveCache : {
    refresh : [
      'sessionData',
      'auth.department.id',
      'auth.role.id',
      'site.default.locale',
      'impersonatorData',
      'app.state.extra',
      'app.state.filters'
    ],
    logout : [
      'offlineRequests',
      'site.default.locale',
    ]
  },*/
  //Reset Store
  /*resetStores : [
    'quserAuth/RESET'
  ]*/
}
