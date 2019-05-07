<template functional>
  <div class="data-layout">
    <div
      class="title"
      :class="{large: props.large, widen: props.widen}"
    >{{props.title}}</div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'data-layout',
  functional: true,
  props: {
    title: {
      type: String,
      required: true
    },
    large: {
      type: Boolean,
      default: false
    },
    widen: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.data-layout {
  .title {
    background-image: url("../../../assets/big_screen/data_layout_title_bg_small.png");
    background-position: bottom;
    background-size: contain;
    background-repeat: no-repeat;
    height: 0.33rem;
    font: 400 0.2rem MicrosoftYaHei;
    color: #ffffff;
    &.large {
      background-image: url("../../../assets/big_screen/data_layout_title_bg.png");
      height: 0.37rem;
      margin: 0 0.03rem;
    }
    &.widen {
      background-image: url("../../../assets/big_screen/data_layout_title_bg_small_widen.png");
    }
  }
}
</style>
