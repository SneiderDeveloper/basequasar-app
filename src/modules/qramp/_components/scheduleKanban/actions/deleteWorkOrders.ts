import Vue from 'vue';

export default async function deleteWorkOrders(workOrderId: number): Promise<void> {
    try {
        await Vue.prototype.$crud.delete("apiRoutes.qramp.workOrders", workOrderId, { params: { titleOffline: `Delete Work Order - Id: ${workOrderId}` } });
        Vue.prototype.$alert.info('workOrders was deleted correctly');
    } catch (error) {
        console.log(error);
    }
}