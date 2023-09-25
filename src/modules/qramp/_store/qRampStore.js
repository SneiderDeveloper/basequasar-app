import {
    STATUS_DRAFT,
    STATUS_POSTED,
    STATUS_SUBMITTED,
    modelFlightBoundFormStatus,
    BUSINESS_UNIT_PASSENGER,
    BUSINESS_UNIT_RAMP,
    COMPANY_PASSENGER,
    COMPANY_RAMP
} from '../_components/model/constants.js'
import moment from 'moment';
import baseService from '@imagina/qcrud/_services/baseService.js'
import Vue, { reactive } from "vue";

const state = reactive({
    titleOffline: '',
    statusId: STATUS_DRAFT,
    needToBePosted: false,
    flightNumberField: null,
    contractId: 0,
    workOrderItems: [],
    loading: false,
    flightBoundFormStatus: { ...modelFlightBoundFormStatus },
    dateBoundBlock: {
        outboundBlockOut: null,
        inboundBlockIn: null,
        outboundScheduledDeparture: null,
        inboundScheduledArrival: null,
    },
    responsible: {},
    visibleMapModal: false,
    flightMap: null,
    loadingModalMap: false,
    flightList: [],
    flightId: 0,
    isblank: false,
    isPassenger: false,
});

export default function qRampStore() {
    function setIsPassenger(value) {
        state.isPassenger = value;
    }
    function getIsPassenger() {
        return state.isPassenger;
    }
    function getTitleOffline() {
        return state.titleOffline;
    }
    function setTitleOffline(value) {
        state.titleOffline = value;
    }
    function setStatusId(value) {
        state.statusId = value;
    }
    function getStatusId() {
        return state.statusId;
    }
    function setNeedToBePosted(value) {
        state.needToBePosted = value;
    }
    function getIsblank(value) {
        return state.isblank;
    }
    function setIsblank(value) {
        state.isblank = value;
    }
    function disabledReadonly() {
        const statusId = Number(state.statusId);
        if(state.isblank) {
            return true;
        }
        if (statusId === STATUS_DRAFT && state.needToBePosted) {
            return true;
        }
        if (statusId === STATUS_SUBMITTED && !editPermissionseSubmitted()) {
            return true;
        }
        if (statusId === STATUS_POSTED
        ) {
            return true;
        }
        return false;
    }
    function setFlightNumberField(value) {
        state.flightNumberField = value;
    }
    function getFlightNumberField() {
        return state.flightNumberField;
    }
    function setContractId(value) {
        state.contractId = value;
    }
    function getContractId() {
        return state.contractId;
    }
    function setWorkOrderItems(data) {
        state.workOrderItems = data;
    }
    function getWorkOrderItems() {
        return state.workOrderItems;
    }
    function getLoading() {
        return state.loading;
    }
    function hideLoading() {
        state.loading = false;
    }
    function showLoading() {
        state.loading = true;
    }
    function validateStatusSelectedFlight(data) {
        state.flightBoundFormStatus.boundOriginAirportId = this.isData(data.destinationAirport.id);
        state.flightBoundFormStatus.boundTailNumber = this.isData(data.registration);
        state.flightBoundFormStatus.outboundTailNumber = this.isData(data.registration || data.outRegistration);
        state.flightBoundFormStatus.boundDestinationAirport = this.isData(data.originAirport.id);
        state.flightBoundFormStatus.boundScheduled = this.isData(data.estimatedOn);
        state.flightBoundFormStatus.boundScheduledDeparture = this.isData(data.estimatedOff);
        if(state.isPassenger) {
            state.flightBoundFormStatus.inboundGateArrival = this.isData(data.gateDestination);
            state.flightBoundFormStatus.outboundGateDeparture = this.isData(data.gateOrigin);
        }
        
    }
    function isData(data) {
        return (!data || data === '') ? false : true;
    }
    function resetFlightBoundFormStatus() {
        state.flightBoundFormStatus = { ...modelFlightBoundFormStatus };
    }
    function showFielFlightBoundFormStatus() {
        const status = {
            boundOriginAirportId: false,
            boundTailNumber: false,
            boundScheduled: false,
            boundScheduledDeparture: false,
        }
        if(state.isPassenger) {
            status.inboundGateArrival = false;
            status.outboundGateDeparture = false;
        }
        state.flightBoundFormStatus = status;
    }
    function getFlightBoundFormStatus() {
        return state.flightBoundFormStatus;
    }
    function validateFutureDateTime(dateTime, dateMin = null, currentDate) {
        const current = moment(currentDate).format('YYYY/MM/DD');
        const date = moment();
        const today = date.format('YYYY/MM/DD');
        const hour = date.format('H');
        const min = date.format('mm');
        if (isNaN(dateTime)) {
            return dateTime <= today
        }
        if (dateMin) {
            return today === current ? Number(dateMin) <= min : true;
        }
        return today === current ? dateTime <= hour : true;
    }
    function setDateInboundBlockIn(value) {
        state.dateBoundBlock.inboundBlockIn = value;
    }
    function getDateInboundBlockIn() {
        return state.dateBoundBlock.inboundBlockIn;
    }
    function setDateOutboundBlockOut(value) {
        state.dateBoundBlock.outboundBlockOut = value;
    }
    function getDateOutboundBlockOut() {
        return state.dateBoundBlock.outboundBlockOut;
    }

    function setDateOutboundScheduledDeparture(value) {
        state.dateBoundBlock.outboundScheduledDeparture = value;
    }
    function getDateOutboundScheduledDeparture() {
        return state.dateBoundBlock.outboundScheduledDeparture;
    }
    function setDateinboundScheduledArrival(value) {
        state.dateBoundBlock.inboundScheduledArrival = value;
    }
    function getDateinboundScheduledArrival() {
        return state.dateBoundBlock.inboundScheduledArrival;
    }

    function validateDateInboundBlockIn(dateTime, dateMin = null) {
        const date = getDateInboundBlockIn()
            ? moment(getDateInboundBlockIn()) : moment();
        const today = date.format('YYYY/MM/DD');
        const hour = date.format('H');
        const min = date.format('mm')
        if (isNaN(dateTime)) {
            if (getDateInboundBlockIn()) {
                return dateTime <= today;
            }
            return dateTime <= moment().format('YYYY/MM/DD');
        }
        if (dateMin) {
            return Number(dateMin) <= min;
        }
        return dateTime <= hour;
    }
    function validateDateOutboundBlockOut(dateTime, dateMin = null) {
        const date = getDateOutboundBlockOut()
            ? moment(getDateOutboundBlockOut()) : moment();
        const hour = date.format('H');
        const min = date.format('mm');
        if (isNaN(dateTime)) {
            if (getDateOutboundBlockOut()) {
                return dateTime <= date.format('YYYY/MM/DD')
                    && dateTime >= moment(getDateInboundBlockIn()).format('YYYY/MM/DD');
            }
            return dateTime <= moment().format('YYYY/MM/DD')
                && dateTime >= moment(getDateInboundBlockIn()).format('YYYY/MM/DD');
        }
        if (dateMin) {
            return Number(dateMin) <= min;
        }
        return dateTime <= hour;
    }
    function getDifferenceInHours(start, end) {
        if (start) {
            const dateStart = moment(start);
            const dateEnd = moment(end);
            const hour = dateEnd.diff(dateStart, 'minutes') / 60;
            return Math.round(hour * 100) / 100;
        }
        return 0;
    }
    function dateFormatter(date) {
        if (!date) return null
        const [year, month, day] = date.substr(0, 10).split('-')
        return `${month}/${day}/${year}`
    }
    function getTableListOfFlights(data) {
        const dataTable = [];
        data.forEach((items, index) => {
          const date = items.scheduledOn ? dateFormatter(items.scheduledOn.split("T")[0]) : '';
          const inboundTime = items.estimatedOn ? moment(items.estimatedOn).utc().format('MM-DD-YYYY h:mm:ss a') : '';
          const outboundTime = items.estimatedOff ? moment(items.estimatedOff).utc().format('MM-DD-YYYY h:mm:ss a') : '';
          const airportName = items.originAirport ? items.originAirport.fullName : '';
          const destinationairportName = items.destinationAirport ? items.destinationAirport.fullName : '';
          const flight = {
            index,
            date,
            registration: items.registration,
            inbound: `${inboundTime} - ${destinationairportName}`,
            outbound: `${outboundTime} - ${airportName}`,
            aircraftType: items.aircraftType,
            faFlightId: items.faFlightId,
            cancelled: items.cancelled,
          }
          if(state.isPassenger) {
            flight.gateDestination = items.gateDestination || '';
            flight.gateOrigin = items.gateOrigin || '';
          }
          dataTable.push(flight)
        })
        return dataTable;
    }
    function setResponsible(data) {
        state.responsible = data;
    }
    function getResponsible() {
        return state.responsible;
    }
    function numberInRange(max, min) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    function hideVisibleMapModal() {
        state.visibleMapModal = false;
    }
    function showVisibleMapModal() {
        state.visibleMapModal = true;
    }
    function getVisibleMapModal() {
        return state.visibleMapModal;
    }
    function setVisibleMapModal(value) {
        state.visibleMapModal = value;
    }
    function setFlightMap(data) {
        state.flightMap = data;
    }
    function getFlightMap() {
        return state.flightMap;
    }
    function getLoadingModalMap() {
        return state.loadingModalMap;
    }
    function setLoadingModalMap(value) {
        state.loadingModalMap = value;
    }
    function setFlightList(value) {
        state.flightList = value;
    }
    function getFlightList() {
        return state.flightList;
    }
    function getFlightId() {
        return state.flightId;
    }
    function setFlightId(value) {
        state.flightId = value;
    }
    function editPermissionseSubmitted() {
        return Vue.prototype.$auth.hasAccess('ramp.work-orders.edit-when-submitted');
    }
    function setAttr(obj) {
        try {
            const att = [];
            for (let key in obj) {
                if (obj[key].id && obj[key].attributeId) {
                    att.push({
                        name: obj[key].name,
                        value: obj[key].value,
                        attribute_id: obj[key].attributeId,
                        id: obj[key].id,
                    })
                } else if (obj[key].id && !obj[key].attributeId) {
                    att.push({
                        name: obj[key].name,
                        value: obj[key].value,
                        attribute_id: obj[key].id,
                    })
                } else if (obj[key].attributeId && obj[key].value) {
                    att.push({
                        name: obj[key].name,
                        value: obj[key].value,
                        attribute_id: obj[key].attributeId,
                    })
                }
            }
            return att
        } catch (error) {
            console.log(error);
        }
    }
    function productDataTransformation(data = []) {
        try {
            const products = [];
            data.forEach((items) => {
                if (items.id && items.productsId) {
                    products.push({
                        id: items.id,
                        product_id: items.productsId,
                        work_order_item_attributes: setAttr(items.formField)
                    })
                } else if (items.id && !items.productsId) {
                    products.push({
                        product_id: items.id,
                        work_order_item_attributes: setAttr(items.formField)
                    })
                } else if (items.id && isDelete(items.formField)) {
                    products.push({
                        product_id: items.productsId,
                        work_order_item_attributes: setAttr(items.formField)
                    })
                }
            })
            return products;
        } catch (error) {
            console.log(error);
        }
    }
    function isDelete(obj) {
        try {
            const att = []
            for (let key in obj) {
                return obj[key].value && obj[key].value != ""
            }
            return att
        } catch (error) {
            console.log(error);
        }
    }
    async function getFlights() {
        try {
          const isPassenger = getIsPassenger();
          const companyId = isPassenger ? COMPANY_PASSENGER : COMPANY_RAMP;
          const workOrderId = state.flightId;
          const params = {
            refresh: true, 
            params: {
                filter: {
                    companyId,
                }
            }
          };
          if(workOrderId) params.params.filter.id = workOrderId;
          const response = await baseService.index("apiRoutes.qramp.flightPosition", params);
          const data = workOrderId ? [response.data] : response.data;
          setFlightList(data);
          return response;
        } catch (error) {
          console.log(error)
        }
    }
    async function changeStatus(statusId, workOrderId) {
        try {
          const route = 'apiRoutes.qramp.workOrderChangeStatus';
          const payload = {
            id: workOrderId,
            statusId,
          }
          const params = {params: {
            titleOffline: getTitleOffline()
          }};
          await baseService.update(route, workOrderId, payload, params);
        } catch (error) {
          console.log('Error changeStatus Schedule',error);
        }
    }
    function parseDateOfflineWO(dateWO){
        if (!dateWO && !dateWO?.includes('T')) return dateWO;
        const splitDate = dateWO.split(" ");
        const [date, hour] = splitDate;
        const newDate = new Date(date).toLocaleDateString('fr-CA');
        return `${newDate}T${hour}`;
    }
    return {
        getTitleOffline,
        setTitleOffline,
        disabledReadonly,
        setStatusId,
        getStatusId,
        setNeedToBePosted,
        setFlightNumberField,
        getFlightNumberField,
        setContractId,
        getContractId,
        setWorkOrderItems,
        getWorkOrderItems,
        getLoading,
        hideLoading,
        showLoading,
        validateStatusSelectedFlight,
        getFlightBoundFormStatus,
        resetFlightBoundFormStatus,
        showFielFlightBoundFormStatus,
        isData,
        validateFutureDateTime,
        setDateInboundBlockIn,
        getDateInboundBlockIn,
        setDateOutboundBlockOut,
        getDateOutboundBlockOut,
        setDateOutboundScheduledDeparture,
        setDateinboundScheduledArrival,
        getDateOutboundScheduledDeparture,
        getDateinboundScheduledArrival,
        validateDateOutboundBlockOut,
        validateDateInboundBlockIn,
        getDifferenceInHours,
        dateFormatter,
        getTableListOfFlights,
        setResponsible,
        getResponsible,
        numberInRange,
        hideVisibleMapModal,
        showVisibleMapModal,
        getVisibleMapModal,
        setVisibleMapModal,
        setFlightMap,
        getFlightMap,
        getLoadingModalMap,
        setLoadingModalMap,
        setFlightList,
        getFlightList,
        getFlightId,
        setFlightId,
        editPermissionseSubmitted,
        setAttr,
        productDataTransformation,
        isDelete,
        getFlights,
        setIsblank,
        getIsblank,
        setIsPassenger,
        getIsPassenger,
        changeStatus,
        parseDateOfflineWO,
    }
}