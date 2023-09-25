<template></template>

<script>
export default {
  computed: {
    crudData() {
      return {
        //permission: 'setup.buildings.manage',
        crudId: this.$uid(),
        //entityName: config("main.qsetupagione.entityNames.buildings"),
        apiRoute: "apiRoutes.qsetupagione.setupBuildings",
        read: {
          columns: [
            {
              name: "id",
              label: this.$tr("isite.cms.form.id"),
              field: "id",
              style: "width: 50px",
            },
            {
              name: "buildingName",
              label: "Building Name",
              field: "buildingName",
              align: "left",
            },
            {
              name: "workdayLocationId",
              label: "Location Ref ID",
              field: "workdayLocationId",
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
              name: "companyName",
              label: "Company Name",
              field: "company",
              format: val => val ? val.companyName : '',
              align: "left",
            },
            {
              name: "actions",
              label: this.$tr("isite.cms.form.actions"),
              align: "left",
            },
          ],
          requestParams: {include: "company,station"},
        },
        create: {
          title: 'Create buildings'
        },
        update: {
          title: 'Update buildings'
        },
        delete: true,
        formLeft: {
          id: {
            value: null,
          },
          buildingName: {
            name:'buildingName',
            value: '',
            type: 'input',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              label: 'Building Name',
              clearable: true,
              color:"primary",
              'hide-bottom-space': false
            },
            label: 'Building Name',
          },
          workdayLocationId: {
            name:'workdayLocationId',
            value: '',
            type: 'input',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              label: 'Location Ref ID',
              clearable: true,
              color:"primary",
              'hide-bottom-space': false
            },
            label: 'Location Ref ID',
          },

          workdayWid: {
            name:'workdayWid',
            value: '',
            type: 'input',
            props: {
              label: 'Workday ID',
              clearable: true,
              color:"primary",
              'hide-bottom-space': false
            },
            label: 'Workday ID',
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
          companyId: {
            value: null,
            type: 'crud',
            props: {
              crudType: 'select',
              crudData: import('../_crud/companies'),
              crudProps: {
                label: 'Company Name',
              },
              config: {options: {label: 'companyName', value: 'id'}},
            },
          },
          oldId: {
            value: null,
          },
          externalId: {
            value: null,
          },
          options: {
            value: null,
          },                  
        },
      };
    },
  },
};
</script>