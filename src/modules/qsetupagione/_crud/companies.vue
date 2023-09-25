<template></template>

<script>
export default {
  computed: {
    crudData() {
      return {
        //permission: 'setup.companies.manage',
        crudId: this.$uid(),
        //entityName: config("main.qsetupagione.entityNames.companies"),
        apiRoute: "apiRoutes.qsetupagione.setupCompanies",
        read: {
          columns: [
            {
              name: "id",
              label: this.$tr("isite.cms.form.id"),
              field: "id",
              style: "width: 50px",
            },
            {
              name: "companyName",
              label: "Company Name",
              field: "companyName",
              align: "left",
            },
            {
              name: "companyCode",
              label: "Company Code",
              field: "companyCode",
              align: "left",
            },
            {
              name: "workdayCode",
              label: "Workday Code",
              field: "workdayCode",
              align: "left",
            },
            {
              name: "workdayWid",
              label: "workdayWid",
              field: "workdayWid",
              align: "left",
            },
            {
              name: "actions",
              label: this.$tr("isite.cms.form.actions"),
              align: "left",
            },
          ],
          requestParams: {},
        },
        update: {
            title: 'Update companies'
        },
        delete: true,
        create: true,
        formLeft: {
          id: {
            value: null,
          },
          companyName: {
            name:'companyName',
            value: '',
            type: 'input',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              label: 'Company name',
              clearable: true,
              color:"primary",
              'hide-bottom-space': false
            },
            label: 'Company name',
          },
          companyCode: {
            name:'companyCode',
            value: '',
            type: 'input',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              label: 'Company code',
              clearable: true,
              color:"primary",
              'hide-bottom-space': false
            },
            label: 'Company code',
          },
          workdayCode : {
            name:'workdayCode',
            value: '',
            type: 'input',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              label: 'Workday code',
              clearable: true,
              color:"primary",
              'hide-bottom-space': false
            },
            label: 'Workday code',
          },
          workdayWid: {
            name:'workdayWid',
            value: '',
            type: 'input',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              label: 'Workday Wid',
              clearable: true,
              color:"primary",
              'hide-bottom-space': false
            },
            label: 'Workday Wid',
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