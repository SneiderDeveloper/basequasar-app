<template>
  <div v-show="!loading">
    <div class="row">
      <div class="col-12 text-center q-pa-md">
        <q-btn
          @click="markAsSync"
          :loading="loadingButton"
          :disable="disableButton"
          :icon-right="icon"
          no-caps
          :label="cardParams.buttonLabel"
          size="md"
          />
      </div>
    </div>
    <div class="row">
      <div class="col-12 text-center q-pa-md">
        <div v-if="disableButton">
          <q-icon name="warning" color="warning" size="sm" />
          <p>We are working on the sync, we'll notify you when finished</p>
        </div>
        <div v-if="lastSync" class="text-bold">
          <p>Last Sync: {{ lastSync }}</p>
        </div>          
        <div  v-if="syncedByName">
          by {{ syncedByName }}
        </div>  
      </div>
    </div>   
  </div>
</template>
<script>
import useSyncCard from '../uses/useSyncCard';
//Component
export default {
  name: 'syncCard',
  setup(props) {
    return {...useSyncCard(props)}
  },
  props: {
    items: [],
    loading: Boolean,
    cardParams: {}
  }
}
</script>
<style lang="stylus">
</style>
  