<template>
  <div>
    <div class="tw-p-6 row q-col-gutter-lg tw-mb-10" >
      <dynamic-field class="col-12 col-md-6" v-for="(field, keyField) in formFields" :key="keyField" :field="field"
        v-model="form[field.name || keyField]"/>
    </div>
  </div>
</template>

<script>
import responsive from '../../_mixins/responsive.js';
import remarkStore from './store.ts';
export default {
  props:{
    readonly: true,
    toolbar:{},
  },
  inject: ['disabledReadonly'],
  mixins:[responsive],
  computed:{
    form() {
      return remarkStore().getForm();
    },
    formFields(){
      return{
        remark: {
          value: '',
          type: this.readonly ? 'inputStandard':'input',
          props: {
            readonly: this.readonly || this.disabledReadonly,
            outlined: !this.readonly,
            label: this.$tr('ifly.cms.form.remark'),
            type: 'textarea',
            rows: "12",
            debounce: 1500
          },
        },
        safetyMessage : {
          value: '',
          type: this.readonly ? 'inputStandard':'input',
          props: {
            readonly: this.readonly || this.disabledReadonly,
            outlined: !this.readonly,
            label: this.$tr('ifly.cms.form.safetyMessage'),
            type: 'textarea',
            rows: "12",
            debounce: 1500
          },
        },
      }
    }
  },
}
</script>

<style>

</style>