import Vue, { ref, computed, ComputedRef, WritableComputedRef } from 'vue';
import store from '../store/filters.store'
import workOrderList from '../../../_store/actions/workOrderList'

export default function useFiltersBar() {
  const filtersBar = computed(() => { 
    const filters = {...store.form}
    /* time */
    filters.time =  `${store.filterTime[0]} - ${store.filterTime[1]}:59 H`
    
    /* carrier*/    
    const carrier = workOrderList().getAirlinesList().find(item => filters.carrierId == item.id) || {};
    filters.carrier = carrier.airlineName
    delete filters.carrierId;
    
    /* station */
    const stationId = store.form.stationId || store.stationId
    const station: any =  workOrderList().getStationList().find(item => stationId == item.id) || {};
    delete filters.stationId;      
    filters.station = station.fullName

    /* status */
    const statusId: any = workOrderList().getWorkOrderStatusesList().find(item => filters.statusId == item.id) || {};
    filters.status = statusId.statusName    
    delete filters.statusId;

    /* Adhoc*/
    filters.adHoc = filters.adHoc ? 'Yes' : 'No'
    /* flight status*/

    const flightStatus: any = workOrderList().getFlightStatusesList().find(item => filters.flightStatusId == item.id) || {};
    filters.flightStatus = flightStatus.name

    /* Areas */
    //const areas  = workOrderList()??   

    delete filters.scheduleType
    return filters;    
  });
     
  return {
    filtersBar,
  };
}
