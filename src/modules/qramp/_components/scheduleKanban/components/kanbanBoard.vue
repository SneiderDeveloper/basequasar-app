<template>
  <div class="kanbanBoardCtn">
      <page-actions
        ref="pageActions" 
        :title="title"
        multipleRefresh
        :extra-actions="extraPageActions"  
        class="q-mb-md"
        @refresh="buildKanbanStructure(true)" 
      />
    <filters />
    <filtersBar v-if="false"/>
   <actionBar /> 
  <div class="tw-flex">
    <div
      class="
        tw-flex-none 
        tw-py-4 
        tw-border-b 
        tw-border-gray-200 
        tw-space-y-4 tw-hidden"
    >
      <q-btn-toggle
        v-model="scheduleType"
        rounded
        no-caps
        unelevated
        toggle-color="blue-grey"
        color="grey-2"
        text-color="blue-grey"
        :options="scheduleTypeOptions"
        id="btnCalendarType"
        size="14px"
        spread
        class="tw-py-2"
      />
      <q-date v-model="selectedDate" minimal size="sm"/>
      <dynamic-field v-model="filterTime" :field="dynamicFieldTime" />
    </div>

    <div
      v-if="columns.length > 0" 
      class="
       tw-flex-1 
       tw-h-auto 
       tw-flex 
       tw-overflow-x-auto"
      >
      <kanbanColumn
        v-for="(column, index) in columns"
        :key="index"
        :column="column"
        :groupOptions="groupOptions"
        class="
         tw-flex-none 
         tw-space-y-0 
         tw-h-auto 
         tw-rounded-lg 
         tw-mb-4"
      />
    </div>
  </div>
  <modalSchedule />
  <formOrders ref="refFormOrders" @getWorkOrderFilter="individualRefreshByColumns" />
  <modalStation />
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import kanbanColumn from "./kanbanColumn.vue";
import useKanbanBoard from '../uses/useKanbanBoard'
import actionBar from './actionBar.vue'
import filters from './filters.vue';
import filtersBar from "./filtersBar.vue";
import modalSchedule from './modalSchedule.vue'
import formOrders from "../../formOrders.vue";
import modalStation from "./modalStation.vue";

export default defineComponent({
  components: {
    kanbanColumn,
    actionBar,
    filters,
    filtersBar,
    modalSchedule,
    formOrders,
    modalStation
  },
  setup(props) {
    return {...useKanbanBoard(props)}
  },
});
</script>

<style>
.kanbanBoardCtn {
  font-family: 'Manrope', sans-serif;
}
</style>
