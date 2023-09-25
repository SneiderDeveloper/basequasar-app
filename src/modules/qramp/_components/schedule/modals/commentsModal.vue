<template>
  <master-modal
    v-if="!isAppOffline"
    v-model="visible"
    :title="`Comments Work Order Id:${commentableId}`"
    :persistent="true"
    :loading="loading"
    @hide="hideModal"
    width="60%"
    :maximized="$q.screen.lt.md"
  >
    <comments
      v-if="commentableId > 0"
      apiRoute="apiRoutes.qramp.comments"
      :commentableId="Number(commentableId)"
      commentableType="Modules\Ramp\Entities\WorkOrder"
      permisionComments="ramp.work-orders-comments"
      class="tw-py-4"
    />
  </master-modal>
</template>

<script>
import comments from "@imagina/qsite/_components/master/comments/index.vue";

export default {
  components: { comments },
  props: {
    commentableId: {
      type: Number,
      default: () => 0,
    },
    isCrud: {
      type: Boolean,
      default: () => false,
    },
  },
  data: () => ({
    visible: false,
    loading: false,
    stationId: null,
  }),
  computed: {
    isAppOffline() {
      return this.$store.state.qofflineMaster.isAppOffline;
    },
    permisionCommentsIndex() {
      return this.$auth.hasAccess('ramp.work-orders-comments.index');
    },
  },
  methods: {
    hideModal() {
      this.visible = false;
      if(this.isCrud) {
        this.$root.$emit('crud.data.refresh')
        this.$emit('getWorkOrders');
      }
    },
    showModal() {
      if(!this.permisionCommentsIndex) {
          this.$alert.warning({message: 'You do not have permission to view comments'});
        return;
      }
      this.visible = true;
    },
  },
};
</script>