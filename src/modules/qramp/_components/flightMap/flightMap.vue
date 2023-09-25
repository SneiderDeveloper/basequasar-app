<template>
  <div>
    <l-map :zoom="zoom" :worldCopyJump="true" :minZoom="2"  :center="center" style="height: 700px; width: 100%">
      <l-tile-layer :url="url" :attribution="attribution" />

      <vRotatedMarker
        v-for="(item, index) in aircraftList"
        :key="item.id"
        :lat-lng="item.coordinates"
        :icon="icon(item.flightStatusColor)"
        :rotationAngle="item.lastPositionHeading - 95"
        @click="selectedflight(item.id)"
      >
        <l-tooltip>
          <p>
            <span class="tw-font-semibold">
              {{ $tr('ifly.cms.map.workOrderId') }}:
            </span>{{ item.id }}
          </p>
          <p>
            <span class="tw-font-semibold">
              {{ $tr('ifly.cms.map.flightNumber') }}:
            </span>
            {{ item.preFlightNumber }}
          </p>
          <p>
            <span class="tw-font-semibold">
              {{ $tr('ifly.cms.map.aircraftType') }}:
            </span>
            {{ item.aircraft_type }}
          </p>
          <p>
            <span class="tw-font-semibold">{{ $tr('ifly.cms.map.estimatedTimeOfArrival') }}:</span>
            {{ minutesToHours(item.timeTotalEstimated) }}
          </p>
        </l-tooltip>
      </vRotatedMarker>
      <div>
        <l-marker
          v-for="(item, index) in listOfAirports"
          :key="item.id"
          :lat-lng="item.coordinates"
        >
          <l-icon
            :icon-size="dynamicSize"
            :icon-anchor="dynamicAnchor"
            class-name="someExtraClass"
          >
            <div>
              <span class="tw-font-bold">{{ item.airportIataCode }}</span>
              <i
                class="
                  tw-animate-pulse
                  fa-sharp fa-solid fa-circle
                  tw-text-green-600
                  tw-text-xs
                "
              ></i>
            </div>
          </l-icon>
          <l-tooltip>
            <p>
              {{ $tr('ifly.cms.map.airportName') }}:{{  item.airportName }}
            </p> 
          </l-tooltip>
        </l-marker>
      </div>
    </l-map>
  </div>
</template>
  
<script>
import {
  LMap,
  LTileLayer,
  LCircle,
  LRectangle,
  LPolygon,
  LPolyline,
  LIcon,
  LMarker,
  LTooltip,
} from "vue2-leaflet";
import coordinateModel from "./models/coordinateModel.js";
import vRotatedMarker from "vue2-leaflet-rotatedmarker";
import { Icon, LatLng, divIcon } from "leaflet";
const ico = "https://i.ibb.co/d0bmMTz/black-plane.png";
import qRampStore from '../../_store/qRampStore.js';
import workOrderModel from './models/workOrderModel.js';
import _ from 'lodash';

export default {
  props: {
    flightDetail: {
      type: Boolean,
      default: () => false,
    },
  },
  inject: {
    openModal: {
        type: Boolean,
        default: () => false
    },
  },
  components: {
    LMap,
    LTileLayer,
    LCircle,
    LRectangle,
    LPolygon,
    LPolyline,
    LIcon,
    LMarker,
    vRotatedMarker,
    LTooltip,
  },
  data() {
    return {
      zoom: 2,
      staticAnchor: [16, 37],
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      iconSize: 20,
      refreshIntervalId: null,
    };
  },
  async mounted() {
    this.$nextTick(function () {
      const fiveMin = 1000 * 60 * 5;
      if(!this.flightDetail || this.openModal) {
        this.refreshIntervalId = setInterval(async() => {
          await this.getFlights();
        }, fiveMin);
      }
    })
  },
  beforeDestroy() {
    this.clearIntervalMap();
  },
  computed: {
    flightList() {
      return qRampStore().getFlightList();
    },
    flightId() {
      return qRampStore().getFlightId();
    },  
    dynamicSize() {
      return [this.iconSize, this.iconSize * 1.15];
    },
    dynamicAnchor() {
      return [this.iconSize / 2, this.iconSize * 1.15];
    },
    aircraftList() {
      const flightList = this.flightList.map(item => {
        const flightPosition = item.flightPosition ? item.flightPosition : null;
        const coordinates = flightPosition 
          ? [flightPosition.lastPositionLatitude || 0, flightPosition.lastPositionLongitude || 0] 
          : [0, 0];
          return {
            ...item,
            ...flightPosition,
            coordinates,
          }
      }).filter(item => item.flightPosition !== null);
      if(this.flightDetail) {
        return flightList.filter(item => this.flightId === item.id);
      }
      return flightList;
    },
    listOfAirportsOfOrigin() {
      return this.mapFlight('inboundOriginAirport');
    },
    listOfDestinationOfOrigin() {
      return this.mapFlight('outboundDestinationAirport');
    },
    listOfAirports() {
      const data =  _.uniqBy([...this.listOfAirportsOfOrigin, ...this.listOfDestinationOfOrigin], 'id');
      return data;
    },
    icon() {
      return color => new divIcon({
        html: `<i class="fak fa-plane-right-thin-icon tw-text-4xl ${ color ? `tw-text-${color}`: 'tw-text-blue-500'}"  />`,
        iconSize: this.dynamicSize, // size of the icon
        iconAnchor: this.dynamicAnchor,
        className: "iconMapPane",
      });
    },
    center() {
      if(this.flightDetail) {
        this.zoom = 5;
        return this.aircraftList[0].coordinates;
      }
      this.zoom = 2;
      return [0, 0];
    },
  },
  methods: {
    async selectedflight(id) {
      this.getFlightMap();
      qRampStore().setFlightId(id);
    },
    async getFlights() {
      try {
        await qRampStore().getFlights();
      } catch (error) {
        console.log(error)
      }
    },
    async getFlightMap() {
      try {
        if(qRampStore().getVisibleMapModal()) return;
        qRampStore().showVisibleMapModal();
        qRampStore().setLoadingModalMap(true);
        setTimeout(() => {
          qRampStore().setLoadingModalMap(false);
        }, 1000);
      } catch (error) {
        qRampStore().setFlightMap(null);
        qRampStore().setLoadingModalMap(false);
      }
    },
    minutesToHours(numberOfMinutes) {  
      const duration = this.$moment.duration(numberOfMinutes, 'minutes');
      const hh = (duration.years()*(365*24)) + (duration.months()*(30*24)) + (duration.days()*24) + (duration.hours());
      const mm = duration.minutes();
      return `${hh}h ${mm} min`;
    },
    mapFlight(key) {
      try {
          const flightList =  this.flightList.map(item => {
          const fligth = item[key] ? item[key] : {};
          const coordinates = fligth 
          ? [fligth.lat || 0, fligth.lng || 0]
          : [0, 0];
          return {
            workOrderId: item.id,
            ...fligth,
            coordinates,
            flightPosition: item.flightPosition
          }
        }).filter(item => item.flightPosition !== null)
        if(this.flightDetail) {
          return flightList.filter(item => this.flightId === item.workOrderId);
        }
        return flightList;
      } catch (error) {
        console.log(error);
      }
    },
    clearIntervalMap() {
      clearInterval(this.refreshIntervalId);
      this.refreshIntervalId = null;
    },
  },
};
</script>
<style>
</style>