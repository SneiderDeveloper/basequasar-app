<template>
  <div>
    <q-form ref="ruleForm" id="ruleForm">
      <dynamic-field
          key="contractRuleType"
          id="contractRuleType"
          :field="type"
          class="col-12"
          v-model="form.type"

      />
      <dynamic-field
          key="contractRuleStatus"
          id="contractRuleStatus"
          :field="status"
          class="col-12"
          v-model="form.status"

      />
      <dynamic-field
          key="contract"
          id="contract"
          :field="contractField"
          class="col-12"
          v-model="form.contractId"
          v-if="!GLOBAL_RULES.includes(this.form.type)"
      />
    </q-form>
    <component ref="ruleComponent" :is="ruleComponent" :contractId="form.contractId" :form="form" v-model="form"/>

    <!--Actions-->
    <div class="box box-auto-height row justify-end">
      <q-btn v-for="(action, keyAction) in formActions" :key="keyAction" v-bind="action"
             unelevated rounded no-caps @click="save()" type="button"

             v-if="action.vIf != undefined ? action.vIf : true"/>
      <inner-loading :visible="loading"/>
    </div>
  </div>
</template>
<script>

import {RULE_TYPES, GLOBAL_RULES} from '../../_components/model/constants'
import included from '../../_components/contractRules/included.vue'
import parking from '../../_components/contractRules/parking.vue'
import aircraftType from '../../_components/contractRules/aircraftType.vue'
import operationType from '../../_components/contractRules/operationType.vue'
import cargoKilos from '../../_components/contractRules/cargoKilos.vue'
import qSetupStore from "../../_store/qSetupStore.js";

export default {
  beforeDestroy() {
    this.$root.$off('page.data.refresh')
  },
  props: {
    value: {default: true},
    update: {default: false},
    row: {default: false},
  },
  components: {
    included,
    parking,
    aircraftType,
    operationType,
    cargoKilos
  },
  watch: {},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      GLOBAL_RULES,
      loading: false,
      data: [],
      form: {
        id: null,
        status: true,
        type: null,
        productOriginId: null,
        contractLineId: null,
        contractId: null,
        quantityRule: null,
        options: null
      },
      status: {
        name: 'status',
        value: true,
        type: 'select',
        props: {
          rules: [
            val => !!val || this.$tr('isite.cms.message.fieldRequired')
          ],
          label: 'Status',
          options:[
            {label: 'Active', value: true},
            {label: 'Inactive', value: false}
          ],
          color: "primary"
        },

      },
      type: {
        name: 'type',
        value: null,
        type: 'select',
        props: {
          rules: [
            val => !!val || this.$tr('isite.cms.message.fieldRequired')
          ],
          readonly: this.update,
          outlined: !this.update,
          borderless: this.update,
          label: "Rule Type",
          clearable: true,
          color: "primary",
          options: RULE_TYPES
        },
      },
    }
  },
  computed: {
    contractField() {
      return {
          name: 'contractId',
          value: this.contractId,
          type: 'select',
          props: {
            rules: [
              val => !!val && !GLOBAL_RULES.includes(this.form.type) || this.$tr('isite.cms.message.fieldRequired')
            ],
            label: 'Contract',
            clearable: true,
            color: "primary",
            readonly: this.contractId === 0 ? false : true
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qsetupagione.contracts',
            select: {label: 'contractName', id: 'id'},
            requestParams: {filter: {}}
          }
      }
    },
    ruleComponent() {

      let component = this.type.props.options.find(opt => (opt.value == this.form.type))
      if (component) return component.component;
      return null;

    },
    contractId() {
      return qSetupStore().getContractId();
    },
    //Step actions
    formActions() {
      //Validate if is last step

      //Default actions config
      let actions = {

        submit: {
          color: "green",
          icon: "fas fa-save",
          label: this.$tr('isite.cms.label.save'),
          ...({}),
          action: () => this.save()
        },
      }

      //Response
      return [actions.submit]
    },
  },
  methods: {
    init() {
      if (this.row) {
        let dataToUpdate = this.$clone(this.row)
        this.form.id = dataToUpdate.id;
        this.form.status = dataToUpdate.status;
        this.form.type = dataToUpdate.type;
        this.form.productOriginId = dataToUpdate.productOriginId;
        this.form.contractLineId = dataToUpdate.contractLineId;
        this.form.contractId = dataToUpdate.contractId;
        this.form.quantityRule = dataToUpdate.quantityRule;
        this.form.options = dataToUpdate.options;
      }
      if (this.contractId) this.form.contractId = this.$clone(this.contractId)
      console.log(this.contractId);
      //this.getData()
    },

    save() {
      const route = 'apiRoutes.qramp.contractRules';
      this.loading = true;
      this.$emit('loading', true)
      this.$refs.ruleForm.validate().then(async success => {
        if (success) {
          // yay, first form are correct
          //validating the subForm
          let subFormValidateResult = await this.$refs.ruleComponent.validateForm()
          if (subFormValidateResult) {

            // yay, sub form are correct
            const request = this.update ? this.$crud.update(route, this.form.id, this.form)
                : this.$crud.create(route, this.form);
            request.then(res => {

              const message = this.update ? `${this.$tr('isite.cms.message.recordUpdated')}`
                  : `${this.$tr('isite.cms.message.recordCreated')}`;
              this.$alert.info({message})

              this.$root.$emit('crud.data.refresh')
              this.$emit('close', false)
              this.$emit('loading', false)
              this.loading = false;
            })
                .catch(err => {
                  this.loading = false;
                  this.$emit('loading', false)
                  this.$alert.error({message: `${this.$tr('isite.cms.message.recordNoUpdated')}`})
                  console.log('SEND INFO ERROR:', err)
                })

          }else{
            this.loading = false;
            this.$emit('loading', false)
          }

        } else {
          this.loading = false;
          this.$emit('loading', false)
          // at least one invalid value
          this.$alert.error({message: this.$tr('isite.cms.message.formInvalid')})

        }


      })

    },
    //Get data
    getData(refresh = false) {
      return new Promise((resolve, reject) => {
        this.loading = true
        //Request params
        let requestParams = {
          refresh: refresh
        }
        //Request
        this.$crud.index('apiRoutes', requestParams).then(response => {
          this.data = response.data
          this.loading = false
        }).catch(error => {
          this.loading = false
        })
      })
    }
  }
}
</script>
<style lang="stylus">
</style>
