<template>
    <master-modal
      v-if="!isAppOffline"
      v-model="visible"
      :title="`Comments Work Order Id:${commentableId}`"
      :persistent="true"
      :loading="loading"
      @hide="hideModalComments"
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
  
<script lang="ts">
import { defineComponent } from 'vue'
import useModalComment from '../uses/useModalComments';
import comments from "@imagina/qsite/_components/master/comments/index.vue";

export default defineComponent({
  components: {
    comments
  },
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
  setup (props) {
    return {...useModalComment(props)}
  }
})
</script>

<style scoped>

</style>