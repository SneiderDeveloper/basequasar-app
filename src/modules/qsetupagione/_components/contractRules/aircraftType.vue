<template>
  <div id="aircraftTypeRuleComponent">
    <q-form ref="aircraftTypeRuleForm" id="aircraftTypeRuleForm">
      <dynamic-field
          v-for="(field,index) in formFields"
          :key="'aircraftTypeContractRuleField'+index+field.name"
          :id="'aircraftTypeContractRuleField'+index+field.name"
          :field="field"
          class="col-12"
          v-model="form[field.name]"
      />

      <div class="full-width q-px-md">
        <q-item-label>
          Aircraft Type Options
          <q-btn class="q-ml-sm" flat round icon="add" color="primary" @click="addAcTypes()"/>
        </q-item-label>

      </div>
      <div flat class="row">
        <template v-for="(field,keyField) in aircraftTypesFields">
          <dynamic-field
              class="col-12 col-md-5 q-pr-sm"
              :key="keyField"
              :field="field"
              v-model="acTypesList[keyField.includes('acTypes') ? keyField.split('acTypes')[1] : keyField.split('contractLineId')[1]][keyField.includes('contractLineId') ? 'contractLineId' : 'acTypes']"
          />

          <q-btn
              v-if="ifDelButton(field, keyField)"
              style="width: 40px; height:38px"
              class="col-12 btn-stick col-md-1"
              round icon="delete" flat
              size="12px"
              color="primary"
              @click="delAcType(keyField)"
          />
        </template>
      </div>
    </q-form>

  </div>
</template>
<script>
export default {
  beforeDestroy() {
    this.$root.$off('page.data.refresh')
  },
  props: {
    form: {
      default: {
        type: null,
        status: true,
        productOriginId: null,
        contractLineId: null,
        contractId: null,
        quantityRule: null,
        options: {acTypesRules: []}
      }
    },
    contractId: {default: null},
  },
  components: {},
  watch: {},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      loading: false,
      data: {
        quantityRule: null,
        serviceOriginId: null,
        contractLineId: null,
        options: null
      },
      acTypesList: [
        {
          acTypes: [],
          contractLineId: null
        },
      ],
    }
  },
  computed: {
    formFields(){
      return [
        {
          name: 'contractLineId',
          value: null,
          type: 'select',
          props: {
            rules: [
              val => !!val || this.$tr('isite.cms.message.fieldRequired')
            ],
            label: 'Default Contract Line',
            clearable: true,
            color: "primary"
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qsetupagione.contractLines',
            select: {label: 'fullName', id: 'id'},
            requestParams: {
              filter: {
                workdayContractLineStatus: {operator: "!=", value: "COMPLETE"},
                contractId: this.contractId
              }
            }
          }
        },
      ]
    },

    aircraftTypesFields() {
      const obj = {}
      this.acTypesList.forEach((acType, index) => {
        obj['acTypes' + index] = {
          value: [],
          type: 'select',
          props: {
            label: 'Aircraft Types',
            rules: [
              val => val.length || this.$tr('isite.cms.message.fieldRequired')
            ],
            multiple: true,
            useChips: true,
            clearable: true,
            color: "primary",
            'hide-bottom-space': false
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qfly.aircraftTypes',
            select: {label: 'fullName', id: 'id'},
            requestParams: {filter: {}}
          },
          label: 'Aircraft Types',
        }
        obj['contractLineId' + index] = {
          name: 'contractLineId',
          value: null,
          type: 'select',
          props: {
            rules: [
              val => !!val || this.$tr('isite.cms.message.fieldRequired')
            ],
            label: 'Contract Line',
            clearable: true,
            color: "primary"
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qsetupagione.contractLines',
            select: {label: 'fullName', id: 'id'},
            requestParams: {
              filter: {
                workdayContractLineStatus: {operator: "!=", value: "COMPLETE"},
                contractId: this.contractId
              }
            }
          }
        }
      })
      return obj
    },

  },
  methods: {
    init() {
      if (this.form.options && this.form.options.acTypesRules) {
        this.acTypesList = this.form.options.acTypesRules
      }
    },
    ifDelButton(field, keyField) {
      return !keyField.includes('0') && !keyField.includes('acTypes')
    },
    addAcTypes() {
      this.acTypesList.push({
        acTypes: [],
        contractLineId: null
      })
    },
    delAcType(index) {
      const i = parseInt(index.slice(-1))
      this.acTypesList.splice(i, 1)
    },
    resetAcTypesList() {
        this.acTypesList = [];
        this.addAcTypes();
    },

    validateForm() {
      return new Promise((resolve, reject) => {
        this.$refs.aircraftTypeRuleForm.validate().then(success => {
          if (success) {
            // yay, models are correct
            this.data = this.$clone(this.form)
            this.data.options = {acTypesRules: this.acTypesList}
            this.$emit('input', this.data)
            resolve(success)
          } else {
            // at least one invalid value
            this.$alert.error({message: this.$tr('isite.cms.message.formInvalid')})
            resolve(success)
          }
        })
      })
    }


  }
}
</script>
<style lang="stylus">
</style>