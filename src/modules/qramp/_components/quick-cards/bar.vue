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
      dataChart: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: ['#8A2BE2', '#FFD700', '#7CFC00', '#800000', '#FF4500', '#28489a'],
            data: [5.9, 19, 25, 30, 35, 39, 0]
          }
        ]
      },
    }
  },
  computed: {
    chartData() {
      if (this.dataChart.datasets.length === 0) return;
      return {
        type: 'barChart',
        dataSets: this.dataChart.datasets,
        dataLabels: this.dataChart.labels
      }
    },
    quickCardParams() {
      return {
        type: 'chart',
        title: 'Work Orders by status (Current Month)',
        icon: 'fa-light fa-briefcase',
        apiRoute:"apiRoutes.qramp.workOrdersByStatus"
      }
    }
  },
  methods: {}
}
</script>
<style lang="stylus">
</style>
