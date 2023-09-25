<template>
    <div>
        <div 
            v-if="['day-agenda', 'week-agenda'].includes(scheduleType)"
            :class="{
                'h-43': cards.length === 0,
            }" 
            class="
              tw-inline-flex 
              tw-items-center
              tw-w-full
              tw-px-4
              tw-py-2
              tw-mt-1
              tw-text-xs 
              lg:tw-text-base
              tw-leading-none 
              tw-bg-white
              tw-rounded-lg
              tw-label-not
              tw-h-12"
            >
            <div 
              class="
                tw-text-blueGray-500
                "
                v-if="cards.length > 0"
            >
                <div v-if="uncompleted">
                    <span class="tw-text-orange-400">
                        <i class="fa-solid fa-circle-exclamation" />
                    </span>
                    <span class="tw-text-sm" >
                        {{ uncompleted }} Not completed
                    </span>
                </div>
                <div v-if="completed">
                    <span class="tw-text-green-500">
                        <i class="fa-solid fa-circle-exclamation" />
                    </span>
                    <span class="tw-text-sm" >
                        {{ completed }} Completed
                    </span>
                </div>
            </div>

            <div 
                class="tw-absolute tw-right-5"
                :class="{
                    'tw-mt-1': cards.length === 0
                }"
            >
            <div class="
                tw-inline-flex
                tw-items-center
                tw-justify-center"
            >
                <q-btn
                    v-if="!isBlank && !showInline"
                    icon="fa-light fa-plus tw-text-blue-500"
                    size="sm"
                    outline
                    unelevated
                    flat
                    dense
                    @click="openForm"
                />
                <span class="
                    tw-h-4
                    tw-text-lg
                    tw-text-gray-200
                    tw-mx-2"
                    :class="{
                      'tw-border-l-2': !isBlank
                    }"
                />
                <q-btn
                    icon="fa-light fa-rotate-right tw-text-blue-500"
                    size="sm"
                    outline
                    unelevated
                    flat
                    dense
                    @click="refresh"
                />
            </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useCompletedSchedule from '../uses/useCompletedSchedule'

export default defineComponent({
    props: {
        scheduleType: {
            type: String,
            default: () => 'week-agenda'
        },
        isWeekAgenda: {
            type: Boolean,
            default: true
        },
        column: {
            type: Object,
            default: () => {}
        }
    },
    setup(props, {emit}) {
        return {
            ...useCompletedSchedule(props, emit)
        }
    }
})
</script>

<style>
.h-43 {
  height: 43px !important;
}
</style>
