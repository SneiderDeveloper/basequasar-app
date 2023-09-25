<template>
  <master-modal
    v-model="visibleMapModal"
    v-bind="modalProps"
    :persistent="true"
    :loading="loading"
    @hide="close"
  >
    <div
      v-if="!loading && flight.flightPosition"
      class="flight-map tw-mx-auto tw-p-3"
    >
      <div class="md:tw-flex tw-mb-6 md:tw-space-x-4">
        <div class="rw-grow">
          <div class="tw-flex">
            <div class="tw-grow">
              <p class="tw-text-2xl tw-mb-2 tw-hidden">ABX Air 1234</p>
              <p class="tw-uppercase tw-text-gray-400">
                {{ flight.flightPosition.ident }} /
                {{ flight.flightPosition.ident_iata }}
              </p>
              <a
                class="
                  tw-text-xs
                  tw-mb-2
                  tw-block
                  tw-font-semibold
                  tw-underline
                  tw-decoration-dashed
                  tw-text-blue-400
                  tw-hidden
                "
                href=""
                >Make a category upgrade to see the registration number</a
              >
              <p
                class="tw-uppercase tw-text-xl tw-font-bold"
                :class="
                  flight.flightStatusColor
                    ? ` bg-${flight.flightStatusColor} tw-text-white tw-px-2 tw-rounded-md`
                    : ''
                "
              >
                {{ flight.flightPosition.status }}
              </p>
              <p class="tw-text-yellow-600 tw-text-base tw-hidden">
                {{ minutesToHours(flight.flightPosition.timeTotalEstimated) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        class="
          tw-flex tw-flex-col
          md:tw-flex-row
          tw-justify-between tw-space-x-4
        "
      >
        <div class="tw-mb-3">
          <p class="tw-text-xl tw-uppercase">
            {{ flight.inboundOriginAirport.airportIataCode }}
          </p>
          <p class="tw-text-lg tw-uppercase tw-font-bold">
            {{ flight.inboundOriginAirport.airportName }}
          </p>
          <p class="tw-text-sm tw-hidden">Detachment from</p>
          <a
            class="
              tw-text-base
              tw-mb-2
              tw-block
              tw-font-bold
              tw-underline
              tw-decoration-dotted
              tw-text-blue-400
              tw-hidden
            "
            >int'l de denver -
            <span class="tw-font-bold tw-uppercase">DEN</span></a
          >
          <p class="tw-text-lg tw-uppercase">
            {{
              $moment(flight.inboundScheduledArrival).format("dddd DD-MM-YYYY")
            }}
          </p>
          <p class="tw-text-lg">
            <span class="tw-font-bold"
              >{{ $moment(flight.inboundScheduledArrival).format("hh:mm A") }}
              {{ timezone(this.flight.inboundOriginAirport.timezone) }}</span
            >
            <span :class="delay(flight.flightPosition.departureDelay).color">
              ({{ delay(flight.flightPosition.departureDelay).title }})
            </span>
          </p>
        </div>
        <div class="tw-text-right">
          <p class="tw-text-xl tw-uppercase">
            {{ flight.outboundDestinationAirport.airportIataCode }}
          </p>
          <p class="tw-text-lg tw-uppercase tw-font-bold">
            {{ flight.outboundDestinationAirport.airportName }}
          </p>
          <p class="tw-text-sm tw-hidden">landing on</p>
          <a
            class="
              tw-text-base
              tw-mb-2
              tw-block
              tw-font-bold
              tw-underline
              tw-decoration-dotted
              tw-text-blue-400
              tw-hidden
            "
            >int'l de denver -
            <span class="tw-font-bold tw-uppercase">ILN</span></a
          >
          <p class="tw-text-lg tw-uppercase">
            {{
              $moment(flight.outboundScheduledDeparture).format(
                "dddd DD-MM-YYYY"
              )
            }}
          </p>
          <p class="tw-text-lg">
            <span :class="delay(flight.flightPosition.arrivalDelay).color">
              ({{ delay(flight.flightPosition.arrivalDelay).title }})</span
            >
            <span class="tw-font-bold"
              >{{ $moment(flight.outboundScheduledDeparture).format("hh:mm A") }}
              {{ timezone(flight.outboundDestinationAirport.timezone) }}</span
            >
          </p>
        </div>
      </div>
      <div class="tw-mt-6">
        <q-range
          v-model="standard"
          color="positive"
          :min="0"
          :max="100"
          readonly
          left-thumb-color="tw-left-thumb"
          :right-thumb-color="rightThumbColor"
        />
      </div>
      <div
        class="
          tw-grid
          tw-grid-cols-1
          tw-gap-4
          tw-place-items-stretch
          tw-mb-6
          tw-text-gray-500
        "
      >
        <div class="tw-text-sm tw-text-center">
          <span class="tw-font-bold">{{
            minutesToHours(flight.flightPosition.timeTotalEstimated)
          }}</span>
          total travel time
        </div>
      </div>
    </div>
    <div class="tw-px-4">
      <flightMap
        v-if="!loading && visibleMapModal && flight.flightPosition"
        :flightDetail="true"
      />
      <div v-if="loading" class="tw-w-64 tw-h-64" />
    </div>
  </master-modal>
</template>

<script>
import qRampStore from "../../_store/qRampStore.js";
import flightMap from "../flightMap/flightMap.vue";
import workOrdersModelDefault from "../flightMap/models/workOrdersModelDefault.js";
import momentTimezone from "moment-timezone";

export default {
  components: {
    flightMap,
  },
  data() {
    return {};
  },
  computed: {
    standard() {
      return {
        min: 0,
        max: this.flight.flightPosition.distancePercentageCovered,
      };
    },
    rightThumbColor() {
      if (this.standard.max >= 100) {
        return "tw-right-thumb tw-hidden";
      }
      return "tw-right-thumb";
    },
    visibleMapModal: {
      get() {
        return qRampStore().getVisibleMapModal();
      },
      set(value) {
        qRampStore().setVisibleMapModal(value);
      },
    },
    imgMap() {
      return qRampStore().getFlightMap();
    },
    loading() {
      return qRampStore().getLoadingModalMap();
    },
    flight() {
      return (
        qRampStore()
          .getFlightList()
          .find((item) => item.id === this.flightId) || {
          ...workOrdersModelDefault,
        }
      );
    },
    flightId() {
      return qRampStore().getFlightId();
    },
    modalProps() {
      return {
        width: "90vw",
        title: `Flight Map : ${this.flightId}`,
      };
    },
  },
  methods: {
    close() {
      this.visibleMapModal = false;
      qRampStore().setFlightMap(null);
      qRampStore().setFlightId(null);
    },
    minutesToHours(numberOfMinutes) {
      const duration = this.$moment.duration(numberOfMinutes, "minutes");
      const hh =
        duration.years() * (365 * 24) +
        duration.months() * (30 * 24) +
        duration.days() * 24 +
        duration.hours();
      const mm = duration.minutes();
      return `${hh} hour ${mm} minutes`;
    },
    delay(minutes) {
      if (minutes === 0 || minutes === null) {
        return { title: "On Time", color: "text-positive" };
      }
      const duration = this.$moment.duration(minutes, "minutes");
      const hh =
        duration.years() * (365 * 24) +
        duration.months() * (30 * 24) +
        duration.days() * 24 +
        duration.hours();
      const mm = duration.minutes();
      if (minutes < 0) {
        const title =  Math.abs(hh) === 0 ? `Advanced ${Math.abs(mm)} minutes` 
          : `Advanced ${Math.abs(hh)} hours and ${Math.abs(mm)} minutes`;
        return {
          title,
          color: "text-positive",
        };
      }
      if (minutes > 0) {
        const title =  Math.abs(hh) === 0 ? `Delayed ${Math.abs(mm)} minutes` 
          : `Delayed ${Math.abs(hh)} hours and ${Math.abs(mm)} minutes`;
        return {
          title,
          color: "tw-text-yellow-600",
        };
      }
      return {
        title: "",
        color: "tw-text-black",
      };
    },
    timezone(timezone) {
      if (!timezone) return;
      return momentTimezone.tz(timezone).format("z");
    },
  },
};
</script>

<style>
.flight-map .q-slider__thumb,
.flight-map .q-slider__track-container,
.q-slider__selection {
  @apply tw-relative;
}

.flight-map .q-slider__thumb:last-child:before {
  @apply tw-absolute tw-z-10 tw-text-2xl;
  font-family: "Font Awesome 6 Sharp";
  content: "\f072";
  color: var(--q-color-positive);
  top: -10px;
  text-shadow: 0px 9px 5px #607d8b, 0px -4px 10px rgba(255 255 255 0.3);
}

.flight-map .img-map {
  width: 70vw;
  height: 500px;
  border-radius: 10px;
}

.flight-map .text-tw-left-thumb,
.flight-map .q-slider__thumb-shape {
  @apply tw-hidden;
}

.flight-map .tw-underline.tw-decoration-dotted {
  text-underline-offset: 3px;
  text-decoration-style: dotted;
}

.flight-map .tw-underline.tw-decoration-dashed {
  text-underline-offset: 3px;
  text-decoration-style: dashed;
}

.flight-map .q-slider__track-container:before,
.flight-map .q-slider__track-container:after {
  content: "";
  width: 15px;
  height: 15px;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  box-shadow: 0px 0px 10px 2px #a2b1b9;
}

.flight-map .q-slider__track-container:before {
  @apply tw-left-0;
  background-color: var(--q-color-positive);
}

.flight-map .q-slider__track-container:after {
  @apply tw-right-0 tw-z-0;
  background-color: var(--q-color-positive);
}
.flight-map .q-slider__inner {
  @apply tw-opacity-30 tw-bg-gray-200;
}
</style>