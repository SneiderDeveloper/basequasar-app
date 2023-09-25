<template>
  <div id="cargoContainer" class="tw-mb-20">
    <!-- toolbar -->
    <div class="tw-grid tw-gap-10 tw-grid-cols-1 lg:tw-grid-cols-2 tw-p-4 md:tw-p-10">
      <div class=" ">
        <div :class="`${readonly? '' :'card-bound'}`">
          <div class="text-primary tw-rounded-t-md tw-text-base boundColor tw-p-2 text-center text-weight-bold">
            <div>Inbound</div>
          </div>
          <div class="q-pa-md">
            <template v-for="(field, keyField) in formFields.inbound" >
              <label id="labelInput" :key="keyField" class="row items-center justify-end no-wrap">
                <p 
                  class="text-primary text-right md:tw-text-base span q-mr-sm col-5"
                  v-if="field.props.vIf"
                >
                  <span>{{field.label}}</span>
                  <span v-if="readonly">:</span>
                </p>
                <dynamic-field
                  class="col-7"
                  :field="field"
                  v-model="form[field.name || keyField]" 
                />
              </label>
              <hr v-if="readonly" class="label-container"/>
            </template>
          </div>
        </div>
      </div>
      <div class=" ">
        <div :class="`${readonly? '' :'card-bound'}`">
          <div class="text-primary tw-rounded-t-md tw-text-base boundColor tw-p-2 text-center text-weight-bold">
            <div>Outbound</div>
          </div>
          <div class="q-pa-md">
            <template v-for="(field, keyField) in formFields.outbound" >
              <label id="labelInput" :key="keyField" class="row items-center justify-end no-wrap">
                <p 
                  class="text-primary text-right md:tw-text-base span q-mr-sm col-5"
                  v-if="field.props.vIf"
                >
                  {{field.label}}
                  <span v-if="readonly">:</span>
                </p>
                <dynamic-field
                  class="col-7"
                  :field="field"
                  v-model="form[field.name || keyField]" 
                />
              </label>
              <hr v-if="readonly" class="label-container"/>
            </template>
          </div>
        </div>
      </div>
    </div>
    <delayComponent />
  </div>
</template>

<script>
import responsive from '../../_mixins/responsive.js'
import qRampStore from '../../_store/qRampStore.js'
import cargoStore from './store/cargo.ts';
import {
  BUSINESS_UNIT_PASSENGER, 
  BUSINESS_UNIT_RAMP,
  COMPANY_PASSENGER,
  COMPANY_RAMP
} from '../model/constants.js'
import delayComponent from './delayComponent.vue'

export default {
  components: {
    delayComponent,
  },
  props:{
    readonly: true,
  },
  mixins:[responsive],
  data(){
    return{
      codeList: [],
    }
  },
  computed:{
    isPassenger() {
      return qRampStore().getIsPassenger();
    },
    filterBusinessUnit() {
      return this.isPassenger ? BUSINESS_UNIT_PASSENGER : BUSINESS_UNIT_RAMP;
    },
    filterCompany() {
      return this.isPassenger ? COMPANY_PASSENGER : COMPANY_RAMP;
    },
    disabledReadonly() {
      return qRampStore().disabledReadonly();
    },
    form() {
      return cargoStore().getForm();
    },
    showKilosFiels() {
      const contractsWithKilosFiels = this.$store.getters['qsiteApp/getSettingValueByName']('setup::contractsWithKilosFiels');
      return contractsWithKilosFiels.some((item) => item === qRampStore().getContractId());
    },
    formFields() {
      return {
        inbound:{
          inboundCargoTotalUldsUnloaded:{
            value: '',
            type: 'inputStandard',
            props: {
              vIf: true,
              mask:'###################',
              readonly: this.readonly || this.disabledReadonly,
              outlined: !this.readonly,
              borderless: this.readonly
            },
            label: `${this.$tr('ifly.cms.form.TotalUldsUnloaded')}`,
          },
          inboundCargoBulkUnloaded:{
            value: '',
            type: 'inputStandard',
            props: {
              vIf: true,
              mask:'###################',
              readonly: this.readonly || this.disabledReadonly,
              outlined: !this.readonly,
              borderless: this.readonly
            },
            label: `${this.$tr('ifly.cms.form.BulkUnloaded')}`,
          },
          cargoTotalKilosUnloaded:{
            value: '',
            type: 'inputStandard',
            props: {
              vIf: this.showKilosFiels,
              mask:'###################',
              readonly: this.readonly || this.disabledReadonly,
              outlined: !this.readonly,
              borderless: this.readonly
            },
            label: `${this.$tr('ifly.cms.form.cargoTotalKilosUnloaded')}`,
          },
        },
        outbound:{
          outboundCargoTotalUldsLoaded:{
            value: '',
            type: 'inputStandard',
            props: {
              vIf: true,
              mask:'###################',
              readonly: this.readonly || this.disabledReadonly,
              outlined: !this.readonly,
              borderless: this.readonly
            },
            label: `${this.$tr('ifly.cms.form.TotalUldsLoaded')}`,
          },
          outboundCargoBulkLoaded:{
            value: '',
            type: 'inputStandard',
            props: {
              vIf: true,
              mask:'###################',
              readonly: this.readonly || this.disabledReadonly,
              outlined: !this.readonly,
              borderless: this.readonly
            },
            label: `${this.$tr('ifly.cms.form.BulkLoaded')}`,
          },
          cargoTotalKilosLoaded:{
            value: '',
            type: 'inputStandard',
            props: {
              vIf: this.showKilosFiels,
              mask:'###################',
              readonly: this.readonly || this.disabledReadonly,
              outlined: !this.readonly,
              borderless: this.readonly
            },
            label: `${this.$tr('ifly.cms.form.cargoTotalKilosLoaded')}`,
          },
        }
      }
    },
  },
}
</script>

<style scoped>
.span {
  padding-bottom: 22px;
}
        
</style>