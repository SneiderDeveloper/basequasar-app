<template>

</template>

<script>
export default {
  data() {
    return {
      crudId: this.$uid()
    }
  },
  computed: {
    crudData() {
      return {
       permission: 'idhl.score-cards',
        crudId: this.crudId,
      //  entityName: config("main.qsetupagione.entityNames.buildings"),
        apiRoute: "apiRoutes.qdhlagione.scoreCards",
        read: {
          columns: [
            {
              name: "id",
              label: this.$tr("isite.cms.form.id"),
              field: "id",
              style: "width: 50px",
            },
            {
              name: "date",
              label: "Date",
              field: "date",
              format: (val) => (val ? this.$trd(val) : "-"),
              align: "left",
            },
            {
              name: "shift",
              label: "Session",
              format: val => val ? (val.shift ? "PM" : "AM") : '',
              field: "staff",
              align: "left",
            },
            {
              name: "station",
              label: "Station",
              field: "staff",
              format: val => val ? (val.station ? `${val.station.stationName} (${val.station.stationCode})` : '') : '' ,
              align: "left",
            },
            {
              name: "staffing",
              label: "Staffing",
              field: "staffing",
              align: "left",
            },
            {
              name: 'fuel',
              label: 'Fuel',
              field: 'fuel',
              format: val => val ? 'Yes' : 'No',
              align: 'left'
            },
            {
              name: 'gse',
              label: 'GSE',
              field: 'gse',
              format: val => val ? 'Yes' : 'No',
              align: 'left'
            },
            {
              name: "actions",
              label: this.$tr("isite.cms.form.actions"),
              align: "left",
            },
          ],
          filters:{
            date: {
              props:{
                label: "Date"
              },
              field: {value: 'date'},
              quickFilter: true
            },

          },
          requestParams: {include: "company,staff,staff.station"},
        },
        create: {
          title: 'Create a Score Card'
        },
        update: {
          title: 'Update a Score Card'
        },
        delete: true,
        formLeft: {
          scoreCardDate: {
            type:"date",
            name: "date",
            props:{
            //  hint:'Format: MM/DD/YYYY',
          //    mask:'MM/DD/YYYY',
           //   'place-holder': 'MM/DD/YYYY',
          //    format24h: true,
              label: "Date",
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },

          },
          staffId: {
            value: null,
            type: 'crud',
            props: {
              crudType: 'select',
              crudData: import('../_crud/staffs'),
              crudProps: {
                label: 'Planned HCTs',
              },
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              config: {options: {label: 'fullName', value: 'id'}},
            },
          },
          actualHct: {
            value: 0,
            type:"input",

            props:{
              classes:"col-3",
              type:"number",
              label: "Staff",
              mask:'###################',
            },
            rules: [
              val => !!val || this.$tr('isite.cms.message.fieldRequired')
            ],
            name: "actualHct"
          },

          fuel: {
            value: false,
            type:"select",
            props:{
              label: "Fuel",
              options: [
                {label: "Yes", value: true},
                {label: "No", value: false},
              ]
            },
            name: "fuel"
          },
          gse: {
            value: false,
            type:"select",
            props:{
              label: "GSE",
              options: [
                {label: "Yes", value: true},
                {label: "No", value: false},
              ]
            },
            name: "gse"
          },

          companyId: {
            value: null,
            type: 'crud',
            props: {
              crudType: 'select',
              crudData: import('../../qsetupagione/_crud/companies'),
              crudProps: {
                label: 'Company Name',
              },
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              config: {options: {label: 'fullName', value: 'id'}},
            },
          },
          flightType: {
            value: "Arrive",
            type: 'select',
            props: {
              label: "Flight",
              options: [
                {label: "Arrive", value: "Arrive"},
                {label: "Departure", value: "Departure"},
              ],
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
          },
          std: {
            type:"fullDate",
            props:{
          //    hint:'Format: MM/DD/YYYY HH:mm',
            //  mask:'MM/DD/YYYY HH:mm',
            //  'place-holder': 'MM/DD/YYYY HH:mm',
           //   format24h: true,
              label: this.crudInfo.flightType == 1 ? "STA" : "STD",
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
            name: "std"
          },
          atd: {
            type:"fullDate",
            props:{
         //    hint:'Format: MM/DD/YYYY HH:mm',
          //    mask:'MM/DD/YYYY HH:mm',
          //    'place-holder': 'MM/DD/YYYY HH:mm',
          //    format24h: true,
              label: this.crudInfo.flightType == 1 ? "ATA" : "ATD",
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
            name: "atd"
          },

        },
        formRight: {
          outOfService: {
            type:"input",
            props:{
              label: "Out of Service",
              type:"textarea"
            },
          },

          delayDetails: {
            type:"input",
            props:{
              label: "Delay details",
              type:"textarea"
            },
          },


          otherComments: {
            type:"input",
            props:{
              label: "Comments",
              type:"textarea"
            },
          },


          preOps: {
            type:"input",
            props:{
              label: "Pre Ops",
              type:"textarea"
            },
          },


          postOps: {
            type:"input",
            props:{
              label: "Post Ops",
              type:"textarea"
            },
          },


          safety: {
            type:"input",
            props:{
              label: "Safety",
              type:"textarea"
            },
          },
        },
        getDataForm: (data, typeForm) => {

          return new Promise((resolve, reject) => {
            resolve({
              ...data,
              flightType : parseInt(data.flightType),
              date: this.dateFormatterFull(data.date,"date"),
              std: this.dateFormatterFull(data.std),
              atd: this.dateFormatterFull(data.atd)
            })
          })
        }
      };
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    },

  },
  methods:{
    dateFormatterFull(date, type = "datetime") {
      if (!date) return null
console.warn("$date$",date,type)
      if(type == "datetime"){
        const formDate = date.split(" ")
        const [year, month, day] = formDate[0].substr(0, 10).split('/')
        const [hr, mm] = formDate[1].substr(0, 5).split(':')
        return `${month}/${day}/${year} ${hr}:${mm}`
      }else{
        const [year, month, day] = date.substr(0, 10).split('/')
        return `${month}/${day}/${year}`
      }
    },
  }
};
</script>