import Vue from 'vue';
import qRampStore from "src/modules/qramp/_store/qRampStore";
import modalScheduleStore from '../store/modalSchedule.store'

export default async function updateSimpleWorkOrder(): Promise<void> {
    try {
        const params = {params: {
            titleOffline: qRampStore().getTitleOffline()
          }};
        await Vue.prototype.$crud.update("apiRoutes.qramp.schedule", modalScheduleStore.form.id, modalScheduleStore.form, params); 
    } catch (error) {
        console.log(error)
    }
} 