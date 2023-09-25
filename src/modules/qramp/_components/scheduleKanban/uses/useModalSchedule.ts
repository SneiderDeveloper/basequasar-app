import Vue, { computed, ComputedRef, ref, onBeforeUnmount, inject } from 'vue';
import store from '../store/modalSchedule.store'
import fieldsSchedule from '../models/fieldsSchedule.model'
import validateOperationType from '../actions/validateOperationType'
import saveSimpleWorkOrder from '../actions/saveSimpleWorkOrder'
import kanbanStore from '../store/kanban.store';
import getIndividualWorkOrders from '../actions/getIndividualWorkOrders';
import moment from 'moment';
import qRampStore from 'src/modules/qramp/_store/qRampStore';
import { STATUS_DRAFT } from 'src/modules/qramp/_components/model/constants.js'
import updateSimpleWorkOrder from '../actions/updateSimpleWorkOrder';
import deleteWorkOrders from '../actions/deleteWorkOrders';
import individualRefreshByColumns from '../actions/individualRefreshByColumns';
import showWorkOrder from '../actions/showWorkOrders';
import storeKanban from '../store/kanban.store';
import getCurrentColumn from '../actions/getCurrentColumn';
import setEditableCard from '../actions/setEditableCard';
import setIndividualCards from '../actions/setIndividualCards'
import updateWorkOrder from '../actions/updateWorkOrder'

export default function useModalSchedule(props: any, emit: any) {
  const refFormSchedule: any = ref(null);
  const refFormOrders: any = inject('refFormOrders');
  const showModal = computed({
    get: () => store.showModal,
    set: (value) => store.showModal = value
  });
  const titleModal: ComputedRef<string> = computed(() => store.titleModal);
  const form = computed(() => store.form);
  const loading: ComputedRef<boolean> = computed(() => store.loading);
  const showCommentsComponent = computed(() => !store.showInline)
  const actions = computed(() => [
    {
      props: {
        vIf: store.isEdit && !kanbanStore.isBlank,
        color: "green",
        label: 'Start Work Order',
      },
      action: async () => {
        store.loading = true;
        await qRampStore().changeStatus(STATUS_DRAFT, form.value.id);
        await setIndividualCards(form.value.id);
        await showModalFull();
        await hideModal();
        store.loading = false;
      },
    },
    {
      props: {
        vIf: !kanbanStore.isBlank,
        color: "primary",
        label: store.isEdit
          ? Vue.prototype.$tr("isite.cms.label.update")
          : Vue.prototype.$tr("isite.cms.label.save"),
      },
      action: async () => {
        await saveForm()
      },
    },
    {
      props: {
        vIf: store.isEdit && !kanbanStore.isBlank,
        color: "red",
        label: Vue.prototype.$tr("isite.cms.label.delete"),
      },
      action: async () => {
        store.loading = true;
        await deleteWorkOrders(form.value.id);
        await individualRefreshByColumns();
        await hideModal();
        store.loading = false;
      },
    },
  ]);
  const permisionComments = computed(() => Vue.prototype.$auth.hasAccess(`ramp.work-orders-comments.index`))
  const flightStatus = computed(() => fieldsSchedule().flightStatus.value);
  const isbound = computed(() => validateOperationType(form.value.operationTypeId));
  const fields = computed(() => fieldsSchedule().fields.value);
  function zanetizeData(key: string) {
    if (key === "flightNumber") {
      form.value[key] = form.value[key].toUpperCase().replace(/\s+/g, "");
    }
  }
  async function saveForm() {
    refFormSchedule.value.validate().then(async (success) => {
      if (success) {
        store.loading = true;
        await tranformData();
        if (store.isEdit) {
          await updateWorkOrder(form.value.id, form.value);
        } else {
          await saveSimpleWorkOrder();
        }
        hideInline();
        if(!store.isEdit) {
          individualRefreshByColumns(); 
        }
        await setIndividualCards(form.value.id);
        await hideModal();
        store.loading = false;
      }
    });
  }
  async function tranformData() {
    form.value.inboundScheduledArrival = `${moment(form.value.inboundScheduledArrival || store.seletedDateColumn).format('MM/DD/YYYY')} ${form.value.sta || '00:00'}`;
    form.value.outboundScheduledDeparture = form.value.outboundScheduledDeparture;
    form.value.std = form.value.outboundScheduledDeparture ? moment(form.value.outboundScheduledDeparture).format('HH:mm') : null;
    const isbound = validateOperationType(form.value.operationTypeId);
    if (isbound.inbound && isbound.outbound) return;
    if (isbound.inbound && !isbound.outbound) {
      form.value.std = null;
      form.value.outboundScheduledDeparture = null;
    }
    if (!isbound.inbound && isbound.outbound) {
      form.value.sta = null;
      form.value.inboundScheduledArrival = null;
    }
  }
  async function hideModal() {
    store.reset();
    if (store.isEdit) await individualRefreshByColumns();
  }

  function hideInline(){
    if(!store.showInline) return;
    if(props.card?.id){
      store.showInline = false;
      setEditableCard(props.card.id, false);
    } else {
      const col = getCurrentColumn();
      if (props.card.duplicated){
        const card = col.cards.find((card) => card.duplicated === props.card.duplicated);
        const index = col.cards.indexOf(card)
        col.cards.splice(index, 1);
        store.isEdit = false;
        store.showInline = false;
        return;
      }
      if(col.cards){
        col.cards.shift();
      }
    }
    store.isEdit = false
    store.showInline = false;
  }
  async function showModalFull() {
    const titleModal = Vue.prototype.$tr('ifly.cms.form.updateWorkOrder') + (form.value.id ? ` Id: ${form.value.id}` : '')
    const response = await showWorkOrder(form.value.id);
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
  onBeforeUnmount(() => {
    store.reset();
  });
  return {
    showModal,
    hideInline,
    titleModal,
    loading,
    form,
    hideModal,
    actions,
    flightStatus,
    isbound,
    permisionComments,
    zanetizeData,
    fields,
    refFormSchedule,
    saveForm,
    showCommentsComponent
  }
}
