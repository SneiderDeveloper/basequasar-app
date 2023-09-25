<template>
  <div>
    <q-form ref="refFormScheduler">
      <div class="tw-grid md:tw-grid-cols-2 tw-gap-4">
        <div>
          <customer
            :dataForm="form"
            :addNewOptions="false" 
            :readonly="updateModal"
            ref="refCustomer"
          />
          <div v-for="(field, keyField) in formFields.left" :key="keyField">
            <dynamic-field v-model="form[keyField]" :field="field" />
          </div>
        </div>
        <div>
          <div v-for="(field, keyField) in formFields.right" :key="keyField">
            <dynamic-field v-model="form[keyField]" :field="field" />
          </div>
        </div>
      </div>
      <div>
        <div v-for="(field, keyField) in formFields.center" :key="keyField">
            <dynamic-field v-model="form[keyField]" :field="field" />
        </div>
      </div>
      <div v-if="isbound.inbound">
        <div v-for="(field, keyField) in formFields.inbound">
          <dynamic-field :field="field" v-model="form[keyField]" />
        </div>
      </div>
      <div v-if="isbound.outbound">
        <div v-for="(field, keyField) in formFields.outbound">
          <dynamic-field :field="field" v-model="form[keyField]" />
        </div>
      </div>
      <div v-if="isbound.inbound && isbound.outbound">
        <div v-for="(field, keyField) in formFields.full">
          <dynamic-field :field="field" v-model="form[keyField]" />
        </div>
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import useForm from "../uses/useForm";
import customer from '../../customer/index.vue'
export default defineComponent({
  components:{
    customer,
  },
  setup() {
    return { ...useForm() };
  },
});
</script>

<style scoped></style>
