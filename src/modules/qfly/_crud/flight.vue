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
        entityName: config("main.qfly.entityNames.flight"),
        apiRoute: "apiRoutes.qfly.flight",
        permission: "iflight.flight",
        //extraFormFields: "ifly.crud-fields.categories",
        create: {
          title: this.$tr("ifly.cms.form.newflight"),
        },
        read: {
          columns: [
            {
              name: "id",
              label: this.$tr("isite.cms.form.id"),
              field: "id",
              style: "width: 50px",
            },
            {
              name: "flightScheduleLeg",
              label: this.$tr("ifly.cms.sidebar.flightScheduleLeg"),
              field: "relation",
              align: "rigth",
            },
            {
              name: "tailNumber",
              label: this.$tr("ifly.cms.form.tailNumber"),
              field: "tailNumber",
              align: "left",
            },
            {
              name: "fligthStatus",
              label: this.$tr("ifly.cms.form.fligthStatus"),
              field: "fligthStatus",
              align: "left",
            },
            {
              name: "estimatedDepartureTime",
              label: this.$tr("ifly.cms.form.estimatedDepartureTime"),
              field: "estimatedDepartureTime",
              align: "left",
            },
            {
              name: "estimatedArrivalTime",
              label: this.$tr("ifly.cms.form.estimatedArrivalTime"),
              field: "estimatedArrivalTime",
              align: "left",
            },
            {
              name: "actualDepartureTime",
              label: this.$tr("ifly.cms.form.actualDepartureTime"),
              field: "actualDepartureTime",
              align: "left",
            },
            {
              name: "actualArrivalTime",
              label: this.$tr("ifly.cms.form.actualArrivalTime"),
              field: "actualArrivalTime",
              align: "left",
            },
            {
              name: "estimatedBlockOutTime",
              label: this.$tr("ifly.cms.form.estimatedBlockOutTime"),
              field: "estimatedBlockOutTime",
              align: "left",
            },
            {
              name: "actualBlockInTime",
              label: this.$tr("ifly.cms.form.actualBlockInTime"),
              field: "actualBlockInTime",
              align: "left",
            },
            {
              name: "actualBlockOutTime",
              label: this.$tr("ifly.cms.form.actualBlockOutTime"),
              field: "actualBlockOutTime",
              align: "left",
            },
            {
              name: "airportOriginId",
              label: this.$tr("ifly.cms.form.airportOriginId"),
              field: "airportOriginId",
              align: "left",
            },
            {
              name: "airportDestinationId",
              label: this.$tr("ifly.cms.form.airportDestinationId"),
              field: "airportDestinationId",
              align: "left",
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
            {
              name: "actions",
              label: this.$tr("isite.cms.form.actions"),
              align: "left",
            },
          ],
        },
        update: {
          title: this.$tr("ifly.cms.updateCategory"),
          requestParams: {},
        },
        delete: true,
        formLeft: {
          id: {value: null},
          userId: {value: this.$store.state.quserAuth.userId},
          relation: {
            value: null,
            type: 'treeSelect',
            props: {
              label: this.$tr('ifly.cms.sidebar.flightScheduleLeg'),
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qfly.flightScheduleLegs',
              refresh: true,
            }
          },
          tailNumber : {
            value: "",
            type: "input",
            props: {
              label: `${this.$tr("ifly.cms.form.tailNumber")}*`,
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
            },
          },
          fligthStatus: {
            value: '0',
            type: 'select',
            props: {
              label: this.$tr('ifly.cms.form.fligthStatus'),
              options: [
                {label: this.$tr('ifly.cms.label.scheduled'), value: '0'},
                {label: this.$tr('ifly.cms.label.scheduledDelayed'), value: '1'},
                {label: this.$tr('ifly.cms.label.active'), value: '2'},
                {label: this.$tr('ifly.cms.label.unknown'), value: '3'},
                {label: this.$tr('ifly.cms.label.redirected'), value: '4'},
                {label: this.$tr('ifly.cms.label.landed'), value: '5'},
                {label: this.$tr('ifly.cms.label.landedTaxing'), value: '6'},
                {label: this.$tr('ifly.cms.label.arrived'), value: '7'},
                {label: this.$tr('ifly.cms.label.arrivedGateArrival'), value: '8'},
                {label: this.$tr('ifly.cms.label.arrivedDelayed'), value: '9'},
                {label: this.$tr('ifly.cms.label.taxiingLeftGate'), value: '10'},
                {label: this.$tr('ifly.cms.label.enRouteOnTime'), value: '11'},
                {label: this.$tr('ifly.cms.label.enRouteDelayed'), value: '12'},
                {label: this.$tr('ifly.cms.label.diverted'), value: '13'},
                {label: this.$tr('ifly.cms.label.cancelled'), value: '14'},
                {label: this.$tr('ifly.cms.label.notOperational'), value: '15'},
                {label: this.$tr('ifly.cms.label.resultunknown'), value: '16'},
                {label: this.$tr('ifly.cms.label.delayed'), value: '17'},
              ]
            }
          },
          estimatedDepartureTime: {
            value: "",
            type: "fullDate",
            props: {
              label: `${this.$tr("ifly.cms.form.estimatedDepartureTime")}*`,
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
            },
          },
          estimatedArrivalTime: {
            value: "",
            type: "fullDate",
            props: {
              label: `${this.$tr("ifly.cms.form.estimatedArrivalTime")}*`,
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
            },
          },
          actualDepartureTime: {
            value: "",
            type: "fullDate",
            props: {
              label: `${this.$tr("ifly.cms.form.actualDepartureTime")}*`,
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
            },
          },
          actualArrivalTime: {
            value: "",
            type: "fullDate",
            props: {
              label: `${this.$tr("ifly.cms.form.actualArrivalTime")}*`,
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
            },
          },
          estimatedBlockOutTime: {
            value: "",
            type: "fullDate",
            props: {
              label: `${this.$tr("ifly.cms.form.estimatedBlockOutTime")}*`,
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
            },
          },
          actualBlockInTime: {
            value: "",
            type: "fullDate",
            props: {
              label: `${this.$tr("ifly.cms.form.actualBlockInTime")}*`,
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
            },
          },
          actualBlockOutTime: {
            value: "",
            type: "fullDate",
            props: {
              label: `${this.$tr("ifly.cms.form.actualBlockOutTime")}*`,
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
            },
          },
          airportOriginId: {
            value: "",
            type: "fullDate",
            props: {
              label: `${this.$tr("ifly.cms.form.airportOriginId")}*`,
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
            },
          },
          airportOriginId : {
            value: "",
            type: "select",
            props: {
              label: `${this.$tr("ifly.cms.form.airportOriginId")}*`,
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qfly.airports',
              select: {
                label:'airportName',
                id: 'id'
              },
              refresh: true,
            }
          },
          airportDestinationId : {
            value: "",
            type: "select",
            props: {
              label: `${this.$tr("ifly.cms.form.airportDestinationId")}*`,
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qfly.airports',
              select: {
                label:'airportName',
                id: 'id'
              },
              refresh: true,
            }
          },
        },
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {};
    },
  },
};
</script>
