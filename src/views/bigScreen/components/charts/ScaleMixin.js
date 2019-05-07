export default {
  props: {
    scale: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      options: null
    }
  },
  mounted() {
    this.query()
  }
}
