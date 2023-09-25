<template></template>

<script>
export default {
  computed: {
    crudData() {
      return {
        //permission: 'setup.buildings.manage',
        crudId: this.$uid(),
        //entityName: config("main.qsetupagione.entityNames.buildings"),
        apiRoute: "apiRoutes.qdhlagione.staffs",
        read: {
          columns: [
            {
              name: "id",
              label: this.$tr("isite.cms.form.id"),
              field: "id",
              style: "width: 50px",
            },
            {
              name: "StationName",
              label: "Station Name",
              field: "station",
              format: val => val ? val.stationName : '' ,
              align: "left",
            },
            {
              name: "shift",
              label: "Session",
              format: val => val ? "PM" : "AM",
              field: "shift",
              align: "left",
            },
            {
              name: "dayOfWeekName",
              label: "Day",
              field: "dayOfWeekName",
              align: "left",
            },

            {
              name: "qty",
              label: "Qty",
              field: "qty",
              align: "left",
            },
            {
              name: "actions",
              label: this.$tr("isite.cms.form.actions"),
              align: "left",
            },
          ],
          requestParams: {include: "station"},
        },
        create: {
          title: 'Create Planned HCT'
        },
        update: {
          title: 'Update Planned HCT'
        },
        delete: true,
        formLeft: {
          stationId: {
            value: null,
            type: 'crud',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              crudType: 'select',
              crudData: import('../../qsetupagione/_crud/stations'),
              crudProps: {
                label: 'Station Name',
              },
              config: {options: {label: 'fullName', value: 'id'}},
            },
          },
          shift: {
            value: null,
            type: 'select',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              label: "Session",
              options: [
                {label: "AM", value: 0},
                {label: "PM", value: 1},
              ]
            },
          },
          dayOfWeek: {
            value: null,
            type: 'select',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              label: "Day",
              options: [
                {label: "Sunday", value: 0},
                {label: "Monday", value: 1},
                {label: "Tuesday", value: 2},
                {label: "Wednesday", value: 3},
                {label: "Thursday", value: 4},
                {label: "Friday", value: 5},
                {label: "Saturday", value: 6},
              ]
            },
          },
          qty: {
            value: 0,
            type:"quantity",
            props:{
              label: "Staff"
            },
            rules: [
              val => !!val || this.$tr('isite.cms.message.fieldRequired')
            ],
            name: "qty"
          },
        },
      };
    },
  },
};
</script>