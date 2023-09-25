<template>
  <div>
    <flightMap />
    <flightDetail />
  </div>
</template>
<script>
import flightMap from "./flightMap.vue";
import flightDetail from "../modal/flightDetail.vue";
import qRampStore from "../../_store/qRampStore.js";
export default {
  components: {
    flightMap,
    flightDetail,
  },
  watch: {
    '$route.name': {
      deep: true,
      handle: async (newValue) => {
        const currentRouteName = this.$router.currentRoute.path.indexOf('passenger');
        qRampStore().setIsPassenger(currentRouteName !== -1);
      }
    },
  },
  async mounted() {
    const currentRouteName = this.$router.currentRoute.path.indexOf('passenger');
    await qRampStore().setIsPassenger(currentRouteName !== -1);
    await qRampStore().getFlights();
  },
  beforeDestroy() {
    qRampStore().setFlightList([]);
    qRampStore().setFlightId(null);
  }
};
</script>