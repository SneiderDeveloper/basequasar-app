<template>
  <master-modal
    v-model="show"
    :title="title"
    :persistent="true"
    :loading="loading"
    @hide="hideModal"
    :actions="actions"
    :maximized="$q.screen.lt.md"
    :width="form.id ? '70%' : '400px'"
    :customClass="`tw-border-l-2 tw-border-${flightStatusComputed() ? flightStatusComputed().color : 'gray-100'}`"
  >
    <q-form ref="formSchedule">
      <div 
        class="tw-grid tw-grid-cols-1 tw-gap-4"
        :class="{'lg:tw-grid-cols-2': form.id && permisionComments}"
      >
          <div>
            <div v-for="(field, keyField) in fields.form" :key="keyField">
              <dynamic-field
                v-if="keyField !== 'sta' && keyField !== 'outboundScheduledDeparture'"
                :field="field"
                v-model="form[keyField]"
                @input="zanetizeData(keyField)"
                :class="{ 'tw-hidden': keyField === 'stationId' }"
              />
              <div v-if="isbound[0] && keyField === 'sta'">
                <dynamic-field
                  :field="field"
                  v-model="form[keyField]"
                  @input="zanetizeData(keyField)"
                  :class="{ 'tw-hidden': keyField === 'stationId' }"
                />
              </div>
              <div v-if="isbound[1] && keyField === 'outboundScheduledDeparture'">
                <dynamic-field
                    :field="field"
                    v-model="form[keyField]"
                    @input="zanetizeData(keyField)"
                    :class="{ 'tw-hidden': keyField === 'stationId' }"
                  />
              </div>
          </div>
        </div>
        <div>
          <comments 
            v-if="form.id && permisionComments && !isAppOffline"
            apiRoute="apiRoutes.qramp.comments"
            :commentableId="Number(form.id)"
            commentableType="Modules\Ramp\Entities\WorkOrder"
            permisionComments="ramp.work-orders-comments"
            class="tw-py-4"
          />
        </div>
      </div>
    </q-form>
  </master-modal>
</template>
<script>
import scheduleField from "../fields/scheduleField.js";
import qRampStore from '../../../_store/qRampStore.js';
import comments from '@imagina/qsite/_components/master/comments/index.vue'
import {STATUS_DRAFT , STATUS_SCHEDULE} from '../../model/constants.js'
import cache from '@imagina/qsite/_plugins/cache';
export default {
  components: {comments},
  mixins: [scheduleField],
  data() {
    return {
      show: false,
      loading: false,
      title: null,
      form: {},
      isEdit: false,
      dataLoad: false,
    };
  },
  async created() {
    this.$nextTick(async function () {
      this.sessionStationId =
        await cache.get.item("stationId") !== "null"
          ? await cache.get.item("stationId")
          : null;
      await this.getFlightStatusList();
    })
  },
  computed: {
    isAppOffline() {
      return this.$store.state.qofflineMaster.isAppOffline;
    },
    isBlank() {
      return qRampStore().getIsblank();
    },
    permisionComments() {
      return this.$auth.hasAccess(`ramp.work-orders-comments.index`)
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
    actions() {
      return [
        {
          props: {
            vIf: this.isEdit && !this.isBlank,
            color: "green",
            label: 'Start Work Order',
          },
          action: async() => {
            await this.saveScheduleForm(STATUS_DRAFT);
          },
        },
        {
          props: {
            vIf: !this.isBlank,
            color: "primary",
            label: this.isEdit
              ? this.$tr("isite.cms.label.update")
              : this.$tr("isite.cms.label.save"),
          },
          action: async () => {
            await this.saveScheduleForm();
          },
        },
        {
          props: {
            vIf: this.isEdit && !this.isBlank,
            color: "red",
            label: this.$tr("isite.cms.label.delete"),
          },
          action: () => {
            this.$emit("deleteSchedule", this.form.id);
            this.hideModal();
          },
        },
      ];
    },
  },
  methods: {
    async hideModal() {
      this.$emit('setEventComments', this.form.id);
      this.show = false;
      this.form = {};      
    },
    async openModal(title = null, data = null, date) {
      try {
        this.sessionStationId = await cache.get.item("stationId") !== 'null' ? await cache.get.item("stationId") : null;
        this.dataLoad = true;
        let currentDate = this.$moment().format('MM/DD/YYYY');
        if(this.$moment().format('YYYY-MM-DD') !== date) {
          currentDate = this.$moment(date).format('MM/DD/YYYY');
        }
        this.title = title;
        this.show = true;
        this.isEdit = !!data;
        this.form.inboundScheduledArrival = currentDate;
        this.form.scheduleDate = currentDate;
        this.form.outboundScheduledDeparture = `${currentDate} 00:00`;
        if (data) {
          this.form = data;
          this.form.sta = this.form.inboundScheduledArrival ? this.$moment(this.form.inboundScheduledArrival).format('HH:mm'): null;
          this.form.outboundScheduledDeparture = this.$moment(this.form.outboundScheduledDeparture).format('MM/DD/YYYY HH:mm');
        };
        setTimeout(() => {
          this.dataLoad = false;
        }, 300);
      } catch (error) {
        console.log(error);
      }
    },
    async saveScheduleForm(statusId = null) {
      try {
        this.$refs.formSchedule.validate().then(async (success) => {
          if (success) {
            this.tranformData();
            if (this.isEdit) {
              if(statusId) {
                this.form.statusId = statusId;
              }
              this.$emit("updateSchedule", this.form);
            } else {
              this.$emit("addSchedule", this.form);
            }
          }
        });
      } catch (error) {
        console.log(error);
      }
    },
    tranformData() {
      this.form.inboundScheduledArrival = `${this.$moment(this.form.inboundScheduledArrival).format('MM/DD/YYYY')} ${this.form.sta || '00:00'}`;
      this.form.outboundScheduledDeparture = this.form.outboundScheduledDeparture;
      this.form.std = this.form.outboundScheduledDeparture ? this.$moment(this.form.outboundScheduledDeparture).format('HH:mm'): null;
      if(this.isbound[0] && this.isbound[1]) return;
      if(this.isbound[0] && !this.isbound[1]) {
        this.form.std = null;
        this.form.outboundScheduledDeparture = null;
      }
      if(!this.isbound[0] && this.isbound[1]) {
        this.form.sta = null;
        this.form.inboundScheduledArrival = null;
      }
    },
    zanetizeData(key) {
      if(this.dataLoad) return;
      if (key === "flightNumber") {
        this.form[key] = this.form[key].toUpperCase().replace(/\s+/g, "");
      }
      if (key === "stationId") {       
        this.form.gateId = null;
        return;
      }
    },
    setLoading(value) {
      this.loading = value;
    },
    flightStatusComputed() {
      return this.flightStatusList.find(item => item.id == this.form.flightStatusId) || null;
    },
  },
};
</script>