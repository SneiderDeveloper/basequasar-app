import Vue, {computed, inject } from 'vue';
import storeKanban from '../store/kanban.store';
import {
  STATUS_DRAFT,
  STATUS_CLOSED,
  STATUS_POSTED,
  STATUS_SUBMITTED,
  STATUS_SCHEDULE,
} from '../../model/constants.js';
import workOrderList from '../../../_store/actions/workOrderList';
import qRampStore from './../../../_store/qRampStore.js'
import modalScheduleStore from '../store/modalSchedule.store'
import showWorkOrder from '../actions/showWorkOrders';
import openInlineSchedule from '../actions/openInlineSchedule'
import scheduleTypeModel from "../models/scheduleType.model";

export default function useKanbanCard(props: any = {}) {
  const refFormOrders: any = inject('refFormOrders');
  const isBlank = computed(() => storeKanban.isBlank);
  const isPassenger = computed(() => qRampStore().getIsPassenger());
  const isWeekAgenda = computed(() => storeKanban.scheduleType == scheduleTypeModel[0].value );
  const colorCheckSchedule = computed(() => {
    const statusColor: string | undefined = workOrderList()
      .getWorkOrderStatusesList()
      .find(status => status.id === Number(props.card.statusId))?.color;
    const color = statusColor ? `tw-border-${statusColor}` : 'tw-border-gray-200';
    return color;
  })
  const flightStatuses = computed(() => {
    const flightStatuses: any =
      workOrderList()
        .getFlightStatusesList()
        .find(status => status.id === Number(props.card.flightStatusId));
    const color = flightStatuses ? `tw-text-${flightStatuses.color}` : 'tw-text-gray-400';
    const icon = flightStatuses?.icon || 'fa-solid fa-circle-question';
    return flightStatuses ? { name: flightStatuses.name, color, icon } : { name: 'Unknown', color, icon: 'fa-solid fa-circle-question' };
  })
  const actypes = computed(() => {
    const actypesList: any =
      workOrderList()
      .getACTypesList()
        .find(ac => ac.id === Number(props.card.acTypeId));
    return actypesList ? actypesList.fullName : '';
  })
  const gates = computed(() => {
    if(props.card.calendar?.gate && isPassenger.value) {
      if(props.card.calendar.gate.trim().length !== 0 ) return props.card.calendar.gate
    }
    const gateList: any =
      workOrderList()
      .getGatesList()
        .find(gate => gate.id === Number(props.card.gateId));
    return gateList ? `${gateList.name}` : null;
  })
  const titleStatus = computed(() => {
    const statuses = {
      [STATUS_DRAFT]: 'Draft',
      [STATUS_CLOSED]: 'Closed',
      [STATUS_POSTED]: 'Posted',
      [STATUS_SUBMITTED]: 'Submitted',
      [STATUS_SCHEDULE]: 'Scheduled',
    };
    return statuses[props.card.statusId] || '';
  })

  async function openModalSchedule() {
    if (!isWeekAgenda.value && modalScheduleStore.showInline) return
    if (!isWeekAgenda.value && props.card.statusId === STATUS_SCHEDULE && !isPassenger.value){
      openInlineSchedule(props);
      return;
    }
    modalScheduleStore.titleModal = `Edit schedule Id Id: ${props.card.id}`;
    modalScheduleStore.seletedDateColumn = props.dateColumn;
    if(props.card.statusId !== STATUS_SCHEDULE || isPassenger.value) {
      const titleModal = Vue.prototype.$tr('ifly.cms.form.updateWorkOrder') + (props.card.id ? ` Id: ${props.card.id}` : '')
      const response = await showWorkOrder(props.card.id);
      await refFormOrders.value.loadform({
        modalProps: {
          title: titleModal,
          update: true,
          workOrderId: response.data.id,
          width: "90vw",
        },
        data: response.data,
      });
      return;
    }
    modalScheduleStore.isEdit = true;
    modalScheduleStore.showModal = true;
    modalScheduleStore.form = { ...props.card };
  }
  return {
    colorCheckSchedule,
    titleStatus,
    flightStatuses,
    actypes,
    gates,
    openModalSchedule,
    isBlank,
    isPassenger
  };
}