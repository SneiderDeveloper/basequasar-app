//import { reactive } from '@vue/composition-api';
import baseService from '@imagina/qcrud/_services/baseService.js'
import Vue, { reactive } from "vue";

const state = reactive({
    awbTrackingList: {
        '@num': null,
        awbOrigin: null,
        awbDestination: null,
        awbPieces: null,
        awbWeight: null,
        awbVolume: null,
        routing: null,
        segments: [],
    },
    loading: false,
    errorMessage: null,
});

export default function qCargoStore() {
    async function getAwbTracking(key) {
        try {
            showLoading();
            const response = await baseService.post('apiRoutes.qcargoagione.awbTracking', {key});
            if(response.data.errorMessage) {
                state.errorMessage = response.data.errorMessage;
                Vue.prototype.$alert.info({
                    mode: "modal",
                    title: '',
                    message: response.data.errorMessage,
                    actions: [
                      {
                        label: 'Ok',
                        color:'primary',
                      },
                    ],
                });
                resetAwbTrackingList();
                hideLoading();
                return;
            }
            setAwbTrackingList(response.data);
            hideLoading();
            state.errorMessage = null;
        } catch (error) {
           hideLoading();
           resetAwbTrackingList();
           console.log(error); 
        }
    }
    function getAwbTrackingList() {
        return state.awbTrackingList;
    }
    function setAwbTrackingList(data) {
        state.awbTrackingList = data;
    }
    function hideLoading() {
        state.loading = false;
    }
    function showLoading() {
        state.loading = true;
    }
    function getLoading() {
        return state.loading;
    }
    function resetAwbTrackingList() {
        state.awbTrackingList = {
            '@num': null,
            awbOrigin: null,
            awbDestination: null,
            awbPieces: null,
            awbWeight: null,
            awbVolume: null,
            routing: null,
            segments: [],
        };
    }
    function getErrorMessage() {
        return state.errorMessage;
    }
    return {
        getAwbTrackingList,
        setAwbTrackingList,
        getAwbTracking,
        hideLoading,
        showLoading,
        getLoading,
        getErrorMessage,
        resetAwbTrackingList,
    }
}