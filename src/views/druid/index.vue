<template>
  <div >
    <iframe :src="druidUrl" :height="clientHeight" :width="clientWidth" frameborder="0" ></iframe>
  </div>
</template>
<script>

export default {
  name: 'druid',
  data() {
    return {
      druidUrl: process.env.BASE_API + '/druid/index.html',
      clientHeight: document.documentElement.clientHeight,
      clientWidth: document.documentElement.clientWidth
    }
  },
  methods: {
  }
}
</script>
<style>
.druid{
  width: calc(100% -0px);
  height: calc(100% -0px);
}
</style>
