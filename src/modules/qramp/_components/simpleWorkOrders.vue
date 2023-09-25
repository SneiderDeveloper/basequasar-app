<template>
  <div>
    <table-flight
        @cancel="dialog = $event"
        :dialog="dialog"
        :dataTable="dataTable"
        @flightSelect="setDataTable($event)"
        @validateBound="addmanually"
    />
    <q-form
        ref="formSimpleWorkOrders"
        id="simpleWordOrder"
        class="
        tw-px-8
        tw-pt-8
        tw-pb-10
        tw-my-4
        tw-mx-8
        tw-mb-32
        tw-border
        tw-border-gray-200
        tw-rounded-lg
      "
    >
      <div
          class="col-12 col-md-6"
          v-for="(field, keyField) in fields.form"
          :key="keyField"
      >
        <div v-if="keyField == 'customerId'">
          <dynamic-field
              v-if="bannerMessage"
              class="q-mb-md"
              :field="fields.banner"
          />
          <dynamic-field
              :field="field"
              v-model="selectCustomerComputed"
              @input="setCustomerForm(keyField)"
              @filter="setCustomerName"
              ref="customerId"
          >
            <div slot="before-options">
              <div class="q-py-md q-px-md" @click="addCustumers">
                <div class="row cursor-pointer">
                  <div class="q-pr-md">
                    <q-btn
                        push
                        color="primary"
                        round
                        icon="fas fa-plus"
                        size="xs"
                    />
                  </div>
                  <div class="q-py-xs">
                    <label class="cursor-pointer">{{
                        $tr("ifly.cms.label.createNewCustomer")
                      }}</label>
                  </div>
                </div>
              </div>
            </div>
          </dynamic-field>
        </div>
        <div v-else>
          <dynamic-field
              :key="keyField"
              :id="keyField"
              :field="field"
              v-model="form[keyField]"
              @enter="search(field)"
              @input="zanetizeData(keyField)"
          />
        </div>
      </div>
    </q-form>
  </div>
</template>
<script>
import qRampStore from "../_store/qRampStore.js";
import tableFlight from "../_components/modal/tableFlight.vue";
import fieldsSimpleWorkOrders from './model/fieldsSimpleWorkOrders.js'
import {
  BUSINESS_UNIT_PASSENGER, 
  BUSINESS_UNIT_RAMP, 
  STATUS_DRAFT,
  COMPANY_PASSENGER,
  COMPANY_RAMP,
  modelWorkOrder
} from './model/constants.js';
import cacheOffline from '@imagina/qsite/_plugins/cacheOffline.js';
import workOrderList from '../_store/actions/workOrderList.ts'


export default {
  components: {
    tableFlight,
  },
  data() {
    return {
      newCustumerAdHoc: [],
      form: {
        customerId: null,
        contractId: null,
        preFlightNumber: null,
        stationId: null,
        adHoc: null,
        customCustomerName: null,
        customCustomer: null,
        faFlightId: null,
        statusId: STATUS_DRAFT
      },
      bannerMessage: null,
      selectCustomers: "",
      customerName: null,
      loadingState: false,
      dataTable: [],
      dialog: false,
      loading: false,
      acceptSchedule: false,
    };
  },
  mixins: [
    fieldsSimpleWorkOrders
  ],
  inject: ["showWorkOrder", "closeModal"],
  computed: {
    isAppOffline() {
      return this.$store.state.qofflineMaster.isAppOffline;
    },
    selectCustomerComputed: {
      get() {
        return this.selectCustomers;
      },
      set(value) {
        this.selectCustomers = value;
      },
    },
    disabledReadonly() {
      return qRampStore().disabledReadonly();
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
    zanetizeData(key) {
      if (key === 'preFlightNumber') {
        this.form[key] = this.form[key].toUpperCase().replace(/\s+/g, '');
      }
    },
    addCustumers() {
      if (this.customerName !== "") {
        const id = `customer-${qRampStore().numberInRange(8000, 1000)}`;
        this.newCustumerAdHoc = [{id, label: this.customerName}];
        this.form.adHoc = true;
        this.form.customCustomer = true;
        this.bannerMessage = this.$tr("ifly.cms.message.requestNewCustomer");
        this.selectCustomerComputed = {
          id,
          value: this.customerName,
          label: this.customerName,
        };
        this.form.customCustomerName = this.customerName;
        this.form.customerId = null;
        this.form.contractId = null;
        this.customerName = "";
        return;
      }
      this.$alert.error({
        message: this.$tr("ifly.cms.message.orderaddNewrecord"),
      });
    },
    setCustomerForm(key) {
      if (key !== "customerId") return;
      const selectCustomers =
        this.selectCustomers === null || 
        this.selectCustomers === undefined ||
        this.selectCustomers === "" ? {} : this.selectCustomers;
      this.form.customerId = selectCustomers.id || null;
      const customCustomerName = selectCustomers.label || null;
      this.form.customCustomerName = this.form.customerId
        ? null
        : customCustomerName;
      this.form.contractId = selectCustomers.contractId || null;
      const message = this.form.contractId
        ? `${this.$tr("ifly.cms.message.selectedCustomerWithContract")}`
        : this.$tr("ifly.cms.message.selectedCustomerWithoutContract");
      this.bannerMessage =
        selectCustomers && !this.form.contractId ? message : null;
      this.form.adHoc = this.form.contractId ? false : true;
      this.form.customCustomer = this.form.contractId ? false : true;
    },
    setCustomerName(query) {
      this.customerName = query || "";
    },
    saveSimpleWorkOrder() {
      this.$refs.formSimpleWorkOrders.validate().then(async (success) => {
        if (success) {
          if (this.isAppOffline || this.acceptSchedule || this.form.faFlightId) {
            await this.messageWhenFlightIsNotChosen();
            return;
          }

          if ((!this.form.faFlightId || !this.acceptSchedule) && !this.isAppOffline) {
              this.search({type: 'search'});
              return;
          }

        } else {
          this.$alert.error({
            message: this.$tr("isite.cms.message.formInvalid"),
          });
          this.$emit("isError", true);
        }
      });
    },
    async messageWhenFlightIsNotChosen() {
      if (this.acceptSchedule) {
        this.$alert.warning({
          mode: "modal",
          message: `Are you sure to create this Work Order with an unscheduled flight number: ${this.form.preFlightNumber}?`,
          actions: [
            {
              label: 'Ok',
              color: 'positive',
              handler: async () => {
                await this.orderConfirmationMessage();
                this.acceptSchedule = false;
              }
            },
          ],
        });
        return;
      }
      await this.orderConfirmationMessage();
    },
    async orderConfirmationMessage() {
      this.$emit('loading', true);
      let response = await this.saveRequestSimpleWorkOrder();
      await this.$alert.info({
        mode: "modal",
        title: '',
        message: 'What do you want to do?',
        modalWidth: '600px',
        actions: [
          {
            label: 'Go out to the list',
            color: 'grey-6',
            handler: async () => {
              await this.closeModal();
            }
          },

          {
            label: 'Continue editing',
            color: "light-blue-7",
            handler: async () => {
              await this.showWorkOrder(response.data);
              this.acceptSchedule = false;
              this.$root.$emit('crud.data.refresh');
            },
          },
          {
            label: 'Create a new one',
            color: 'positive',
            handler: () => {
              this.resetForm();
            }
          },
        ],
      });
      this.$emit('loading', false);
    },
    search({type}) {
      if(!this.isAppOffline) {
        if (
            type != "search" &&
            (this.form.preFlightNumber !== "" || this.form.preFlightNumber !== null)
        )
          return;
        const params = {
          refresh: true,
          params: {
            filter: {search: this.form.preFlightNumber.toUpperCase()},
          },
        };
        this.loadingState = true;
        //Request
        this.$crud
            .index("apiRoutes.qfly.flightaware", params)
            .then((response) => {
              this.responseStatus(response);
            })
            .catch((error) => {
              this.loadingState = false;
              this.$alert.error({message: this.$tr("ifly.cms.message.errorlookingForFlight")})
              console.log(error);
            });
      }
    },
    setDataTable({select, dialog}) {
      this.form.faFlightId = select.faFlightId || null;
      this.dialog = dialog;
      this.acceptSchedule = false;
    },
    addmanually() {
      this.form.faFlightId = null;
      this.dialog = false;
      this.acceptSchedule = true;
      ;
    },
    async saveRequestSimpleWorkOrder() {
      try {
        qRampStore().showLoading();
        console.log("Aquí ?")
        const businessUnitId = this.isPassenger ? { businessUnitId : BUSINESS_UNIT_PASSENGER } : {};
        const offlineId = 'work-order-' + this.$uid();
        const dataForm = {
              ...this.form, 
              offlineId, 
              titleOffline: qRampStore().getTitleOffline(), 
              companyId: this.filterCompany,
              ...businessUnitId,
        };
        const response = await this.$crud.create(
            "apiRoutes.qramp.simpleWorkOrders",dataForm,
        ).catch(error => {
          qRampStore().hideLoading();
        });
        if(this.isAppOffline) {
          const offlineWorkOrder = {
            ...modelWorkOrder,
            stationId: Number(this.form.stationId),
            customerId: Number(this.form.customerId),
            inboundFlightNumber: this.form.preFlightNumber,
            outboundFlightNumber: this.form.preFlightNumber,
            offline: this.isAppOffline,
            id: offlineId
          };
          cacheOffline.addNewRecord("apiRoutes.qramp.workOrders", offlineWorkOrder);
        }else{
          console.log("GET WO")
          await workOrderList().getWorkOrders(true, true)
        }
        qRampStore().hideLoading();
        
        return this.isAppOffline ? {data: {...modelWorkOrder, ...dataForm, id: offlineId } } : response;
      } catch (error) {
        qRampStore().hideLoading();
        console.error(error);
      }
    },
    responseStatus(response) {
      this.dataTable = [];
      this.acceptSchedule = false;
      if (response.status == 200) {
        this.dataTable = qRampStore().getTableListOfFlights(response.data);
        this.dialog = true;
      }
      if (response.status == 204) {
        const message = this.$tr("ifly.cms.label.flightMessage").replace("#file_number", this.form.preFlightNumber)
        this.$alert.warning({
          mode: "modal",
          title: this.$tr("ifly.cms.form.flight"),
          message,
          actions: [
            {label: this.$tr('isite.cms.label.cancel'), color: 'grey-8'},
            {
              label: this.$tr("isite.cms.label.yes"),
              color: "primary",
              handler: () => {
                this.acceptSchedule = true;
                this.form.faFlightId = null;
              },
            },
          ],
        });
      }
      this.loadingState = false;
    },
    resetForm() {
      this.form = {
        customerId: null,
        contractId: null,
        preFlightNumber: null,
        stationId: null,
        adHoc: null,
        customCustomerName: null,
        customCustomer: null,
        faFlightId: null,
        statusId: STATUS_DRAFT,
      }
      this.newCustumerAdHoc = [];
      this.bannerMessage = null;
      this.selectCustomers = "";
      this.customerName = null;
      this.loadingState = false;
      this.dataTable = [];
      this.dialog = false;
      this.loading = false;
      this.acceptSchedule = false;
      this.$refs.formSimpleWorkOrders.reset();
    }
  },
};
</script>
