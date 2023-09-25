export default {
  computed:{
    responsive() {return this.windowSize == 'mobile'},
    windowSize() {
      return this.windowWith >= '768' ? 'desktop' : 'mobile'
    },
    windowWith() {
      return window.innerWidth
    }
  }
}