<template>  
    <div class="
        tw-text-blue-500
        tw-mb-2
        tw-text-xs"
    >
        <q-icon 
            name="fa-light fa-filter"
            class="tw-mr-1"
            color="tw-text-blue-500"            
        />
        <b>{{ $trp('isite.cms.label.filter') }}:</b>
        <label class="filters tw-ml-xs">            
            {{ filtersBar }}
        </label>        
    </div>
</template>

<script lang="ts">
import { defineComponent} from "vue";
import useFiltersBar from "../uses/useFiltersBar";
export default defineComponent({
  components: {},
  props: {},
  setup() {
    return {...useFiltersBar()};
  }
});
</script>
<style scoped>
.filters {
    color: #556189;
}
</style>

