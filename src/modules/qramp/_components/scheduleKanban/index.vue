<template>
  <div>
    <kanbanBoard />
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, watch, onMounted } from "vue";
import kanbanBoard from "./components/kanbanBoard.vue";
import workOrderList from '../../_store/actions/workOrderList'
import qRampStore from "../../_store/qRampStore";
import kanbanStore from './store/kanban.store'

export default defineComponent({
  components: {
    kanbanBoard,
  },
  props: {
    isBlank: {
      type: Boolean,
      default: () => false,
    }
  },
  setup(props) {
    const proxy = (getCurrentInstance() as any).proxy as any;
    init();
    watch(() => proxy.$route, (currentValue, oldValue) => {
        init();
      },
      { deep: true }
    );
    function init() {
      new Promise(async (resolve, reject) => {
        const currentRouteName = proxy.$router.currentRoute.path.indexOf('passenger');
        await workOrderList().setStationList([]);
        await qRampStore().setIsPassenger(currentRouteName !== -1);
        await workOrderList().getAllList();
        await workOrderList().getCustomerWithContract();
      })
    }
    onMounted(() => {
      kanbanStore.isBlank = props.isBlank;
      qRampStore().setIsblank(props.isBlank)
    })
    return {};
  },
});
</script>

<style scoped></style>
