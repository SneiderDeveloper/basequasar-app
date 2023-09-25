<template>
  <div
    v-if="event.comments > 0 && permisionComments"
    class="
     badger-comment
     tw-relative 
     tw-inline-flex 
     tw-items-center 
     tw-font-medium 
     tw-text-center 
     tw-rounded-lg 
     hover:bg-blue-800 
     focus:ring-4 
     focus:outline-none 
     focus:ring-blue-300 
     dark:bg-blue-600
     dark:hover:bg-blue-700 
     dark:focus:ring-blue-800 
     tw-text-xl
     tw-cursor-pointer"
     :class="mainClass"
  >
    <i 
      class="
       fa-light 
       fa-comment-lines 
       tw-pr-1 
       tw-text-red-500
        tw-font-semibold"
      :class="iconClass" 
     />
    <div
      v-if="event.comments && event.comments > 0"
      class="
       tw-absolute 
       tw-inline-flex 
       tw-items-center 
       tw-justify-center 
       tw-w-4 
       tw-h-4 
       tw-font-bold 
       tw-text-white 
       tw-border 
       tw-bg-red-500 
       tw-rounded-full 
       tw--top-1 
       tw--right-2 
       dark:border-gray-900"
      :style="`font-size: ${sizeBadge}px`"
    >{{ event.comments }}</div>
    <q-tooltip
      v-model="event.showCommentTooltip"
      :content-class="{
        tooltipComments: true,
        'tw-text-center': loadingComment,
      }"
      @input="changeLastComment(event)"
      :offset="[10, 10]"
    >
      <div v-if="loadingComment" class="tw-py-2">
        <i class="fa-thin fa-spinner-third fa-spin fa-pulse tw-text-2xl" />
      </div>
      <div v-else>
        <p class="tw-text-sm tw-font-semibold">Last comment</p>
        <div class="tw-text-sm" v-html="lastComment" />
      </div>
    </q-tooltip>
  </div>
</template>

<script lang="ts">
import Vue, { computed, defineComponent } from "vue";
import {
  getCommentsFilter,
  getLastComment,
  setLastComment,
  getLoading
} from "../../_store/actions/comments";

export default defineComponent({
  props: {
    event: {
      default: () => {}
    },
    sizeBadge: {
      type: Number,
      default: () => 9,
    },
    iconClass: {
      type: String,
      default: () => '',
    },
    mainClass: {
      type: String,
      default: () => '',
    },
  },
  setup(props) {
    const loadingComment = computed(() => getLoading());
    const event = computed(() => props.event);
    const sizeBadge = computed(() => props.sizeBadge);
    const iconClass = computed(() => props.iconClass);
    const permisionComments = computed(() =>
      Vue.prototype.$auth.hasAccess(`ramp.work-orders-comments.index`)
    );
    const lastComment = computed(() => getLastComment());
    async function changeLastComment(event) {
      await setLastComment("");
      if (event.showCommentTooltip) {
        await getCommentsFilter(event.id);
        return;
      }
    }
    return {
      event,
      permisionComments,
      loadingComment,
      changeLastComment,
      lastComment,
      sizeBadge,
      iconClass,
    };
  }
});
</script>

<style scoped></style>
