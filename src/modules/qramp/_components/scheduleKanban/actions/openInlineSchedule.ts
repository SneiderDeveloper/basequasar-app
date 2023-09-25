
import modalScheduleStore from '../store/modalSchedule.store'
import showWorkOrder from '../actions/showWorkOrders';
import setEditableCard from '../actions/setEditableCard';

export default async function openInlineSchedule(props: any): Promise<void> {
    try {
        const response = await showWorkOrder(props.card.id);
        modalScheduleStore.isEdit = true;
        modalScheduleStore.showInline = true;
        modalScheduleStore.form = { ...response.data };
        setEditableCard(props.card.id, true)
    } catch (error) {
      console.log(error);
    }
  }
