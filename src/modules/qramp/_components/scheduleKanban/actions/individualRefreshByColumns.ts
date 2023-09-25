import moment from 'moment';
import kanbanStore from '../store/kanban.store';
import modalScheduleStore from '../store/modalSchedule.store'
import getIndividualWorkOrders from './getIndividualWorkOrders';
import getWorkOrdersStatistics from './getWorkOrderStatistics';
import storeFilters from "../store/filters.store";


export default async function individualRefreshByColumns(): Promise<void> {
    const column: any = kanbanStore.columns.find(item => {
        return item.date.format('YYYY-MM-DD') === modalScheduleStore.seletedDateColumn
    });
    if (!column) return;
    try {
        column.loading = true;
        column.page = 1;
        const response = await getIndividualWorkOrders(true, column.page, moment(modalScheduleStore.seletedDateColumn));
        column.cards = response.data;

        const date = moment(modalScheduleStore.seletedDateColumn)
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
        column.loading = false;
    } catch (error) {
        column.loading = false;
        console.log(error);
    }
}