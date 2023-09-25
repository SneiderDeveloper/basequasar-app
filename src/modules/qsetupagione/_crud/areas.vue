<template></template>

<script>
export default {
  computed: {
    crudData() {
      return {
        //permission: 'setup.stations.manage',
        crudId: this.$uid(),
        //entityName: config("main.qsetupagione.entityNames.stations"),
        apiRoute: "apiRoutes.qsetupagione.areas",
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
              name: "stationCode",
              label: "Station Code",
              field: "station",
              format: val => val ? val.stationCode : '' ,
              align: "left",
            },
            {
              name: "stationName",
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
          requestParams: {
            include: 'station'
          },
        },
        create: {
          title: 'Create area'
        },
        update: {
          title: 'Update area'
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
              label: 'Area Name',
              clearable: true,
              color:"primary",
              'hide-bottom-space': false
            },
            label: 'Station Name',
          },
          stationId: {
            name:'stationId',
            value: '',
            type: 'select',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              selectByDefault : true,
              
              label: `*${this.$tr('ifly.cms.form.station')}`,
              clearable: true,
              color:"primary"
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qramp.setupStations',
              select: {label: 'stationName', id: 'id'},
            },
          }
        },
      };
    },
  },
};
</script>