import Vue, { reactive } from 'vue';
import baseService from '@imagina/qcrud/_services/baseService.js'
import qRampStore from '../qRampStore.js'
import {
    BUSINESS_UNIT_PASSENGER,
    BUSINESS_UNIT_RAMP,
    COMPANY_PASSENGER,
    COMPANY_RAMP
} from '../../_components/model/constants.js';
import {
    Contract,
    CustomerContract,
    FlightStatusContract,
    Gates,
    OperationType,
    State,
    StationContract,
    WorkOrderList,
    WorkOrders,
    WorkOrderStatusesContract
} from './@Contracts/workOrderList.contract';
import { buildServiceList } from './services';
import factoryCustomerWithContracts from './factoryCustomerWithContracts.js'
import cache from '@imagina/qsite/_plugins/cache.js';
import cacheOffline from '@imagina/qsite/_plugins/cacheOffline.js';

const state = reactive<State>({
    operationTypeList: [],
    stationList: [],
    customerList: [],
    contractList: [],
    flightStatusesList: [],
    workOrderStatusesList: [],
    gatesList: [],
    customerWithContractList: [],
    airlinesList: [],
    actypesList: [],
    airportsList: [],
    /* Creating a new array called workOrderList and assigning it to the variable workOrderList. */
    workOrderList: {
        data: [],
        meta: {
            page: {
                total: 0,
                hasNextPage: false,
                hasPreviousPage: false,
                currentPage: 1,
                perPage: 1,
            },
        }
    },
});
const cacheTimeForm24Hour: number = 60 * 60 * 24;
const cacheTimeForThirtyDays: number = cacheTimeForm24Hour * 30;

/**
 * This is a work order list function that returns an object with several functions to
 * interact with OperationType, StationContract, CustomerContract, Contract, 
 * FlightStatusContract, and WorkOrderStatusesContract.
 * @returns {WorkOrderList} A WorkOrderList object.
*/
export default function workOrderList(): WorkOrderList {
    /**
     * This function returns the workOrderList property of the state object.
     * @returns the state.workOrderList.
     */
    function getCustomerWithContractLists() {
        return state.customerWithContractList;
    }

    function setCustomerWithContractLists(data: any) {
        return state.customerWithContractList = data;
    }

    function getDataWorkOrderList(): WorkOrders {
        return state.workOrderList;
    }

    /**
     * This function takes a parameter of type WorkOrders and sets the state.workOrderList to the value
     * of the parameter.
     * @param {WorkOrders} data - WorkOrders
     */
    function setDataWorkOrderList(data: WorkOrders): void {
        state.workOrderList = data;
    }
    /**
     * This function takes an array of OperationType objects and assigns it to the operationTypeList
     * property of the state object.
     * @param {OperationType[]} data - OperationType[] - this is the data that is being passed in from
     * the component.
     */

    function setOperationTypeList(data: OperationType[]): void {
        state.operationTypeList = data;
    }
    /**
     * It returns a list of OperationType objects.
     * @returns The operationTypeList array.
     */
    function getOperationTypeList(): OperationType[] {
        return state.operationTypeList;
    }
    /**
     * This function takes an array of StationContract objects and assigns it to the stationList
     * property of the state object.
     * @param {StationContract[]} data - StationContract[]
     */
    function setStationList(data: StationContract[]): void {
        state.stationList = data;
    }
    /**
     * This function returns an array of StationContract objects.
     * @returns The stationList array.
     */
    function getStationList(): StationContract[] {
        return state.stationList;
    }

    //
    function setAirlinesList(data): void {
        state.airlinesList = data;
    }
    function getAirlinesList(): any {
        return state.airlinesList;
    }

    function setACTypesList(data): void {
        state.actypesList = data;
    }
    function getACTypesList(): any {
        return state.actypesList;
    }

    function setAirportsList(data): void {
        state.airportsList = data;
    }
    function getAirportsList(): any {
        return state.airportsList;
    }

    //

    /**
     * This function takes an array of CustomerContract objects and assigns it to the customerList
     * property of the state object.
     * @param {CustomerContract[]} data - CustomerContract[] - This is the data that is being passed
     * in.
     */
    function setCustomerList(data: CustomerContract[]): void {
        state.customerList = data;
    }
    /**
     * This function returns an array of CustomerContract objects.
     * @returns An array of CustomerContract objects.
     */
    function getCustomerList(): CustomerContract[] {
        return state.customerList;
    }

    /**
     * This function takes an array of Contract objects and assigns it to the contractList property of
     * the state object.
     * @param {Contract[]} data - Contract[]
     */
    function setContractList(data: Contract[]): void {
        state.contractList = data;
    }
    /**
     * The function getContractList returns an array of Contract objects.
     * @returns The contractList array.
     */
    function getContractList(): Contract[] {
        return state.contractList;
    }

    /**
     * This function takes an array of FlightStatusContract objects and assigns it to the
     * flightStatusesList property of the state object.
     * @param {FlightStatusContract[]} data - FlightStatusContract[]
     */
    function setFlightStatusesList(data: FlightStatusContract[]): void {
        state.flightStatusesList = data;
    }
    /**
     * It returns a list of FlightStatusContract objects.
     * @returns the value of the state.flightStatusesList property.
     */
    function getFlightStatusesList(): FlightStatusContract[] {
        return state.flightStatusesList;
    }

    /**
     * This function takes an array of WorkOrderStatusesContract objects and sets the
     * state.workOrderStatusesList property to that array.
     * @param {WorkOrderStatusesContract[]} data - WorkOrderStatusesContract[]
     */
    function setWorkOrderStatusesList(data: WorkOrderStatusesContract[]): void {
        state.workOrderStatusesList = data;
    }
    /**
     * This function returns a list of work order statuses.
     * @returns An array of WorkOrderStatusesContract objects.
     */
    function getWorkOrderStatusesList(): WorkOrderStatusesContract[] {
        return state.workOrderStatusesList;
    }

    /**
     * This function takes an array of Gates objects and sets the gatesList property of the state
     * object to that array.
     * @param {Gates[]} data - Gates[] - this is the data that is being passed in from the API call.
     */
    function setGatesList(data: Gates[]): void {
        state.gatesList = data;
    }

    /**
     * The function getGatesList() returns an array of Gates objects.
     * @returns The gatesList array.
     */
    function getGatesList(): Gates[] {
        return state.gatesList;
    }

    // actions 
    /**
     * The function getOperationType() returns a Promise that resolves to an array of OperationType
     * objects or void.
     * @returns a Promise.
     */
    async function getOperationType(refresh = false): Promise<OperationType[] | void> {
        if (Vue.prototype.$auth && Vue.prototype.$auth.hasAccess('ramp.operation-types.index')) {
            try {
                const isPassenger = qRampStore().getIsPassenger();
                const companyId = isPassenger ? COMPANY_PASSENGER : COMPANY_RAMP;
                const params = {
                    refresh,
                    cacheTime: cacheTimeForThirtyDays,
                    params: {
                        filter: {
                            companyId,
                        }
                    },
                }
                const response = await baseService.index('apiRoutes.qramp.operationTypes', params);
                const data = response.data.map(item => ({label: item.operationName, ...item, value: item.id}))
                setOperationTypeList(data);
                return data;
            } catch (error) {
                console.log(error);
            }
        }
    }

    /**
     * This function is an async function that returns a promise of an array of StationContract objects
     * or void.
     * @returns a Promise.
     */
    async function getStation(refresh = false): Promise<StationContract[] | void> {
        if (Vue.prototype.$auth && Vue.prototype.$auth.hasAccess('setup.stations.index')) {
            try {
                const isPassenger = qRampStore().getIsPassenger();
                const companyId = isPassenger ? COMPANY_PASSENGER : COMPANY_RAMP;
                const filterRamp = isPassenger ? {companyId} : {
                    companyId,
                    "allTranslations": true
                };
                const params = {
                    refresh,
                    cacheTime: cacheTimeForThirtyDays,
                    params: {
                        filter: {...filterRamp}
                    },
                }
                const response = await baseService.index('apiRoutes.qsetupagione.setupStations', params);
                const data = response.data;
                setStationList(data);
                return data;
            } catch (error) {
                console.log(error);
            }
        }
    }
    //"status":1,"companyId":26,"allTranslations":true
    async function getAirlines(refresh = false) {
        if (Vue.prototype.$auth && Vue.prototype.$auth.hasAccess('iflight.airline.index')) {
            try {
                const isPassenger = qRampStore().getIsPassenger();
                const companyId = isPassenger ? COMPANY_PASSENGER : COMPANY_RAMP;
                const params = {
                    refresh,
                    params: {
                        filter: {status: 1, companyId, "allTranslations": true}
                    },
                }
                const response = await baseService.index('apiRoutes.qfly.airlines', params);
                const data = response.data;
                setAirlinesList(data);
                return data;
            } catch (error) {
                console.log(error);
            }
        }
    }
    /**
     * Requests a list of customers from the server based on user type.
     * @returns A promise that will resolve with the array of CustomerContract objects or void if there's an error
     */
    async function getCustomer(refresh = false): Promise<CustomerContract[] | void> {
        if (Vue.prototype.$auth && Vue.prototype.$auth.hasAccess('setup.customers.index')) {
            try {
                const isPassenger = qRampStore().getIsPassenger();
                const companyId = isPassenger ? COMPANY_PASSENGER : COMPANY_RAMP;
                const filterRamp = isPassenger ? {} : {};
                const params = {
                    refresh,
                    cacheTime: cacheTimeForThirtyDays,
                    params: {
                        filter: {
                            companyId,
                        }
                    },
                }
                const response = await baseService.index('apiRoutes.qramp.setupCustomers', params);
                const data = response.data;
                setCustomerList(data);
                return data;
            } catch (error) {
                console.log(error);
            }
        }
    }

    /**
     * The function getContract() is an async function that returns a promise of an array of any type
     * or void.
     * @returns The data is being returned as an array of objects.
     */
    async function getContract(refresh = false): Promise<any[] | void> {
        if (Vue.prototype.$auth && Vue.prototype.$auth.hasAccess('ramp.operation-types.index')) {
            try {
                const isPassenger = qRampStore().getIsPassenger();
                const companyId = isPassenger ? COMPANY_PASSENGER : COMPANY_RAMP;
                const params = {
                    refresh,
                    cacheTime: cacheTimeForThirtyDays,
                    params: {
                        filter: {
                            "contractStatusId": 1,
                            companyId,
                        }
                    },
                }
                const response = await baseService.index('apiRoutes.qramp.setupContracts', params);
                const data = response.data;
                setContractList(data);
                return data;
            } catch (error) {
                console.log(error);
            }
        }
    }

    /**
     * This function gets the flight statuses from the server and sets the flight statuses list in the
     * store.
     * @returns a promise.
     */
    async function getFlightStatuses(refresh = false): Promise<FlightStatusContract[] | void> {
        if (Vue.prototype.$auth && Vue.prototype.$auth.hasAccess('iflight.flight-statuses.index')) {
            try {
                const isPassenger = qRampStore().getIsPassenger();
                const companyId = isPassenger ? COMPANY_PASSENGER : COMPANY_RAMP;
                const params = {
                    refresh,
                    params: {
                        filter: {
                            companyId,
                        }
                    },
                }
                const response = await baseService.index('apiRoutes.qfly.flightStatuses', params);
                const data = response.data;
                setFlightStatusesList(data);
                return data;
            } catch (error) {
                console.log(error);
            }
        }
    }

    /**
     * This function gets the work order statuses from the API and sets the work order statuses list in
     * the store.
     * @returns The data is being returned.
     */
    async function getWorkOrderStatuses(refresh = false): Promise<WorkOrderStatusesContract[] | void> {
        if (Vue.prototype.$auth && Vue.prototype.$auth.hasAccess('ramp.work-order-statuses.index')) {
            try {
                const isPassenger = qRampStore().getIsPassenger();
                const companyId = isPassenger ? COMPANY_PASSENGER : COMPANY_RAMP;
                const filterRamp = isPassenger ? {companyId} : {
                    companyId,
                    "allTranslations": true
                }
                const params = {
                    refresh,
                    cacheTime: cacheTimeForThirtyDays,
                    params: {
                        filter: {...filterRamp}
                    },
                }
                const response = await baseService.index('apiRoutes.qramp.workOrderStatuses', params);
                const data = response.data;
                setWorkOrderStatusesList(data);
                return data;
            } catch (error) {
                console.log(error);
            }
        }
    }

    /**
     * "getGates() is an async function that returns a Promise of Gates[] or void"</code>
     * @returns The data is being returned as an array of objects.
     */
    async function getGates(refresh = false): Promise<Gates[] | void> {
        if (Vue.prototype.$auth && Vue.prototype.$auth.hasAccess('setup.gates.index')) {
            try {
                const isPassenger = qRampStore().getIsPassenger();
                const companyId = isPassenger ? COMPANY_PASSENGER : COMPANY_RAMP;
                const params = {
                    refresh,
                    cacheTime: cacheTimeForThirtyDays,
                    params: {
                        filter: {
                            companyId,
                        }
                    },
                }
                const response = await baseService.index('apiRoutes.qsetupagione.gates', params);
                const data = response.data;
                setGatesList(data);
                return data;
            } catch (error) {
                console.log(error);
            }
        }
    }

    /**
     * This function is an async function that returns a promise of type WorkOrders or void. It calls a
     * function called baseService.index() which returns a promise of type WorkOrders. The function
     * then sets the dataWorkOrderList to the response and returns the data.
     * @returns The data is being returned as an array of objects.
     */
    async function getWorkOrders(refresh = false): Promise<WorkOrders | void> {
        if (Vue.prototype.$auth && (Vue.prototype.$auth.hasAccess('ramp.work-orders.index') || Vue.prototype.$auth.hasAccess('ramp.passenger-work-orders.index'))){
            try {
                const isPassenger = qRampStore().getIsPassenger();
                const businessUnitId = isPassenger ? BUSINESS_UNIT_PASSENGER : BUSINESS_UNIT_RAMP;
                const params = {
                    refresh: refresh,
                    cacheTime: cacheTimeForThirtyDays,
                    params: {
                        include: 'responsible,workOrderItems,workOrderItems.workOrderItemAttributes',
                        filter: {
                            businessUnitId,
                            date: {
                                field: "created_at",
                                type: "15DaysAroundToday",
                                from: null,
                                to: null
                            },
                            order: {
                                field: "id",
                                way: "desc"
                            },
                            withoutDefaultInclude: true,
                        },
                        take: 200,
                        page: 1
                    },
                }
                const response = await baseService.index('apiRoutes.qramp.workOrders', params, true);
                const data = response;
                setDataWorkOrderList(data);
                return data;
            } catch (error) {
                console.log(error);
            }
        }
    }

    function getCustomerWithContract(refresh = false): Promise<any[] | void> {

            return new Promise(async (resolve) => {
                if (Vue.prototype.$auth && Vue.prototype.$auth.hasAccess('setup.contracts.index') && Vue.prototype.$auth.hasAccess('setup.customers.index')) {

                const allowContractName = Vue.prototype.$auth ? Vue.prototype.$auth.hasAccess('ramp.work-orders.see-contract-name') : false;
                const isPassenger = qRampStore().getIsPassenger();
                const companyId = isPassenger ? COMPANY_PASSENGER : COMPANY_RAMP;
                const businessUnitId = isPassenger ? {businessUnitId: BUSINESS_UNIT_PASSENGER} : {businessUnitId: BUSINESS_UNIT_RAMP};
                const custemerParams = {
                    refresh,
                    params: {
                        filter: {
                            withoutContracts: true,
                            adHocWorkOrders: true,
                            customerStatusId: 1,
                            companyId,
                        }
                    },
                }
                const contractParams = {
                    params: {
                        filter: {
                            contractStatusId: 1,
                            ...businessUnitId,
                        }
                    },
                }
                const customersData = await Promise.all([
                    baseService.index('apiRoutes.qramp.setupCustomers', custemerParams),
                    baseService.index('apiRoutes.qramp.setupContracts', contractParams)
                ]);

                const customerList = factoryCustomerWithContracts(customersData, allowContractName);
                setCustomerWithContractLists(customerList);
                return resolve(customerList);
                }else{
                    resolve();
                }
            })

    }

    async function getACTypes(refresh = false) {
        if (Vue.prototype.$auth && Vue.prototype.$auth.hasAccess('iflight.aircrafttype.index')) {
            try {
                const isPassenger = qRampStore().getIsPassenger();
                const companyId = isPassenger ? COMPANY_PASSENGER : COMPANY_RAMP;
                const params = {
                    refresh,
                    params: {
                        filter: {
                            "status": 1,
                            companyId,
                            "allTranslations": true
                        },
                    },
                }
                const response = await baseService.index('apiRoutes.qfly.aircraftTypes', params);
                const data = response.data;
                setACTypesList(data);
                return data;
            } catch (error) {
                console.log(error);
            }
        }
    }

    async function getAirports(refresh = false) {
        if (Vue.prototype.$auth && Vue.prototype.$auth.hasAccess('iflight.airport.index')) {
            try {
                const isPassenger = qRampStore().getIsPassenger();
                const companyId = isPassenger ? COMPANY_PASSENGER : COMPANY_RAMP;
                const params = {
                    refresh,
                    params: {
                        filter: {
                            "status": 1,
                            companyId,
                            "allTranslations": true
                        },
                    },
                }
                const response = await baseService.index('apiRoutes.qfly.airports', params);
                const data = response.data;
                setAirportsList(data);
                return data;
            } catch (error) {
                console.log(error);
            }
        }
    }


    /**
     * The function getAllList() returns a Promise that resolves to void.
     */
    async function getAllList(refresh = false): Promise<void> {
        Promise.all([
            getWorkOrders(refresh),
            getStation(refresh),
            getOperationType(refresh),
            getCustomerWithContract(refresh),
            getCustomer(refresh),
            getFlightStatuses(refresh),
            getWorkOrderStatuses(refresh),
            getGates(refresh),
            getAirlines(refresh),
            getACTypes(refresh),
            getAirports(refresh),
            buildServiceList()
        ]);
    }

    /**
   * This object consists of functions for getting and setting data for OperationType, 
   * StationContract, CustomerContract, Contract, FlightStatusContract, and WorkOrderStatusesContract.
   * @typedef {Object} WorkOrderList
   * @property {function(data: OperationType[]): void} setOperationTypeList - Assigns an array of 
   *    OperationType objects to the operationTypeList property of the state object.
   * @property {function(): OperationType[]} getOperationTypeList - Returns an array of 
   *    OperationType objects.
   * @property {async function(): Promise<OperationType[] | void>} getOperationType - Gets an
   *    array of OperationType objects.
   * @property {function(data: StationContract[]): void} setStationList - Assigns an array of 
   *    StationContract objects to the stationList property of the state object.
   * @property {function(): StationContract[]} getStationList - Returns an array of StationContract 
   *    objects.
   * @property {async function(): Promise<StationContract[] | void>} getStation - Gets an array of 
   *    StationContract objects.
   * @property {function(data: CustomerContract[]): void} setCustomerList - Assigns an array of 
   *    CustomerContract objects to the customerList property of the state object.
   * @property {function(): CustomerContract[]} getCustomerList - Returns an array of 
   *    CustomerContract objects.
   * @property {async function(): Promise<CustomerContract[] | void>} getCustomer - Gets an array of 
   *    CustomerContract objects.
   * @property {function(data: Contract[]): void} setContractList - Assigns an array of Contract 
   *    objects to the contractList property of the state object.
   * @property {function(): Contract[]} getContractList - Returns an array of Contract objects.
   * @property {async function(): Promise<any[] | void>} getContract - Gets an array of objects of any type.
   * @property {function(): FlightStatusContract[]} getFlightStatusesList - Returns a list of 
   *    FlightStatusContract objects.
   * @property {function(data: FlightStatusContract[]): void} setFlightStatusesList - Assigns an 
   *    array of FlightStatusContract objects to the flightStatusesList property of the state object.
   * @property {async function(): Promise<FlightStatusContract[] | void>} getFlightStatuses - Gets 
   *    an array of FlightStatusContract objects.
   * @property {function(): WorkOrderStatusesContract[]} getWorkOrderStatusesList - Returns 
   *    a list of work order statuses.
   * @property {function(data: WorkOrderStatusesContract[]): void} setWorkOrderStatusesList - 
   *    Assigns an array of WorkOrderStatusesContract objects to the workOrderStatusesList property 
   *    of the state object.
   * @property {async function(): Promise<WorkOrderStatusesContract[] | void>} getWorkOrderStatuses - 
   *    Gets an array of WorkOrderStatusesContract objects.
   * @property {async function(): Promise<void>} getAllList - Gets all the lists for 
   *    OperationType, StationContract, CustomerContract, Contract, FlightStatusContract, and 
   *    WorkOrderStatusesContract.
   */

    return {
        setOperationTypeList,
        getOperationTypeList,
        getOperationType,
        setStationList,
        getStationList,
        getStation,
        setCustomerList,
        getCustomerList,
        getCustomer,
        getAllList,
        setContractList,
        getContractList,
        getFlightStatusesList,
        setFlightStatusesList,
        getWorkOrderStatusesList,
        setWorkOrderStatusesList,
        getWorkOrderStatuses,
        getGatesList,
        setGatesList,
        getGates,
        getDataWorkOrderList,
        setDataWorkOrderList,
        getWorkOrders,
        getCustomerWithContract,
        getCustomerWithContractLists,
        setCustomerWithContractLists,
        setAirlinesList,
        getAirlinesList,
        setACTypesList,
        getACTypesList,
        setAirportsList,
        getAirportsList
    }
}