<template></template>

<script>
export default {
  computed: {
    crudData() {
      return {
        //permission: 'setup.stations.manage',
        crudId: this.$uid(),
        //entityName: config("main.qsetupagione.entityNames.stations"),
        apiRoute: "apiRoutes.qsetupagione.gates",
        read: {
          columns: [
            {
              name: "id",
              label: this.$tr("isite.cms.form.id"),
              field: "id",
              style: "width: 50px",
            },
            {
              name: "name",
              label: "Name",
              field: "name",
              align: "left",
            },
            {
              name: "StationName",
              label: "Station Name",
              field: "station",
              format: val => val ? val.stationName : '' ,
              align: "left",
            },
            {
              name: "actions",
              label: this.$tr("isite.cms.form.actions"),
              align: "left",
            },
          ],
          requestParams: {include: 'station'},
        },
        create: {
          title: 'Create Parking Spot'
        },
        update: {
          title: 'Update Parking Spot'
        },
        delete: true,
        formLeft: {
          id: {
            value: null,
          },
          name: {
            name:'name',
            value: '',
            type: 'input',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              label: 'Name',
              clearable: true,
              color:"primary",
              'hide-bottom-space': false
            },
            label: 'Name',
          },
          stationId: {
            value: null,
            type: 'crud',
            props: {
              crudType: 'select',
              crudData: import('../_crud/stations'),
              crudProps: {
                label: 'Station Name',
              },
              config: {options: {label: 'stationName', value: 'id'}},
            },
          },
        },
      };
    },
  },
};
</script>