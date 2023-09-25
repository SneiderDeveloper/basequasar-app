<template>
  <div 
    class="schedule-ctn" 
    :class="{ 'fullscreen tw-bg-white tw-p-3 tw-overflow-x-scroll': fullscreen }"
  >
    <div class="box box-auto-height q-mb-md">
      <page-actions 
        ref="pageActions" 
        :title="$t('ifly.cms.sidebar.schedule')" 
        multipleRefresh
        :extra-actions="extraPageActions" 
        :excludeActions="fullscreen ? ['filter'] : []"
        @refresh="refreshWorkOrder" 
        class="q-mb-md" 
      />
    </div>
    <q-btn-toggle 
      v-model="scheduleTypeComputed" 
      rounded 
      no-caps 
      unelevated 
      toggle-color="blue-grey" color="grey-2"
      text-color="blue-grey" :options="scheduleTypeOptions" id="btnCalendarType" size="14px" padding="md sm" spread />
    <div 
      class="
       tw-btn-nav 
       tw-flex 
       tw-my-2 
       tw-justify-center 
       tw-items-center"
      >
      <q-btn 
        dense 
        rounded 
        unelevated 
        color="grey-1" 
        text-color="blue-grey" 
        label="Prev" 
        @click="schedulePrev" 
        icon="fa-regular fa-chevron-left" 
        class="tw-w-1/2 tw-mr-1" 
       />
      <q-btn 
        dense 
        rounded 
        unelevated 
        color="grey-1" 
        text-color="blue-grey" 
        label="Next" 
        @click="scheduleNext" 
        icon-right="fa-regular fa-chevron-right" 
        class="tw-w-1/2 tw-ml-1" 
      />
    </div>
    <q-calendar
      v-show="scheduleTypeComputed"
      bordered 
      ref="schedule" 
      v-model="selectedDate" 
      :view="scheduleType" 
      locale="en-us"
      hour24Format 
      @click:day2="eventSchedule" 
      @click:date2="event => eventSchedule(event, true)"
      @click:day:header2="eventSchedule" :class="scheduleType"
    >
      <template #day-body="{ timestamp, timeStartPos, timeDurationHeight }">
        <template>
          <div class="tw-container">
            <div class="tw-inline-block tw-w-4/5">
              <dynamic-field
                v-model="multiFilterDate[timestamp.date]" 
                :field="fields.time"
                @input="getWorkOrderDateTime($event, timestamp.date, false)"
                class="tw-px-2"
              />
            </div>
            <div class="tw-inline-block tw-w-1/5">
              <q-btn
                flat
                round
                icon="fa-duotone fa-rotate-right"
                size="10px"
                @click="getWorkOrderDateTime(multiFilterDate[timestamp.date], timestamp.date)"
                class="tw--mt-3"
            >
              <q-tooltip> 
                  {{ $trp('isite.cms.label.refresh') }} 
              </q-tooltip>
            </q-btn>
            </div>
          </div>
          <template v-for="[hours, eventArr] in Object.entries(getEvents(timestamp.date).data).sort()">
            <div 
              class="
               tw-mb-0"
            >
            <div 
              class="
                tw-border-b-2
                tw-border-gray-300 
                tw-py-3-2 
                tw-mb-6"
            >
              <div 
                  class="
                    tw-inline-flex 
                    tw-items-center 
                    tw-justify-center 
                    tw-p-1
                    tw-mr-2 
                    tw-text-xs 
                    tw-font-bold 
                    tw-leading-none 
                    tw-absolute
                    tw-bg-white">
                  <i class="
                    fa-sharp 
                    fa-light 
                    fa-clock
                    tw-px-1" />
                  {{ hours }} h
                </div>
              </div>
              <div v-for="(event, index) in eventArr">
                <div :key="index" v-if="event.time && !event.isUpdate" class="
                    tw-text-base
                    tw-mb-3
                    tw-p-1
                    tw-mx-2
                    tw-rounded-md
                    tw-border-2
                    tw-border-grey-100
                    sm:tw-flex
                    tw-whitespace-normal
                    tw-break-all
                    tw-cursor-pointer
                  "
                  :class="classSchedule(event)"
                  :style="
                    badgeStyles(event, 'body', timeStartPos, timeDurationHeight)
                  "
                  @click.stop.prevent="editSchedule(event)"
                >
                  <div 
                    class="tw-font-semibold"
                    :class="{'tw-mb-2 sm:tw-mb-0 sm:tw-w-1/2': event.id && scheduleType === 'day-agenda'}"
                  >
                    <badgeComment
                      v-if="!isAppOffline"
                      :event="event"
                      mainClass="tw-mr-2" 
                    />
                    <i
                      class="
                      fa-solid 
                      fa-circle-check" :class="colorCheckSchedule(event)">
                      <q-tooltip>
                        {{ titleStatus(event.statusId) }}
                      </q-tooltip>
                    </i>
                    {{ event.calendarTitle }}
                  </div>
                  <div class="tw-text-right sm:tw-w-1/2 tw-space-x-2" v-if="event.id && scheduleType === 'day-agenda'">
                    <button v-if="!isBlank && !events.some(item => item.isUpdate) && !isPassenger" class="
                        tw-rounded-lg
                        tw-text-gray-400 
                        tw-px-2 tw-py-1 lg:tw-py-0  
                        tw-border 
                        tw-border-gray-200 
                        hover:tw-text-white 
                        hover:tw-bg-green-500 
                        hover:tw-opacity-75" 
                        @click.stop.prevent="startWorkOrders(STATUS_DRAFT, event)"
                      >
                      <i class="fa-sharp fa-regular fa-bring-forward" />
                      <q-tooltip>
                        Start Work Order
                      </q-tooltip>
                    </button>
                    <button v-if="!isBlank && !events.some(item => item.isUpdate)" class="
                        tw-rounded-lg
                        tw-text-gray-400 
                        tw-px-2 tw-py-1 lg:tw-py-0  
                        tw-border tw-border-gray-200 
                        hover:tw-text-white 
                        hover:tw-bg-blue-500 
                        hover:tw-opacity-75" 
                        @click.stop.prevent="duplicateSchedule(event)"
                    >
                      <i class="fa-thin fa-clone" />
                      <q-tooltip>
                        Duplicate
                      </q-tooltip>
                    </button>
                    <button v-if="!events.some(item => item.isUpdate)" @click.stop.prevent="editSchedule(event, 'day')"
                      class="
                        tw-rounded-lg
                        tw-text-gray-400 
                        tw-px-2 tw-py-1 lg:tw-py-0
                        tw-border tw-border-gray-200 hover:tw-text-white hover:tw-bg-blue-500 hover:tw-opacity-75">
                      <i class="fa-light" :class="{
                        'fa-eye': isBlank,
                        'fa-pen-to-square': !isBlank
                      }" />
                      <q-tooltip>
                        <div v-if="!isBlank">
                          {{ $tr('isite.cms.label.edit') }}
                        </div>
                        <div v-else>
                          {{ $tr('isite.cms.label.show') }}
                        </div>
                      </q-tooltip>
                    </button>
                    <button v-if="!isBlank && !events.some(item => item.isUpdate)" class="
                        tw-rounded-lg
                        tw-text-gray-400 
                        tw-px-2 tw-py-1 lg:tw-py-0  
                        tw-border tw-border-gray-200 hover:tw-text-white 
                        hover:tw-bg-red-500 
                        hover:tw-opacity-75" 
                        @click.stop.prevent="deleteSchedule(event.id)"
                      >
                      <i class="fa-light fa-trash-can" />
                      <q-tooltip>
                        {{ $tr('isite.cms.label.delete') }}
                      </q-tooltip>
                    </button>
                  </div>
                </div>
                <lineForm :key="index" v-if="event.isUpdate" :event="event" @dismissEvent="dismissEvent"
                  @addSchedule="addSchedule" @updateSchedule="updateSchedule" @setEventComments="setEventComments" />
              </div>
            </div>
          </template>
        </template>
      </template>
      <template #day-header="{ timestamp }">
        <div 
          class="tw-mx-3 tw-py-2 tw-block" 
          v-if="['day-agenda', 'week-agenda'].includes(scheduleType)"
        >
          <button class="
              tw-w-full
              tw-bg-gray-100
              hover:tw-bg-gray-200
              tw-rounded-lg 
              tw-p-1" 
              @click="addNewDayToSchedule(timestamp)" 
              :disabled="events.some(item => item.isUpdate)">
            <i class="fa-light fa-plus"></i> 
            <span v-if="scheduleType === 'day-agenda' && !isBlank"> {{ $tr('isite.cms.label.new')
            }}</span>
            <q-tooltip v-if="scheduleType === 'week-agenda'">
              {{ $tr('isite.cms.label.new') }}
            </q-tooltip>
          </button>
          <div v-if="!events.some(item => item.isUpdate)">
            <div class="tw-w-full tw-grid tw-items-center" :class="{
              'tw-grid-cols-1': scheduleType === 'week-agenda',
              'tw-grid-cols-2': scheduleType === 'day-agenda',
            }">
              <div>
                <completedSchedule 
                  :getEvents="getEvents" 
                  :scheduleType="scheduleType" 
                  :timestamp="timestamp"
                  v-if="Object.entries(getEvents(timestamp.date, false).data).length > 0" 
                />
              </div>
              <!--<div v-if="scheduleType === 'day-agenda'">
                <dynamic-field v-model="filterTime" :field="fields.time" />
              </div>-->
            </div>
          </div>
          <div>
          </div>
        </div>
      </template>
    </q-calendar>
    <div v-if="loading" class="
        tw-flex
        tw-justify-center
        tw-absolute
        tw-inset-0
        tw-pt-64
        tw-bg-white
        tw-bg-opacity-75
        tw-z-20
      ">
      <div>
        <i class="
            fa-duotone 
            fa-loader 
            fa-spin 
            fa-pulse
            tw-text-7xl 
            tw-text-blue-800
          " />
      </div>
    </div>
    <modalForm ref="modalForm" @addSchedule="addSchedule" @updateSchedule="updateSchedule"
      @deleteSchedule="deleteSchedule" @setEventComments="setEventComments" />
    <form-orders ref="formOrders" @getWorkOrderFilter="getWoCache" />
    <stationModal ref="stationModal" @saveFilterStationId="saveFilterStationId" />
    <scheduler />
  </div>
</template>
<script>
import calendar, { QCalendar } from "@quasar/quasar-ui-qcalendar";
import modalForm from "./modals/modalForm.vue";
import formOrders from "../formOrders.vue";
import stationModal from "./modals/stationModal.vue";
import _ from "lodash";
import qRampStore from '../../_store/qRampStore.js';
import {
  STATUS_SCHEDULE,
  STATUS_CLOSED,
  STATUS_DRAFT,
  STATUS_POSTED,
  STATUS_SUBMITTED,
  BUSINESS_UNIT_PASSENGER,
  BUSINESS_UNIT_RAMP,
  COMPANY_PASSENGER,
  COMPANY_RAMP,
  modelWorkOrder
} from "../model/constants";
import lineForm from './lineForm.vue';
import '@quasar/quasar-ui-qcalendar/dist/index.css';
import badgeComment from './badgeComment.vue';
import cache from '@imagina/qsite/_plugins/cache';
import workOrderList from '../../_store/actions/workOrderList.ts';
import completedSchedule from './completedSchedule.vue'
import modelHoursFilter from './models/modelHoursFilter.js'
import cacheOffline from '@imagina/qsite/_plugins/cacheOffline';
import scheduler from '../scheduler/index.vue';
import storeScheduler from '../scheduler/store/index.store.ts';
export default {
  props: {
    isBlank: {
      type: Boolean,
      default: () => false,
    }
  },
  components: {
    QCalendar,
    modalForm,
    formOrders,
    stationModal,
    lineForm,
    badgeComment,
    completedSchedule,
    scheduler
  },
  data() {
    return {
      fullscreen: false,
      loading: false,
      eventLoading: false,
      selectedDate: this.$moment().format("YYYY-MM-DD"),
      selectedDateEnd: this.$moment().endOf("day").format("YYYY-MM-DD"),
      selectedDateStart: this.$moment().startOf("day").format("YYYY-MM-DD"),
      scheduleType: null,
      events: [],
      stationId: null,
      filterData: null,
      cloneEvent: {},
      STATUS_SCHEDULE,
      STATUS_DRAFT,
      filterTime: null,
      multiFilterDate: {},
      fields: {
        time: {
          value: null,
          type: 'select',
          props: {
            label: 'Filter by time',
            format24h: true,
            options: modelHoursFilter,
            alphabeticalSort: false,
          }
        },
      },
      componentLoaded: false,
    };
  },
  watch: {
    $route: {
      deep: true,
      handler: async function () {
        this.$router.go();
      },
    },
  },
  created() {
    this.$nextTick(async function () {
      const currentRouteName = this.$router.currentRoute.path.indexOf('passenger');
      this.getFilterTimeCurrent();
      await workOrderList().setStationList([]);
      await qRampStore().setIsPassenger(currentRouteName !== -1);
      await workOrderList().getAllList();
      await workOrderList().getCustomerWithContract();
      
    });
  },
  mounted() {
    this.$nextTick(async function () {
      await this.init();
      await this.getWorkOrderFilter(false, this.selectedDateStart, this.selectedDateEnd);
    });
  },
  beforeDestroy() {
    this.$nextTick(async function () {
      this.filter.reset();
    });
  },
  computed: {
    isAppOffline() {
      return this.$store.state.qofflineMaster.isAppOffline;
    },
    colorCheckSchedule() {
      return item => {
        const statusColor = workOrderList().getWorkOrderStatusesList().find(status => status.id === Number(item.statusId))?.color;
        const color = statusColor ? `tw-text-${statusColor}` : 'tw-text-black';
        return color;
      }
    },
    titleStatus() {
      const statuses = {
        [STATUS_DRAFT]: 'Draft',
        [STATUS_CLOSED]: 'Closed',
        [STATUS_POSTED]: 'Posted',
        [STATUS_SUBMITTED]: 'Submitted',
        [STATUS_SCHEDULE]: 'Scheduled',
      };
      return statusId => statuses[statusId] || '';
    },
    permisionComments() {
      return this.$auth.hasAccess(`ramp.work-orders-comments.index`)
    },
    classSchedule() {
      return event => {
        const carrierColor = workOrderList().getAirlinesList().find(item => item.id === Number(event.carrierId))?.color;
        const flightStatusesColor = workOrderList().getFlightStatusesList().find(item => item.id === Number(event.flightStatusId))?.color;
        const color = carrierColor ? carrierColor : 'black';
        const statusColor = flightStatusesColor ? flightStatusesColor : 'grey-100';
        return {
          [`tw-text-${color} tw-font-semibold`]: carrierColor,
          'tw-cursor-pointer': this.scheduleType !== 'day-agenda',
          'tw-text-black': !carrierColor,
          [`tw-border-${statusColor}`]: statusColor
        }
      }
    },
    scheduleTypeOptions() {
      return [
        {
          id: 2,
          label: this.$tr("isite.cms.label.week"),
          value: "week-agenda",
          icon: "fas fa-calendar-week",
        },
        {
          id: 3,
          label: `${this.$tr("isite.cms.label.day")}  (${this.$moment(this.selectedDate).format('MMMM')})`,
          value: "day-agenda",
          icon: "fas fa-calendar-day",
        },
      ];
    },
    filter() {
      this.filterData = this.$clone(this.$filter.values);
      return this.$filter;
    },
    userData() {
      return this.$store.state.quserAuth.userData;
    },
    scheduleTypeComputed: {
      get() {
        return this.scheduleType;
      },
      async set(value) {
        this.scheduleType = value;
        await this.$refs.schedule;
        if(value && this.stationId) {
          await this.getListOfSelectedWorkOrders(value);
        }
      },
    },
    extraPageActions() {
      let extraActions = [
        {
          label: "Copy Tiny URL",
          props: {
            icon: "fa-light fa-copy",
          },
          action: () => {
            const routeName = this.isPassenger ? 'passenger' : 'ramp';
            let hrefSplit = window.location.href.split("?");
            let tinyUrl =
              this.$store.state.qsiteApp.originURL +
              `/#/${routeName}/schedule/public/index`;
            if (hrefSplit[1]) tinyUrl = tinyUrl + "?" + hrefSplit[1];
            this.$helper.copyToClipboard(tinyUrl, "Tiny URL copied!");
          },
        },
        {
          label: this.$t("isite.cms.configList.fullScreen", {
            capitalize: true,
          }),
          props: {
            icon: this.fullscreen ? "fullscreen_exit" : "fullscreen",
          },
          action: () => {
            this.fullscreen = !this.fullscreen;
            this.$q.fullscreen.toggle();
          },
        },
      ];

      if(!this.isPassenger && this.$auth.hasAccess('ramp.schedulers.manage')){
        extraActions.push({
          label: "Scheduler",
          props: {
            label: "Scheduler",
            icon: "fa-duotone fa-calendar-plus",
          },
          action: () => {
            const routeName = this.isPassenger ? 'passenger' : 'ramp';
            let hrefSplit = window.location.href.split("?");
            let tinyUrl =
              this.$store.state.qsiteApp.originURL +
              `/#/${routeName}/schedule/index`;
            if (hrefSplit[1]) tinyUrl = tinyUrl + "?" + hrefSplit[1];
            localStorage.setItem('urlSchedule', tinyUrl);
            this.$router.push({name: 'qramp.admin.scheduler'})
          },
        })
      }
      return extraActions;
    },
    filterActions() {
      return {
        name: this.$route.name,
        fields: {
          carrierId: {
            value: null,
            type: "select",
            loadOptions: {
              apiRoute: "apiRoutes.qsetupagione.airlines",
              select: { label: "airlineName", id: "id" },
              requestParams: {
              },
            },
            props: {
              label: "Carrier",
              clearable: true,
            },
          },
          stationId: {
            value: this.stationId,
            type: "select",
            loadOptions: {
              apiRoute: "apiRoutes.qsetupagione.setupStations",
              select: { label: "fullName", id: "id" },
              requestParams: {
                filter: {
                  companyId: this.filterCompany,
                },
              },
            },
            props: {
              label: "Station",
            },
          },
          statusId: {
            value: null,
            type: 'select',
            loadOptions: {
              apiRoute: 'apiRoutes.qramp.workOrderStatuses',
              select: { 'label': 'statusName', 'id': 'id' },
              requestParams: {
                filter: {
                  companyId: this.filterCompany,
                },
              },
            },
            props: {
              label: 'Status',
              'clearable': true
            },
          },
          adHoc: {
            value: null,
            type: "select",
            props: {
              label: "Ad Hoc",
              clearable: true,
              options: [
                { label: this.$tr("isite.cms.label.yes"), value: true },
                { label: this.$tr("isite.cms.label.no"), value: false },
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
                  companyId: this.filterCompany,
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
            type: 'select',
            loadOptions: {
              apiRoute: 'apiRoutes.qsetupagione.areas',
              select: { label: 'name', id: 'id' },
              requestParams: {
                filter: {
                  companyId: this.filterCompany,
                },
              },
            },
            props: {
              label: 'Areas',
              'clearable': true
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
        },
        callBack: this.getFilter,
        storeFilter: true,
      };
    },
    isPassenger() {
      return qRampStore().getIsPassenger();
    },
    filterBusinessUnit() {
      return this.isPassenger ? BUSINESS_UNIT_PASSENGER : BUSINESS_UNIT_RAMP;
    },
    filterCompany() {
      return this.isPassenger ? COMPANY_PASSENGER : COMPANY_RAMP;
    },
  },
  methods: {
    async init() {
      try {
        qRampStore().setIsblank(this.isBlank)
        await this.initUrlMutate();
        setTimeout(async () => {
          await this.setFilter();
          this.componentLoaded = true;
        }, 100);
      } catch (error) {
        console.log(error);
      }
    },
    getFilterTimeCurrent() {
      const currentHour = this.$moment().hour();
      this.filterTime = modelHoursFilter.filter(item => item.value !== '0-23').find(range => {
        const [start, end] = range.value.split('-').map(Number);
          return currentHour >= start && currentHour <= end;
      }).value || null;
    },
    async initUrlMutate() {
      const obj = await this.$helper.convertStringToObject();
      const localStationId = await cache.get.item("stationId") !== 'null' ? await cache.get.item("stationId") : null;
      this.stationId = this.getStationAssigned() || (obj.stationId || null) || (localStationId || null);
      const station = await workOrderList().getStationList()
        .find(item => item.id == this.stationId && item.companyId === this.filterCompany);
      if (!this.stationId || !station) {
        await this.$refs.stationModal.showModal();
        return;
      }
      if (obj.dateStart) {
        this.selectedDate = this.$moment(obj.dateStart, 'YYYYMMDD').format('YYYY-MM-DD');
        
      }
      if (obj.dateEnd) {
        this.selectedDateEnd = this.$moment(obj.dateEnd, 'YYYYMMDD').format('YYYY-MM-DD');
      }
      if (!obj.stationId) {
        await this.mutateCurrentURL();
      }
      await this.getMultiDate(this.selectedDate, this.selectedDateEnd);
    },
    getStationAssigned() {
      try {
        let stationsAssigned = null;
        if (this.userData) {
          if (this.userData.options) {
            if (this.userData.options.stationsAssigned
              && Array.isArray(this.userData.options.stationsAssigned)
              && this.userData.options.stationsAssigned.length > 0) {
              stationsAssigned = this.userData.options.stationsAssigned.shift();
            }
          }
        }
        return stationsAssigned;
      } catch (error) {
        console.log(error)
      }

    },
    async scheduleNext() {
      this.getFilterTimeCurrent();
      this.selectedFilterDate = null;
      this.selectedDate = this.$moment(this.selectedDate).startOf("day").add(1, 'M').format("YYYY-MM-DD");
      await this.$refs.schedule.next();
      await this.getMultiDate(this.selectedDate, this.selectedDateEnd);
      await this.getListOfSelectedWorkOrders(this.scheduleTypeComputed);
    },
    async schedulePrev() {
      this.getFilterTimeCurrent();
      this.selectedFilterDate = null;
      this.selectedDate = this.$moment(this.selectedDate).startOf("day").add(-1, 'M').format("YYYY-MM-DD");
      await this.$refs.schedule.prev();
      await this.getMultiDate(this.selectedDate, this.selectedDateEnd);
      await this.getListOfSelectedWorkOrders(this.scheduleTypeComputed);
    },
    async getListOfSelectedWorkOrders(type = false, refresh = false) {
      try {
        this.selectedFilterDate = null;
        this.events = [];
        const lastStart = this.$refs.schedule.lastStart;
        const lastEnd = this.$refs.schedule.lastEnd;
        await this.getMultiDate(lastStart, lastEnd);
        await this.getWorkOrderFilter(refresh, lastStart, lastEnd, type);
      } catch (error) {
        console.log(error);
      }
    },
    getEvents(timestamp, filter = true) {
      try {
        let events = this.$clone(this.events || []);
        const filterData = events;
        const filters = filterData
          .filter((event) => {
            if (event.scheduleDate) {
              const momentDate = this.$moment(
                event.scheduleDate,
                "YYYY-MM-DD"
              ).toDate();

              let eventDate = calendar.parseDate(momentDate);
              return eventDate.date === timestamp;
            }
            return false;
          })
          .map((item) => ({
            ...item,
            sta: this.$moment(item.sta, 'HH:mm:ss').format('HH:mm'),
            std: this.$moment(item.std, 'HH:mm:ss').format('HH:mm'),
            time: this.$moment(item.scheduleDate).format('HH:mm') || '00:00',
          }));
        const order = _.orderBy(
          filters,
          ["time"],
          ["asc"]
        );
        if (this.scheduleTypeComputed !== 'month') {
          let dataSchedule = order.sort(item => !item.isClone ? 1 : -1);
          dataSchedule = dataSchedule.reduce((acc, item) => {
            const hour = item.time.substring(0, 2);

            acc[hour] = acc[hour] ? [...acc[hour], item] : [item];

            return acc;
          }, {});
          return { data:{...dataSchedule}};
        }
        return order.sort(item => !item.isClone ? 1 : -1);
      } catch (error) {
        console.log(error);
      }
    },
    eventSchedule(event, isDay = false) {
      if (isDay) {
        this.scheduleTypeComputed = 'day-agenda';
        return;
      }
      if (this.scheduleType !== 'day-agenda') {
        if (!this.isBlank && !event.scope.outside) {
          this.selectedData = event.scope.timestamp;
          this.$refs.modalForm.openModal(
            `Create schedule date: ${event.scope.timestamp.date}`,
            null,
            event.scope.timestamp.date
          );
        }
      }
    },
    async editSchedule(event, type = null) {
      await this.showWorkOrder(event, type);
    },
    async addSchedule(data) {
      try {
        const isClone = data.isClone || false;
        const offlineId = 'work-order-' + this.$uid();
        data.offlineId = offlineId;
        await this.$refs.modalForm.setLoading(true);
        if (this.isAppOffline) {
          const flightStatusColor = workOrderList().getFlightStatusesList().find(item => item.id === Number(data.flightStatusId))?.color;
          const cloneSchedule = this.$clone(
            {
            ...modelWorkOrder,
            ...data, 
            id: offlineId, 
            calendarTitle: `${data.preFlightNumber} STA ${data.sta} STD ${data.std}`,
            inboundScheduledArrival: `${this.$moment(data.inboundScheduledArrival).format('YYYY-MM-DD')}T23:59:59`,
            scheduleDate: `${this.$moment(data.scheduleDate).format('YYYY-MM-DD')}T23:59:59`,
            statusId: STATUS_SCHEDULE,
            workOrderStatus: {
              color: 'pink-500',
            },
            flightStatus: {
              color: flightStatusColor || 'gray-200',
            },  
          });
          this.events.push(cloneSchedule);
          await cacheOffline.addNewRecord("apiRoutes.qramp.workOrders", cloneSchedule);
        }
        await this.saveRequestSimpleWorkOrder(data);
        await this.$refs.modalForm.setLoading(false);
        await this.$refs.modalForm.hideModal();
        
        if(!this.isAppOffline) {
          await this.getWorkOrderFilter(true, this.selectedDateStart, this.selectedDateEnd);
          if (this.scheduleTypeComputed === 'day-agenda' && !isClone) {
            await this.addNewDayToSchedule({ date: this.selectedDate });
          }
          await workOrderList().getWorkOrders(true, true);
        }
        
        this.$alert.success('workOrders was added correctly');
      } catch (error) {
        console.log(error);
        await this.$refs.modalForm.setLoading(false);
      }
    },
    async startWorkOrders(statusId, data) {
      data.statusId = statusId;
      await cacheOffline.updateRecord('apiRoutes.qramp.workOrders', data);
      await this.updateSchedule(data);
    },
    async updateSchedule(data) {
      try {
        await this.$refs.modalForm.setLoading(true);
        const event = this.events.find(
          (item) => item.id === data.id
        );
        if (event) {
          const dataForm = {};
          dataForm.calendarTitle = `${data.preFlightNumber} STA ${data.sta} STD ${data.std}`,
          dataForm.id = data.id;
          dataForm.sta = data.sta;
          dataForm.std = data.std;
          dataForm.stationId = data.stationId;
          dataForm.preFlightNumber = data.preFlightNumber;
          dataForm.gateId = data.gateId;
          dataForm.flightStatusId = data.flightStatusId;
          dataForm.acTypeId = data.acTypeId;
          dataForm.inboundScheduledArrival = data.inboundScheduledArrival;
          dataForm.carrierId = data.carrierId;
          dataForm.statusId = data.statusId;
          dataForm.outboundScheduledDeparture =  data.outboundScheduledDeparture;
          dataForm.operationTypeId = data.operationTypeId;
          if(this.isAppOffline) {
            Object.keys(dataForm).forEach((key) => {
              if (key !== 'inboundScheduledArrival') {
                event[key] = dataForm[key];
              }
            });
          }
          if (data.statusId === STATUS_DRAFT) {
            await this.changeStatus(data.statusId, data.id);
            this.showWorkOrder(data);
          } else {
            const params = {params: {
              titleOffline: qRampStore().getTitleOffline()
            }};
            await this.$crud.update("apiRoutes.qramp.schedule", data.id, dataForm, params);
            await cacheOffline.updateRecord('apiRoutes.qramp.workOrders', dataForm);
          }
          if(!this.isAppOffline) {
            await this.getWorkOrderFilter(true, this.selectedDateStart, this.selectedDateEnd);
          }
          this.$alert.info('The workOrders was updated correctly');
        }
        await this.$refs.modalForm.setLoading(false);
        await this.$refs.modalForm.hideModal();
      } catch (error) {
        await this.$refs.modalForm.setLoading(false);
        await this.$refs.modalForm.hideModal();
        console.log(error);
      }
    },
    async changeStatus(statusId, workOrderId) {
      await qRampStore().changeStatus(statusId, workOrderId);
    },
    deleteSchedule(scheduleId) {
      try {
        const events = this.events.filter(
          (item) => item.id !== scheduleId
        );
        this.events = events;
        this.$crud.delete("apiRoutes.qramp.workOrders", scheduleId, {params: {titleOffline: `Delete Work Order - Id: ${scheduleId}`}});
        this.$alert.info('workOrders was deleted correctly');
      } catch (error) {
        console.log(error);
      }
    },
    async getCurrentFilterDate(lastStart, lastEnd) {
      try {
        const startDate = this.$moment(this.$refs.schedule.lastStart);
        const endDate = this.$moment(this.$refs.schedule.lastEnd);
        if (this.scheduleType === 'day-agenda') {
          endDate.add(-1, 'day');
        }
        if (this.scheduleType === 'month' && startDate.format('MM') === this.$moment(lastEnd).format('MM')) {
          lastStart = startDate.startOf("month").format("YYYY-MM-DD");
          lastEnd = endDate.endOf("month").format("YYYY-MM-DD");
        }
        if (this.scheduleType !== 'month') {
          lastStart = startDate.format("YYYY-MM-DD");
          lastEnd = endDate.format("YYYY-MM-DD");
        }
        let lastStartM = this.$moment(lastStart)
          .startOf('day')
          .format("YYYY-MM-DD HH:mm:ss");
        let lastEndM = this.$moment(lastEnd)
          .endOf('day').format("YYYY-MM-DD HH:mm:ss");
        return {
          date: {
            field: "schedule_date",
            type: "customRange",
            from: lastStartM,
            to: lastEndM,
          },
        };
      } catch (error) {
        console.log(error);
      }
    },
    async getWorkOrderFilter(
      refresh = false,
      dateStart = null,
      dateEnd = null,
      type = false,
    ) {
      try {
        this.selectedDateStart = this.$moment(this.selectedDate).format("YYYY-MM-DD HH:mm:ss");
        if (dateStart && dateEnd) {
          this.selectedDateStart = dateStart;
          this.selectedDateEnd = dateEnd;
        }
        const currentFilterDate = await this.getCurrentFilterDate(this.selectedDateStart, this.selectedDateEnd);
        const objUrl = await this.$helper.convertStringToObject();
        const filter =
          Object.keys(objUrl).length === 0 ? this.$filter.values : objUrl;
        const thereAreFilters = Object.keys(filter).length > 0 ? filter : {};
        const scheduleTypeOption = this.scheduleTypeOptions.find(item => item.id === Number(thereAreFilters.type)) || 'day-agenda';
        const scheduleTypeId = this.scheduleTypeOptions.find(item => item.value === this.scheduleType) || {};
        thereAreFilters.type = String(scheduleTypeId.id) || '1';
        thereAreFilters.dateStart = this.$moment(this.selectedDateStart).format('YYYYMMDD');
        thereAreFilters.dateEnd = this.$moment(this.selectedDateEnd).format('YYYYMMDD');
        if (type) this.mutateCurrentURLBrowser(thereAreFilters);
        this.scheduleType = type ? type : scheduleTypeOption.value;
        const filterCurrent = {
          ...thereAreFilters,
          ...currentFilterDate,
        };
        await this.getWorkOrders(refresh, filterCurrent);
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },
    generateCustomDatesArray(startDate, endDate) {
      let startDateM = this.$moment(startDate);
      let endDateM = this.$moment(endDate);
      const customDatesArray = [];

      while (startDateM.isSameOrBefore(endDateM, 'day')) {
        if (this.scheduleType === 'day-agenda' && customDatesArray.length > 0) break;
        const time = this.filterTime.split('-') || [0,0];
        const startDateTime = startDateM.startOf('day').set({ hour: time[0], minute: 0, second: 0 }).format('YYYY-MM-DD HH:mm:ss');
        const endDateTime = startDateM.endOf('day').set({ hour: time[1], minute: 59, second: 59 }).format('YYYY-MM-DD HH:mm:ss');
        const customDateObject = {
          field: 'schedule_date',
          type: 'customRange',
          from: startDateTime,
          to: endDateTime
        };
        customDatesArray.push(customDateObject);
        startDateM.add(1, 'days');
      }
      
      return customDatesArray;
    },
    getMultiDate(startDate, endDate) {
      this.multiFilterDate = {};
      const currentHour = this.$moment().hour();
      let startDateM = this.$moment(startDate);
      let endDateM = this.$moment(endDate);
      const filterTime = modelHoursFilter.filter(item => item.value !== '0-23').find(range => {
             const [start, end] = range.value.split('-').map(Number);
          return currentHour >= start && currentHour <= end;
          }).value || null;
      while (startDateM.isSameOrBefore(endDateM, 'day')) {
        this.multiFilterDate[startDateM.format('YYYY-MM-DD')] = filterTime;
        startDateM.add(1, 'days');
      } 
    },
    async getWorkOrders(refresh = false, filter) {
      try {
        const businessUnitId = this.filterBusinessUnit;
        const weekDates = this.generateCustomDatesArray(filter.dateStart, filter.dateEnd)
        .filter(item => {
          return this.selectedFilterDate 
           ? this.$moment(item.from)
            .startOf('day')
            .format('YYYY-MM-DD HH:mm:ss') === this.$moment(this.selectedFilterDate)
            .startOf('day')
            .format('YYYY-MM-DD HH:mm:ss') 
           : true
        });
        const filterClone = this.$clone(filter);
        delete filterClone.type;
        delete filterClone.dateStart;
        delete filterClone.dateEnd;
            delete filterClone.date;
        this.loading = true;
        await weekDates.reduce(async (previousPromise, item) => {
            if (!this.selectedFilterDate) {
              this.events = [];
            } else {
              this.events = this.events.filter(item => this.$moment(item.scheduleDate).format('YYYY-MM-DD') !== this.selectedFilterDate);
            }

            const params = {
              refresh,
              params: {
                include: "gate,acType,operationType",
                filter: {
                  businessUnitId,
                  ...filterClone,
                  date: item,
                  withoutDefaultInclude: true,
                  order: {
                    field: "id",
                    way: "desc",
                  },
                },
              },
            };
            const response = await this.$crud.index(
              "apiRoutes.qramp.workOrders",
              params,
              this.isAppOffline
            );
            const responseData = response.data.map((item) => ({ 
              ...item, 
              isUpdate: false, 
              isClone: false,
            }));
            this.events.push(...responseData);
            
          }, Promise.resolve());
          this.loading = false;
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },
    async showWorkOrder(reponseSchedule, type = null) {
      const title = `${this.$tr("ifly.cms.form.updateWorkOrder")} Id: ${reponseSchedule.id}`;
      let response = { data: reponseSchedule };
      await qRampStore().setTitleOffline(title);
      if (this.isPassenger || response.data.statusId !== STATUS_SCHEDULE) {
        if (this.isAppOffline) {
          const workOrderOffline = await cacheOffline.getItemById(reponseSchedule.id);
          response = {data: workOrderOffline};
        } else {
          response = await this.$crud.show("apiRoutes.qramp.workOrders", reponseSchedule.id, {
            refresh: true,
            include:
              "customer,workOrderStatus,operationType,station,contract,responsible,flightStatus,scheduleStatus,gate",
          })
        }
        await this.$refs.formOrders.loadform({
          modalProps: {
            title,
            update: true,
            workOrderId: response.data.id,
            width: "90vw",
          },
          data: response.data,
        });
        return;
      }
      response.data.sta = this.$moment(response.data.sta, 'HH:mm:ss').format('HH:mm');
      response.data.std = this.$moment(response.data.std, 'HH:mm:ss').format('HH:mm');
      if (type === 'day' && this.scheduleType === 'day-agenda') {
        const index = this.events.indexOf(item => item.id == reponseSchedule.id);
        this.events[index] = response.data;
        this.cloneEvent = await this.$clone(this.events);
        const eventFind = this.events.find(item => item.id === reponseSchedule.id);
        if (eventFind) {
          eventFind.isUpdate = true;
        }
        return;
      }
      if (this.scheduleType !== 'day-agenda') {
        await this.$refs.modalForm.openModal("Edit schedule", response.data, response.data.inboundScheduledArrival);
      }
    },
    async getFilter() {
      this.events = [];
      const station = await workOrderList().getStationList()
        .find(item => item.id == this.stationId && item.companyId === this.filterCompany);
      if (this.stationId && station && this.componentLoaded) {
        await cache.set("stationId", this.filter.values.stationId || null);
        await this.getWorkOrderFilter(!this.isAppOffline);
      }
    },
    async setFilter() {
      this.$filter.setFilter(this.filterActions);
    },
    async saveRequestSimpleWorkOrder(form) {
      try {
        delete form.scheduleDate;
        const businessUnitId = this.isPassenger ? { businessUnitId: BUSINESS_UNIT_PASSENGER } : {};
        const companyId = this.filterCompany
        const response = await this.$crud.create(
          "apiRoutes.qramp.simpleWorkOrders",
          {
            ...form,
            titleOffline: this.$tr('ifly.cms.form.newWorkOrder'),
            companyId,
            ...businessUnitId,
          }
        );
        return response;
      } catch (error) {
        console.error(error);
      }
    },
    badgeStyles(event, type, timeStartPos, timeDurationHeight) {
      const s = {};
      if (timeStartPos) {
        // don't clamp position to 0px
        s.top = timeStartPos(event.time, false) + "px";
        s.position = "absolute";
        if (event.side !== undefined) {
          s.width = "50%";
          if (event.side === "right") {
            s.left = "50%";
          }
        } else {
          s.width = "100%";
        }
      }
      if (timeDurationHeight) {
        s.height = timeDurationHeight(event.duration) + "px";
      }
      s["align-items"] = "flex-start";
      return s;
    },
    async saveFilterStationId(stationId) {
      this.stationId = stationId;
      await this.mutateCurrentURL();
      await this.emitFilter();
      if (this.isAppOffline) {
        this.getWorkOrderFilter(true, this.selectedDateStart, this.selectedDateEnd)
      }else{
        await this.$router.go();
      }
    },
    async mutateCurrentURL() {
      try {
        const scheduleTypeId = this.scheduleTypeOptions.find(item => item.value === this.scheduleType);
        const origin = window.location.href.split("?");
        let dateStart = this.$moment(this.selectedDateStart).format('YYYYMMDD');
        let dateEnd = this.$moment(this.selectedDateEnd).format('YYYYMMDD');
        if (this.isPassenger) {
          dateStart = this.$moment().format('YYYYMMDD');
          dateEnd = this.$moment().add(1, 'day').format('YYYYMMDD');
        }
        const urlBase = `${origin[0]}?stationId=${this.stationId}&type=${scheduleTypeId ? scheduleTypeId.id : 3}&dateStart=${dateStart}&dateEnd=${dateEnd}`;
        window.history.replaceState({}, "", urlBase);
      } catch (error) {
        console.log(error);
      }
    },
    async mutateCurrentURLBrowser(data) {
      try {
        let paramsUrl = '';
        Object.keys(data).forEach((item, index) => {
          if (this.$filter.fields.hasOwnProperty(item)) {
            if (index === 0) {
              paramsUrl += this.validateObjectFilter('?', item, data);
            } else {
              paramsUrl += this.validateObjectFilter('&', item, data);
            }
          }
        });
        const origin = window.location.href.split('?');
        const urlBase = `${origin[0]}${paramsUrl}`
        window.history.replaceState({}, '', urlBase);
      } catch (error) {
        console.log(error);
      }
    },
    // validate Object Filter
    validateObjectFilter(operator = '?', item, data) {
      if (data[item]) {
        if (typeof data[item] === 'object'
          || Array.isArray(data[item])) {
          return `${operator}${item}=${JSON.stringify(data[item])}`;
        }
        return `${operator}${item}=${data[item]}`;
      }
      return '';
    },
    emitFilter() {
      //Add Values
      setTimeout(() => {
        this.setFilter();
      }, 1000);
    },
    async addNewDayToSchedule(event) {
      try {
        if (this.scheduleType === 'week-agenda') {
          return;
        }
        const date = `${this.$moment(event.date).format('YYYY-MM-DD')}T00:00:00`;
        this.sessionStationId = await cache.get.item("stationId") !== 'null' ? await cache.get.item("stationId") : null;
        const data = {
          calendarTitle: null,
          id: this.$uid(),
          sta: null,
          std: null,
          stationId: this.sessionStationId,
          preFlightNumber: null,
          gateId: null,
          scheduleStatusId: null,
          inboundScheduledArrival: date,
          scheduleDate: date,
          isUpdate: true,
          operationTypeId: null,
        }
        this.events.push({ ...data });
      } catch (error) {
        console.log(error);
      }
    },
    duplicateSchedule(event) {
      try {
        this.events.push(this.$clone({ ...event, id: this.$uid(), isUpdate: true, isClone: true, showCommentTooltip: false }));
      } catch (error) {
        console.log('duplicate', error);
      }
    },
    dismissEvent(event) {
      if (typeof event.id === "number") {
        const eventFind = this.events.find(item => item.id === event.id);
        if (eventFind) {
          eventFind.isUpdate = false;
        }
        this.setEventComments(event.id);
        return;
      }
      this.events = this.events.filter(item => item.id !== event.id);
    },
    async setEventComments(workOrderId) {
      try {
        const event = this.events.find(item => item.id === workOrderId);
        if (event) {
          const response = await this.$crud.show("apiRoutes.qramp.workOrders", workOrderId, {
            refresh: true
          })
          event.comments = response.data.comments;
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getWoCache(data) {
      if(!this.isAppOffline){
        await this.getWorkOrderFilter(true, this.selectedDateStart, this.selectedDateEnd);
      } else {
        let event = this.events.find(item => item.id == data.id) || {};
        const calendarTitle = `${event.preFlightNumber} STA ${event.sta} STD ${event.std}`;
        const inboundBlockIn =  qRampStore().parseDateOfflineWO(data.inboundBlockIn);
        const inboundScheduledArrival = qRampStore().parseDateOfflineWO(data.inboundScheduledArrival);
        const scheduleDate = qRampStore().parseDateOfflineWO(data.scheduleDate);
        const outboundBlockOut = qRampStore().parseDateOfflineWO(data.outboundBlockOut);
        const outboundScheduledDeparture = qRampStore().parseDateOfflineWO(data.outboundScheduledDeparture);
        const eventParset = {
          ...event, 
          calendarTitle, 
          ...data,
          inboundBlockIn,
          inboundScheduledArrival,
          outboundBlockOut,
          outboundScheduledDeparture,
          scheduleDate,
          workOrderItems: Object.values(this.$helper.snakeToCamelCaseKeys(data.workOrderItems)),
        };
        
        this.events = this.$clone(this.events.map(item => {
          return item.id == data.id ? { ...eventParset } : { ...item };
        }));
        
        await cacheOffline.updateRecord('apiRoutes.qramp.workOrders', eventParset);
      }
    },
    async getWorkOrderDateTime(hour, date, refresh = true) {
      this.selectedFilterDate = date;
      this.filterTime = hour;
      await this.getWorkOrderFilter(refresh, this.selectedDateStart, this.selectedDateEnd);
    },
    async refreshWorkOrder() {
      await this.getFilterTimeCurrent();
      this.selectedFilterDate = null;
      await this.getMultiDate(this.selectedDate, this.selectedDateEnd);
      await this.getWorkOrderFilter(true, this.selectedDateStart, this.selectedDateEnd)
    }
  },
};
</script>

<style>
.tooltipComments {
  @apply tw-bg-white tw-text-black tw-shadow-lg tw-border tw-w-52 tw-break-normal;
}

.tw-py-3-2 {
  padding-top: 0.6rem;
  padding-bottom: 0.6rem;
}

@media (max-width: 640px) { 
  #btnCalendarType > button i {
    @apply tw-block tw-w-full tw-mx-0 tw-mb-0;
  }
}
@media (max-width: 420px) {
  #btnCalendarType > button {
    height: 50px;
  }
  #btnCalendarType > button .q-btn__wrapper{
    padding: 8px !important;
  }
  #btnCalendarType > button .q-btn__content i {
    font-size: 1rem;
  }
  #btnCalendarType > button .q-btn__content span {
    font-size: 0.575rem;
    line-height: .7rem;
  }
}
.q-calendar-daily__head-weekday, .q-calendar-weekly__head-weekday {
  @apply tw-py-1 tw-bg-gray-50 tw-justify-center tw-text-xs lg:tw-text-base;
}
.q-calendar-daily__head-weekday, .q-calendar-agenda__head-weekday {
  @apply tw-mb-2;
}
.q-btn--dense.q-btn--round .q-btn__wrapper {
  min-height: 2.1em;
  min-width: 2.1em;
}
.tw-btn-nav .q-btn .q-icon {
  font-size: 10px;
}
.q-calendar.month, .q-calendar.week-agenda {
  width: 100%;  
  overflow-x: scroll;
}
.q-calendar.day-agenda .tw-label-not {
  @apply tw-mb-4;
}
@media (max-width: 640px) {
  .q-calendar-weekly, .q-calendar.week-agenda .q-calendar-agenda {
      width: 200%;
  }
}
@media (max-width: 420px) {
  .q-calendar-weekly, .q-calendar.week-agenda .q-calendar-agenda {
      width: 300%;
  }
}
.q-calendar .tw-text-sm {
    font-size: 0.575rem;
    line-height: .7rem;
}
@media (min-width: 1024px) {
  .q-calendar .tw-text-sm {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
}


.schedule-ctn #dynamicFieldComponent .q-field--with-bottom {
    padding: 20px 0;
}
</style>