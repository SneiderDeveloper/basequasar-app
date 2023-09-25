<template>
  <div>
    <master-modal
      v-model="showModal"
      :title="titleModal"
      :persistent="true"
      custom-position
      :actions="actions"
      :loading="loading"
      @hide="clear"
    >
      <div class="tw-px-4">
        <formFields ref="refFormFields" />
      </div>
    </master-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import useSchedulerModal from "./uses/useSchedulerModal";
import formFields from './components/formFields.vue';

export default defineComponent({
  components:{
    formFields
  },
  setup() {
    return { ...useSchedulerModal() };
  },
});
</script>

<style scoped></style>
