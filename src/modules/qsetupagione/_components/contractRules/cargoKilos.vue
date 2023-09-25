<template>
  <div id="cargoKilosRuleComponent">

    <q-form ref="cargoKilosRuleForm" id="cargoKilosRuleForm" class="row">
      <div class="col-12">
        <q-item-label>Loaded:</q-item-label>
      </div>
      <dynamic-field
          v-for="(field,index) in formFields.loaded"
          :key="'cargoKilosLoadedContractRuleField'+index+field.name"
          :id="'cargoKilosLoadedContractRuleField'+index+field.name"
          :field="field"
          class="col-12"
          v-model="kilosTypes[0][field.name]"
      />
      <div class="col-12">
        <q-item-label>Unloaded:</q-item-label>
      </div>
      <dynamic-field
          v-for="(field,index) in formFields.unloaded"
          :key="'cargoKilosUnloadedContractRuleField'+index+field.name"
          :id="'cargoKilosUnloadedContractRuleField'+index+field.name"
          :field="field"
          class="col-12"
          v-model="kilosTypes[1][field.name]"
      />
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
        options: {
          kilosTypes: [
            {
              type: 'loaded',
              quantityRule: null,
              operationTypes: [],
              noExceedContractLineId: null,
              exceedContractLineId: null
            },
            {
              type: 'unloaded',
              quantityRule: null,
              operationTypes: [],
              noExceedContractLineId: null,
              exceedContractLineId: null
            }
          ]
        }
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
      kilosTypes: [
        {
          type: 'loaded',
          quantityRule: null,
          operationTypes: [],
          noExceedContractLineId: null,
          exceedContractLineId: null
        },
        {
          type: 'unloaded',
          quantityRule: null,
          operationTypes: [],
          noExceedContractLineId: null,
          exceedContractLineId: null
        }
      ],
      data: {},
    }
  },
  computed: {
    formFields(){
      return {
        loaded: [
          {
            name: 'quantityRule',
            value: null,
            type: 'input',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              label: "Quantity(Kilos)",
              clearable: true,
              color: "primary",
              type: "number"
            }
          },
          {
            name: 'operationTypes',
            value: [],
            type: 'select',
            props: {
              rules: [
                val => val.length || this.$tr('isite.cms.message.fieldRequired')
              ],
              label: 'Operation Types',
              multiple: true,
              useChips: true,
              clearable: true,
              color: "primary"
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qramp.operationTypes',
              select: {label: 'operationName', id: 'id'},
              requestParams: {filter: {status: true}}
            }
          },
          {
            name: 'noExceedContractLineId',
            value: null,
            type: 'select',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              label: 'No Exceed Contract Line',
              clearable: true,
              color: "primary"
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qsetupagione.contractLines',
              select: {label: 'fullName', id: 'id'},
              requestParams: {filter: {contractId: this.contractId}}
            }
          },

          {
            name: 'exceedContractLineId',
            value: null,
            type: 'select',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              label: 'Exceed Contract Line',
              clearable: true,
              color: "primary"
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qsetupagione.contractLines',
              select: {label: 'fullName', id: 'id'},
              requestParams: {filter: {contractId: this.contractId}}
            }
          },

        ],
        unloaded: [
          {
            name: 'quantityRule',
            value: null,
            type: 'input',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              label: "Quantity(Kilos)",
              clearable: true,
              color: "primary",
              type: "number"
            }
          },
          {
            name: 'operationTypes',
            value: [],
            type: 'select',
            props: {
              rules: [
                val => val.length || this.$tr('isite.cms.message.fieldRequired')
              ],
              label: 'Operation Types',
              multiple: true,
              useChips: true,
              clearable: true,
              color: "primary"
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qramp.operationTypes',
              select: {label: 'operationName', id: 'id'},
              requestParams: {filter: {status: true}}
            }
          },
          {
            name: 'noExceedContractLineId',
            value: null,
            type: 'select',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              label: 'No Exceed Contract Line',
              clearable: true,
              color: "primary"
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qsetupagione.contractLines',
              select: {label: 'fullName', id: 'id'},
              requestParams: {filter: {contractId: this.contractId}}
            }
          },

          {
            name: 'exceedContractLineId',
            value: null,
            type: 'select',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              label: 'Exceed Contract Line',
              clearable: true,
              color: "primary"
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qsetupagione.contractLines',
              select: {label: 'fullName', id: 'id'},
              requestParams: {filter: {contractId: this.contractId}}
            }
          },
        ]
      }
    }
  },
  methods: {
    init() {
      if (this.form.options && this.form.options.kilosTypes) {
        this.kilosTypes = this.form.options.kilosTypes
      }
    },
    validateForm() {
      return new Promise((resolve, reject) => {
        this.$refs.cargoKilosRuleForm.validate().then(success => {
          if (success) {
            // yay, models are correct
            this.data = this.$clone(this.form)
            this.data.options = {kilosTypes: this.kilosTypes}
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