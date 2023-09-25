import qRampStore from '../_store/qRampStore.js'

export default {
  mounted() {
    this.$nextTick(function () {
      const _this = this;
      if(_this.hasOwnProperty('init')){
        _this.init()
      }
    })
  },
  data(){
    return{
      services:[],
      searchServices: '',
      isProducts :[]
    }
  },
  computed:{
    filterServices () {
      const conditions = []
      if (this.searchServices) {
          conditions.push(this.servicesFilter)
      }
      if (conditions.length > 0) {
          return this.services.filter((service) => {
              return conditions.every((condition) => {
                  return condition(service)
              })  
          })
      }
      return this.services
    },
    disabledReadonly() {
      return qRampStore().disabledReadonly();
    }
  },
  methods: {
    setValue(type) {
      if (type == 'quantity') {
        return 0
      } else {
        return ''
      }
    },
    servicesFilter(service){
      return service.title.toLowerCase().includes(this.searchServices.toLowerCase())
    },
    async getProducts(requestParams, id){
      this.services = [];
      await this.$crud.index('apiRoutes.qramp.products', requestParams).then(({data}) => {
        const formatData = this.formatData(data, id)
        formatData.forEach(item => {
          this.services.push({
            icon: "settings",
            title: item.name,
            id: item.id,
            categoryId: item.categoryId,
            formField: {
              ...item.attributes.reduce((previousValue, currentValue, currentIndex, array) => {
                const props = this.setProps(currentValue.type, currentValue.name, currentValue.values, currentIndex)
                  previousValue = {
                    ...previousValue,
                      [`${currentValue.type}${currentValue.name ? currentValue.name : ''}`] : {
                      name: currentValue.name,
                      value: currentValue.value ? currentValue.value : null,
                      type: currentValue.type === 'quantityFloat' ? 'quantity' : currentValue.type,
                      id: currentValue.id,
                      props :{ ...props}
                    }
                  }
                  return previousValue
              }, {} )
            }
          })
        })
      }).catch(error => {
        console.error("[qramp-services]::init", error)
      })
    },
    formatData(data, id) {
      const productData = qRampStore().getWorkOrderItems();
      if(productData.length > 0) {
        return data.map(product => {
          productData.map(sw => {
            if(sw.productId == product.id) {
              product.attributes.map(att => {
                sw.workOrderItemAttributes.map(swatt => {
                  if(swatt.attributeId == att.id) {
                    att.value = swatt.value
                    return swatt
                  }
                })
                return att
              })
            }
            return sw
          })
          return product
        })
      } else {
        return data
      }
    },
    saveInfo() {
      this.isProducts = this.services.find(items => {
        for(let item in items.formField){
          for(let key in items.formField[item]) {
            if (key == 'value') {
              return items.formField[item][key]
            }
          }
        }
      });
      if(this.isProducts) {
        this.$emit('isError', false)
        this.saveFormService();
      } else {
        this.$alert.error({message: this.$tr('ifly.cms.message.servicesMessage')})
        this.$emit('isError', true)
      }
      const validate = this.validateFulldate();
      if(!validate) {
        this.$emit('isError', true);
        return;
      }
    },
    validateFulldate() {
      let validate = true;
      this.services.forEach(item => {
       Object.keys(item.formField).forEach(key => {
          Object.keys(item.formField[key]).forEach(type => {
            if(item.formField[key][type] === 'fullDate' 
              && item.formField[key].value !== null
            ) {
              if(!this.$moment(item.formField[key].value, 'MM/DD/YYYY HH:mm', true).isValid()) {
                validate = this.$moment(item.formField[key].value, 'MM/DD/YYYY HH:mm', true).isValid()
                return;
              }
            }
          })
        })
      })
      return validate; 
    },
    setProps(type, name, options, index) {
      if (type == 'quantity') {
        return {
          readonly: this.readonly || this.disabledReadonly,
          mask:'###################',
        }
      }else if(type == 'select') {
        return {
          readonly: this.readonly || this.disabledReadonly,
          label: name,
          options: options.map((item) => {
            item.label = item.name
            return item
          }),
          type
        }
      }else if(type == 'fullDate') {
        const options = index === 0 ? qRampStore().validateDateInboundBlockIn
        : qRampStore().validateDateOutboundBlockOut;
        return {
          readonly: this.readonly || this.disabledReadonly,
          label: name,
          hint:'Format: MM/DD/YYYY HH:mm',
          mask:'MM/DD/YYYY HH:mm',
          'place-holder': 'MM/DD/YYYY HH:mm',
          format24h: true,
          options,
          typeIndexDate: index,
        }
      } else if(type === 'quantityFloat') {
        return {
          readonly: this.readonly || this.disabledReadonly,
          type: 'number',
          step:"0.1"
        }
      } else {
        return {
          readonly: this.readonly || this.disabledReadonly,
          label: name,
        }
      }
    },
    saveFormService() {
      const services = this.services.filter(items => {
        for(let item in items.formField){
          for(let key in items.formField[item]){
            if (key == 'value'){
              return items.formField[item][key]
            }
          }
        }
      });
      this.$store.commit('qrampApp/SET_FORM_SERVICES', services)
    }
  },
}