<template>
  <div id="indexMasterPage" class="relative-position">
    <!--Page Actions-->
    <div class="q-mb-md">
      <page-actions 
        :title="$tr($route.meta.title)" 
        :excludeActions="['refresh']" 
        :tour-name="tourName"
        @toggleDynamicFilterModal="toggleDynamicFilterModal"
        :dynamicFilter="dynamicFilter"
        :dynamicFilterValues="getDynamicFilterValues"
        :dynamicFilterSummary="dynamicFilterSummary"
      />
    </div>
    <dynamicFilter
      v-if="dynamicFilter"
      :systemName="systemName"
      :modelValue="showDynamicFilterModal"
      :filters="dynamicFilter"
      @showModal="showDynamicFilterModal = true"
      @hideModal="showDynamicFilterModal = false"
      @update:modelValue="filters => updateDynamicFilterValues(filters)"
      @update:summary="summary => dynamicFilterSummary = summary"
    />

    <dashboardRenderer
      :dynamicFilterValues="getDynamicFilterValues"
      :configName="configName"
    />

    <!--Activities-->
    <div id="adminHomeActivities" class="col-12 q-mb-md">
      <activities system-name="admin_home_actions" @loaded="loading = false" view="cardImage" />
    </div>

    <!--Quick cards-->
    <div v-if="quickCards.list1 && quickCards.list1.length">
      <div class="row q-col-gutter-x-md">
        <!-- QuickCards -->
        <div id="quickCardsContent" class="col-12">
          <div class="row q-col-gutter-x-md">
            <div v-for="(groupQuickCard, key) in quickCards" :key="key" class="col-12 col-lg-6">
              <div class="row q-col-gutter-y-md full-width">
                <div v-for="(item, keyItem) in groupQuickCard" :key="keyItem" class="col-12">
                  <component :is="item.component" :key="`component${keyItem}`" v-bind="item.props || {}" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--inner-loading-->
    <inner-loading :visible="loading" />
  </div>
</template>
<script>
import { markRaw } from 'vue';
import dynamicFilter from 'src/modules/qsite/_components/master/dynamicFilter'
import dashboardRenderer from 'src/modules/qsite/_components/master/dashboardRenderer'
// import service from 'src/modules/qsite/_components/master/dashboardRenderer/services.ts'

export default {
  created() {
    this.loading = true;
  },
  components: {
    dynamicFilter,
    dashboardRenderer,
  },
  mounted() {
    this.$nextTick(async function() {
      setTimeout(() => {
        this.loading = false;
        this.setQuickCards();
        this.$tour.start(this.tourName);
      }, 1000);
    });
  },
  data() {
    return {
      // configName: `config.dashboard.quickCards`,
      configName: `ramp.config.dashboard.quickCards`,
      testSchedule: false,
      loading: false,
      quickCards: {},
      tourName: this.$q.platform.is.desktop ? 'admin_home_tour' : 'admin_home_tour_mobile',
      dynamicFilterValues: {},
      dynamicFilterSummary: {},
      dynamicFilter: {
        date: {
          value: {},
          type: 'dateRange',
          quickFilter: false,
          props: {
            label: "Scheduled date",
            field: 'schedule_date_local',
          },
        },
        comparisonDate: {
          value: {},
          type: 'dateRange',
          props: {
            label: "Comparison date",
            field: 'schedule_date_local',
          },
        },
        customerId: {
          value: null,
          type: 'select',
          quickFilter: false,
          loadOptions: {
            apiRoute: 'apiRoutes.qramp.setupCustomers',
            select: { 'label': 'customerName', 'id': 'id' },
            requestParams: {
              filter: {
                companyId: [30,33,34],
              },
            },
          },
          props: {
            label: 'Customer',
            'clearable': true
          },
        },
        contractId: {
          value: null,
          type: 'select',
          quickFilter: false,
          loadOptions: {
            apiRoute: 'apiRoutes.qramp.setupContracts',
            select: { 'label': 'contractName', 'id': 'id' },
            requestParams: {
              filter: {
                contractStatusId: 1,
                businessUnitId: 8
              },
            },
          },
          props: {
            label: 'Contract',
            'clearable': true,
          },
        },
        statusId: {
          value: null,
          type: 'select',
          quickFilter: false,
          loadOptions: {
            apiRoute: 'apiRoutes.qramp.workOrderStatuses',
            select: { 'label': 'statusName', 'id': 'id' },
            requestParams: {
              filter: {
                companyId: [30,33,34],
              },
            },
          },
          props: {
            label: 'Status',
            'clearable': true
          },
        },
        stationId: {
          value: null,
          type: 'select',
          loadOptions: {
            apiRoute: 'apiRoutes.qsetupagione.setupStations',
            select: { 'label': 'fullName', 'id': 'id' },
            requestParams: {
              filter: {
                companyId: [30,33,34],
              },
            },
          },
          props: {
            label: 'Station',
            'clearable': true
          },
        },
        adHoc: {
          value: null,
          type: 'select',
          props: {
            label: 'Ad Hoc',
            clearable: true,
            options: [
              { label: this.$tr('isite.cms.label.yes'), value: true, },
              { label: this.$tr('isite.cms.label.no'), value: false, },
            ],
          },
        },
        operationTypeId: {
          value: null,
          type: 'select',
          props: {
            label: 'Operation Type',
            clearable: true,
            color: "primary"
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qramp.operationTypes',
            select: { label: 'operationName', id: 'id' },
            requestParams: { filter: { companyId: [30,33,34] } },
          }
        },
        type: {
          value: [],
          type: 'select',
          props: {
            label: 'Work Order Types',
            multiple: true,
            useChips: true,
            clearable: true,
            color: "primary",
            options: [
              {label: 'Flight', value: 1},
              {label: 'Non flight', value: 2},
            ]
          },
        },
        businessUnitId: { value: 8 },
      },
      systemName: 'ramp.passenger-work-orders',
      showDynamicFilterModal: false,
    };
  },
  computed: {
    getDynamicFilterValues() {
      return this.dynamicFilterValues;
    },
  },
  methods: {
    async setQuickCards() {
      //Get quick cards
      let quickCards = [];
      let mainConfigs = Object.values(config('main')).map(item => item.quickCards || []);
      mainConfigs.forEach(item => quickCards = quickCards.concat(item));
      //Validate Permissions
      let quickCardsToShow = [];
      for (const card of quickCards) {
        if (!card.permission || this.$hasAccess(card.permission)) {
          let qcComponent = card?.component
          if(typeof qcComponent == 'function') qcComponent = await qcComponent();
          card.component = markRaw(qcComponent.default || qcComponent);
          quickCardsToShow.push(card);
        }
      }

      //Divide quick cards
      let response = {
        list1: (quickCardsToShow.length >= 2) ? quickCardsToShow.slice(0, (quickCardsToShow.length / 2)) : quickCardsToShow,
        list2: (quickCardsToShow.length >= 2) ? quickCardsToShow.slice((quickCardsToShow.length / 2), quickCardsToShow.length) : []
      };
      //Response
      this.quickCards = response;
    },
    toggleDynamicFilterModal() {
      this.showDynamicFilterModal = !this.showDynamicFilterModal;
    },
    updateDynamicFilterValues(filters) {
      this.dynamicFilterValues = filters;
    },
  }
};
</script>
<style lang="scss">
.flex-break {
  flex: 1 0 100% !important;
  height: 0 !important;
}

.example-container {
  .example-cell {
    margin: 1px;
    padding: 4px 8px;
    box-shadow: inset 0 0 0 2px $grey-6;
  }
}

#indexMasterPage {
  #logoContent {
    min-height: calc(100vh - 200px);
  }
}
</style>
