<template>
  <div class="tw-flex tw-justify-center tw-items-center tw-bg-gray-100 tw-h-screen">
    <div class="tw-max-w-xl tw-bg-white tw-p-6 tw-mx-5 tw-rounded-xl tw-shadow-lg">
      <div class="text-center">
        <q-icon :name="content.icon" size="xl" color="secondary" />
        <div class="tw-text-2xl tw-font-bold tw-my-5 text-blue">
          {{ i18n.tr(content.title) }}
        </div>
      </div>
      <p class="tw-text-base tw-font-medium">
        {{ i18n.tr(content.message) }}
      </p>
      <q-linear-progress rounded size="8px" :value="progress" color="secondary" class="tw-mt-5" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { i18n, store, router, cache } from 'src/plugins/utils';

const route = useRoute();
const progress = ref(0);
const content = ref({
  title: 'isite.cms.messages.updateAvailable',
  message: 'isite.cms.messages.refreshAppVersion',
  action: 'isite.cms.messages.updateNow',
  icon: 'fa-regular fa-rocket-launch',
});
let interval;

onBeforeMount(async () =>
{
  
  if (route.query.fromCache) {
    content.value = {
      title: 'isite.cms.label.cacheCleanup', 
      message: 'isite.cms.messages.cacheCleanupMessage',
      action: 'isite.cms.label.clear',
      icon: 'fas fa-broom'
    }
  }

  //Redirect after update
  if (route.query.updated) router.push({
    name: route.query.fromVueRoute || 'app.home',
    query: { ...JSON.parse(route.query.fromVueRouteQuery) },
    params: { ...JSON.parse(route.query.fromVueRouteParams) },
  }); else {
    interval = setInterval(() => {
      progress.value = progress.value + (100 / 20);
      if (progress.value >= 100) {
        clearInterval(interval);
      }
    }, 1000);
  }
});

const update = async () =>
{
  router.push({ query: { ...route.query, updated: '1' } });
  await Promise.allSettled([
    await store.dispatch('qsiteApp/REFRESH_PAGE'),
    await store.dispatch('qsiteApp/CLEAR_CACHE_STORAGE'),
    await store.dispatch('qsiteApp/DELETE_SW'),
  ])
  if (route.query.version) await cache.set('api.version', route.query.version);
  window.location.reload();
};

onMounted(async () => {
  setTimeout(async () => {
    await update();
  }, 2000)
});
</script>
