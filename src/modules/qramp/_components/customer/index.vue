<template>
  <div>
    <dynamic-field
      v-if="state.bannerMessage"
      class="q-mb-md"
      :field="fields.banner"
    />
    <dynamic-field
      :field="fields.customerId"
      v-model="state.selectCustomers"
      @input="setCustomer"
      @filter="setCustomerName"
    >
      <div slot="before-options" v-if="addNewOptions">
        <div class="q-py-md q-px-md" @click="addCustumers">
          <div class="row cursor-pointer">
            <div class="q-pr-md">
              <q-btn push color="primary" round icon="fas fa-plus" size="xs" />
            </div>
            <div class="q-py-xs">
              <label class="cursor-pointer">{{
                $tr("ifly.cms.label.createNewCustomer")
              }}</label>
            </div>
          </div>
        </div>
      </div>
    </dynamic-field>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import useCustomerField from "./uses/useCustomerField";

export default defineComponent({
  props: {
    dataForm: {
        type: Object,
        default: {}
    },
    addNewOptions: {
      type: Boolean,
      default: () => true,
    }, 
    readonly: {
      type: Boolean,
      default: () => false,
    }, 
  },
  setup(props) {
    return { ...useCustomerField(props) };
  },
});
</script>

<style scoped></style>
