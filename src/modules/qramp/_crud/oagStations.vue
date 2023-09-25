<template></template>
<script>
export default {
  name: 'scheduleStatus',
  data() {
    return {
      crudId: this.$uid(),
    }
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        //entityName: config("main.qfly.entityNames.workOrder"),
        //apiRoute: 'apiRoutes.qramp.scheduleStatuses',
        //permission: 'ramp.schedule-statuses',
        create: {
          title: 'Create OAG Stations'
        },
        read: {
          columns: [
            {
              name: 'id',
              label: this.$tr('isite.cms.form.id'),
              field: 'id',
              style: 'width: 50px',
              action: (item) => false
            },
            {
              name: 'type',
              label: 'Type',
              field: 'type',
              align: 'left',
            },
            {
              name: 'creation',
              label: 'Creation',
              field: 'creation',
              align: 'left',
            },
            {
              name: 'station',
              label: 'Station',
              field: 'station',
              align: 'left',
            },
            {
              name: 'description',
              label: 'Description',
              field: 'description',
              align: 'left',
            },
            {
              name: 'iata Code',
              label: 'Iata Code',
              field: 'iata_code',
              align: 'left',
            },
            {
              name: 'carrier_code',
              label: 'Carrier Code',
              field: 'carrier_code',
              align: 'left',
            },
            {
              name: 'Carrier Description',
              label: 'Carrier Description',
              field: 'carrier_description',
              align: 'left',
            },
            {
              name: 'Schedule freq',
              label: 'Schedule Freq',
              field: 'schedule_freq',
              align: 'left',
            },
            {
              name: 'Account number',
              label: 'Account Number',
              field: 'account_number',
              align: 'left',
            },
            {
              name: 'Order number',
              label: 'Order Number',
              field: 'order_number',
              align: 'left',
            },
            {
              name: 'Airline flag',
              label: 'Airline Flag',
              field: 'airline_flag',
              align: 'left',
            },
            {
              name: 'Active Flag',
              label: 'Active Flag',
              field: 'active_flag',
              align: 'left',
            },
            {
              name: 'Grace Period',
              label: 'Grace Period',
              field: 'grace_period',
              align: 'left',
            },
            {
              name: 'Rate based on',
              label: 'Rate Based On',
              field: 'rate_based_on',
              align: 'left',
            },
            {
              name: 'Grace period begin',
              label: 'Grace Period Begin',
              field: 'grace_period_begin',
              align: 'left',
            },
            {
              name: "created_at",
              label: this.$tr("isite.cms.form.createdAt"),
              field: "createdAt",
              align: "left",
              format: (val) => (val ? this.$trd(val) : "-"),
            },
            {
              name: "updated_at",
              label: this.$tr("isite.cms.form.updatedAt"),
              field: "updatedAt",
              align: "left",
              format: (val) => (val ? this.$trd(val) : "-"),
            },
            { name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left' },
          ],
          filters: {},
        },
        update: {
          title: 'Update OAG Stations'
        },
        delete: true,
        formLeft: {
          id: {value: ""},
          type: {
            value: "",
            type: "select",
            props: {
              label: 'Type',
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
              options: [
                {label: 'Creation', value: 'Creation'},
                {label: 'Update', value: 'Update'},
                {label: 'Required', value: 'Required'},
                {label: 'Default', value: 'Default'},
              ],
            },
          },
          creation: {
            value: "",
            type: "select",
            props: {
              label: 'Creation',
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
              options: [
                {label: 'Creation', value: 'Creation'},
                {label: 'Update', value: 'Update'},
                {label: 'Required', value: 'Required'},
                {label: 'Default', value: 'Default'},
              ],
            },
          },
          station: {
            value: "",
            type: "input",
            props: {
              label: 'Station',
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
            },
          },
          description: {
            value: "",
            type: "input",
            props: {
              label: 'Description',
            },
          },
          iataCode: {
            value: "",
            type: "input",
            props: {
              label: 'Iata code',
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
            },
          },
          carrierCode: {
            value: "",
            type: "input",
            props: {
              label: 'Carrier code',
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
            },
          },
          carrierDescription: {
            value: "",
            type: "input",
            props: {
              label: 'Carrier description',
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
            },
          },
          scheduleFreq: {
            value: "",
            type: "select",
            props: {
              label: 'Schedule freq',
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
              options: [
                {label: 'Daily', value: 'Daily'},
                {label: 'Monthly', value: 'Monthly'},
              ],
            },
          },
        },
        formRight: {
          accountNumber: {
            value: "",
            type: "input",
            props: {
              label: 'Account number',
            },
          },
          orderNumber: {
            value: "",
            type: "input",
            props: {
              label: 'Order Number',
            },
          },
          airlineFlag: {
            value: "",
            type: "select",
            props: {
              label: 'Airline flag',
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
              options: [
                {label: 'Yes', value: 'Yes'},
                {label: 'No', value: 'No'},
              ],
            },
          },
          activeFlag: {
            value: "",
            type: "select",
            props: {
              label: 'Active Flag',
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
              options: [
                {label: 'Yes', value: 'Yes'},
                {label: 'No', value: 'No'},
              ],
            },
          },
          gracePeriod: {
            value: "0",
            type: "input",
            props: {
              type: 'number',
              label: 'Grace Period',
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
            },
          },
          rateBasedOn: {
            value: "",
            type: "select",
            props: {
              label: 'Rate based on',
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
            },
          },
          gracePeriodBegin: {
            value: "0",
            type: "input",
            props: {
              type: 'number',
              label: 'Grace Period Begin',
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
            },
          },
        }
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  },
  methods: {}
}
</script>
<style lang="stylus">
</style>
