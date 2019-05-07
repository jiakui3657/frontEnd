<template>
  <div style="object-fit: fill; width: 100%; height: 100%">
    <video ref="myplayRef"
        style="object-fit: fill; width: 100%; height: 100%"
        class="video-js
            vjs-default-skin
            vjs-big-play-centered"
        preload="auto"
        data-setup='{ "html5" : { "nativeTextTracks" : false } }'>
    </video>
    <div></div>
  </div>
</template>
<script>
var videojs = require('video.js')
require('videojs-flash')
export default {
  name: 'videoPlayer',
  props: ['options', 'pid'],
  data() {
    return {
      player: null
    }
  },
  mounted() {
    this.$refs.myplayRef.setAttribute('id', this.pid)
    this.player = videojs(this.pid, this.options, function onPlayerReady() {
      this.play()
    })
  },
  methods: {
    doPlayer(win) {
      console.log('自定义组件播放方法doPlayer()被调用', win)
    }
  }
}
</script>
<style>
@import '../../../styles/video-js.min.css';
</style>