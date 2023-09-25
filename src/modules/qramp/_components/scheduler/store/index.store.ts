import { reactive, computed } from 'vue';
import {
    State,
    Store,
    Form,
} from '../contracts/store.contract'
import moment from 'moment';
import workOrderList from '../../../_store/actions/workOrderList'

const state = reactive<State>({
    showModal: false,
    titleModal: '',
    form: {
        carrierId: null,
        stationId: null,
        acTypeId: null,
        fromDate: null,
        untilDate: null,
        operationTypeId: null,
        flightNumber: null,
        inboundScheduleArrival: null,
        outboundScheduleDeparture: null,
        outboundFlightNumber: null,
        daysOfWeek: [],
        customerId: null,
        contractId: null,
        //customCustomerName: null,
        depDays: null,
    },
    loading: false,
    updateModal: false,
})
function dateFormatterFull(date: string): string {
    if (!date) return '';

    const formattedDate = moment(date).format('MM/DD/YYYY HH:mm');
    return formattedDate;
}

const store: Store = computed(() => ({
    get showModal(): boolean {
        return state.showModal;
    },
    set showModal(value: boolean) {
        state.showModal = value;
    },
    get titleModal(): string {
        return state.titleModal;
    },
    set titleModal(value: string) {
        state.titleModal = value;
    },
    get loading(): boolean {
        return state.loading;
    },
    set loading(value: boolean) {
        state.loading = value;
    },
    get updateModal(): boolean {
        return state.updateModal;
    },
    set updateModal(value: boolean) {
        state.updateModal = value;
    },
    get form(): Form {
        return state.form;
    },
    set form(data: Form) {
        if (data.id) {
            state.form.id = data.id
        }
        state.form.carrierId = data.carrierId
        state.form.stationId = data.stationId
        state.form.acTypeId = data.acTypeId
        state.form.fromDate = data.fromDate ? moment(data.fromDate).format('MM/DD/YYYY') : null;
        state.form.untilDate = data.untilDate ? moment(data.untilDate).format('MM/DD/YYYY') : null;
        state.form.operationTypeId = data.operationTypeId
        state.form.flightNumber = data.flightNumber
        state.form.inboundScheduleArrival = data.inboundScheduleArrival ? moment(data.inboundScheduleArrival).format('HH:mm') : null;
        state.form.outboundScheduleDeparture = data.outboundScheduleDeparture ? moment(data.outboundScheduleDeparture).format('HH:mm') : null;
        state.form.outboundFlightNumber = data.outboundFlightNumber
        state.form.daysOfWeek = data.daysOfWeek || [];
        state.form.customerId = data.customerId;
        state.form.contractId = data.contractId;
        //state.form.customCustomerName = data.customCustomerName || null;
        state.form.depDays = data.depDays || null;
    },
    reset(): void {
        state.form = {
            carrierId: null,
            stationId: null,
            acTypeId: null,
            fromDate: null,
            untilDate: null,
            operationTypeId: null,
            flightNumber: null,
            inboundScheduleArrival: null,
            outboundScheduleDeparture: null,
            outboundFlightNumber: null,
            daysOfWeek: [],
            customerId: null,
            contractId: null,
            //customCustomerName: null,
            depDays: null,
        };
        state.showModal = false;
    },
    validateOperationType(): void {
        if (state.form.operationTypeId) {
            const operationType = workOrderList().getOperationTypeList()
                .find(item => item.id === Number(state.form.operationTypeId));
            const type = operationType?.options?.type;
            if (type) {
                if (type === 'inbound') {
                    state.form.outboundScheduleDeparture = null;
                    state.form.outboundFlightNumber = null;
                }
                if (type === 'outbound') {
                    state.form.inboundScheduleArrival = null;
                    state.form.flightNumber = null;
                }
            }
        }
    },
    dateFormatterFull,
})).value


export default store;