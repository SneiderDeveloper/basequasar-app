export interface FormContract {
    inboundCargoTotalUldsUnloaded: string;
    inboundCargoBulkUnloaded: string;
    outboundCargoTotalUldsLoaded: string;
    outboundCargoBulkLoaded: string;
    cargoTotalKilosLoaded: string;
    cargoTotalKilosUnloaded: string;
}

export interface DelayListContract {
    code: string;
    hours: string;
}

export interface CargoStoreContract {
    form: FormContract;
    delayList: DelayListContract[];
    delay: boolean;
}

export interface UseCargoStoreContract {
    getForm(): FormContract;
    setForm(cargo: FormContract): void;
    getDelayList(): DelayListContract[];
    setDelayList(data: DelayListContract[]): void;
    getDelay(): boolean;
    setDelay(value: boolean): void;
    payload(): PayloadContract;
    reset(): void;
}

export interface PayloadContract {
    delay: DelayListContract[],
    cargo: FormContract,
}