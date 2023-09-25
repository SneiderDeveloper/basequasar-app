import Vue, { computed, ref, onMounted, provide, getCurrentInstance } from 'vue';
import storeKanban from '../store/kanban.store';
import storeFilters from '../store/filters.store'
import moment from 'moment'
import getWorkOrder from '../actions/getWorkOrder'
import getIndividualWorkOrders from '../actions/getIndividualWorkOrders';
import updateWorkOrder from '../actions/updateWorkOrder'
import workOrderList from '../../../_store/actions/workOrderList'
import validateOperationType from '../actions/validateOperationType'
import scheduleTypeModel from '../models/scheduleType.model';
import devicesModel from '../models/devices.model';
import buildKanbanStructure from '../actions/buildKanbanStructure';
import setUrlParams from '../actions/setUrlParams';
import { Screen } from 'quasar';
import modalScheduleStore from '../store/modalSchedule.store';
import getWorkOrdersStatistics from '../actions/getWorkOrderStatistics';

export default function useKanbanColumn(props: any = {}) {
  provide('singleRefreshmentColumn', singleRefreshment);
  const proxy = (getCurrentInstance() as any).proxy as any;
  const isLoading = ref(false);
  const cards: any = computed({
    get: () => props.column.cards,
    set: (value) => (props.column.cards = value),
  });
  const isBlank = computed(() => storeKanban.isBlank);
  const isWeekAgenda = computed(() => storeKanban.scheduleType == scheduleTypeModel[0].value );

  const cardComponentName = computed(() => {
    const kanbanCardComponentName = 'kanban-card';
    const kanbanDayComponentName = 'kanban-day';
    if ( (storeKanban.scheduleType == scheduleTypeModel[1].value) && ( Screen.width > devicesModel.mobile.maxWidth )) return kanbanDayComponentName;
    return kanbanCardComponentName;
  })

  const date = computed(() => props.column.date)
  const selectedDate = computed({
    get: () => storeFilters.selectedDate,
    set: (value) => (storeFilters.selectedDate = value),
  });
  const isDraggingCard = computed({
    get: () => storeKanban.isDraggingCard,
    set: (value) => (storeKanban.isDraggingCard = value),
  });
  const cardHours = computed(() => {
    return (index, card, cards) => index !== 0
      && moment(card.scheduleDate).format('HH') === moment(cards[index - 1].scheduleDate).format('HH')
  })

  async function showKanbanDay(){
    /* only on week-agenda */
    modalScheduleStore.showInline = false;
    if(storeKanban.scheduleType == scheduleTypeModel[0].value) {
      props.column.loading = true;
      storeKanban.columns = [];
      storeFilters.selectedDate = date.value.format('YYYY/MM/DD');
      storeFilters.scheduleType = scheduleTypeModel[1].value;
      storeKanban.scheduleType = storeFilters.scheduleType;
      await buildKanbanStructure;
      props.column.loading = false;
      setUrlParams(proxy);
    }
  }

  function observerCallback(entries) {
    entries.forEach(({ isIntersecting }) => {
      if (isIntersecting) {
        infiniteHandler();
      }
    });
  }
  async function infiniteHandler() {
    try {
      if(props.column.loading || props.column.total === cards.value.length) return;
      isLoading.value = true;
      props.column.page = props.column.page + 1;
      const response = await getIndividualWorkOrders(true, props.column.page, date.value);
      cards.value.push(...response.data);
      isLoading.value = false;
    } catch (error) {
      console.log(error);
      isLoading.value = false;
    }
  }

  async function updateColumnStatistics (date, column){
    const startDate = date.startOf('day');
      const endDate = date.endOf('day');
      const filterTime = storeFilters.filterTime;
      const params = {
        field: "schedule_date",
        type: "customRange",
        from: startDate.set({ hour: filterTime[0], minute: 0, second: 0 }).format('YYYY-MM-DD HH:mm:ss'),
        to: endDate.set({ hour: filterTime[1], minute: 59, second: 59 }).format('YYYY-MM-DD HH:mm:ss')
      }
      const statistics:any = await getWorkOrdersStatistics(true, params)
      column.completed = statistics.data.completed
      column.uncompleted = statistics.data.uncompleted
  }

  async function singleRefreshment(columnDate = null) {
    try {
      props.column.cards = [];
      const page = 1;
      props.column.loading = true
      const scheduleDate = columnDate || date.value;
      await updateColumnStatistics(scheduleDate, props.column);
      const response = await getIndividualWorkOrders(true, page,  scheduleDate);
      props.column.page = page;
      props.column.cards = response.data;
      props.column.loading = false;
    } catch (error) {
      console.log(error);
      props.column.loading = false;
    }
  }
  function setDrag(isDrag = false) {
    if(isBlank) return;
    storeKanban.columns.forEach(item => {
      if(isDrag && props.column.date === item.date) {
        item.isDrag = isDrag
      } else {
        item.isDrag = false
      }
      
    })
  }
  async function changeDate(event) {
    if (event.from.id === event.to.id) return;
    const column: any = storeKanban.columns.find(item => {
      return item.date.format('YYYY-MM-DD') === event.to.id
    });
    if(!column) return;
    try {
      column.loading = true;
      const card = column.cards.find(item => item.id == event.item.id);
      if(!card) return;
      const attributes = updateTransportScheduleChanges(card, event);
      column.cards = [];
      await updateWorkOrder(event.item.id, attributes);
      column.page = 1;
      const response = await getIndividualWorkOrders(true, column.page,  moment(event.to.id));
      const previousColumn:any = storeKanban.columns.find((element) => element.date.format('YYYY-MM-DD') == event.from.id)      
      await updateColumnStatistics( previousColumn.date, previousColumn)
      await updateColumnStatistics( column.date, column)
      column.cards = response.data;
      column.loading = false;
    } catch (error) {
      console.log(error);
      column.loading = false;
    }
  }
  function updateTransportScheduleChanges(card, event) {
    let arrival: any = moment(card.inboundScheduledArrival);
    let departure: any = moment(card.outboundScheduledDeparture);
    const sheduleDateColumn = moment(event.to.id);
    const isbound = validateOperationType(card.operationTypeId);
    if(isbound.inbound && !isbound.outbound) {
      arrival = `${sheduleDateColumn.format('MM/DD/YYYY')} ${arrival.format('HH:MM')}`;
      departure = null;
    }
    if(!isbound.inbound && isbound.outbound) {
      arrival = null;
      departure = `${sheduleDateColumn.format('MM/DD/YYYY')} ${departure.format('HH:MM')}`;
    }
    if(isbound.inbound && isbound.outbound) {
      const daysDifference = sheduleDateColumn.diff(arrival.format('MM/DD/YYYY'), 'days');
      departure.add(daysDifference, 'days');
      arrival = `${sheduleDateColumn.format('MM/DD/YYYY')} ${arrival.format('HH:MM')}`;
      departure = departure.format('MM/DD/YYYY HH:MM');
    }
    return {
      id: event.item.id,
      inboundScheduledArrival: card.inboundScheduledArrival && arrival ? arrival : null,
      outboundScheduledDeparture: card.outboundScheduledDeparture && departure ? departure : null
    }
  }
  onMounted(() => {
    const observerOptions = {
      root: document.querySelector(`.cardCtn-${date.value}`),
    };
    const target: any = document.querySelector(`.trigger-${date.value}`);
    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );
    observer.observe(target);
  })
  return {
    selectedDate,
    isDraggingCard,
    cardHours,
    isLoading,
    cards,
    date,
    singleRefreshment,
    setDrag,
    changeDate,
    isBlank,
    isWeekAgenda,
    showKanbanDay,
    cardComponentName
  }
}
