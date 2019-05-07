<template style="overflow:hidden">
  <div>
    <transition name="fade">
      <video id="my-player" class="video-js vjs-default-skin vjs-big-play-centered" controls preload="auto" autoplay="autoplay"
       width="500" height="400" data-setup='{ "html5" : { "nativeTextTracks" : false } }'>
        <!--src: 规定媒体文件的 URL  type:规定媒体资源的类型-->
        <source src='rtmp://47.105.140.197:10090/live/test2' type='rtmp/flv'/>
    </video>
    </transition>
  </div>
</template>

<script>
var videojs = require('video.js')
require('videojs-flash')
export default {
  name: 'realVideo',
  data() {
    return {
      player: null
    }
  },
  created() {
    this.player = videojs('my-player')
    this.player.play() // 播放
  }
}
</script>
