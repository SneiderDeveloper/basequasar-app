import Vue, {computed} from 'vue';
import {STATUS_DRAFT, STATUS_SCHEDULE} from '../../model/constants.js';
import modalScheduleStore from '../store/modalSchedule.store'
import storeKanban from '../store/kanban.store'
import _ from "lodash";
import getCurrentColumn from '../actions/getCurrentColumn';


export default function useCompletedSchedule(props: any, emit: any) {
  const isBlank = computed(() => storeKanban.isBlank);
  const scheduleType = computed(() => props.scheduleType);
  const dateColumn = computed(() => props.column.date.format('YYYY-MM-DD'));
  const cards = computed(() => props.column.cards)


  const showInline = computed(()=> modalScheduleStore.showInline)
  const modalShowSchedule = computed({
    get: () => modalScheduleStore.showModal,
    set: (value: boolean) => modalScheduleStore.showModal = value
  })
  const modalTitleSchedule = computed({
    get: () => modalScheduleStore.titleModal,
    set: (value: string) => modalScheduleStore.titleModal = value
  })

  const openForm = computed(() => props.isWeekAgenda? openModalForm : openInlineForm)
  const completed = computed(() => props.column.completed)
  const uncompleted = computed(() => props.column.uncompleted)  
  
  function openModalForm() {
    modalScheduleStore.isEdit = false;
    modalShowSchedule.value = true;
    modalTitleSchedule.value = `Create schedule date: ${dateColumn.value}`;
    modalScheduleStore.seletedDateColumn = dateColumn.value;
  }

  function openInlineForm() {
    modalScheduleStore.isEdit = false;
    modalScheduleStore.showInline = true;
    modalScheduleStore.seletedDateColumn = dateColumn.value;
    const dummyCard = {
      id: false,
      editable: true,
      statusId: null,
    }
    const col = getCurrentColumn()
    col.cards.unshift(dummyCard)
  }

  function refresh() {
    modalScheduleStore.showInline = false; // forces to close the scheduleForm
    emit('refresh');
  }
  return {    
    scheduleType,
    modalShowSchedule,
    refresh,
    openModalForm,
    isBlank,
    openInlineForm,
    showInline,
    openForm,
    completed,
    uncompleted,
    cards
  }
}
