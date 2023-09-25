<template>
  <div :class="{'lg:tw-flex-wrap lg:tw-space-x-0 xl:tw-flex xl:tw-space-x-2' : inlineMode }">
    <div v-for="(field, keyField) in fields.form" :key="keyField">
      <dynamic-field
        v-if="keyField !== 'sta' && keyField !== 'outboundScheduledDeparture'"
        :field="field"
        v-model="form[keyField]"
        @input="zanetizeData(keyField)"
        :class="{
         'tw-hidden': keyField === 'stationId',
         'xl:tw-w-fit' : inlineMode }"
      />
      <div v-if="isbound.inbound && keyField === 'sta'">
        <dynamic-field
          :field="field"
          v-model="form[keyField]"
          @input="zanetizeData(keyField)"
          :class="{ 'tw-hidden': keyField === 'stationId' }"
        />
      </div>
      <div v-if="isbound.outbound && keyField === 'outboundScheduledDeparture'">
        <dynamic-field
            :field="field"
            v-model="form[keyField]"
            @input="zanetizeData(keyField)"
            :class="{ 'tw-hidden': keyField === 'stationId' }"
          />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useModalSchedule from '../uses/useModalSchedule'

export default defineComponent({
  props:{
    inlineMode: {
      type: Boolean,
      default: false,
    }
  },
  setup (props, {emit}) {
    return {...useModalSchedule(props, emit)}
  }
})
</script>

<style scoped>

</style>