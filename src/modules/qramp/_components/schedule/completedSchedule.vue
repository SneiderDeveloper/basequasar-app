<template>
    <div>
        <div 
            v-if="['day-agenda', 'week-agenda'].includes(scheduleType)" 
            class="
              tw-inline-flex 
              tw-items-center
              tw-w-full
              tw-px-2 
              tw-py-1 
              tw-mt-1
              tw-text-xs 
              lg:tw-text-base 
              tw-font-bold 
              tw-leading-none 
              tw-bg-white
              tw-rounded-lg
              tw-label-not"
            >
            <div 
              :class="{
                'tw-text-green-500': isEventListComplete(timestamp.date),
                'tw-text-orange-500': !isEventListComplete(timestamp.date)
              }"
            >
                <i class="fa-solid fa-circle" />
                <span v-html="titleCompletedSchedule(timestamp.date)" />
                <div 
                   class="
                    tw-text-green-500 
                    tw-text-left 
                    tw-py-1"
                    v-if="countIncompleteEvents(timestamp.date)[0] > 0 
                    && !isEventListComplete(timestamp.date)"
                >
                    <i class="fa-solid fa-circle" />
                    {{ totalCompleted(timestamp.date) }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import _ from "lodash";
import {STATUS_DRAFT, STATUS_SCHEDULE} from '../model/constants.js'

export default defineComponent({
    props: {
        getEvents: {
            type: Function,
            default: () => {}
        },
        scheduleType: {
            type: String,
            default: () => ''
        },
        timestamp: {
            type: Object,
            default: () => {}
        }
    },
    setup(props) {
        const timestamp = computed(() => props.timestamp);
        const scheduleType = computed(() => props.scheduleType);
        function isEventListComplete(date: string): boolean {
            return _.every(Object.entries(props.getEvents(date, false).data), (elemento) => {
                return _.every(elemento[1], (objeto) => {
                return objeto.statusId !== STATUS_DRAFT && objeto.statusId !== STATUS_SCHEDULE;
                });
            });
        }
        function countIncompleteEvents(date: string): number[] {
            let incomplete = 0;
            let completed = 0;
            const events = props.getEvents(date, false).data;
            
            Object.entries(events).forEach((entry: any) => {
                entry[1].forEach((objeto) => {
                if (objeto.statusId === STATUS_DRAFT || objeto.statusId === STATUS_SCHEDULE) {
                    incomplete++;
                } else {
                    completed++;
                }
                });
            });
            
            return [completed, incomplete];
        }
        function titleCompletedSchedule(date: string): string {
            const completed = isEventListComplete(date);
            const event = countIncompleteEvents(date);
            return completed ? ' Completed' : ` ${event[1]} Not completed`
        }

        function totalCompleted(date: string): string {
            const complete = countIncompleteEvents(date);
            return `${complete[0]} Completed`;
        }

        return {
            isEventListComplete,
            titleCompletedSchedule,
            timestamp,
            scheduleType,
            totalCompleted,
            countIncompleteEvents,
        }
    }
})
</script>

<style scoped></style>