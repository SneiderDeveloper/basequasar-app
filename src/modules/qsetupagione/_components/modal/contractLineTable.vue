<template>
  <div class="q-pa-md">
    <q-table
      title="Contract Lines"
      :data="tableData"
      :columns="columns"
      row-key="name"
      class="stick-table"
    />
  </div>
</template>
<script>
import qSetupStore from "../../_store/qSetupStore.js";

export default {
  data() {
    return {
      columns: [
        {
          name: "contractLineName",
          label: "Line Name",
          align: "left",
          field: 'contractLineName',
        },
        {
          name: "contractLineDescription",
          label: "Description",
          align: "left",
          field: 'contractLineDescription',
        },
        {
          name: "contractLineWorkdayId",
          label: "Workday Id",
          align: "left",
          field: 'contractLineWorkdayId',
        },
        {
          name: "workdaySalesLineItemId",
          label: "Workday Sales Line Item Id",
          align: "left",
          field: 'workdaySalesLineItemId',
        },
        {
          name: "workdayContractLineStatus",
          label: "Workday Contract Line Status",
          align: "left",
          field: 'workdayContractLineStatus',
        },
      ],
    };
  },
  computed: {
    tableData() {
      return qSetupStore().getContractLineList();
    },
  }
};
</script>