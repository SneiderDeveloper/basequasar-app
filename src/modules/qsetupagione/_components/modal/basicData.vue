<template>
  <div class="q-py-lg q-pa-md">
    <q-card class="my-card">
      <q-card-section>
        <div class="row q-px-md">
          <div
            :class="{
              'col-6': isDesktop,
              'col-12': !isDesktop,
            }"
          >
            <p>Name: {{ basicDataContract.contractName }}</p>
            <p>Customer: {{ basicDataContract.customer.customerName }}</p>
            <p>Status: {{ basicDataContract.contractStatus.statusName }}</p>
          </div>
          <div
            :class="{
              'col-6': isDesktop,
              'col-12': !isDesktop,
            }"
          >
            <p>Cost Center: {{ basicDataContract.costCenter.name }}</p>
            <p>WorkDay: {{ basicDataContract.workdayId }}</p>
            <p>Work Tag: {{ basicDataContract.worktag }}</p>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import qSetupStore from "../../_store/qSetupStore.js";

export default {
  computed: {
    isDesktop() {
      return window.innerWidth >= "900";
    },
    basicDataContract() {
      return qSetupStore().getBasicDataContract();
    },
  },
};
</script>