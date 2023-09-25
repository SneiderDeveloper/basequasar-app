<template>
</template>
<script>
//Component
export default {
  data() {
    return {
      crudId: this.$uid(),
    };
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config("main.qfly.entityNames.flightSchedule"),
        apiRoute: "apiRoutes.qfly.flightSchedules",
        permission: "iflight.flightSchedule",
       // extraFormFields: "ifly.crud-fields.flightSchdules",
        create: {
          title: this.$tr('ifly.cms.form.newflightSchedule'),
        },
        read: {
          columns: [
            {
              name: 'id',
              label: this.$tr('isite.cms.form.id'),
              field: 'id',
              style: 'width: 50px',
            },
            {
              name: 'flightNumber',
              label: this.$tr('ifly.cms.form.flightNumber'),
              field: 'flightNumber',
              align: 'rigth',
            },
            {
              name: 'flightNumberIATA',
              label: this.$tr('ifly.cms.form.flightNumberIATA'),
              field: 'flightNumberIata',
              align: 'left',
            },
            {
              name: 'flightNumberICAO',
              label: this.$tr('ifly.cms.form.flightNumberICAO'),
              field: 'flightNumberIcao',
              align: 'left',
            },

            {
              name: 'aircraftType',
              label: this.$tr('ifly.cms.sidebar.aircraftType'),
              field: 'aircraftTypeId',
              align: 'left',
            },
            {
              name: 'airline',
              label: this.$tr('ifly.cms.sidebar.airline'),
              field: 'airlineId',
              align: 'left',
            },
            {
              name: 'activeFlight',
              label: this.$tr('ifly.cms.form.activeFlight'),
              field: 'isActive',
              align: 'left',
            },
            {
              name: 'flightType',
              label: this.$tr('ifly.cms.form.flightType'),
              field: 'flightType',
              align: 'left',
            },
            {
              name: 'flightScheduleLegs',
              label: this.$trp('ifly.cms.sidebar.flightScheduleLeg'),
              field: 'relation',
              align: 'left',
            },
            {
              name: 'created_at',
              label: this.$tr('isite.cms.form.createdAt'),
              field: 'createdAt',
              align: 'left',
              format: (val) => (val ? this.$trd(val) : '-')
            },
            {
              name: 'updated_at',
              label: this.$tr('isite.cms.form.updatedAt'),
              field: 'updatedAt',
              align: 'left',
              format: (val) => (val ? this.$trd(val) : '-')
            },
            {
              name: 'actions',
              label: this.$tr('isite.cms.form.actions'),
              align: 'left',
            },
          ],
          requestParams: {include: 'aircraftType,airline'}
        },
        update: {
          title: this.$trp('ifly.cms.sidebar.flightSchedule'),
        },
        delete: true,
        formLeft: {
          id: {value: ''},
          userId: {value: this.$store.state.quserAuth.userId},
          flightNumber: {
            value: '',
            type: 'input',
            props: {
              label: `${this.$tr('ifly.cms.form.flightNumber')}*`,
              rules: [(val) => !!val || this.$tr('isite.cms.message.fieldRequired')],
            },
          },
          flightNumberIata: {
            value: '',
            type: 'input',
            props: {
              label: `${this.$tr('ifly.cms.form.flightNumberIATA')}*`,
              rules: [(val) => !!val || this.$tr('isite.cms.message.fieldRequired')],
            },
          },
          flightNumberIcao: {
            value: '',
            type: 'input',
            props: {
              label: `${this.$tr('ifly.cms.form.flightNumberICAO')}*`,
              rules: [(val) => !!val || this.$tr('isite.cms.message.fieldRequired')],
            },
          },
          aircraftTypeId: {
            value: null,
            type: 'treeSelect',
            props: {
              label: this.$tr('ifly.cms.sidebar.aircraftType'),

            },
            loadOptions: {
              apiRoute: 'apiRoutes.qfly.aircraftTypes',
              select: {
                label:'model',
                id: 'id'
              },
              refresh: true,
            }
          },
          airlineId: {
            value: null,
            type: 'treeSelect',
            props: {
              label: this.$tr('ifly.cms.sidebar.airline'),
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qfly.airlines',
              select: {
                label:'airlineName',
                id: 'id'
              },
              refresh: true,
            }
          },
          isActive: {
            value: false,
            type: 'checkbox',
            props: {
              label: this.$tr('ifly.cms.label.isActive'),
              trueValue: true,
              falseValue: false
            }
          },
          schedule: {
            value: '',
            type: 'input',
            props: {
              label: `${this.$tr('isite.cms.form.schedule')}*`,
              rules: [(val) => !!val || this.$tr('isite.cms.message.fieldRequired')],
            },
          },
          flightType: {
            value: '0',
            type: 'select',
            props: {
              label: this.$tr('ifly.cms.form.flightType'),
              options: [
                {label: this.$tr('ifly.cms.label.unknow'), value: '0'},
                {label: this.$tr('ifly.cms.label.passenger'), value: '1'},
                {label: this.$tr('ifly.cms.label.freighter'), value: '2'},
                {label: this.$tr('ifly.cms.label.truc'), value: '3'},
              ]
            }
          },
          relation: {
            value: null,
            type: 'treeSelect',
            props: {
              label: this.$trp('ifly.cms.sidebar.flightScheduleLeg'),
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qfly.flightScheduleLegs',
              refresh: true,
            }
          },
        }
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {};
    },
  },
};
</script>
