<template>    
    <quick-card :params="quickCardParams" />
</template>
<script>
//Component
import quickCard from '@imagina/qsite/_components/master/quickCard';
import syncCard from './components/syncCard.vue';

export default {
  name: 'workdaySync',
  props: {},
  components: {quickCard, syncCard},
  watch: {},
  mounted() {
    this.$nextTick(function () {
    })
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    quickCardParams() {
      return {
        type: 'custom',
        title: 'Workday Sync',
        icon: 'fa-light fa-briefcase',        
        apiRoute: "apiRoutes.qsetupagione.workdaySync",
        requestParams: {
          filter: {"field": "name"}
        },
        syncApiRoute: "apiRoutes.qsetupagione.workdaySyncPost",
        syncRequestParams: {},
        component: syncCard, //custom component to render
        buttonLabel: 'Sync'
      }
    }
  },
  methods: {}
}
</script>
<style lang="stylus">
</style>
  