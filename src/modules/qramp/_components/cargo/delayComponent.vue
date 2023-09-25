<template>
  <div class="tw-w-full tw-mb-12">
    <div class="tw-px-6 tw-mb-8">
      <q-toggle
        v-model="delay"
        color="primary"
        label="Delay"
        @input="resetDelayList"
      />
      <q-btn
        v-if="delay"
        class="q-ml-sm"
        flat
        round
        icon="add"
        color="primary"
        @click="addDelay()"
      />
    </div>
    <div v-if="delay" class="tw-px-6">
      <div class="row">
        <template v-for="(field, keyField) in delayFields">
          <dynamic-field
            class="col-12 col-md-5 q-pr-sm"
            :key="keyField"
            :field="field"
            v-model="
              delayList[
                keyField.includes('code')
                  ? keyField.split('code')[1]
                  : keyField.split('hours')[1]
              ][keyField.includes('code') ? 'code' : 'hours']
            "
          />
          <q-btn
            v-if="field.type !== 'select'"
            style="width: 40px; height: 38px"
            class="col-12 btn-stick col-md-1"
            round
            icon="delete"
            flat
            size="12px"
            color="primary"
            @click="delDelay(keyField)"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Vue, { defineComponent, computed, ref, onMounted, onBeforeUnmount } from "vue";
import cargoStore from "./store/cargo";
import qRampStore from "../../_store/qRampStore.js";
import { COMPANY_PASSENGER, COMPANY_RAMP } from "../model/constants.js";

export default defineComponent({
  setup() {
    const codeList = ref([]);
    const disabledReadonly = computed(() => qRampStore().disabledReadonly());
    const isPassenger = computed(() => qRampStore().getIsPassenger());
    const delay = computed({
      get() {
        return cargoStore().getDelay();
      },
      set(value) {
        cargoStore().setDelay(value);
      },
    });

    const delayList = computed(() => cargoStore().getDelayList());
    const filterCompany = computed(() =>
      isPassenger.value ? COMPANY_PASSENGER : COMPANY_RAMP
    );
    const delayFields = computed(() => {
      const obj = {};
      delayList.value.forEach((delay, index) => {
        obj["code" + index] = {
          value: delay.code,
          type: "select",
          props: {
            options: codeList.value,
            readonly: disabledReadonly.value,
            label: Vue.prototype.$tr("icommerce.cms.sidebar.code"),
            clearable: true,
            color: "primary",
            "hide-bottom-space": false,
          },
          label: Vue.prototype.$tr("icommerce.cms.sidebar.code"),
        };
        obj["hours" + index] = {
          value: delay.hours,
          type: "inputStandard",
          props: {
            hint: "Enter the Time in minutes",
            mask: "###################",
            readonly: disabledReadonly.value,
            label: Vue.prototype.$tr("isite.cms.label.time"),
            clearable: true,
            color: "primary",
            "hide-bottom-space": false,
          },
          label: Vue.prototype.$tr("isite.cms.label.time"),
        };
      });
      return obj;
    });
    function delDelay(index) {
      const i = parseInt(index.slice(-1));
      delayList.value.splice(i, 1);
    }
    function resetDelayList() {
      if (!delay.value) {
        delayList.value = [];
      }
    }
    function addDelay() {
      delayList.value.push({
        code: "",
        hours: "",
      });
    }

    function getCodeList() {
      const params = {
        refresh: true,
        params: {
          filter: {
            companyId: filterCompany.value,
          },
        },
      };
      Vue.prototype.$crud
        .index("apiRoutes.qramp.workOrderDelays", params)
        .then((res) => {
          const data = res.data || [];
          codeList.value = data.map((item) => ({
            id: item.id,
            label: item.name,
            value: item.name,
          }));
        })
        .catch((err) => {
          codeList.value = [];
          console.log("ERROR WHILE OBTAINING THE LIST OF CODES:", err);
        });
    }
    onMounted(() => {
      getCodeList();
      delay.value = delayList.value.length > 0;
    })
    return {
      delayFields,
      delayList,
      delDelay,
      delay,
      resetDelayList,
      getCodeList,
      addDelay,
    };
  },
});
</script>

<style></style>
