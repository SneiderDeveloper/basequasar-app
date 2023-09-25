<template>
  <master-modal v-model="form.show" :loading="loading"  custom-position :title="form.title" :persistent="true">
    <form-contract-form @close="closeModal" :row="form.data" :update="form.update"/>
  </master-modal>
</template>
<script>
//components
import formContractForm from "../_components/contractRules/index"
import {RULE_TYPES} from '../_components/model/constants'

export default {
  components: {formContractForm},
  data() {
    return {
      crudId: this.$uid(),
      loading: false,
      form: {
        title: '',
        update: false,
        show: false,
        data: null
      }
    }
  },
  methods:{
    closeModal($event){
      this.form.show = $event
    }
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        apiRoute: 'apiRoutes.qramp.contractRules',
        permission: 'setup.contract-rules',
        create: {
          method: () => {
            this.form = {
              title: this.$tr('setupagione.cms.newContractRule'),
              show: true,
              update: false,
              data: null
            }
          }
        },
        read: {
          columns: [
            {
              name: 'id', label: this.$tr('isite.cms.form.id'),
              field: 'id',
              sortable: true,
            },
            {
              name: 'type',
              label: this.$tr('isite.cms.form.type'),
              field: 'typeName',
              align: 'left',
            },
            {
              name: 'contract',
              label: 'Contract',
              field: 'contract',
              format: val => val ? val.contractName : '-',
              align: 'left',
            },
            {
              name: 'service',
              label: 'Service',
              field: 'product',
              format: val => val ? val.name+' - '+val.externalId : '-',
              align: 'left',
            },
            {
              name: 'contractRuleStatus',
              label: 'Status',
              field: 'status',
              format: val => val ? 'Active' : 'Inactive',
              align: 'left',
            },
            {
              name: 'createdAt', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt',
              format: val => val ? this.$trd(val) : '-',
              align: 'left', sortable: true
            },
            {
              name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'center'
            },
          ],
          requestParams: {
            include:"contract,product"
          },
          filters: {
            contractId: {
              value: null,
              type: 'select',
              quickFilter: true,
              loadOptions: {
                apiRoute: 'apiRoutes.qsetupagione.contracts',
                select: {'label': 'contractName', 'id': 'id'},
              },
              props: {
                label: 'Contract',
                'clearable': true
              },
            },
            type: {
              name: 'type',
              value: null,
              type: 'select',
              quickFilter: true,
              props: {
                options:RULE_TYPES,
                label: 'Rule Type',
                'clearable': true
              },
            },
          }
        },
        update: {
          method: (item) => {
            this.form = {
              title: this.$tr('setupagione.cms.updateContractRule'),
              update: true,
              show: true,
              data: item
            }
          }
        },
        delete: true,
        formLeft: {},
        formRight: {}
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  },
}
</script>
