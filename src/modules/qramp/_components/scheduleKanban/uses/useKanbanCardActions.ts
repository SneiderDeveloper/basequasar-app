import Vue, {computed, inject } from 'vue';
import storeKanban from '../store/kanban.store';
import {
  STATUS_DRAFT,
  STATUS_CLOSED,
  STATUS_POSTED,
  STATUS_SUBMITTED,
  STATUS_SCHEDULE,
} from '../../model/constants.js';

import qRampStore from './../../../_store/qRampStore.js'
import modalScheduleStore from '../store/modalSchedule.store'
import showWorkOrder from '../actions/showWorkOrders';
import scheduleTypeModel from '../models/scheduleType.model';
import { Screen } from 'quasar'
import devicesModel from '../models/devices.model';
import deleteWorkOrders from '../actions/deleteWorkOrders';
import buildKanbanStructure from '../actions/buildKanbanStructure';
import setEditableCard from '../actions/setEditableCard';
import getCurrentColumn from '../actions/getCurrentColumn';
import openInlineSchedule from '../actions/openInlineSchedule'

export default function useKanbanCardActions(props: any = {}) {
  const refFormOrders: any = inject('refFormOrders');
  const isBlank = computed(() => storeKanban.isBlank);
  const isPassenger = computed(() => qRampStore().getIsPassenger());

  const isMobile = computed(() => Screen.width < devicesModel.mobile.maxWidth );
  const isTablet = computed(() => Screen.width >= devicesModel.mobile.maxWidth  && Screen.width < devicesModel.tablet.maxWidth);
  const isDesktop = computed(() => Screen.width >= devicesModel.tablet.maxWidth );
  const showKanbanCardsActions = computed(() => (storeKanban.scheduleType == scheduleTypeModel[1].value) && !isBlank.value )

  const cardComponentName = computed(() => {
    const kanbanCardTabletComponentName = 'kanbanCardTablet';
    const kanbanCardDesktopComponentName = 'kanbanCardDesktop';
    if (isTablet.value) return kanbanCardTabletComponentName
    return kanbanCardDesktopComponentName;
  })

  const showCardActions = computed(()=> !modalScheduleStore.showInline && !modalScheduleStore.showModal)

  const cardActions = computed(() => [
    {
      vIf: showCardActions.value && props.card.statusId === STATUS_SCHEDULE,
      icon: 'fa-light fa-bring-forward',
      toolttip: 'Start Work Order',
      action: () => {
        startWorkOrder()
      },
    },
    {
      vIf: showCardActions.value,
      icon: 'fa-light fa-copy',
      toolttip: 'Duplicate',
      action: () => {
        duplicateWorkOrder()
      },
    },
    {
      vIf: showCardActions.value,
      icon: 'fa-light fa-pen-to-square',
      toolttip: Vue.prototype.$tr('isite.cms.label.edit'),
      action: () => {
        (props.card.statusId === STATUS_SCHEDULE && !isPassenger.value) ? openInlineSchedule(props) : openModalSchedule()
      },
    },
    {
      vIf: showCardActions.value,
      icon: 'fa-light fa-trash',
      toolttip: Vue.prototype.$tr('isite.cms.label.delete'),
      action: () => {
        deleteWorkOrder()
      },
    }
  ])
  
  async function showModalFull() {
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
  }

  async function openModalSchedule() {
    modalScheduleStore.titleModal = `Edit schedule Id Id: ${props.card.id}`;
    modalScheduleStore.seletedDateColumn = props.dateColumn;
    if(props.card.statusId !== STATUS_SCHEDULE || isPassenger.value) {
      showModalFull()
      return;
    }
    modalScheduleStore.isEdit = true;
    modalScheduleStore.showModal = true;
    modalScheduleStore.form = { ...props.card };
  }

  async function startWorkOrder() {
    modalScheduleStore.seletedDateColumn = props.dateColumn;
    modalScheduleStore.loading = true;
    await qRampStore().changeStatus(STATUS_DRAFT, props.card.id);
    await buildKanbanStructure(true)
    await showModalFull();
    modalScheduleStore.loading = false;
    modalScheduleStore.showInline = false;
  }

  async function deleteWorkOrder(){
    await deleteWorkOrders(props.card.id);
    await buildKanbanStructure(true);
  }

  async function hideModal() {
    modalScheduleStore.reset();
    //if (modalScheduleStore.isEdit) await individualRefreshByColumns();
  }

  async function duplicateWorkOrder() {
    modalScheduleStore.seletedDateColumn = props.dateColumn;
    const col  = getCurrentColumn();
    const card  = col.cards.find((card) => card.id === props.card.id)
    const index  = col.cards.indexOf(card)
    const newCard = {...card}
    delete newCard.id;
    newCard.duplicated = true
    newCard.editable = true;
    col.cards.splice(index, 0, newCard);
    modalScheduleStore.isEdit = false;
    modalScheduleStore.showInline = true;
    modalScheduleStore.form = { ...newCard };
  }

  return {
    openModalSchedule,
    isBlank,
    isPassenger,
    isMobile,
    isTablet,
    isDesktop,
    showKanbanCardsActions,
    cardActions,
    cardComponentName
  };
}