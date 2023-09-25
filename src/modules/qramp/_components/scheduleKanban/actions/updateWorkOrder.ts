import Vue from 'vue';
export default async function updateWorkOrder(id: number, attributes: any): Promise<void> {
    try {
        await Vue.prototype.$crud.update(
            "apiRoutes.qramp.workOrders", id, attributes
        );
    } catch (error) {
        console.log(error);
    }
}