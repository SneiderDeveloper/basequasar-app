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
        entityName: config("main.qfly.entityNames.flightScheduleLeg"),
        apiRoute: "apiRoutes.qfly.flightScheduleLegs",
        permission: "iflight.flightScheduleLeg",
        //extraFormFields: "ifly.crud-fields.flightScheduleLegs",
        create: {
          title: this.$tr("ifly.cms.form.newflightScheduleLeg"),
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
              name: "light_schedule_id",
              label: this.$tr("ifly.cms.sidebar.flightSchedule"),
              field: "flightSchedule",
              align: "rigth",
            },
            {
              name: "legNumber",
              label: this.$tr("ifly.cms.form.legNumber"),
              field: "legNumber",
              align: "left",
            },
            {
              name: "airport_origin_id",
              label: this.$tr("ifly.cms.form.airportOriginId"),
              field: "origin",
              align: "left",
              format: val => val ? val.title : '-'
            },
            {
              name: "airline_ICAO_code",
              label: this.$tr("ifly.cms.form.airlineIcaoCode"),
              field: "airlineICAOcode",
              align: "left",
              format: val => val ? val.title : '-'
            },
            {
              name: "airport_destination_id",
              label: this.$tr("ifly.cms.form.airportOriginId"),
              field: "airportDestinationId",
              align: "left",
              format: val => val ? val.title : '-'
            },
            {
              name: "departure_time",
              label: this.$tr("ifly.cms.form.departureTime"),
              field: "departureTime ",
              align: "left",
              format: val => val ? val.title : '-'
            },
            {
              name: "arrival_time",
              label: this.$tr("ifly.cms.form.arrivalTime"),
              field: "arrivalTime",
              align: "left",
              format: val => val ? val.title : '-'
            },
            {
              name: "aircraft_type_id",
              label: this.$tr("ifly.cms.sidebar.aircraftType"),
              field: "aircraftTypeId",
              align: "left",
              format: val => val ? val.title : '-'
            },
            {
              name: "flights",
              label: this.$trp("ifly.cms.sidebar.flight"),
              field: "relation",
              align: "left",
              format: val => val ? val.title : '-'
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
          title: this.$tr("ifly.cms.form.updateflightScheduleLeg"),
          requestParams: {},
        },
        delete: true,
        formLeft: {
          id: {value: ""},
          userId: {value: this.$store.state.quserAuth.userId},
          flightSchedule: {
            value: null,
            type: 'treeSelect',
            props: {
              label: this.$tr('ifly.cms.sidebar.flightSchedule'),
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qfly.flightSchedules',
              refresh: true,
            }
          },
          legNumber: {
            value: "",
            type: "input",
            props: {
              label: `${this.$tr("ifly.cms.form.legNumber")}*`,
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
            },
          },
          airportOriginId: {
            value: null,
            type: 'treeSelect',
            props: {
              label: this.$tr('ifly.cms.form.airportOriginId'),
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qfly.flightSchedules',
              refresh: true,
            }
          },
          airlineIcaoCode: {
            value: "",
            type: "input",
            props: {
              label: `${this.$tr("ifly.cms.form.airlineIcaoCode")}*`,
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
            },
          },
          airportDestinationId: {
            value: null,
            type: 'treeSelect',
            props: {
              label: this.$tr('ifly.cms.form.airportDestinationId'),
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qfly.airports',
              refresh: true,
            }
          },
          departureTime: {
            value: "",
            type: "fullDate",
            props: {
              label: `${this.$tr("ifly.cms.form.departureTime")}*`,
              rules: [(val) => !!val || this.$tr("ifly.cms.message.fieldRequired")],
            },
          },
          arrivalTime: {
            value: "",
            type: "fullDate",
            props: {
              label: `${this.$tr("ifly.cms.form.arrivalTime")}*`,
              rules: [(val) => !!val || this.$tr("ifly.cms.message.fieldRequired")],
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
              refresh: true,
            }
          },
          relation: {
            value: null,
            type: 'treeSelect',
            props: {
              label: this.$trp('ifly.cms.sidebar.flight'),
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qfly.flightScheduleLegs',
              refresh: true,
            }
          },
        }
      };
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {};
    },
  },
};
</script>
