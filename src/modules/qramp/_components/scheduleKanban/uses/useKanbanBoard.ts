import Vue, {
  ref,
  computed,
  provide,
  getCurrentInstance,
  watch,
  onMounted,
} from "vue";
import storeKanban from "../store/kanban.store";
import storeFilter from "../store/filters.store";
import modelHoursFilter from "../models/hoursFilter.model";
import qRampStore from "./../../../_store/qRampStore.js";
import filtersStore from "../store/filters.store";
import _ from "lodash";
import buildKanbanStructure from "../actions/buildKanbanStructure";
import individualRefreshByColumns from "../actions/individualRefreshByColumns";
import checkUrlParams from "../actions/checkUrlParams";
import setUrlParams from "../actions/setUrlParams";
import getTitleFilter from "../actions/getTitleFilter";
import cache from "@imagina/qsite/_plugins/cache";
import workOrderList from "src/modules/qramp/_store/actions/workOrderList";
import eventsKanban from '../actions/eventsKanban'

export default function useKanbanBoard(props) {
  const proxy = (getCurrentInstance() as any).proxy as any;
  const refFormOrders = ref(null);
  provide("refFormOrders", refFormOrders);
  const isPassenger = computed(() => qRampStore().getIsPassenger());
  const isDraggingCard = computed(() => storeKanban.isDraggingCard);
  const fullscreen = ref(false);
  const filterTime = ref(null);
  const dynamicFieldTime = ref({
    value: null,
    type: "select",
    props: {
      label: "Filter by time",
      format24h: true,
      options: modelHoursFilter,
    },
  });

  const title = computed(() => isPassenger.value ? 'Passenger Schedule' : 'Ramp Schedule')
  const selectedDate = computed(() => storeFilter.selectedDate);

  const scheduleType = computed({
    get: () => storeKanban.scheduleType,
    set: (value) => (storeKanban.scheduleType = value),
  });

  const groupOptions = { name: "kanban-columns" };

  const columns: any = computed({
    get: () => storeKanban.columns,
    set: (value) => (storeKanban.columns = value),
  });

  const scheduleTypeOptions = ref([
    {
      id: 2,
      label: Vue.prototype.$tr("isite.cms.label.week"),
      value: "week-agenda",
      icon: "fas fa-calendar-week",
    },
    {
      id: 3,
      label: `${Vue.prototype.$tr("isite.cms.label.day")}`,
      value: "day-agenda",
      icon: "fas fa-calendar-day",
    },
  ]);
  const extraPageActions = computed(() => {
    let extraActions: any = [
      {
        label: "Copy Tiny URL",
        props: {
          icon: "fa-light fa-copy",
        },
        action: () => {
          const routeName = isPassenger.value ? "passenger" : "ramp";
          let hrefSplit = window.location.href.split("?");
          let tinyUrl =
            proxy.$store.state.qsiteApp.originURL +
            `/#/${routeName}/schedule/public/index`;
          if (hrefSplit[1]) tinyUrl = tinyUrl + "?" + hrefSplit[1];
          Vue.prototype.$helper.copyToClipboard(tinyUrl, "Tiny URL copied!");
        },
      },
      {
        label: Vue.prototype.$tr("isite.cms.configList.fullScreen", {
          capitalize: true,
        }),
        props: {
          icon: fullscreen.value ? "fullscreen_exit" : "fullscreen",
        },
        action: () => {
          fullscreen.value = !fullscreen.value;
          proxy.$q.fullscreen.toggle();
        },
      },
      {
        label: "Scheduler",
        vIf:
          !isPassenger.value &&
          Vue.prototype.$auth.hasAccess("ramp.schedulers.manage"),
        props: {
          label: "Scheduler",
          icon: "fa-duotone fa-calendar-plus",
        },
        action: () => {
          const routeName = isPassenger.value ? "passenger" : "ramp";
          let hrefSplit = window.location.href.split("?");
          let tinyUrl =
            proxy.$store.state.qsiteApp.originURL +
            `/#/${routeName}/schedule/index`;
          if (hrefSplit[1]) tinyUrl = tinyUrl + "?" + hrefSplit[1];
          localStorage.setItem("urlSchedule", tinyUrl);
          proxy.$router.push({ name: "qramp.admin.scheduler" });
        },
      },
      {
        label: Vue.prototype.$tr("isite.cms.label.filter"),
        vIf: true,
        props: {
          icon: "fa-duotone fa-filter",
          id: "filter-button-crud",
        },
        action: () => {
          filtersStore.showModal = true;
        },
      },
    ];

    return extraActions;
  });

  const init = async () => {
    eventsKanban(proxy).cardRefresh();
    await setStations();
    await checkUrlParams(proxy);
    storeKanban.scheduleType = storeFilter.scheduleType;
    storeKanban.isAppOffline = proxy.$store.state.qofflineMaster.isAppOffline
    getTitleFilter();
    await setUrlParams(proxy);
    await buildKanbanStructure();
  };
  async function setStations() {
    const params = { ...proxy.$route.query };
    const localStationId =
      (await cache.get.item("stationId")) !== "null"
        ? await cache.get.item("stationId")
        : null;
    storeFilter.stationId =
      getStationAssigned(proxy.$store.state.quserAuth.userData) ||
      params.stationId ||
      null ||
      localStationId ||
      null;
    storeFilter.form.stationId = storeFilter.stationId;
    const station = await workOrderList()
      .getStationList()
      .find(
        (item) =>
          item.id == Number(storeFilter.stationId) &&
          item.companyId === storeKanban.filterCompany
      );
    if (!station) {
      storeFilter.stationId = null;
      storeFilter.showModalStation = true;
      return;
    }
  }
  function getStationAssigned(userData) {
    try {
      let stationsAssigned = null;
      if (userData) {
        if (userData.options) {
          if (
            userData.options.stationsAssigned &&
            Array.isArray(userData.options.stationsAssigned) &&
            userData.options.stationsAssigned.length > 0
          ) {
            stationsAssigned = userData.options.stationsAssigned.shift();
          }
        }
      }
      return stationsAssigned;
    } catch (error) {
      console.log(error);
    }
  }
  onMounted(() => {
    init();
  });
  watch(
    () => proxy.$route,
    async (currentValue, oldValue) => {
      if(storeFilter.stationId == null) {
        storeFilter.showModalStation = true;
      }

      if (!storeKanban.loading) {
        init();
      }
    },
    { deep: true }
  );
  return {
    selectedDate,
    columns,
    groupOptions,
    scheduleTypeOptions,
    scheduleType,
    filterTime,
    dynamicFieldTime,
    extraPageActions,
    isDraggingCard,
    buildKanbanStructure,
    refFormOrders,
    individualRefreshByColumns,
    title
  };
}
