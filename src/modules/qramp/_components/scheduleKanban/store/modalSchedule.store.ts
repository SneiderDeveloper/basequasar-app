import moment from 'moment';
import Vue, { reactive, computed } from 'vue';

interface State {
    showModal: boolean;
    showInline: boolean;
    titleModal: string;
    loading: boolean;
    form: any;
    seletedDateColumn: any;
    isEdit: boolean;
    stationId: number | null,
    showModalComments: boolean
}

const state = reactive<State>({
    showModal: false,
    showInline: false,
    titleModal: '',
    loading: false,
    form: {},
    seletedDateColumn: null,
    isEdit: false,
    stationId: null,
    showModalComments: false,
})

function getForm(data: any) {
    const form: any = {};
    if (data.id) {
        form.id = data.id
    }
    form.sta = data.inboundScheduledArrival ? moment(data.inboundScheduledArrival).format('HH:mm') : null;
    form.outboundScheduledDeparture = data.outboundScheduledDeparture ? moment(data.outboundScheduledDeparture).format('MM/DD/YYYY HH:mm') : null;
    form.inboundFlightNumber = data.inboundFlightNumber;
    form.preFlightNumber = data.inboundFlightNumber;
    form.stationId = data.stationId;
    form.gateId = data.gateId;
    form.operationTypeId = data.operationTypeId;
    form.std = data.std;
    form.flightStatusId = data.flightStatusId;
    form.acTypeId = data.acTypeId;
    form.inboundScheduledArrival = data.inboundScheduledArrival;
    form.statusId = data.statusId;
    return form;
}

const store = computed(() => ({
    get showModal(): boolean {
        return state.showModal;
    },
    set showModal(value: boolean) {
        state.showModal = value;
    },
    get showInline(): boolean {
        return state.showInline;
    },
    set showInline(value: boolean) {
        state.showInline = value;
    },
    get showModalComments(): boolean {
        return state.showModalComments;
    },
    set showModalComments(value: boolean) {
        state.showModalComments = value;
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
    get stationId(): number | null {
        return state.stationId;
    },
    set stationId(value: number | null) {
        state.stationId = value;
    },
    get form() {
        return state.form;
    },
    set form(data) {
        state.form = getForm(data);
    },
    get seletedDateColumn() {
        return state.seletedDateColumn;
    },
    set seletedDateColumn(value) {
        state.seletedDateColumn = value;
    },
    get isEdit() {
        return state.isEdit;
    },
    set isEdit(value) {
        state.isEdit = value;
    },
    reset(): void {
        state.form = {};
        state.showModal = false;
    },
})).value


export default store;
