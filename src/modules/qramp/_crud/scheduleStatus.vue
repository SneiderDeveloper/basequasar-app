<template></template>
<script>
import colorTailwind from '@imagina/qsite/_resources/models/colorTailwind.js'
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
        apiRoute: 'apiRoutes.qramp.scheduleStatuses',
        permission: 'ramp.schedule-statuses',
        create: {
          title: 'Create Schedule statuses'
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
              name: 'name',
              label: 'name',
              field: 'name',
              align: 'left',
              formatColumn: row => ({
                bgTextColor: row.color ? `tw-bg-${row.color}` : ''
              }),
            },
            {
              name: 'color',
              label: 'Color',
              field: 'color',
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
          title: 'Update Schedule statuses'
        },
        delete: true,
        formLeft: {
          id: {value: ""},
          name: {
            value: "",
            type: "input",
            props: {
              label: 'Name',
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
            },
          },
          color : {
            value: "",
            type: "select",
            props: {
              selectColor: true,
              colorType: 'tailwindcss',
              label: 'Font Color',
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
              options: colorTailwind,
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
