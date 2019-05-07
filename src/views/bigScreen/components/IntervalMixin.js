export default {
  data() {
    return {
      intervalID: null,
      intervalDelay: 1000 * 10,
      intervalMethod: this.query
    }
  },
  mounted() {
    this.intervalID = window.setInterval(this.intervalMethod, this.intervalDelay)
  },
  beforeDestroy() {
    window.clearInterval(this.intervalID)
  }
}
