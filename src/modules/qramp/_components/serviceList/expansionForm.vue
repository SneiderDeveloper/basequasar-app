<script lang="ts">
import {defineComponent, computed} from 'vue';

export default defineComponent({
  name: 'expansionComponent',
  props: {
    data: {
      type: Array,
      default: () => [],
    }
  },
  setup(props) {
    const data: any = computed(() => props.data);
    const isDesktop = computed(() => (window as any).innerWidth >= '900');

    function showValue(data: any) {
      if (data) {
        return data.value
      }
    }

    return {
      isDesktop,
      showValue,
      data
    }
  },
})
</script>
<template>
  <div id="expansion-container" class="tw-mb-12" style="max-width: 100%">
    <div v-if="!isDesktop">
      <q-list v-for="(item, index) in data" :key="index">
        <q-expansion-item header-class="text-white">
          <template v-slot:header>
            <q-item-section avatar class="q-pr-none " style="min-width: 45px;">
              <q-avatar size="32px" font-size="18px" :icon="item.icon" color="primary" text-color="white"/>
            </q-item-section>
            <q-item-section class="q-py-sm">
              <span class="tw-text-base tw-font-bold" style="color:#1F294F;">{{ item.title }}</span>
              <span class="tw-text-sm" style="color:#8A98C3;">{{ showValue(item.formField.quantity) }}</span>
            </q-item-section>
          </template>
          <q-card class="row card-color justify-center">
            <q-card-section class=" q-py-md col-12 col-md" v-for="(field, keyfield) in item.formField" :key="keyfield">
              <label class="flex no-wrap items-center ">
                <dynamic-field
                    class="marginzero tw-w-full"
                    v-model="data[index]['formField'][keyfield]['value']"
                    :field="field"></dynamic-field>
              </label>
              <div
                  class="tw-px-3 tw-font-semibold tw-mt-5 tw-text-center tw-hidden"
                  v-if="field.type === 'fullDate' 
                  && field.props.typeIndexDate === 1"
              >
                Difference (hours): {{ 1 }}
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <!-- <q-separator color="red" />-->
      </q-list>
    </div>
    <q-list v-for="(item, index) in data" :key="index" v-else>
      <div class="q-py-sm row">
        <div class="row q-py-md">
          <div class="q-py-sm" style="width: 220px; display: flex;">
            <div class="q-px-sm">
              <q-avatar size="32px" font-size="18px" :icon="item.icon" color="primary" text-color="white"/>
            </div>
            <div>
              {{ item.title }}
            </div>
          </div>
        </div>
        <div class="row">
          <div class="q-pa-none q-py-md" v-for="(field, keyfield) in item.formField" :key="keyfield">
            <div class="flex no-wrap items-center">
              <dynamic-field
                  class="q-ml-sm marginzero"
                  v-model="data[index]['formField'][keyfield]['value']"
                  :field="field"
              />
              <div
                  class="tw--mt-4 tw-px-3 tw-font-semibold tw-hidden"
                  v-if="field.type === 'fullDate' 
                  && field.props.typeIndexDate === 1"
              >
                Difference (hours): {{ 1 }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <q-separator color="#fff"/>
    </q-list>
  </div>
</template>

<style>
#expansion-container {
  @apply tw-border tw-border-gray-100 tw-rounded-lg tw-overflow-hidden;
}

#expansion-container .card-color {
  @apply tw-rounded-lg tw-mx-4;
  background-color: #F1F4FA;
}

#expansion-container .q-expansion-item--collapsed {
  @apply tw-relative;
}

#expansion-container .q-expansion-item--collapsed:before {
  content: '';
  @apply tw-bg-gray-200 tw-mx-4 tw-absolute tw-bottom-0 tw-inset-x-0 tw-h-px;
}
</style>