export interface State {
    showModal: boolean;
    titleModal: string;
    filters: any,
    form: any;
    loading: boolean;
    updateModal: boolean,
    scheduleType: string,
    selectedDate: string,
    startDateTime: string,
    endDateTime: string,
    fullDay: string,
    stationId: string | null
    showModalStation: boolean
    titleFilter: string;
}