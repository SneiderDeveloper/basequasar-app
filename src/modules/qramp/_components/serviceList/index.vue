<script lang="ts">
import {defineComponent} from "vue";
import expansionForm from "./expansionForm.vue";
import useServiceList from "./useServiceList";

export default defineComponent({
  components: {
    expansionForm,
  },
  setup() {
    return {
      ...useServiceList(),
    };
  },
});
</script>
<template>
  <div
      class="
      service-list-ctn
      tw-mx-3
      tw-p-4
      tw-mb-12
      tw-overflow-auto
      tw-shadow-lg
      tw-rounded-lg
      tw-border-t
      tw-border-gray-100
    "
  >
    <q-breadcrumbs>
      <q-breadcrumbs-el
          icon="widgets"
          label="Service list"
          @click="setBreadcrumbs(null)"
          class="tw-cursor-pointer tw-text-blue-900"
      />
      <q-breadcrumbs-el
          v-for="(breadcrumb, index) in breadcrumbs"
          :key="breadcrumb.id"
          :label="breadcrumb.title"
          @click="setBreadcrumbs(breadcrumb, index)"
          :class="{ 'tw-cursor-pointer': index + 1 !== breadcrumbs.length }"
      />
    </q-breadcrumbs>
    <div class="tw-py-6">
      <inner-loading :visible="loading"/>
      <q-input
          v-if="!selectService.component"
          borderless
          standout
          dense
          rounded
          style="max-width: 100%"
          color="primary"
          :placeholder="`What are you looking for?`"
          class="tw-mb-6 search tw-shadow-inner search-service-list"
          v-model="search"
      >
        <template v-slot:prepend>
          <q-icon color="primary" class="q-pl-sm" name="search"/>
        </template>
      </q-input>
      <q-list
          v-if="showServiceList"
          bordered
          separator
          class="tw-shadow-lg tw-rounded-lg"
      >
        <q-item
            v-for="service in filterService"
            :key="service.id"
            clickable
            v-ripple
            class="tw-py-4"
            @click.native="setBreadcrumbs(service)"
        >
          <div class="tw-flex tw-w-full tw-font-semibold tw-text-gray-500">
            <div class="tw-w-11/12">
              {{ service.title }}
            </div>
            <div class="tw-w-1/6 tw-text-right">
              <i class="fa-light fa-angle-right tw-font-semibold"></i>
            </div>
          </div>
        </q-item>
      </q-list>

      <expansionForm
          v-if="!loading && 
          selectService.dynamicField && 
          selectService.dynamicField.length > 0"
          :data="filterService"
      />
      <component
          v-if="selectService.component"
          :is="selectService.component"
      />
      <div
          v-if="showNoData"
          class="tw-text-center tw-text-gray-600 tw-text-xl"
      >
        <i class="fa-light fa-triangle-exclamation"></i>
        No data available
      </div>
    </div>
  </div>
</template>
<style>
.service-list-ctn .q-item {
  @apply tw-min-h-0;
}

.service-list-ctn .search-service-list {
  @apply tw-p-0 !important;
}

.service-list-ctn .q-list--bordered {
  @apply tw-border-0;
}

.service-list-ctn .search {
  @apply tw-bg-blue-100 tw-rounded-full;
}
</style>
