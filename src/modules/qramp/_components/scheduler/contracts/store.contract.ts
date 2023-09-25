export interface Form {
    id?: number | null;
    carrierId: number | null;
    stationId: number | null;
    acTypeId: number | null;
    fromDate: string | null;
    untilDate: string | null;
    operationTypeId: number | null;
    flightNumber: string | null;
    inboundScheduleArrival: string | null;
    outboundScheduleDeparture: string | null;
    outboundFlightNumber: string | null;
    daysOfWeek: number[];
    customerId: number | null;
    contractId: number | null;
    depDays: number | null;
}

export interface State {
    showModal: boolean;
    form: Form,
    loading: boolean;
    titleModal: string;
    updateModal: boolean;
}

export interface Store {
    showModal: boolean;
    form: Form;
    loading: boolean;
    titleModal: string;
    updateModal: boolean;
    reset(): void;
    validateOperationType(): void;
    dateFormatterFull(date: string): string;
}