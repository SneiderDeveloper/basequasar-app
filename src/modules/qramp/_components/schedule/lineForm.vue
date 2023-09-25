<template>
  <div>
    <q-form ref="lineForm">
      <div
        class="
          tw-border 
          tw-rounded-lg 
          tw-py-3 
          tw-px-4 
          tw-mx-2 
          tw-my-1
          lg:tw-flex 
          lg:tw-space-x-2 
          lg:tw-flex-wrap 
          md:tw-flex-wrap
        "
      >
        <div v-for="(field, keyField) in fields.form" :key="keyField">
          <dynamic-field
            v-if="keyField !== 'sta' && keyField !== 'outboundScheduledDeparture'"
            :field="field"
            v-model="form[keyField]"
            class="tw-w-full lg:tw-w-48"
            :class="{ 'tw-hidden tw-w-0': keyField === 'stationId' || (keyField === 'gateId' && isPassenger)}"
          />
          <div v-if="isbound[0] && keyField === 'sta'">
            <dynamic-field
              :field="field"
              v-model="form[keyField]"
              :class="{ 'tw-hidden': keyField === 'stationId' }"
            />
          </div>
          <div v-if="isbound[1] && keyField === 'outboundScheduledDeparture'">
            <dynamic-field
              :field="field"
              v-model="form[keyField]"
              :class="{ 'tw-hidden': keyField === 'stationId' }"
            />
          </div>
        </div>
        <div class="tw-space-x-2 tw-my-7">
          <button
            v-if="form.isUpdate && !isBlank"
            class="
             tw-bg-blue-800 
             tw-rounded-lg 
             tw-px-2 tw-py-1 
             tw-text-white"
            @click.prevent="save()"
          >
            <i class="fa-light fa-floppy-disk" />
            <q-tooltip>
              {{ $tr("isite.cms.label.save") }}
            </q-tooltip>
          </button>
          <button
            v-if="!isNaN(form.id) && form.isUpdate && !isBlank && permisionComments"
            class="
             tw-bg-blue-800 
             tw-rounded-lg
             tw-px-2 tw-py-1 
             tw-text-white"
            @click.prevent="openCommentsModal"
          >
            <i class="fa-light fa-comment" />
            <q-tooltip>
              {{ $tr("isite.cms.label.comment") }}
            </q-tooltip>
          </button>
          <button
            v-if="form.isUpdate"
            @click.prevent="$emit('dismissEvent', form)"
            class="
             tw-bg-blue-800 
             tw-rounded-lg 
             tw-px-2 
             tw-py-1 
             tw-text-white"
          >
            <i class="fa-light fa-xmark"></i>
            <q-tooltip> Discard </q-tooltip>
          </button>
        </div>
      </div>
    </q-form>
    <commentsModal
      v-if="!isNaN(form.id)"
      :key="form.id"
      ref="commentsModal"
      :commentableId="form.id"
    />
  </div>
</template>
<script>
import scheduleField from "./fields/scheduleField.js";
import qRampStore from "../../_store/qRampStore.js";
import commentsModal from "./modals/commentsModal.vue";
import {STATUS_DRAFT} from '../model/constants.js';
import cache from '@imagina/qsite/_plugins/cache';
export default {
  components: { commentsModal },
  mixins: [scheduleField],
  props: {
    event: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      STATUS_DRAFT,
      form: {},
    }
  },
  created() {
    this.$nextTick(async function () {
      this.sessionStationId =
        await cache.get.item("stationId") !== "null"
          ? await cache.get.item("stationId")
          : null;
      await this.getFlightStatusList();
    });
  },
  mounted() {
    this.form = this.event;
    this.form.sta = this.form.inboundScheduledArrival ? this.$moment(this.form.inboundScheduledArrival).format('HH:mm'): null;
    this.form.outboundScheduledDeparture = typeof this.form.id !== 'string'  
    ? this.$moment(this.form.outboundScheduledDeparture).format(`MM/DD/YYYY HH:mm`)
    : this.$moment(this.form.inboundScheduledArrival).format('MM/DD/YYYY 00:00');
  },
  computed: {
    isAppOffline() {
      return this.$store.state.qofflineMaster.isAppOffline;
    },
    isbound() {
      if(this.form.operationTypeId) {
        const operationType = this.operationTypeList
          .find(item => item.id === Number(this.form.operationTypeId));
        const type = operationType?.options?.type;
        if(type) {
          if(type === 'full'){
            return [true, true];
          }
          if(type === 'inbound') {
            return [true, false]
          }
          if(type === 'outbound') {
            return [false, true];
          }
        }
      }
      return [false, false];
    },
    tranformaDate() {
      const inboundScheduledArrival = `${this.$moment(
        this.form.inboundScheduledArrival
      ).format("MM/DD/YYYY")} ${this.form.sta || '00:00'}`;
      this.form.sta = this.form.sta ? this.$moment(this.form.sta, "HH:mm:ss").format("HH:mm") : null;
      this.form.std = this.form.outboundScheduledDeparture ? this.$moment(this.form.outboundScheduledDeparture).format('HH:mm'): null;
      if(this.isbound[0] && !this.isbound[1]) {
        this.form.std = null;
        this.form.outboundScheduledDeparture = null;
      }
      if(!this.isbound[0] && this.isbound[1]) {
        this.form.sta = null;
        this.form.inboundScheduledArrival = null;
      }
      return {
        isClone: this.form.isClone || false,
        sta: this.form.sta,
        std: this.form.std,
        stationId: this.form.stationId,
        preFlightNumber: this.form.preFlightNumber,
        gateId: this.form.gateId,
        flightStatusId: this.form.flightStatusId,
        acTypeId: this.form.acTypeId,
        inboundScheduledArrival: inboundScheduledArrival,
        carrierId: this.form.carrierId,
        statusId: this.form.statusId,
        outboundScheduledDeparture:  this.form.outboundScheduledDeparture,
        operationTypeId: this.form.operationTypeId,
        scheduleDate: this.form.scheduleDate,
      };
    },
    isBlank() {
      return qRampStore().getIsblank();
    },
    permisionComments() {
      return this.$auth.hasAccess(`ramp.work-orders-comments.index`)
    },
  },
  methods: {
    save(statusId = null) {
      try {
        this.$refs.lineForm.validate().then(async (success) => {
          if (success) {
            if (this.form.isUpdate && typeof this.form.id === "string") {
              this.form.isUpdate = false;
              await this.$emit("addSchedule", this.tranformaDate);
              if(this.isAppOffline) {
                await this.$emit('dismissEvent', this.form);
              }
            } else {
              this.form.isUpdate = false;
              if(statusId) {
                this.form.statusId = statusId;
              }
              this.$emit("updateSchedule", {
                ...this.tranformaDate,
                id: this.form.id,
              });
            }
          }
        });
      } catch (error) {
        console.log(error);
      }
    },
    openCommentsModal() {
      if(this.$refs.commentsModal){
        this.$refs.commentsModal.showModal();
      }
    }
  },
};
</script>