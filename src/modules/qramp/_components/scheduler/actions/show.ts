import baseService from '@imagina/qcrud/_services/baseService.js'
import store from '../store/index.store'
import _ from 'lodash'

export default async function showScheduler(id: number): Promise<void> {
    try {
        store.titleModal = `Update scheduler Id: ${id}`;
        store.updateModal = true;
        store.loading = true;
        store.showModal = true;
        const params = {
            refresh: true,
            params: {}
        }
        const response = await baseService.show('apiRoutes.qramp.schedulers', id, params);
        store.form = {...response.data};
        store.loading = false;
    } catch (error) {
      store.showModal = false;
      store.loading = false;
      console.log(error, 'showScheduler');
    }
}