import Vue from 'vue';
import { DataWorkOrder } from '../contracts/getWorkOrder.contract';
export default async function showWorkOrder(workOrderId: number): Promise<{data: DataWorkOrder | any}> {
    try {
        return await Vue.prototype.$crud.show("apiRoutes.qramp.workOrders", workOrderId, {
            refresh: true,
            include:
                "customer,workOrderStatus,operationType,station,contract,responsible,flightStatus,scheduleStatus,gate",
        })
    } catch (error) {
        console.log(error);
        return { data: {} }
    }
}