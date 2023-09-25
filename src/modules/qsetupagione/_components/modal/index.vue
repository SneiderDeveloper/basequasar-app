<template>
  <div>
    <master-modal
      id="modalComponent"
      v-model="visibleContract"
      v-bind="modalProps"
      custom-position
      :persistent="true"
      :loading="modalLoadingContract"
      @hide="hideVisibleContract"
      :width="'90vw'"
      :maximized="$q.screen.lt.md"
    >
      <basicData />
      <contractLineTable />
      <crud 
        :crud-data="import('../../_crud/contractRules.vue')"
        :customData="customCrudData"
        title="Contract rules"
      />
    </master-modal>
  </div>
</template>
<script>
import qSetupStore from "../../_store/qSetupStore.js";
import basicData from '../../_components/modal/basicData.vue';
import contractLineTable from '../../_components/modal/contractLineTable.vue';

export default {
  components: {
    basicData,
    contractLineTable
  },
  computed: {
    visibleContract: {
      get() {
        return qSetupStore().getVisibleContract();
      },
      set(value) {
        qSetupStore().setVisibleContract(value);
      },
    },
    modalProps() {
      return qSetupStore().getModalProps();
    },
    modalLoadingContract() {
      return qSetupStore().getModalLoadingContract();
    },
    customCrudData() {
      return { 
        read: {
          searchAction: false,
          requestParams: {
            include:"contract,product",
            filter: {
              contractId: qSetupStore().getContractId(),
            }
          },
          filters: {}
        }
      }
    },
  },
  methods: {
    hideVisibleContract() {
      qSetupStore().hideVisibleContract();
      qSetupStore().resetBasicDataContract();
      qSetupStore().setContractLineList([]);
      qSetupStore().setContractId(0);
    },
  },
};
</script>