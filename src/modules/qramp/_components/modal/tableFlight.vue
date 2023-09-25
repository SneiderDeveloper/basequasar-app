<template>
  <q-dialog
    v-model="dialog"
    persistent
    full-width
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card flat>
      <q-card-section :class="{'cardResponsive': responsive}">
        <q-table
          :data="dataTable"
          :columns="columns"
          row-key="index"
          selection="single"
          :grid="responsive"
          :filter="filter"
          class="my-sticky-header-column-table"
          :selected.sync="selected"
          
        >
          <template v-slot:top-left>
            <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body="props">
            <q-tr 
              :props="props"
              :class="{
                'tw-bg-red-500': props.row.cancelled
              }"
            >
              <q-td auto-width>
                <q-checkbox 
                  dense 
                  v-model="props.selected" 
                  :label="props.row.name"
                  :disabled="props.row.cancelled"
                />
              </q-td>
              <q-td
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
              >
                {{ col.value }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
      <q-card-actions align="right" class="q-mr-sm">
        <q-btn
          v-if="manually"
          rounded
          label="Add manually"
          class="q-ml-sm text-capitalize"
          color="grey-6"
          @click="$emit('validateBound')"
        />
        <q-btn
          rounded
          label="cancel"
          color="grey-6"
          class="text-capitalize"
          @click="$emit('cancel', false)"
        />
        <q-btn
          rounded
          label="select"
          class="q-ml-sm text-capitalize"
          color="primary"
          @click="setForm()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  props: {
    dataTable: {
      type: Array,
      default: () => [],
    },
    dialog: {
      type: Boolean,
      default: false
    },
    manually: {
      type: Boolean,
      default: true,
    }
  },
  data(){
    return{
      selected:[],
      filter:'',
      columns:[
        { name: 'tailNumber', label: 'Tail Number', field: 'registration', sortable: true , align: 'left'},
        { name: 'outbound', label: 'Departure', field: 'outbound' , align: 'left'},
        { name: 'inbound', label: 'Arrival ', field: 'inbound', align: 'left'},
        { name: 'aircraftType', label: 'Aircraft', field: 'aircraftType', align: 'left'}
      ],
    }
  },
  computed:{
    responsive() {return this.windowSize == 'mobile'},
    windowSize() {
      return this.windowWith >= '450' ? 'desktop' : 'mobile'
    },
    windowWith() {
      return window.innerWidth
    }
  },
  methods: {
    setForm(){
      if(this.selected.length > 0){
        this.$emit('flightSelect', {select:this.selected[0], dialog:false})
        setTimeout(()=> {
          this.selected = []
        }, 1000)
      } else {
        this.$alert.error({message: this.$tr('ifly.cms.label.errorFlightSelected')})
      }
    }
  },
}
</script>
<style lang="stylus">
  .cardResponsive
    overflow-y: scroll;
    height: 500px;
  .my-sticky-header-column-table
    tr th
      position: sticky
      z-index: 2
      background: $primary
      color: #fff
</style>