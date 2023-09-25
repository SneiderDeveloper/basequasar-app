<template>
    <modalContract />
</template>
<script>
import qSetupStore from '../_store/qSetupStore.js';
import modalContract from '../_components/modal/index.vue';

export default {
  components:{
    modalContract
  },
  computed: {
    crudData() {
      return {
        crudId: this.$uid(),
        apiRoute: "apiRoutes.qsetupagione.setupCustomers",
        read: {
          columns: [
            {
              name: "id",
              label: this.$tr("isite.cms.form.id"),
              field: "id",
              style: "width: 50px",
            },
            {
              name: "customerName",
              label: "Customer Name",
              field: "customerName",
              align: "left",
            },
            {
              name: "workdayId",
              label: "Workday Id",
              field: "workdayId",
              align: "left",
            },
            {
              name: "customerStatus",
              label: "Customer Status",
              field: "customerStatus",
              format: (val) => (val ? val.statusName : ""),
              align: "left",
            },
            {
              name: "airline",
              label: "Airline",
              field: "airline",
              format: (val) => (val ? val.airlineName : ""),
              align: "left",
            },
            {
              name: "adHocWorkOrders",
              label: "ad Hoc Work Orders",
              field: "adHocWorkOrders",
              format: (val) => (val ? "Yes" : "No"),
              align: "left",
            },
            {
              name: "actions",
              label: this.$tr("isite.cms.form.actions"),
              align: "left",
            },
          ],
          requestParams: { include: "customerStatus,airline" },
          relation: {
            label: 'Contracts',
            apiRoute: "apiRoutes.qsetupagione.contracts",
            requestParams: (row) => ({
              filter: {customerId: row.id},
              include: "contractType,contractStatus,costCenter",
            }),
            columns: [
              {
                name: "Id",
                label: "ID",
                field: "id",
                align: "left",
              },
              {
                name: "contractName",
                label: "Name",
                field: "contractName",
                align: "left",
              },
              {
                name: "customerName",
                label: "Customer",
                field: "customer",
                format: (val) => val?.customerName || "-",
                align: "left",
              },
              {
                name: "costCenter",
                label: "Cost Center",
                field: "costCenter",
                format: (val) => val?.name || "-",
                align: "left",
              },
              {
                name: "workdayId",
                label: "Workday Id",
                field: "workdayId",
                align: "left",
              },
              {
                name: "contractStatus",
                label: "Status",
                field: "contractStatus",
                format: (val) => val?.statusName || "-",
                align: "left",
              },
              {
                name: "contractType",
                label: "Type",
                field: "contractType",
                format: (val) => val?.typeName || "-",
                align: "left",
              },
              {
                name: "actions",
                label: this.$tr("isite.cms.form.actions"),
                align: "left",
                align: "left",
              },
            ],
            actions: [
              {
                name: "show",
                icon: "fas fa-eye",
                label: this.$tr("isite.cms.label.show"),
                action: (item) => {
                  qSetupStore().showVisibleContract();
                  qSetupStore().setModalProps({
                    title: `Contract: ${item.contractName}`,
                    update: false
                  });
                  qSetupStore().setContractId(item.id);
                  qSetupStore().showBasicDataContract(item.id);
                },
              },
            ],
          },
        },
        create: false,
        update: {
          title: "Update customer",
        },
        delete: true,
        formLeft: {
          id: {
            value: null,
          }, 
          customerName: {
            name: "customerName",
            value: "",
            type: "input",
            props: {
              rules: [
                (val) => !!val || this.$tr("isite.cms.message.fieldRequired"),
              ],
              readonly: true,
              label: "Customer",
              clearable: true,
              color: "primary",
              "hide-bottom-space": false,
            },
            label: "Customer Name",
          },
          workdayId: {
            name: "workdayId",
            value: "",
            type: "input",
            props: {
              rules: [
                (val) => !!val || this.$tr("isite.cms.message.fieldRequired"),
              ],
              readonly: true,
              label: "WorkdayId",
              clearable: true,
              color: "primary",
              "hide-bottom-space": false,
            },
            label: "workday Id",
          },
          customerStatusId: {
            value: "",
            type: "select",
            props: {
              label: "Status",
            },
            loadOptions: {
              apiRoute: "apiRoutes.qsetupagione.customerStatuses",
              select: { label: "statusName", id: "id" },
              requestParams: { refresh: true },
            },
          },
          airlineId: {
            value: null,
            type: 'crud',
            props: {
              crudType: 'select',
              crudData: import('src/modules/qfly/_crud/airline'),
              crudProps: {
                label: 'Airline',
              },
              config: {options: {label: 'airlineName', value: 'id'}},
            },
          },
          adHocWorkOrders: {
            value: "false",
            type: "select",
            props: {
              label: "adHocWorkOrders",
              options: [
                { id: 0, value:'false', label: 'false' },
                { id: 1, value:'true', label: 'true' },
              ],
            },
          },
        },
      };
    },
  },
};
</script>