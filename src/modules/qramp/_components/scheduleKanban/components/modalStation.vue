<template>
    <master-modal
      v-model="showModalStation"
      title="Filter schedule"
      :persistent="true"
      :loading="loading"
      :actions="actions"
      hideCloseAction
      :maximized="$q.screen.lt.md"
    >
      <dynamic-field :field="fields.banner" />
      <q-form ref="refModalStation">
        <dynamic-field :field="fields.stationId" v-model="stationId" />
      </q-form>
    </master-modal>
  </template>
<script lang="ts">
import { defineComponent } from "vue";
import useModalStation from '../uses/useModalStation'

export default defineComponent({
  setup () {
    return {...useModalStation()}
  }
})
</script>
<style scoped>

</style>