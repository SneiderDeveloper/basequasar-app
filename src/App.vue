<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { eventBus } from 'src/plugins/utils';

export default defineComponent({
  name: 'App',
  mounted ()
  {
    this.$q.iconSet.arrow.dropdown = 'fa fa-caret-down';
    this.$q.iconSet.expansionItem.icon = 'fa fa-chevron-down';
    // Listen Service worker updates
    eventBus.on('service-worker.update.available', () =>
    {
      this.$alert.info({
        mode: 'modal',
        title: this.$tr('isite.cms.messages.updateAvailable'),
        message: this.$tr('isite.cms.message.swUpdateAvailable'),
        icon: 'fas fa-cloud-download-alt',
        timeOut: 15000,
        actions: [
          {
            label: 'Ok',
            handler: async () =>
            {
              this.$router.push({ name: 'app.update.app' });
            }
          }
        ]
      });
    });
  }
});
</script>
