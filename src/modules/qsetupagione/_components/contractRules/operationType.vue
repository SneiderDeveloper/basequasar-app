<template>
  <div id="operationTypeRuleComponent">

    <q-form ref="operationTypeRuleForm" id="operationTypeRuleForm" class="row">
      <dynamic-field
          v-for="(field,index) in formFields"
          :key="'operationTypeContractRuleField'+index+field.name"
          :id="'operationTypeContractRuleField'+index+field.name"
          :field="field"
          class="col-12"
          v-model="form[field.name]"
      />
      <dynamic-field
          key="operationTypeContractRuleFieldOperationTypes"
          id="operationTypeContractRuleFieldOperationTypes"
          :field="operationTypesField"
          class="col-12"
          v-model="operationTypes"
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
        options: {operationTypes: []}
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
      data: {},
      operationTypes: [],

    }
  },
  computed: {
    formFields(){
      return [
        {
          name: 'quantityRule',
          value: null,
          type: 'input',
          props: {
            rules: [
              val => !!val || this.$tr('isite.cms.message.fieldRequired')
            ],
            label: "Quantity",
            clearable: true,
            color: "primary",
            type: "number"
          }
        },
        {
          name: 'productOriginId',
          value: null,
          type: 'select',
          props: {
            rules: [
              val => !!val || this.$tr('isite.cms.message.fieldRequired')
            ],
            label: 'Service Origin',
            clearable: true,
            color: "primary"
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qramp.products',
            select: {label: 'fullName', id: 'id'},
            requestParams: {filter: {status: true}}
          }
        }
      ]
    },
    operationTypesField() {
      return {
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
      }
    }
  },
  methods: {
    init() {
      if (this.form.options && this.form.options.operationTypes) {
        this.operationTypes = this.form.options.operationTypes
      }
    },
    validateForm() {
      return new Promise((resolve, reject) => {
        this.$refs.operationTypeRuleForm.validate().then(success => {
          if (success) {
            // yay, models are correct
            this.data = this.$clone(this.form)
            this.data.options = {operationTypes: this.operationTypes}
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