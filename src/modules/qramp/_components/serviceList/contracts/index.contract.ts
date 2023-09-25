export interface PropsContract {
    readonly?: boolean;
    mask?: string;
    label?: string;
    hint?: string;
    placeHolder?: string;
    format24h?: boolean;
    typeIndexDate?: number;
}

export interface QuantityContract {
    name: string;
    value?: any;
    type: string;
    id: number;
    props?: PropsContract;
}

export interface Inputremark {
    name: string;
    value?: any;
    type: string;
    id: number;
    props: PropsContract;
}

export interface FullDateStart {
    name: string;
    value?: any;
    type: string;
    id: number;
    props: PropsContract;
}

export interface FullDateEnd {
    name: string;
    value?: any;
    type: string;
    id: number;
    props: PropsContract;
}

export interface Quantityquantity {
    name: string;
    value?: any;
    type: string;
    id: number;
    props: PropsContract;
}

export interface DynamicField {
    icon: string;
    title: string;
    id: number;
    categoryId: number;
    formField: any;
}

export interface ListContract {
    id: number;
    title: string;
    dynamicField?: DynamicField[] | any;
    lists?: any[];
}


export interface Quantity2 {
    name: string;
    value?: any;
    type: string;
    id: number;
    props: PropsContract;
}

export interface ServiceModelContract {
    id?: number;
    title?: string;
    lists?: ListContract[] | any[];
    dynamicField?: DynamicField[] | null;
    component?: any;
    form?: any,
}

export interface ReactiveStoreContract {
    serviceList: ServiceModelContract[],
    loading: Boolean,
}

export interface ServiceListStoreContract {
    getServiceData(): Promise<void>;

    setServiceList(value: ServiceModelContract[]): void;

    getServiceList(): ServiceModelContract[];

    setLoading(value: boolean): void;

    getLoading(): Boolean;

    resetStore(): void;

    init(): Promise<void>;

    getServiceListSelected(): Promise<any>;

    orderServicesWithTheStructureToSave(services: ServiceModelContract[]): Promise<any>;

    getServiceItems(): Promise<ServiceModelContract[]>;
}