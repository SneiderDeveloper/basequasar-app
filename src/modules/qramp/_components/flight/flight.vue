<template>
  <div id="formFlyStep" class="tw-mt-6 tw-mb-20">
    <q-form @submit.prevent.stop="saveInfo" ref="myForm" id="rowContainer" class="row q-col-gutter-lg">
      <table-flight 
        @cancel="dialog = $event" 
        :dialog="dialog" 
        :dataTable="dataTable" 
        @flightSelect="setDataTable($event)"
        @validateBound="validateBound(flightNumberField)"
      />
      <div class="col-12 col-md-6">
        <div v-for="(field, keyField) in formFields.flyFormLeft">
          <label v-if="keyField == 'customerId'" :class="`${readonly ? `${responsive ? 'no-wrap' : 'justify-end'} row items-center`: '' }`">
            <dynamic-field
              v-if="bannerMessage"
              class="q-mb-md" 
              :field="formFields.banner"
            />
            <dynamic-field
              :key="keyField"
              :id="keyField"
              :field="field"
              :class="`${readonly ? 'col-7': ''}`"
              :style="`${field.type !== 'input' && !readonly ? 'padding-bottom:7px' : 'padding-bottom:0px'}`"
              v-model="selectCustomers"
              @input="setCustomerForm"
              @filter="setCustomerName"
              ref="customerId"
            >
              <div slot="before-options">
                <div class="q-py-md q-px-md" @click="addCustumers">
                  <div class="row cursor-pointer" >
                    <div class="q-pr-md">
                       <q-btn 
                          push color="primary" 
                          round 
                          icon="fas fa-plus" 
                          size="xs"
                        /> 
                    </div>
                    <div class="q-py-xs">
                      <label class="cursor-pointer">{{ $tr('ifly.cms.label.createNewCustomer') }}</label>
                    </div>
                  </div>
                </div> 
              </div>
            </dynamic-field>
          </label>
          <label v-if="keyField != 'customerId' && keyField != 'customCustomerName'" :class="`${readonly ? `${responsive ? 'no-wrap' : 'justify-end'} row items-center`: '' }`">
            <span v-if="readonly" class="col-5 text-right span q-pr-sm text-primary">{{field.label}}:</span>
            <dynamic-field
              :key="keyField"
              :id="keyField"
              :field="field"
              :class="`${readonly ? 'col-7': ''}`"
              :style="`${field.type !== 'input' && !readonly ? 'padding-bottom:7px' : 'padding-bottom:0px'}`"
              v-model="form[keyField]"
              @input="resetField(keyField)"
            />
          </label>
          <hr v-if="readonly" class="label-container"/>
        </div>
      </div>
      <div 
        class="col-12 col-md-6"
      >
        <div 
          v-for="(field, keyField) in formFields.flyFormRight" 
          :style="`${readonly ? 'height: 50px' : 'padding-bottom: 7px'}`"
        >
        <label :class="`${readonly ? `${responsive ? 'no-wrap' : 'justify-end'} row items-center`: '' }`">
          <span v-if="readonly" class="col-5 text-right span q-pr-sm text-primary">{{field.label}}:</span>
          <dynamic-field
            v-if="keyField !== 'responsibleId'"
            :key="keyField"
            :id="keyField"
            :field="field"
            :class="`${readonly ? 'col-7': ''}`"
            :style="`${field.type !== 'input' && !readonly ? 'padding-bottom:1px' : 'padding-bottom:0px'}`"
            v-model="form[keyField]"
            @input="resetField()"
          />
        </label>
        <div v-if="keyField === 'responsibleId'">
            <dynamic-field
              :key="keyField"
              :id="keyField"
              :field="field"
              :class="`${readonly ? 'col-7': ''}`"
              :style="`${field.type !== 'input' && !readonly ? 'padding-bottom:7px' : 'padding-bottom:0px'}`"
              v-model="form[keyField]"
            />
          </div>
        <hr v-if="readonly" class="label-container"/>
        </div>
      </div>
      <div
        v-if="isbound[0]"
        class="col-12 col-md-6"
      >
        <div v-if="isCollapse">
          <collapse
            :title="$tr('isite.cms.label.inbound')"
            :flightNumber="form.inboundFlightNumber"
            :isComplete="completeFormInbound"
          >
            <div
              v-for="(field, keyField) in formFields.inboundLeft"
              class="tw-px-4"
            >
              <div :class="`${readonly ?`${responsive ? 'no-wrap' : 'justify-end'} row items-center` : ''}`">
                <span v-if="readonly" class="col-5 text-right q-pr-sm text-primary">{{field.label}}:</span>
                <dynamic-field
                  :key="keyField"
                  :class="`${readonly ? 'col-7': ''}`"
                  :id="keyField"
                  :field="field"
                  :style="`${field.type !== 'input' && !readonly ? keyField == 'origin' ? '' : 'padding-bottom:8px' : 'padding-bottom:8px'}`"
                  v-model="form[keyField]"
                  @enter="search(field)"
                  :ref="`${keyField}`"
                  @input="zanetizeData(keyField)"
                />
              </div>
            </div>
          </collapse>
        </div>
      </div>
      <div
        v-if="isbound[1]" 
        class="col-12 col-md-6"
      >
        <div v-if="isCollapse">
          <collapse
            :title="$tr('isite.cms.label.outbound')"
            :flightNumber="form.outboundFlightNumber"
            :isComplete="completedFormOutBound"
          > 
            <div
              v-for="(field, keyField) in formFields.outboundRight"
              class="tw-px-4"
            >
              <div :class="`${readonly ?`${responsive ? 'no-wrap' : 'justify-end'} row items-center` : ''}`">
                <span v-if="readonly" class="col-5 text-right q-pr-sm text-primary">{{field.label}}:</span>
                <dynamic-field
                  :key="keyField"
                  :class="`${readonly ? 'col-7': ''}`"
                  :id="keyField"
                  :field="field"
                  :style="`${field.type !== 'input' && !readonly ? keyField == 'destination' ? '' : 'padding-bottom:8px' : 'padding-bottom:8px'}`"
                  v-model="form[keyField]"
                  @enter="search(field)"
                  @input="zanetizeData(keyField)"
                />
              </div>
            </div>
          </collapse>
        </div>
      </div>

      <div
          class="col-12"
      >
        <div class="tw-font-semibold
          lg:tw-grid
          lg:tw-grid-cols-2
          md:tw-grid-cols-2
          tw-gap-5
          tw-border
          tw-border-gray-200
          tw-p-2
          tw-rounded-md">
          <div
              v-for="(field, keyField) in formFields.dateBound"
              :key="keyField"
          >
            <div>
              <dynamic-field
                  :key="keyField"
                  :id="keyField"
                  :field="field"
                  :style="`${field.type !== 'input' && !readonly ? keyField == 'origin' ? '' : 'padding-bottom:8px' : 'padding-bottom:8px'}`"
                  v-model="form[keyField]"
                  @input="changeDate(field)"
              />
            </div>
          </div>
          <div
              class="
              tw-col-span-2
              tw-p-4
              tw-border
              tw-border-gray-200
              tw-mx-4
              tw-text-center"
          >
            Difference (hours): {{ differenceHour }}
          </div>
        </div>
      </div>
    </q-form>
    <inner-loading :visible="!isCollapse"/>
  </div>
</template>
<script>
import responsive from '../../_mixins/responsive.js'
import tableFlight from '../modal/tableFlight.vue'
import factoryCustomerWithContracts from '../../_store/actions/factoryCustomerWithContracts.js';
import qRampStore from '../../_store/qRampStore.js';
import { 
  BUSINESS_UNIT_PASSENGER , 
  BUSINESS_UNIT_RAMP,
  COMPANY_PASSENGER,
  COMPANY_RAMP
} from '../model/constants.js'
import workOrderList from '../../_store/actions/workOrderList.ts';
import collapse from './collapse.vue'
import flightStore from './store';

export default {
  props:{
    readonly: true,
    toolbar:{},
    dataCompoment:{
      type:Object,
      default:()=>{}
    }
  },
  components:{tableFlight, collapse},
  mixins:[responsive],
  created() {
    this.$nextTick(function () {
      workOrderList().getOperationType();
    })
  },
  mounted() {
     this.$nextTick(function () {
      document.querySelector('.master-dialog__body')
      .addEventListener('scroll', this.handleScroll);
      this.init();
    })
  },
  data(){
    return{
      form:{
        customCustomer: false,
        adHoc: false,
        operationTypeId:null,
        statusId:"1",
        date: '',
        inboundCustomFlightNumber:null,
        outboundCustomFlightNumber:null,
        inboundFlightNumber:null,
        outboundFlightNumber: null,
        inboundOriginAirportId:null,
        outboundDestinationAirportId:null,
        outboundBlockOut: null,
        stationId: null,
      },
      refresh: 1,
      selected:[],
      loadingState:false,
      openAlert:false,
      update:false,
      dialog:false,
      inOutBound:null,
      timeoutID: '',
      dataTable:[],
      mainData:[],
      selectCustomers: '',
      bannerMessage: null,
      customerName: '',
      newCustumerAdHoc: [],
      differenceHour: 0,
      responsibleList: [],
      completeFormInbound: false,
      completedFormOutBound: false,
      isCollapse: false,
    }
  },
  watch:{
    'form.inboundFlightNumber' (val) {
      if (!val) {
        this.form.inboundFlightNumber = null,
        this.form.inboundOriginAirportId = null,
        this.form.inboundTailNumber = null,
        this.form.inboundScheduledArrival = null
      }
    },
    'form.outboundFlightNumber' (val) {
      if (!val) {
        this.form.outboundFlightNumber = null,
        this.form.outboundDestinationAirportId = null,
        this.form.outboundTailNumber = null,
        this.form.outboundScheduledDeparture = null
      }
    },
    'form.outboundDestinationAirportId' (val) {
      if (this.form.inboundOriginAirportId) {
        this.openAlert = false
      } else {
        this.openAlert = true
      }
    },
    'form.inboundOriginAirportId' (val) {
      if (this.form.outboundDestinationAirportId) {
        this.openAlert = false
      } else {
        this.openAlert = true
      }
    }
  },
  computed: {
    isAppOffline() {
      return this.$store.state.qofflineMaster.isAppOffline;
    },
    operationTypeList() {
      return workOrderList().getOperationTypeList()
    },
    disabledReadonly() {
      return qRampStore().disabledReadonly();
    },
    isDesktop() {
      return window.innerWidth >= '900';
    },
    flightBoundFormStatus() {
      return qRampStore().getFlightBoundFormStatus();
    },
    flightNumberField() {
      return qRampStore().getFlightNumberField();
    },
    validateFutureDateTime() {
      return (dateTime, min, currentDate) => qRampStore().validateFutureDateTime(dateTime, min, currentDate);
    },
    selectCustomerComputed: {
      get() {
        return this.selectCustomers;
      },
      set(value) {
        this.selectCustomers = value;
      }
    },
    showLabel(){
      if(this.readonly && !this.responsive ){
        return true
      }
      if(this.readonly && this.responsive ){
        return false   
      }
      return false
    },
    isbound() {
      if(this.form.operationTypeId) {
        const operationType = this.operationTypeList
          .find(item => item.id === Number(this.form.operationTypeId));
        const type = operationType?.options?.type;
        if(type) {
          if(type === 'full'){
            return [true, true];
          }
          if(type === 'inbound') {
            return [true, false]
          }
          if(type === 'outbound') {
            return [false, true];
          }
        }
      }
      return [false, false];
    },
    readStatus(){
      return  !this.$auth.hasAccess('ramp.work-orders.edit-status') || this.readonly || this.disabledReadonly
    },
    allowContractName() {
      return this.$auth.hasAccess('ramp.work-orders.see-contract-name');
    },
    manageResponsiblePermissions() {
      return this.$auth.hasAccess('ramp.work-orders.manage-responsible') && !this.isPassenger;
    },
    isPassenger() {
     return qRampStore().getIsPassenger();
    },
    filterCompany() {
      return this.isPassenger ? BUSINESS_UNIT_PASSENGER : BUSINESS_UNIT_RAMP;
    },
    filterCompany() {
      return this.isPassenger ? COMPANY_PASSENGER : COMPANY_RAMP;
    },
    filterGates() {
      return workOrderList()
        .getGatesList()
        .filter(item => item.stationId == this.form.stationId)
        .map(item =>
          ({
            value: item.id,
            label: item.name
          }));
    },
    validateRulesBlock() {
      const rules = !this.isPassenger ? {
        rules: [
            val => !!val || this.$tr('isite.cms.message.fieldRequired')
        ]
      } : {};
      return rules;
    },
    formFields() {
      return {
        banner: {
          type: 'banner',
          props: {
            color: 'info',
            icon: 'fas fa-exclamation-triangle',
            message: this.bannerMessage,
          }
        },
        flyFormLeft:{
          customerId: {
            name:'customerId',
            value: '',
            type: this.readonly ? 'inputStandard': 'select',
            help: {
                description: 'You can add a new customer to the list if it\'s not available. Type the Customer Name and click on "Create new customer". The Work Order will be created as Ad-Hoc.'
            },
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              readonly: this.readonly || this.disabledReadonly,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `*${this.$tr('ifly.cms.form.customer')}`,
              clearable: true,
              color:"primary",
              'hide-bottom-space': false,
              emitValue: false,
              options: this.newCustumerAdHoc,
            },
            loadOptions: {
              delayed: this.getCustomerList,
            },
            label: this.$tr('ifly.cms.form.customer'),
          },
          customCustomerName: {
            name:'customCustomerName',
            value: '',
            type: this.readonly ? 'inputStandard': 'input',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              readonly: this.readonly || this.disabledReadonly,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `*${this.$tr('ifly.cms.form.customer')}`,
              clearable: true,
              color:"primary",
              'hide-bottom-space': false
            },
            label: this.$tr('ifly.cms.form.customer'),
          },
          stationId: {
            name:'stationId',
            value: '',
            type: this.readonly ? 'inputStandard':'select',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              selectByDefault : true,
              readonly: this.readonly || this.disabledReadonly,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `*${this.$tr('ifly.cms.form.station')}`,
              clearable: true,
              color:"primary"
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qsetupagione.setupStations',
              select: {label: 'fullName', id: 'id'},
              requestParams: {filter: {status: 1, companyId: this.filterCompany}}
            },
          },
          acTypeId: {
            name:'acTypeId',
            value: '',
            type: this.readonly ? 'inputStandard':'select',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              readonly: this.readonly || this.disabledReadonly,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `*${this.$tr('ifly.cms.form.acType')}`,
              clearable: true,
              color:"primary",
              'hide-bottom-space': false
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qfly.aircraftTypes',
              select: {label: 'model', id: 'id'},
              requestParams: {filter: {status: 1, companyId: this.filterCompany}}
            },
            label: this.$tr('ifly.cms.form.acType'),
          },
          operationTypeId: {
            name:'operationTypeId',
            value: '',
            type: this.readonly ? 'inputStandard':'select',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              readonly: this.readonly || this.disabledReadonly,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `*${this.$tr('ifly.cms.form.operation')}`,
              clearable: true,
              color:"primary",
              'hide-bottom-space': false,
              options: this.operationTypeList
            },
            label: this.$tr('ifly.cms.form.operation'),
          },
        },
        flyFormRight:{
          carrierId: {
            name:'carrierId',
            value: '',
            type: this.readonly ? 'inputStandard':'select',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              readonly: this.readonly || this.disabledReadonly,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `*${this.$tr('ifly.cms.form.carrier')}`,
              clearable: true,
              color:"primary",
              'hide-bottom-space': false
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qfly.airlines',
              select: {label: 'airlineName', id: 'id'},
              requestParams: {filter: {status: 1, companyId: this.filterCompany, "allTranslations":true}}
            },
            label: this.$tr('ifly.cms.form.carrier'),
          },
          gateId: {
            name:'gateId',
            value: '',
            type: this.readonly ? 'inputStandard':'select',
            props: {
              vIf: !this.isPassenger,
              rules: [
                val => this.validateSpecialCharacters(val)
              ],
              readonly: this.readonly || this.disabledReadonly,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `*${this.$tr('ifly.cms.form.gate')}`,
              clearable: true,
              color:"primary",
              options: this.filterGates,
            },
            label: this.$tr('ifly.cms.form.gate'),
          },
          statusId: {
            name:'statusId',
            value: 1,
            type: this.readonly ? 'inputStandard':'select',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              readonly: this.readStatus,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `*${this.$tr('ifly.cms.form.status')}`,
              clearable: true,
              color:"primary",
              'hide-bottom-space': false
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qramp.workOrderStatuses',
              select: {label: 'statusName', id: 'id'},
              requestParams: {filter: {status: 1, companyId: this.filterCompany}}
            },
            label: this.$tr('ifly.cms.form.status'),
          },
          responsibleId: {
            name: "responsibleId",
            value: '',
            type: "select",
            props: {
              vIf: this.manageResponsiblePermissions,
              readonly: this.disabledReadonly,
              label: '*Responsible',
              clearable: true,
              color: "primary",
              options: this.isAppOffline ? flightStore().getReponsible() : []
            },
            loadOptions: {
              apiRoute: "apiRoutes.quser.users",
              select: { label: "fullName", id: "id"},
              filterByQuery: true,
              requestParams: {filter: {companyId: this.filterCompany}}
            },
          },
        },
        inboundLeft:{
          inboundFlightNumber: {
            name:'inboundFlightNumber',
            value: '',
            type: this.readonly ? 'inputStandard':'search',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              hint:'Enter the fight number and press enter or press the search icon',
              loading: this.loadingState,
              readonly: this.readonly || this.disabledReadonly || this.loadingState,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `*${this.$tr('ifly.cms.form.flight')}`,
              clearable: true,
              maxlength: 7,
              color:"primary"
            },
            label: this.$tr('ifly.cms.form.flight'),
          },
          inboundOriginAirportId: {
            name:'inboundOriginAirportId',
            value: '',
            type: this.readonly ? 'inputStandard':'select',
            props: {
              rules: [
                val => this.isPassenger ? true : !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              readonly: this.disabledReadonly || this.flightBoundFormStatus.boundOriginAirportId,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `*${this.$tr('ifly.cms.form.origin')}`,
              clearable: true,
              color:"primary"
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qfly.airports',
              select: {label: 'fullName', id: 'id'},
              requestParams: {filter: {status: this.refresh, companyId: this.filterCompany}}
            },
            label: this.$tr('ifly.cms.form.origin'),
          },
          inboundTailNumber: {
            name:'inboundTailNumber',
            value: '',
            type: this.readonly ? 'inputStandard':'input',
            props: {
              rules: [
                val => this.isPassenger ? true : !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              readonly:  this.disabledReadonly || this.flightBoundFormStatus.boundTailNumber,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `*${this.$tr('ifly.cms.form.tail')}`,
              clearable: true,
              color:"primary"
            },
            label: this.$tr('ifly.cms.form.tail'),
          },
          inboundScheduledArrival: {
            name:'inboundScheduledArrival',
            value: '',
            type: this.readonly ? 'inputStandard':'fullDate',
            props: {
              rules: [
                val => this.isPassenger ? true : !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              hint:'Format: MM/DD/YYYY HH:mm',
              mask:'MM/DD/YYYY HH:mm',
              'place-holder': 'MM/DD/YYYY HH:mm',
              readonly: this.disabledReadonly || this.flightBoundFormStatus.boundScheduled,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `*${this.$tr('ifly.cms.form.scheduledArrival')}`,
              clearable: true,
              color:"primary",
              format24h: true,
            },
            label: this.$tr('ifly.cms.form.scheduledArrival'),
          },
          inboundGateArrival: {
            name:'inboundGateArrival',
            value: '',
            type: 'input',
            props: {
              vIf: this.isPassenger,
              readonly:  this.disabledReadonly || this.flightBoundFormStatus.inboundGateArrival,
              label: '*Inbound Gate Arrival',
              clearable: true,
              color:"primary"
            },
            label: 'Inbound Gate Arrival',
          }
        },
        outboundRight:{
          outboundFlightNumber: {
            name:'outboundFlightNumber',
            value: '',
            type: this.readonly ? 'inputStandard':'search',
            props: {
              rules: [
                val => this.isPassenger ? true : !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              hint:'Enter the fight number and press enter or press the search icon',
              loading: this.loadingState,
              readonly: this.readonly || this.disabledReadonly || this.loadingState,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `*${this.$tr('ifly.cms.form.flight')}`,
              clearable: true,
              maxlength: 7,
              color:"primary"
            },
            label: this.$tr('ifly.cms.form.flight'),
          },
          outboundDestinationAirportId: {
            name:'outboundDestinationAirportId',
            value: '',
            type: this.readonly ? 'inputStandard':'select',
            props: {
              rules: [
                val => this.isPassenger ? true : !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              readonly: this.disabledReadonly || this.flightBoundFormStatus.boundDestinationAirport,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `*${this.$tr('ifly.cms.form.destination')}`,
              clearable: true,
              color:"primary"
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qfly.airports',
              select: {label: 'fullName', id: 'id'},
              requestParams: {filter: {status: this.refresh, companyId: this.filterCompany}}
            },
            label: this.$tr('ifly.cms.form.destination'),
          },
          outboundTailNumber: {
            name:'outboundTailNumber',
            value: '',
            type: this.readonly ? 'inputStandard':'input',
            props: {
              rules: [
                val => this.isPassenger ? true : !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              readonly: this.disabledReadonly || this.flightBoundFormStatus.outboundTailNumber,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `*${this.$tr('ifly.cms.form.tail')}`,
              clearable: true,
              color:"primary"
            },
            label: this.$tr('ifly.cms.form.tail'),
          },
          outboundScheduledDeparture: {
            name:'outboundScheduledDeparture',
            value: '',
            type: this.readonly ? 'inputStandard':'fullDate',
            props: {
              rules: [
                val => this.isPassenger ? true : !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              hint:'Format: MM/DD/YYYY HH:mm',
              mask:'MM/DD/YYYY HH:mm',
              'place-holder': 'MM/DD/YYYY HH:mm',
              readonly: this.disabledReadonly || this.flightBoundFormStatus.boundScheduledDeparture,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `*${this.$tr('ifly.cms.form.scheduledDeparture')}`,
              clearable: true,
              color:"primary",
              format24h: true,
            },
            label: this.$tr('ifly.cms.form.scheduledDeparture'),
          },
          outboundGateDeparture: {
            name:'outboundGateDeparture',
            value: '',
            type: 'input',
            props: {
              vIf: this.isPassenger,
              readonly:  this.disabledReadonly || this.flightBoundFormStatus.outboundGateDeparture,
              label: '*Outbound Gate Departure',
              clearable: true,
              color:"primary"
            },
            label: 'Outbound Gate Departure',
          },
        },
        dateBound: {
          inboundBlockIn: {
            name:'inboundBlockIn',
            value: '',
            type: this.readonly ? 'inputStandard':'fullDate',
            props: {
              ...this.validateRulesBlock,
              hint:'Format: MM/DD/YYYY HH:mm',
              mask:'MM/DD/YYYY HH:mm',
              'place-holder': 'MM/DD/YYYY HH:mm',
              readonly: this.readonly || this.disabledReadonly,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: `${this.isPassenger ? 'Actual In': `*${this.$tr('ifly.cms.form.blockIn')}`}`,
              clearable: true,
              color:"primary",
              format24h: true,
              options: (date, min) => this.validateFutureDateTime(date, min, this.form.inboundBlockIn),
            },
            label: `${this.isPassenger ? 'Actual In': `${this.$tr('ifly.cms.form.blockIn')}`}`,
          },
          outboundBlockOut: {
            name:'outboundBlockOut',
            value: '',
            type: this.readonly ? 'inputStandard':'fullDate',
            props: {
              hint:'Format: MM/DD/YYYY HH:mm',
              mask:'MM/DD/YYYY HH:mm',
              'place-holder': 'MM/DD/YYYY HH:mm',
              readonly: this.readonly || this.disabledReadonly,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: `${this.isPassenger ? 'Actual Out': `${this.$tr('ifly.cms.form.blockOut')}`}`,
              clearable: true,
              color:"primary",
              format24h: true,
              options: this.validateDateOutboundBlockOut,
            },
            label: `${this.isPassenger ? 'Actual Out': `${this.$tr('ifly.cms.form.blockOut')}`}`,
          },
        },
        customerField: {
          customCustomerName: {
            name:'customCustomerName',
            value: '',
            type: this.readonly ? 'inputStandard':'input',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              readonly: this.readonly || this.disabledReadonly,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `*${this.$tr('ifly.cms.form.customCustomerName')}`,
              clearable: true,
              color:"primary"
            },
            label: this.$tr('ifly.cms.form.gate'),
          },
        }
      }
    },
  },
  methods: {
    showInputs(keyField){
      return (keyField == 'customCustomer' && this.form.adHoc) || keyField == 'adHoc'
    },
    init() {
      this.currentDate()
      this.updateData()
    },
    async updateData() {
      if(this.dataCompoment && Object.keys(this.dataCompoment).length > 0) {
        this.isCollapse = false;
        this.update = true
        const updateForm = this.$clone(this.dataCompoment)
        this.form.statusId = updateForm.statusId
        this.form.stationId = updateForm.stationId
        this.form.acTypeId = updateForm.acTypeId
        this.form.adHoc = updateForm.adHoc
        this.form.carrierId = updateForm.carrierId
        this.form.customCustomer = updateForm.customCustomer
        this.form.customerId = updateForm.customerId
        const customer = workOrderList().getCustomerWithContractLists().find(item => item.id == updateForm.customerId);
        if(customer) {
          customer.label = updateForm.adHoc ? `${customer.label} (Ad Hoc)`: customer.label;
          if(customer.label) {
            this.selectCustomerComputed = customer;
          }
        }
        await this.setCustomerForm();
        this.form.date = updateForm.date
        this.form.gateId = updateForm.gateId
        this.form.operationTypeId = updateForm.operationTypeId
        setTimeout(() => {
          this.form.date = this.dateFormatterFull(updateForm.date)
          this.update = false
          this.form.responsibleId = updateForm.responsibleId;
          this.form.inboundFlightNumber = updateForm.inboundFlightNumber 
          this.form.outboundFlightNumber = updateForm.outboundFlightNumber 
          this.form.inboundOriginAirportId = updateForm.inboundOriginAirportId
          this.form.inboundTailNumber = updateForm.inboundTailNumber;
          this.flightBoundFormStatus.boundTailNumber = this.checkIfDataArrives(updateForm.inboundTailNumber);
          this.flightBoundFormStatus.outboundTailNumber = this.checkIfDataArrives(updateForm.outboundTailNumber);
          this.flightBoundFormStatus.boundScheduled = this.checkIfDataArrives(updateForm.inboundScheduledArrival);
          this.flightBoundFormStatus.boundScheduledDeparture = this.checkIfDataArrives(updateForm.outboundScheduledDeparture);
          this.flightBoundFormStatus.boundOriginAirportId = this.checkIfDataArrives(updateForm.inboundOriginAirportId);
          this.flightBoundFormStatus.boundDestinationAirport = this.checkIfDataArrives(updateForm.outboundDestinationAirportId);
          if(this.isPassenger) {
            this.form.inboundGateArrival = updateForm.inboundGateArrival;
            this.form.outboundGateDeparture = updateForm.outboundGateDeparture;
            this.flightBoundFormStatus.inboundGateArrival = this.checkIfDataArrives(updateForm.inboundGateArrival);
            this.flightBoundFormStatus.outboundGateDeparture = this.checkIfDataArrives(updateForm.outboundGateDeparture);
          }
          this.form.inboundBlockIn = this.dateFormatterFull(updateForm.inboundBlockIn)
          this.form.inboundScheduledArrival = this.dateFormatterFull(updateForm.inboundScheduledArrival)
          this.form.outboundDestinationAirportId = updateForm.outboundDestinationAirportId
          this.form.outboundTailNumber = updateForm.outboundTailNumber
          this.form.outboundScheduledDeparture = this.dateFormatterFull(updateForm.outboundScheduledDeparture)
          this.form.outboundBlockOut = this.dateFormatterFull(updateForm.outboundBlockOut)
          this.form.faFlightId = updateForm.faFlightId;
          if(this.form.inboundBlockIn && this.form.outboundBlockOut) {
            this.differenceHour = qRampStore().getDifferenceInHours(this.form.inboundBlockIn, this.form.outboundBlockOut);
          }
          this.completeFormInbound = this.validateInbound('inboundLeft');
          this.completedFormOutBound = this.validateInbound('outboundRight');
          this.isCollapse = true;
        },1000)
      }
    },
    checkIfDataArrives(data) {
      return (data === null || data === '')  ? false : true;
    },
    saveInfo(error) {
      this.$refs.myForm.validate().then(async (success) => {
        if (success) {
          this.saveIndividual();
          this.$emit('isError', error);
        }
        else {
          this.$emit('isError', true)
        }
      })
    },
    saveIndividual() {
      this.$store.commit('qrampApp/SET_FORM_FLIGHT', this.$clone(this.form))
      qRampStore().setDateInboundBlockIn(this.form.inboundBlockIn);
      qRampStore().setDateOutboundBlockOut(this.form.outboundBlockOut);
      qRampStore().setDateOutboundScheduledDeparture(this.form.outboundScheduledDeparture);
      qRampStore().setDateinboundScheduledArrival(this.form.inboundScheduledArrival);
    },
    async menssageValidate() {
      let error = false;
      if(
        this.form.operationTypeId === '3' 
        && this.form.inboundFlightNumber
        && this.form.inboundOriginAirportId
        && this.form.inboundTailNumber
        && this.form.inboundScheduledArrival
        && this.form.inboundBlockIn
        && (this.form.outboundBlockOut === '' ||  this.form.outboundBlockOut === null)
      ) {
        if(await new Promise(resolve=>this.$q.dialog({
          ok: this.$tr('isite.cms.label.yes'),
          message: 'Are you sure there is no data for block out?',
          cancel: true,
          persistent: true
        }).onOk(()=>resolve(true)).onCancel(()=>resolve(false)))){
        error = false
        }else{
        error = true;
        const out = this.$refs.outboundBlockOut[0];
        if(out) {
          out.$refs.outboundBlockOutInboundLeft.focus();
        }
        }
      }
      
      return error; 
    },
    currentDate() {
      const tzoffset = (new Date()).getTimezoneOffset() * 60000; 
      const date = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1)
      this.form.date = this.dateFormatterFull(date)
    },
    search({type, name}, criteria = null) {
      if(type != 'search') return;
      if (this.timeoutID) {
        clearTimeout(this.timeoutID)
      }
      this.refresh = 0
      this.dataTable = []
      const _this = this
      this.timeoutID = setTimeout(function () {
        criteria = name == 'inboundFlightNumber' ?  _this.form.inboundFlightNumber : _this.form.outboundFlightNumber
        if(!criteria || criteria.length < 3) return ;
        
        const params = {
          refresh: true,
          params: {
            filter: {search: criteria.toUpperCase()}
          }
        }
        _this.loadingState = true
        _this.inOutBound = ["3","4"].includes(_this.form.operationTypeId)
        //Request
        _this.$crud.index('apiRoutes.qfly.flightaware', params).then(response => {
          _this.loadingState = false
          _this.name = name
          if (response.status == 200) {
            _this.form.outboundCustomFlightNumber= false
            _this.form.inboundCustomFlightNumber= false
            _this.refresh = 1
            _this.mainData = response.data
            _this.loadingState = false
            _this.setTable(response.data)
           _this.dialog = true
            qRampStore().setFlightNumberField(name);
          } else if (response.status == 204) {
            const message = _this.$tr("ifly.cms.label.flightMessage").replace("#file_number", criteria);
            _this.$alert.warning({
              mode:'modal',
              title: _this.$tr('ifly.cms.form.flight'),
              message,
              actions: [
                {label: _this.$tr('isite.cms.label.cancel'), color: 'grey-8'},
                {
                  label: _this.$tr('isite.cms.label.yes'),
                  color: 'primary',
                  handler: () => {
                    _this.validateBound(name);
                  }
                },
              ]
            })
          }
        }).catch(error => {
          _this.resetBound();
          this.loadingState = false;
          this.$alert.error({message: this.$tr("ifly.cms.message.errorlookingForFlight") });
          console.log('error', error)
        })
      },1500) 
    },
    validateBound(name) {
      if(!name) return;
      this.form.outboundCustomFlightNumber = true
      qRampStore().showFielFlightBoundFormStatus();
      this.form.inboundCustomFlightNumber= true
      this.dialog = false;
    },
    setForm(data) {
      this.refresh = 0
      const {
        ident,
        destinationAirport,
        estimatedOff,
        registration,
        originAirport,
        estimatedOn,
        gateDestination,
        gateOrigin,
        actualIn,
        actualOut,
      } = data;
      if(!this.isbound[0] && this.isbound[1]){
        const destinationAirportId = destinationAirport?.id || null;
        this.$set(this.form, "outboundFlightNumber", ident)
        this.$set(this.form, "outboundDestinationAirportId", destinationAirportId)
        this.$set(this.form, "outboundScheduledDeparture",  this.dateFormatterFull(estimatedOff))
        this.$set(this.form, "outboundTailNumber", registration)
        if(this.isPassenger) this.$set(this.form, "inboundGateArrival", gateDestination);
      } 
      if(this.isbound[0] && !this.isbound[1]) {
        this.$set(this.form, "inboundFlightNumber", ident)
        const originAirportId = originAirport?.id || null;
        this.$set(this.form, "inboundOriginAirportId", originAirportId)
        this.$set(this.form, "inboundScheduledArrival", this.dateFormatterFull(estimatedOn))
        this.$set(this.form, "inboundTailNumber", registration)
        if(this.form.outboundTailNumber) {
          this.$set(this.form, "outboundTailNumber", registration);
        }
        if(this.isPassenger) this.$set(this.form, "outboundGateDeparture", gateOrigin);
      }
      if(this.isbound[0] && this.isbound[1]) {
        if(this.name.includes('inboundFlightNumber')) {
          const destinationAirportId = destinationAirport?.id || null;
          this.$set(this.form, "outboundFlightNumber", ident)
          this.$set(this.form, "outboundDestinationAirportId", destinationAirportId)
          this.$set(this.form, "outboundScheduledDeparture",  this.dateFormatterFull(estimatedOff))
          this.$set(this.form, "outboundTailNumber", registration)
          if(this.isPassenger) this.$set(this.form, "outboundGateDeparture", gateOrigin);
          if(this.isPassenger) this.$set(this.form, "inboundGateArrival", gateDestination);
          this.$set(this.form, "inboundFlightNumber", ident)
          const originAirportId = originAirport?.id || null;
          this.$set(this.form, "inboundOriginAirportId", originAirportId)
          this.$set(this.form, "inboundScheduledArrival", this.dateFormatterFull(estimatedOn))
          this.$set(this.form, "inboundTailNumber", registration)
          if(this.form.outboundTailNumber) {
            this.$set(this.form, "outboundTailNumber", registration);
          }
        } else {
          const destinationAirportId = destinationAirport?.id || null;
          this.$set(this.form, "outboundFlightNumber", ident)
          this.$set(this.form, "outboundDestinationAirportId", destinationAirportId)
          this.$set(this.form, "outboundScheduledDeparture",  this.dateFormatterFull(estimatedOff))
          this.$set(this.form, "outboundTailNumber", registration)
          if(this.isPassenger) this.$set(this.form, "inboundGateArrival", gateDestination);
        }
      }
      if(this.isPassenger) {
        this.$set(this.form, "inboundBlockIn", this.dateFormatterFull(actualIn))
        this.$set(this.form, "outboundBlockOut", this.dateFormatterFull(actualOut))
        this.changeDate({
            name: 'outboundBlockOut'
        });
        
      }
      qRampStore().validateStatusSelectedFlight(data);
    },
    setDataTable({select, dialog}) {
      this.dialog = dialog
      this.form.faFlightId = select.faFlightId || null;
      this.setForm(this.mainData.find((item,index) => {
        return index === select.index 
      }))
    },
    dateFormatterFull(date) {
      if (!date) return null
      const formDate = date.split("T")
      const [year, month, day] = formDate[0].substr(0, 10).split('-')
      const [hr, mm] = formDate[1].substr(0, 5).split(':')
      return `${month}/${day}/${year} ${hr}:${mm}`
    },
    setTable(data) {
      try {
        this.dataTable = qRampStore().getTableListOfFlights(data);
      } catch (error) {
        this.dataTable = [];
        console.log(error);
      }
    }, 
    validateSpecialCharacters(val) {
      if(/[^a-zA-Z0-9-]/.test(val)) {
        return this.$tr('isite.cms.message.specialCharactersAreNotAllowed');
      }
      return !!val || this.$tr('isite.cms.message.fieldRequired');
    },
    setCustomerForm() {
      const selectCustomers = this.selectCustomers === null || 
      this.selectCustomers === undefined || 
      this.selectCustomers === '' ? {} : this.selectCustomers;
      this.form.customerId = selectCustomers.id || null;
      const customCustomerName = selectCustomers.label || null;
      this.form.customCustomerName = this.form.customerId ? null : customCustomerName;
      this.form.contractId = selectCustomers.contractId || null;
      qRampStore().setContractId(this.form.contractId);
      const message = this.form.contractId 
        ? `${this.$tr('ifly.cms.message.selectedCustomerWithContract')}` 
        : this.$tr('ifly.cms.message.selectedCustomerWithoutContract');
       
      this.bannerMessage =  selectCustomers && this.form.customerId !== null && !this.form.contractId ? message : null;
      this.form.adHoc = this.form.contractId ? false : true;
      this.form.customCustomer = this.form.contractId ? false : true;
    },
    setCustomerName(query) {
      this.customerName = query !== '' ? query : '';
    },
    addCustumers() {
      if(this.customerName !== '') {
        const id = `customer-${this.numberInRange(8000, 1000)}`;
        this.newCustumerAdHoc = [{id, label: this.customerName}];
        this.form.adHoc = true;
        this.form.customCustomer = true;
        this.bannerMessage =  this.$tr('ifly.cms.message.requestNewCustomer');
        this.selectCustomerComputed = {
          id,
          value: this.customerName,
          label:  this.customerName,
        }
        this.form.customCustomerName = this.customerName;
        this.form.customerId = null;
        this.form.contractId = null;
        this.customerName = '';
        return;
      }
      this.$alert.error({message: this.$tr('ifly.cms.message.orderaddNewrecord')});
    },
    numberInRange(max, min) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
    getCustomerList() {
      return new Promise(async(resolve) => {
        const businessUnitId = this.isPassenger ? { businessUnitId : BUSINESS_UNIT_PASSENGER } : { businessUnitId: BUSINESS_UNIT_RAMP };
        const custemerParams = {
            params: {
              filter: {
                withoutContracts: true,
                adHocWorkOrders: true,
                customerStatusId: 1,
                companyId: this.filterCompany,
              }
            },
        }
        const contractParams = {
            params: {
              filter: {
                contractStatusId: 1,
                ...businessUnitId,
              }
            },
        }
        const customersData = await Promise.all([
          this.$crud.index('apiRoutes.qramp.setupCustomers', custemerParams),
          this.$crud.index('apiRoutes.qramp.setupContracts', contractParams)
        ]);
        const customerList = factoryCustomerWithContracts(customersData, this.allowContractName);

        return resolve(customerList);
      })
    },
    handleScroll(event) {
      if(this.$refs.customerId || this.$refs.customerId.length > 0) {
        if(this.$refs.customerId.some(item => item.tooltip)) {
          this.$refs.customerId[0].tooltip = false;
        }
      }
    },
    resetBound() {
      this.form.outboundCustomFlightNumber = false
      this.form.inboundCustomFlightNumber= false
    },
    resetField(key = '') {
      if(key === 'stationId') {
        this.form.gateId = null;
        return;
      }
      if(!this.form.operationTypeId) return;
      this.$refs.myForm.reset();
      const data = {
          destinationAirport: {
            id: this.form.inboundOriginAirportId,
          },
          registration: this.form.inboundTailNumber,
          outRegistration: this.form.outboundTailNumber,
          originAirport: {
            id: this.form.outboundDestinationAirportId,
          },
          estimatedOff: this.form.outboundScheduledDeparture,
          estimatedOn:  this.form.inboundScheduledArrival,
        }
      qRampStore().validateStatusSelectedFlight(data);
      this.resetBound();
    },
    validateDate(dateTime, dateMin = null) {
        const date = this.form.inboundScheduledArrival 
          ? this.$moment(this.form.inboundScheduledArrival) : this.$moment();
        const today = date.format('YYYY/MM/DD');
        const hour = date.format('H');
        const min = date.format('mm');
        const validateDate = today === this.$moment(this.form.inboundBlockIn).format('YYYY/MM/DD');
        if (isNaN(dateTime)) {
            return dateTime <= this.$moment().format('YYYY/MM/DD') && dateTime >= today;
        }
        if(dateMin) {
            return validateDate ? Number(dateMin) <= min : true;
        }
        return validateDate ? dateTime <= hour : true;
    },
    validateDateOutboundBlockOut(dateTime, dateMin = null) {
      const outboundScheduledDepartureDate = this.form.outboundBlockOut 
          ? this.$moment(this.form.outboundBlockOut) : this.$moment();    
      const today = outboundScheduledDepartureDate.format('YYYY/MM/DD');  
      const inboundBlockIn = this.form.inboundBlockIn 
          ? this.$moment(this.form.inboundBlockIn) : this.$moment();    
      const todayIn =  inboundBlockIn.format('YYYY/MM/DD')  
      const hourIn = inboundBlockIn.format('H');
      const minIn = inboundBlockIn.format('mm');
      const validateDate = today === todayIn;

      if (isNaN(dateTime)) {    
        if(this.form.inboundBlockIn) {
          return dateTime <= this.$moment().format('YYYY/MM/DD') 
          && dateTime >= todayIn;
        }
        return dateTime <= this.$moment().format('YYYY/MM/DD') 
        && dateTime >= today;
      }
      if(dateMin) {
        return validateDate ? Number(dateMin) >= Number(minIn) : true;
      }
      return validateDate ? Number(dateTime) >= Number(hourIn) : true;
    },
    changeDate(field) {
      if(field.name === 'outboundBlockOut' && this.form.outboundBlockOut !== null) {
        this.differenceHour = qRampStore().getDifferenceInHours(this.form.inboundBlockIn, this.form.outboundBlockOut);
      }
    },
    optionResponsible(item) {
      return item ? [{id: String(item.id), label: item.fullName, value: item.id}]: [];
    },
    zanetizeData(key) {
        this.completeFormInbound = this.validateInbound('inboundLeft');
        this.completedFormOutBound = this.validateInbound('outboundRight');  
        if(key === 'inboundFlightNumber' || key === 'outboundFlightNumber') {
          if(this.form[key]) {
            this.form[key] = this.form[key].toUpperCase().replace(/\s+/g, '');
          }
        }
    },
    validateInbound(keyForm) {
      const dataForm = [];
      Object.keys(this.formFields[keyForm]).forEach(key => {
        dataForm.push(this.checkIfDataArrives(this.form[key]));
      });
      if(!this.isPassenger) {
        dataForm.pop();
      }
      return dataForm.every(item => item === true);
    },
  },
}
</script>

<style lang="stylus" scoped>
  #formFlyStep
    #origin
      padding-bottom 0px
    hr.label-container
      position relative
      bottom 20px
      border-top 1px dashed #000D4726
      z-index 1
    .span 
      padding-bottom 10px
    .spanBottom
      padding-bottom 15px
    .card-bound
      border: 1px solid #f1f4fa;
      border-radius: 8px 8px 0px 0px; 
</style>