<template>
  <quick-card :params="quickCardParams" />
</template>
<script>
//Component
import quickCard from '@imagina/qsite/_components/master/quickCard';
import QCharts from '@imagina/qsite/_components/master/charts.vue';

export default {
  props: {},
  components: {quickCard, QCharts},
  watch: {},
  mounted() {
    this.$nextTick(function () {
    })
  },
  data() {
    return {
      loading: false,
      posts: [],
    }
  },
  computed: {
    quickCardParams() {
      return {
        type: 'chart',
        title: 'Work orders by status lines',
        icon: 'fa-light fa-briefcase',
        apiRoute:"apiRoutes.qramp.workOrdersByStatusLines"
      }
    }
  },
  methods: {}
}
</script>
<style lang="stylus">
</style>
