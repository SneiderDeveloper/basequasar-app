import Vue, { computed } from 'vue';
import storeKanban from '../store/kanban.store';
import workOrderList from 'src/modules/qramp/_store/actions/workOrderList';

export default function modalStation() {
      const fields = computed(() => ({
        banner: {
            type: 'banner',
            props: {
              color: 'info',
              icon: 'fas fa-exclamation-triangle',
              message: 'You must first select a Station',
            }
        },
        stationId: {
            value: null,
            type: "select",
            props: {
              label: "Station",
              rules: [
                (val) => !!val || Vue.prototype.$tr("isite.cms.message.fieldRequired"),
              ],
              clearable: true,
              options: workOrderList().getStationList().map(item => ({
                label: item.fullName,
                value: item.id
              })),
            },
        },
    }))

    return {
      fields,
    }
}