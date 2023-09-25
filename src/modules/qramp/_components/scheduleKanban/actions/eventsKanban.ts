import setIndividualCards from './setIndividualCards';
import storeKanban from '../store/kanban.store'
export default function eventsKanban(proxy: any) {
    function cardRefresh(): void {
        try {
            proxy.$eventBus.$on('ramp.workOrders.cardRefresh', async (response) => {
                const foundCard = storeKanban.columns
                    .flatMap(column => column.cards)
                    .find(card => card.id === response.data.id);
                if (!foundCard) return;
                if(foundCard.loading) return;
                await setIndividualCards(response.data.id || 0)
            })
        } catch (error) {
            console.log(error);
        }
    }
    return {
        cardRefresh
    }
}