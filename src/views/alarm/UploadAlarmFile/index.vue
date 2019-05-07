<template>
  <iframe id="box" :src="iframeSrc" width="100%" height="900" frameborder="0" scrolling="auto"></iframe>
</template>

<script>
  import config from '../../../../static/config.js'
  export default {
    data() {
      return {
        iframeSrc: ''
      }
    },
    created() {
      this.iframeSrc = config.UploadAlarmFile
    },
    mounted() {
      console.log(config.UploadAlarmFile)
    }
  }
</script>