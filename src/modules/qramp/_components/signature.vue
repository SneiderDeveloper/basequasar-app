<template>
  <div id="signatureForm">
    <div id="signatureContainer" class="q-pa-md tw-mb-12">
      <div id="disableSignature" :class="readonly ? 'disableEdit': ''"></div>
      <div class="row">
        <div class="col-12 col-md-6">
          <div class="row">
            <dynamic-field
                id="sig1"
                v-if="field.type === 'signature'"
                class="col-12 q-px-sm"
                v-for="(field, keyField) in formField.customer"
                :key="keyField" :field="field"
                v-model="form[field.name || keyField]"
                @fullscreenAction="isFull ? cancelFullScreen('sig1') : launchFullScreen('sig1')"
            />
          </div>
          <div class="row">
            <dynamic-field
                v-if="field.type !== 'signature'"
                class="q-mt-sm q-pa-sm"
                :class="{
                  'col-12': !isDesktop,
                  'col-6': isDesktop
                }"
                v-for="(field, keyField) in formField.customer"
                :key="keyField" :field="field"
                v-model="form[field.name || keyField]"
            />
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="row">
            <dynamic-field
                id="sig2"
                v-if="field.type === 'signature'"
                class="col-12 q-px-sm"
                v-for="(field, keyField) in formField.representative"
                :key="keyField" :field="field"
                v-model="form[field.name || keyField]"
                @fullscreenAction="isFull ? cancelFullScreen('sig2') : launchFullScreen('sig2')"
            />
          </div>
          <div class="row">
            <dynamic-field
                v-if="field.type !== 'signature'"
                class="q-mt-sm q-pa-sm"
                :class="{
                  'col-12': !isDesktop,
                  'col-6': isDesktop
                }"
                v-for="(field, keyField) in formField.representative"
                :key="keyField" :field="field"
                v-model="form[field.name || keyField]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import responsive from '../_mixins/responsive.js'
import qRampStore from '../_store/qRampStore.js';

export default {
  props: {
    readonly: true,
    toolbar: {},
    dataCompoment: {}
  },
  inject: ['disabledReadonly'],
  mixins: [responsive],
  data() {
    return {
      form: {},
      isFull: false,
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  computed: {
    isDesktop() {
      return window.innerWidth >= '900';
    },
    formField() {
      return {
        customer: {
          customer: {
            value: '',
            name: 'customerSignature',
            type: 'signature',
            props: {
              btnFullscreen: true,
              btnFullscreenIcon: this.isFull ? 'zoom_in_map' : 'zoom_out_map',
              readonly: this.readonly || this.disabledReadonly,
              label: this.$tr('ifly.cms.form.customerRepresentativeSignature'),
            },
          },
          printName: {
            name: 'customerName',
            value: '',
            type: this.readonly ? 'inputStandard' : 'input',
            'icon-right': 'fas fa-user',
            props: {
              readonly: this.readonly || this.disabledReadonly,
              label: `${this.$tr('isite.cms.form.printName')}`,
            },
          },
          title: {
            name: 'customerTitle',
            value: '',
            type: this.readonly ? 'inputStandard' : 'input',
            'icon-right': 'fas fa-user',
            props: {
              readonly: this.readonly || this.disabledReadonly,
              label: `${this.$tr('isite.cms.form.title')}`,
            },
          },
        },
        representative: {
          representative: {
            value: '',
            name: 'representativeSignature',
            type: 'signature',
            props: {
              btnFullscreen: true,
              btnFullscreenIcon: this.isFull ? 'zoom_in_map' : 'zoom_out_map',
              readonly: this.readonly || this.disabledReadonly,
              label: this.$tr('ifly.cms.form.AgiRepresentativeSignature'),
            },
          },
          printName: {
            name: 'representativeName',
            value: '',
            type: this.readonly ? 'inputStandard' : 'input',
            'icon-right': 'fas fa-user',
            props: {
              readonly: this.readonly || this.disabledReadonly,
              label: `${this.$tr('isite.cms.form.printName')}`,
            },
          },
          title: {
            name: 'representativeTitle',
            value: '',
            type: this.readonly ? 'inputStandard' : 'input',
            'icon-right': 'fas fa-user',
            props: {
              readonly: this.readonly || this.disabledReadonly,
              label: `${this.$tr('isite.cms.form.title')}`,
            },
          },
        }
      }
    }
  },
  methods: {
    /**
     * Initializes the component's form data.
     */
    init() {
      if (Object.keys(this.dataCompoment).length > 0) {
        this.form = this.dataCompoment
      }
    },
    /**
     * Launches full screen mode for the provided element.
     * @param {string} name - The ID of the element
     * to launch full screen mode for.
     */
    launchFullScreen(name) {
      const element = document.getElementById(name)
      if (element.requestFullScreen) {
        element.style.background = "#fff"
        this.isFull = true
        element.requestFullScreen();
      } else if (element.mozRequestFullScreen) {
        element.style.background = "#fff"
        this.isFull = true
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullScreen) {
        element.style.background = "#fff"
        this.isFull = true
        element.webkitRequestFullScreen();
      }
    },
    /**
     * Cancels full screen mode for the provided element.
     * @param {string} name - The ID of the element to cancel full screen mode for.
     */
    cancelFullScreen(name) {
      const element = document.getElementById(name)
      if (document.cancelFullScreen) {
        element.style.background = "initial"
        this.isFull = false
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        element.style.background = "initial"
        this.isFull = false
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        element.style.background = "initial"
        this.isFull = false
        document.webkitCancelFullScreen();
      }
    },
    /**
     * Saves the component's form signature.
     */
    saveInfo() {
      this.$store.commit('qrampApp/SET_FORM_SIGNATURE', this.form)
      //this.$emit('send-info')
    },
  }
}
</script>

<style>
#signatureContainer {
  @apply tw-relative;
}

#signatureContainer .disableEdit {
  @apply tw-absolute tw-bg-transparent tw-inset-0 tw-z-10;
}

#signatureContainer #vueSiganture .bg-grey-2 {
  @apply tw-h-64;
}

#signatureContainer #vueSiganture .bg-grey-2 img {
  @apply tw-object-contain tw-h-full !important;
}
</style>