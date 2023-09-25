<template></template>

<script>
export default {
  computed: {
    crudData() {
      return {
        permission: 'setup.contracts',
        crudId: this.$uid(),
        //entityName: config("main.qsetupagione.entityNames.stations"),
        apiRoute: "apiRoutes.qsetupagione.contracts",
        read: {
          columns: [
            {
              name: "id",
              label: this.$tr("isite.cms.form.id"),
              field: "id",
              style: "width: 50px",
            },
            {
              name: "contractName",
              label: "Contract Name",
              field: "contractName",
              align: "left",
            },
            {
              name: "customerName",
              label: "Customer Name",
              field: "customerName",
              align: "left",
            },
            {
              name: "building",
              label: "building Name",
              field: "building",
              format: val => val ? val.buildingName : '-',
              align: "left",
            },
            {
              name: "costCenter",
              label: "Cost Center name",
              field: "costCenter",
              format: val => val ? val.name : '-',
              align: "left",
            },
            {
              name: "workdayId",
              label: "Workday Id",
              field: "workdayId",
              align: "left",
            },
            {
              name: "contractEffectiveDate",
              label: "Contract Effective Date",
              field: "contractEffectiveDate",
              align: "left",
            },
            {
              name: "contractSignedDate",
              label: "Contract Signed Date",
              field: "contractSignedDate",
              align: "left",
            },
            {
              name: "actions",
              label: this.$tr("isite.cms.form.actions"),
              align: "left",
            },
          ],
          filters: {
            customerId: {
              quickFilter: true,
              value: null,
              type: "select",
              loadOptions: {
                apiRoute: "apiRoutes.qsetupagione.setupCustomers",
                select: { label: "customerName", id: "id" },
              },
              props: {
                label: "Customer",
                clearable: true,
              },
            },
            buildingId: {
              value: null,
              type: "select",
              quickFilter: true,
              loadOptions: {
                apiRoute: "apiRoutes.qsetupagione.setupBuildings",
                select: { label: "buildingName", id: "id" },
              },
              props: {
                label: "Building",
                clearable: true,
              },
            },
            costCenterId: {
              value: null,
              type: "select",
              quickFilter: true,
              loadOptions: {
                apiRoute: "apiRoutes.qsetupagione.setupCostCenters",
                select: { label: "name", id: "id" },
              },
              props: {
                label: "Cost Center",
                clearable: true,
              },
            },
            businessUnitId: {
              value: null,
              type: "select",
              quickFilter: true,
              loadOptions: {
                apiRoute: "apiRoutes.qsetupagione.businessUnits",
                select: { label: "workdayWid", id: "id" },
              },
              props: {
                label: "Business Unit Id",
                clearable: true,
              },
            },
          },
          requestParams: {},
        },
        create: false,
        update: {
          title: "Update contract",
        },
        delete: false,
        formLeft: {
          id: {
            value: null,
          },
          contractName: {
            value: "",
            type: "input",
            props: {
              rules: [
                (val) => !!val || this.$tr("isite.cms.message.fieldRequired"),
              ],
              label: "Contract Name",
              clearable: true,
              color: "primary",
              readonly: true,
              "hide-bottom-space": false,
            },
            label: "Contract Name",
          },
          contractDescription: {
            value: "",
            type: "input",
            props: {
              type: "textarea",
              rules: [
                (val) => !!val || this.$tr("isite.cms.message.fieldRequired"),
              ],
              label: "Contract Description",
              clearable: true,
              color: "primary",
              "hide-bottom-space": false,
            },
            label: "Contract Description",
          },
          readyToPostWd: {
            value: "false",
            type: "select",
            props: {
              label: "Ready To Post Wd",
              options: [
                {label: this.$tr('isite.cms.label.enabled'), value: true},
                {label: this.$tr('isite.cms.label.disabled'), value: false},
              ],
            },
          },
          oneClickPost: {
            value: "false",
            type: "select",
            props: {
              label: "One Click Post",
              options: [
                {label: this.$tr('isite.cms.label.enabled'), value: true},
                {label: this.$tr('isite.cms.label.disabled'), value: false},
              ]
            },
          },
        },
        formRight: {
          contractStatusId: {
            value: "",
            type: "input",
            props: {
              rules: [
                (val) => !!val || this.$tr("isite.cms.message.fieldRequired"),
              ],
              label: "contract Status Id",
              clearable: true,
              color: "primary",
              "hide-bottom-space": false,
              readonly: true,
            },
            label: "contract Status Id",
          },
          contractTypeId: {
            value: "",
            type: "select",
            props: {
              label: "Contract Type",
              readonly: true,
            },
            loadOptions: {
              apiRoute: "apiRoutes.qsetupagione.contractType",
              select: { label: "typeName", id: "id" },
              requestParams: { refresh: true },
            },
          },
          contractEffectiveDate: {
            value: "",
            type: "fullDate",
            props: {
              rules: [
                (val) => !!val || this.$tr("isite.cms.message.fieldRequired"),
              ],
              label: `* Contract Effective Date`,
              clearable: true,
              color: "primary",
              format24h: true,
              readonly: true,
            },
          },
          workdayId: {
            value: "",
            type: "input",
            props: {
              rules: [
                (val) => !!val || this.$tr("isite.cms.message.fieldRequired"),
              ],
              label: "Workday Id",
              clearable: true,
              color: "primary",
              "hide-bottom-space": false,
              readonly: true,
            },
            label: "Workday Id",
          },
          customerId: {
            value: null,
            type: "select",
            quickFilter: true,
            loadOptions: {
              apiRoute: "apiRoutes.qsetupagione.setupCustomers",
              select: { label: "customerName", id: "id" },
            },
            props: {
              label: "Customer",
              clearable: true,
              readonly: true,
            },
          },
          buildingId: {
            value: null,
            type: "select",
            quickFilter: true,
            loadOptions: {
              apiRoute: "apiRoutes.qsetupagione.setupBuildings",
              select: { label: "buildingName", id: "id" },
            },
            props: {
              label: "Building",
              clearable: true,
              readonly: true,
            },
          },
          costCenterId: {
            value: null,
            type: "select",
            quickFilter: true,
            loadOptions: {
              apiRoute: "apiRoutes.qsetupagione.setupCostCenters",
              select: { label: "name", id: "id" },
            },
            props: {
              label: "Cost Center",
              clearable: true,
              readonly: true,
            },
          },
          businessUnitId: {
            value: null,
            type: "select",
            quickFilter: true,
            loadOptions: {
              apiRoute: "apiRoutes.qsetupagione.businessUnits",
              select: { label: "workdayWid", id: "id" },
            },
            props: {
              label: "Business Unit Id",
              clearable: true,
              readonly: true,
            },
          },
          companyId: {
            value: null,
            type: "select",
            quickFilter: true,
            loadOptions: {
              apiRoute: "apiRoutes.qsetupagione.setupCompanies",
              select: { label: "fullName", id: "id" },
            },
            props: {
              label: "Company",
              clearable: true,
              readonly: true,
            },
          },
        },
        getDataForm: (data, typeForm) => {
          return new Promise((resolve, reject) => {
            resolve({
              ...data,
              contractEffectiveDate: this.dateFormatterFull(data.contractEffectiveDate),
            })
          })
        }
      };
    },
  },
  methods:{
    dateFormatterFull(date, type = "datetime") {
      if (!date) return null
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
