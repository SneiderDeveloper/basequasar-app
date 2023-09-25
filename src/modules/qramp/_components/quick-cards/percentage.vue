<template>
  <quick-card :params="quickCardParams" />
</template>
<script>
//Component
import quickCard from '@imagina/qsite/_components/master/quickCard'

export default {
  props: {},
  components: {quickCard},
  watch: {},
  mounted() {
    this.$nextTick(function () {
    })
  },
  data() {
    return {
      loading: false,
      posts: []
    }
  },
  computed: {
    quickCardParams() {
      return {
        type: 'percentage',
        title: 'Work Orders Posted',
        icon: 'fa-light fa-briefcase',
        apiRoute: 'apiRoutes.qramp.percentageWorkOrdersPosted',
      }
    }
  },
  methods: {}
}
</script>
<style lang="stylus">
</style>
