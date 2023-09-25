import Vue, { computed } from "vue";
import modelHoursFilter from "../models/hoursFilter.model";
import kanbanStore from "../store/kanban.store";
import workOrderList from "src/modules/qramp/_store/actions/workOrderList";

export default function filterModel() {
  return computed(() => ({
    time: {
      value: null,
      type: "select",
      props: {
        label: "Filter by time",
        format24h: true,
        options: modelHoursFilter,
        alphabeticalSort: false,
      },
    },
    carrierId: {
      value: null,
      type: "select",
      loadOptions: {
        apiRoute: "apiRoutes.qsetupagione.airlines",
        select: { label: "airlineName", id: "id" },
        requestParams: {},
      },
      props: {
        label: "Carrier",
        clearable: true,
      },
    },
    stationId: {
      value: null,
      type: "select",
      props: {
        label: "Station",
        options: workOrderList().getStationList().map(item => ({
          label: item.fullName,
          value: item.id
        })),
      },
    },
    statusId: {
      value: null,
      type: "select",
      loadOptions: {
        apiRoute: "apiRoutes.qramp.workOrderStatuses",
        select: { label: "statusName", id: "id" },
        requestParams: {
          filter: {
            companyId: kanbanStore.filterCompany,
          },
        },
      },
      props: {
        label: "Status",
        clearable: true,
      },
    },
    adHoc: {
      value: null,
      type: "select",
      props: {
        label: "Ad Hoc",
        clearable: true,
        options: [
          { label: Vue.prototype.$tr("isite.cms.label.yes"), value: true },
          { label: Vue.prototype.$tr("isite.cms.label.no"), value: false },
        ],
      },
    },
    flightStatusId: {
      value: null,
      type: "select",
      loadOptions: {
        apiRoute: "apiRoutes.qfly.flightStatuses",
        select: { label: "name", id: "id" },
        requestParams: {
          filter: {
            companyId: kanbanStore.filterCompany,
          },
        },
      },
      props: {
        label: "Flight Status",
        clearable: true,
      },
    },
    areaId: {
      value: null,
      type: "select",
      loadOptions: {
        apiRoute: "apiRoutes.qsetupagione.areas",
        select: { label: "name", id: "id" },
        requestParams: {
          filter: {
            companyId: kanbanStore.filterCompany,
          },
        },
      },
      props: {
        label: "Areas",
        clearable: true,
      },
    },
    type: {
      value: null,
    },
    dateStart: {
      value: null,
    },
    dateEnd: {
      value: null,
    },
  }));
}
