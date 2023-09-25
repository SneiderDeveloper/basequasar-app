import storeKanban from "../store/kanban.store";
import showWorkOrders from './showWorkOrders'
import modalScheduleStore from '../store/modalSchedule.store';

export default async function setIndividualCards(cardId: number): Promise<void> {
    try {
        const foundCard = storeKanban.columns
            .flatMap(column => column.cards)
            .find(card => card.id === cardId);

        if (!foundCard) return;
        foundCard.loading = true;
        const response = await showWorkOrders(cardId);
        setTimeout(() => {
            foundCard.loading = false;
            Object.assign(foundCard, { ...response.data, editable: false });
        }, 100);        
    } catch (error) {
        console.log(error);
    }
}