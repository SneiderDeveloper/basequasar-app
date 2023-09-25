export interface CustomerContract {
    customerName: string;
    workdayId: string;
    customerStatusId: number;
    customerStatus: any;
    customerTypeId: any;
    customerType: any;
    parentCustomerId: any;
    airlineId: any;
    airline: any;
    adHocWorkOrders: boolean;
    contracts: any;
    oldId: any;
    id: number;
    createdAt: any;
    updatedAt: any;
    deletedAt: any;
    restoredAt: any;
    createdBy: any;
    updatedBy: any;
    deletedBy: any;
    restoredBy: any;
    externalId: any;
    options: any;
    isReportable: boolean;
    forceDelete: boolean;
    defaultInclude: string;
    searchableFields: SearchableFields;
    fileFormats: any;
}
export interface StationContract {
    airportId: number | null;
    airport: null;
    companyId: number;
    businessUnitId: number;
    company: null;
    buildings: null;
    gates: null;
    areas: null;
    fullName: string;
    stationName: string;
    stationCode: string;
    oldId: number | null;
    id: number;
    createdAt: null | string;
    updatedAt: null | string;
    deletedAt: null;
    restoredAt: null;
    createdBy: number | null;
    updatedBy: number | null;
    deletedBy: null;
    restoredBy: null;
    externalId: null;
    options: null;
    isReportable: boolean;
    forceDelete: boolean;
    defaultInclude: string;
    searchableFields: SearchableFields;
    fileFormats: null;
}

export interface FlightStatusContract {
    name: string;
    color: string;
    id: number;
    createdAt: null;
    updatedAt: string;
    deletedAt: null;
    restoredAt: null;
    createdBy: null;
    updatedBy: number;
    deletedBy: null;
    restoredBy: null;
    externalId: null;
    options: null;
    isReportable: boolean;
    forceDelete: boolean;
    defaultInclude: string;
    searchableFields: string;
    fileFormats: null;
}

export interface WorkOrderStatusesContract {
    statusName: string;
    color: string;
    id: number;
    createdAt: null;
    updatedAt: string;
    deletedAt: null;
    restoredAt: null;
    createdBy: null;
    updatedBy: number;
    deletedBy: null;
    restoredBy: null;
    externalId: null;
    options: null;
    isReportable: boolean;
    forceDelete: boolean;
    defaultInclude: string;
    searchableFields: string;
    fileFormats: null;
}

export interface Contract {
    contractName: null | string;
    contractDescription: null;
    workdayId: string;
    worktag: null;
    contractSignedDate: string;
    contractEffectiveDate: string;
    readyToPostWd: null;
    oneClickPost: null;
    flightSchedules: any[];
    contractLines: null;
    contractRules: null;
    contractTypeId: number | null;
    contractType: null;
    contractStatusId: number;
    contractStatus: null;
    customerId: number;
    customer: CustomerContract;
    customerName: string;
    buildingId: number;
    building: null;
    costCenterId: number;
    costCenter: null;
    businessUnitId: number;
    businessUnit: null;
    companyId: number;
    company: null;
    oldId: null;
    id: number;
    createdAt: null;
    updatedAt: null;
    deletedAt: null;
    restoredAt: null;
    createdBy: null;
    updatedBy: null;
    deletedBy: null;
    restoredBy: null;
    externalId: null;
    options: null;
    isReportable: boolean;
    forceDelete: boolean;
    defaultInclude: DefaultInclude;
    searchableFields: string;
    fileFormats: null;
}

export enum DefaultInclude {
    Customer = "customer",
}

export enum SearchableFields {
    IDCustomerNameWorkdayID = "id,customer_name,workday_id",
}
export interface Options {
    type: string;
}

export interface OperationType {
    operationName: string;
    companyId: number;
    businessUnitId: number;
    company?: number;
    id: number;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    restoredAt?: string;
    createdBy?: any;
    updatedBy?: any;
    deletedBy?: any;
    restoredBy?: any;
    externalId?: number;
    options: Options;
    isReportable: boolean;
    forceDelete: boolean;
    defaultInclude: string;
    searchableFields: string;
    fileFormats?: any;
    label: string,
    value: string | number;
}
export interface Gates {
    stationId: number;
    station: null;
    areaId: number;
    area: null;
    name: string;
    id: number;
    createdAt: null;
    updatedAt: null;
    deletedAt: null;
    restoredAt: null;
    createdBy: null;
    updatedBy: null;
    deletedBy: null;
    restoredBy: null;
    externalId: null;
    options: null;
    isReportable: boolean;
    forceDelete: boolean;
    defaultInclude: string;
    searchableFields: SearchableFields;
    fileFormats: null;
}

export enum SearchableFields {
    IDName = "id,name",
}

export interface WorkOrders {
    data: DataWorkOrder[];
    meta: Meta;
}

export interface DataWorkOrder {
    workdayTransactions: null;
    carrierId: number;
    carrier: null;
    stationId: number;
    station: null;
    customerId: number;
    customer: null;
    acTypeId: number;
    acType: null;
    operationTypeId: number;
    operationType: null;
    statusId: number;
    workOrderStatus: null;
    inboundOriginAirportId: number;
    inboundOriginAirport: null;
    outboundDestinationAirportId: number;
    outboundDestinationAirport: null;
    contractId: number;
    contract: null;
    responsibleId: number;
    responsible: Responsible;
    flightStatusId: number;
    flightStatus: null;
    scheduleStatusId: null;
    scheduleStatus: null;
    workOrderItems: any[];
    gateId: number;
    gate: null;
    companyId: number;
    businessUnitId: number;
    company: null;
    adHoc: boolean;
    customCustomer: boolean;
    inboundCustomFlightNumber: null;
    needToBePosted: boolean;
    customCustomerName: null;
    remark: string;
    delay: any[];
    safetyMessage: string;
    customerSignature: string;
    customerName: string;
    customerTitle: string;
    representativeSignature: string;
    representativeName: string;
    representativeTitle: string;
    date: null;
    referenceId: string;
    inboundFlightNumber: string;
    inboundTailNumber: string;
    inboundScheduledArrival: string;
    inboundBlockIn: string;
    estimatedOnUtc: null;
    inboundCargoTotalUldsUnloaded: null;
    inboundCargoBulkUnloaded: null;
    outboundFlightNumber: string;
    outboundTailNumber: string;
    outboundScheduledDeparture: string;
    outboundBlockOut: string;
    estimatedOffUtc: null;
    calendarTitle: string;
    outboundCustomFlightNumber: null;
    outboundCargoTotalUldsLoaded: null;
    outboundCargoBulkLoaded: null;
    cargoTotalKilosLoaded: null;
    cargoTotalKilosUnloaded: null;
    preFlightNumber: string;
    faFlightId: string;
    faFlightStatus: null;
    comments: number;
    sta: string;
    std: string;
    flightPosition: null;
    isReportable: boolean;
    transactions: Transaction[];
    flightStatusColor: null;
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
    restoredAt: null;
    createdBy: number;
    updatedBy: number;
    deletedBy: null;
    restoredBy: null;
    externalId: null;
    options: null;
    forceDelete: boolean;
    defaultInclude: string;
    searchableFields: string;
    fileFormats: null;
}

export interface Responsible {
    email: string;
    password: string;
    permissions: { [key: string]: boolean };
    allSettings: AllPermissions;
    socialData: AllPermissions;
    defaultInclude: string;
    allPermissions: AllPermissions;
    lastLogin: string;
    fullName: string;
    firstName: string;
    lastName: string;
    timezone: null;
    language: null;
    createdBy: null;
    updatedBy: null;
    deletedBy: null;
    externalGuid: null;
    roles: any[];
    departments: any[];
    folders: null;
    reports: null;
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
    restoredAt: null;
    restoredBy: null;
    externalId: null;
    options: Options;
    isReportable: boolean;
    forceDelete: boolean;
    searchableFields: string;
    fileFormats: null;
}

export interface AllPermissions {
}

export interface Options {
    buildingsAssigned: any[];
    businessUnitType: string;
    stationsAssigned: any[];
    companyAssigned: null;
}

export interface Transaction {
    work_order_id: number;
    workOrder: null;
    contract_line_id: null;
    contractLine: null;
    product_id: number;
    product: null;
    transaction_id: null;
    quantity: number;
    posted_at: null;
    dateTransaction: null;
    ammount: number;
    status: number;
    id: number;
    created_at: null;
    updated_at: null;
    deleted_at: null;
    restored_at: null;
    created_by: null;
    updated_by: null;
    deleted_by: null;
    restored_by: null;
    external_id: null;
    options: null;
    is_reportable: boolean;
    force_delete: boolean;
    dynamic_parameters: AllPermissions;
    default_include: string;
    searchable_fields: string;
    file_formats: null;
}

export interface Meta {
    page: Page;
}

export interface Page {
    total: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    currentPage: number;
    perPage: number;
}

export interface State {
    operationTypeList: OperationType[];
    stationList: StationContract[];
    customerList: CustomerContract[];
    contractList: Contract[];
    flightStatusesList: FlightStatusContract[];
    workOrderStatusesList: WorkOrderStatusesContract[];
    gatesList: Gates[];
    workOrderList: WorkOrders;
    customerWithContractList: any[];
    airlinesList: any[];
    actypesList: any[];
    airportsList: any[];
}

export interface WorkOrderList {
    setOperationTypeList: (data: OperationType[]) => void;
    getOperationTypeList: () => OperationType[];
    setStationList: (data: StationContract[]) => void;
    getStationList: () => StationContract[];
    getOperationType: () => Promise<OperationType[] | void>;
    getStation: () => Promise<StationContract[] | void>;
    setCustomerList: (data: CustomerContract[]) => void;
    getCustomerList: () => CustomerContract[];
    getCustomer: () => Promise<CustomerContract[] | void>;
    getAllList: () => Promise<void>;
    setContractList: (data: Contract[]) => void;
    getContractList: () => Contract[];
    setFlightStatusesList: (data: FlightStatusContract[]) => void;
    getFlightStatusesList: () => FlightStatusContract[];
    setWorkOrderStatusesList: (data: WorkOrderStatusesContract[]) => void;
    getWorkOrderStatusesList: () => WorkOrderStatusesContract[];
    getWorkOrderStatuses: () => void;
    getGatesList: () => Gates[];
    setGatesList: (data: Gates[]) => void;
    getGates: () => Promise<Gates[] | void>;
    getDataWorkOrderList: () => WorkOrders;
    setDataWorkOrderList: (data: WorkOrders) => void;
    getWorkOrders: () => Promise<WorkOrders | void>;
    getCustomerWithContract: () =>  Promise<any[] | void>;
    setCustomerWithContractLists: (data: any) => void;
    getCustomerWithContractLists: () => any;
    setAirlinesList: (data: any) => void;
    getAirlinesList: () => any;
    setACTypesList: (data: any) => void;
    getACTypesList: () => any;
    setAirportsList: (data: any) => void;
    getAirportsList: () => any;
}