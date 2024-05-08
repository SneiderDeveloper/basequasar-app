<template>
  <div class="tw-flex tw-justify-center tw-items-center tw-bg-gray-100 tw-h-screen">
    <div class="tw-w-fit tw-bg-white tw-p-6 tw-mx-5 tw-rounded-xl tw-shadow-lg">
      <div class="text-center">
        <q-icon name="fa-regular fa-rocket-launch" size="xl" color="green" />
        <div class="tw-text-2xl tw-font-bold tw-my-5 text-blue">
          {{ i18n.tr('isite.cms.messages.updateAvailable') }}
        </div>
      </div>
      <p class="tw-text-base tw-font-medium">
        {{ i18n.tr('isite.cms.messages.refreshAppVersion') }}
      </p>
      <div class="tw-flex tw-justify-center tw-w-full">
        <q-btn unelevated @click="update" color="primary"
               class="tw-mt-5 tw-m-auto tw-rounded-lg">
          <span>
            {{ i18n.tr('isite.cms.messages.updateNow') }}
            <span v-if="countdown > 0"> ({{ countdown }})</span>
          </span>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import { i18n, store, router, cache } from 'src/plugins/utils';

const route = useRoute();
const countdown = ref(15);
let interval;

onBeforeMount(async () =>
{
  //Redirect after update
  if (route.query.updated) router.push({
    name: route.query.fromVueRoute || 'app.home'
  }); else
  {
    // Start countdown to auto-update
    if (interval) clearInterval(interval);
    interval = setInterval(() =>
    {
      countdown.value--;
      if (countdown.value === 0) update();
    }, 1000);
  }
});

const update = async () =>
{
  clearInterval(interval);
  router.push({ query: { ...route.query, updated: '1' } });
  await store.dispatch('qsiteApp/REFRESH_PAGE');
  await store.dispatch('qsiteApp/CLEAR_CACHE_STORAGE');
  await store.dispatch('qsiteApp/DELETE_SW');
  //Let this after success refresh
  if (route.query.version) await cache.set('api.version', route.query.version);
  window.location.reload();
};
</script>
