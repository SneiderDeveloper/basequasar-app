import Vue, { computed, ComputedRef } from 'vue';
import {COMPANY_PASSENGER, COMPANY_RAMP} from '../../model/constants.js'
import qRampStore from '../../../_store/qRampStore.js'
import workOrderList from '../../../_store/actions/workOrderList'
import store from '../store/modalSchedule.store'
import kanbanStore from '../store/kanban.store'

export default function modelFields() {
    const isPassenger = computed(() =>  qRampStore().getIsPassenger());
    const companyId = computed(() => isPassenger.value ? COMPANY_PASSENGER : COMPANY_RAMP);
    const isBlank = computed(() => kanbanStore.isBlank);
    const form = computed(() => store.form)
    const filterGates = computed(() => {
        return workOrderList()
          .getGatesList()
          .filter(item => {
            return item.stationId == Number(store.stationId)
          })
          .map(item =>
            ({
              value: item.id,
              label: item.name
            }));
    });
    const flightStatusesList = computed(() => workOrderList().getFlightStatusesList().map((item) =>({
        label: item.name,
        id: item.id,
        color: item.color,
        value: item.id,
    })))
    const flightStatus = computed(() => flightStatusesList.value.find(item => item.id == form.value.flightStatusId) || null);

    const operationTypeList =  computed(() => workOrderList().getOperationTypeList());
    const fields: ComputedRef<any> = computed(() => ({
        form: {
            inboundFlightNumber: {
              name:'inboundFlightNumber',
              value: '',
              type: 'input',
              props: {
                readonly: isBlank.value,
                rules: [
                  val => !!val || Vue.prototype.$tr('isite.cms.message.fieldRequired')
                ],
                label: `*${Vue.prototype.$tr('ifly.cms.form.flight')}`,
                clearable: true,
                color:"primary"
              },
            },
            stationId: {
              name:'stationId',
              value: store.stationId,
              type: 'select',
              props: {
                readonly: isBlank.value,
                rules: [
                  val => !!val || Vue.prototype.$tr('isite.cms.message.fieldRequired')
                ],
                label: `*${Vue.prototype.$tr('ifly.cms.form.station')}`,
                clearable: true,
                color:"primary"
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qsetupagione.setupStations',
                select: {label: 'stationName', id: 'id'},
                requestParams: {filter: {
                  "status": 1,
                  companyId: companyId.value,
                  "allTranslations": true
                }}
              },
            },
            gateId: {
              name:'gateId',
              value: null,
              type: 'select',
              props: {
                vIf: !isPassenger.value,
                readonly: isBlank.value,
                label: `${Vue.prototype.$tr('ifly.cms.form.gate')}`,
                clearable: true,
                color:"primary",
                options: filterGates.value
              },
              label: Vue.prototype.$tr('ifly.cms.form.gate'),
            },
            operationTypeId: {
              name:'operationTypeId',
              value: '',
              type: 'select',
              props: {
                rules: [
                  val => !!val || Vue.prototype.$tr('isite.cms.message.fieldRequired')
                ],
                label: `*${Vue.prototype.$tr('ifly.cms.form.operation')}`,
                clearable: true,
                color:"primary",
                'hide-bottom-space': false,
                options: operationTypeList.value
              },
              label: Vue.prototype.$tr('ifly.cms.form.operation'),
            },
            sta: {
              value: null,
              type: 'hour',
              props: {
                rules: [
                  val => !!val || Vue.prototype.$tr('isite.cms.message.fieldRequired')
                ],
                readonly: isBlank.value,
                label: 'STA',
                format24h: true,
              },
            },
            outboundScheduledDeparture: {
              value: null,
              type: 'fullDate',
              props: {
                rules: [
                  val => !!val || Vue.prototype.$tr('isite.cms.message.fieldRequired')
                ],
                mask:'MM/DD/YYYY HH:mm',
                hint:'Format: MM/DD/YYYY HH:mm',
                readonly: isBlank.value,
                label: 'STD',
                format24h: true,
              },
            },
            flightStatusId: {
              value: null,
              type: 'select',
              props: {
                readonly: isBlank.value,
                selectColor: true,
                colorType: 'tailwindcss',
                label: `Flight Status`,
                clearable: true,
                color:"primary",
                options: flightStatusesList.value,
              },
            },
            acTypeId: {
              value: null,
              type: 'select',
              props: {
                label: Vue.prototype.$tr('ifly.cms.sidebar.aircraftType'),
                options: workOrderList().getACTypesList().map(item => ({
                  label: item.model,
                  value: item.id
                })),
              },
            },
          },
    }));

    return {
        fields,
        flightStatusesList,
        flightStatus,
    }
}