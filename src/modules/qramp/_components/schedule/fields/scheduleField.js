import qRampStore from '../../../_store/qRampStore.js';
import workOrderList from '../../../_store/actions/workOrderList';
import {
  COMPANY_PASSENGER,
  COMPANY_RAMP
} from '../../model/constants.js';

export default {
    data() {
      return {
        flightStatusList: [],
        sessionStationId: null,
      }
    },
    computed: {
      companyId(){
        return this.isPassenger ? COMPANY_PASSENGER : COMPANY_RAMP;
      },
      isPassenger() {
        return qRampStore().getIsPassenger();
      },
      station() {
        return this.sessionStationId;
      },
      isBlank() {
        return qRampStore().getIsblank();
      },
      operationTypeList() {
        return workOrderList().getOperationTypeList()
      },
      filterGates() {
        return workOrderList()
          .getGatesList()
          .filter(item => item.stationId == this.form?.stationId || this.sessionStationId)
          .map(item =>
            ({
              value: item.id,
              label: item.name
            }));
      },
      fields() {
        return {
          form: {
            preFlightNumber: {
              name:'preFlightNumber',
              value: '',
              type: 'input',
              props: {
                readonly: this.isBlank,
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ],
                label: `*${this.$tr('ifly.cms.form.flight')}`,
                clearable: true,
                color:"primary"
              },
            },
            stationId: {
              name:'stationId',
              value: this.station,
              type: 'select',
              props: {
                readonly: this.isBlank,
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ],
                selectByDefault : true,
                label: `*${this.$tr('ifly.cms.form.station')}`,
                clearable: true,
                color:"primary"
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qsetupagione.setupStations',
                select: {label: 'stationName', id: 'id'},
                requestParams: {filter: {
                  "status": 1,
                  companyId: this.companyId,
                  "allTranslations": true
                }}
              },
            },
            gateId: {
              name:'gateId',
              value: null,
              type: 'select',
              props: {
                vIf: !this.isPassenger,
                readonly: this.isBlank,
                label: `${this.$tr('ifly.cms.form.gate')}`,
                clearable: true,
                color:"primary",
                options: this.filterGates
              },
              label: this.$tr('ifly.cms.form.gate'),
            },
            operationTypeId: {
              name:'operationTypeId',
              value: '',
              type: 'select',
              props: {
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ],
                label: `*${this.$tr('ifly.cms.form.operation')}`,
                clearable: true,
                color:"primary",
                'hide-bottom-space': false,
                options: this.operationTypeList
              },
              label: this.$tr('ifly.cms.form.operation'),
            },
            sta: {
              value: null,
              type: 'hour',
              props: {
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ],
                readonly: this.isBlank,
                label: 'STA',
                format24h: true,
              },
            },
            outboundScheduledDeparture: {
              value: null,
              type: 'fullDate',
              props: {
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ],
                mask:'MM/DD/YYYY HH:mm',
                hint:'Format: MM/DD/YYYY HH:mm',
                readonly: this.isBlank,
                label: 'STD',
                format24h: true,
              },
            },
            flightStatusId: {
              value: null,
              type: 'select',
              props: {
                readonly: this.isBlank,
                selectColor: true,
                colorType: 'tailwindcss',
                label: `Flight Status`,
                clearable: true,
                color:"primary",
                options: this.flightStatusList,
              },
            },
            acTypeId: {
              value: null,
              type: 'select',
              props: {
                label: this.$tr('ifly.cms.sidebar.aircraftType'),
                options: workOrderList().getACTypesList().map(item => ({
                  label: item.model,
                  value: item.id
                })),
              },
            },
            /*carrierId: {
              value: null,
              type: 'select',
              props: {
                vIf: false,
                label: 'Carrier',
                options: workOrderList().getAirlinesList().map(item => ({
                  label: item.airlineName,
                  value: item.id
                })),
              },
            },*/
          },
        };
      },
    },
    methods:{
      validateSpecialCharacters(val) {
        if(/[^a-zA-Z0-9-]/.test(val)) {
          return this.$tr('isite.cms.message.specialCharactersAreNotAllowed');
        }
        return !!val || this.$tr('isite.cms.message.fieldRequired');
      },
      async getFlightStatusList() {
        const params = {
            params: {
                filter: {
                    companyId: this.companyId,
                }
            },
        }
        const response = await this.$crud.index('apiRoutes.qfly.flightStatuses', params);
        this.flightStatusList = response.data.map((item) =>({
          label: item.name,
          id: item.id,
          color: item.color,
          value: item.id,
        }));
      },
    }
  };