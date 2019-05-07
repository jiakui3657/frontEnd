<template>
  <footer>
    <ul>
      <li>
        <span>所有车辆:</span>
        <i>755</i>
      </li>
      <li>
        <span>车辆上线:</span>
        <i>755</i>
      </li>
      <li>
        <span>在线率:</span>
        <i>755</i>
      </li>
      <li>
        <span>今日报警:</span>
        <i>755</i>
      </li>
      <li>
        <span>今日处理:</span>
        <i>755</i>
      </li>
      <li>
        <el-switch
          class="ft-switch"
          v-model="value3"
          active-text=""
          active-color="#16ccfe"
          inactive-text="">
        </el-switch>
        <span>报警声音</span>
      </li>
    </ul>
  </footer>
</template>

<script>
export default {
  name: 'FooterBar',
  data() {
    return {
      value3: true
    }
  }
}
</script>

<style lang="scss" scoped>
  footer{
    z-index: 1999;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    ul{
      margin: 0px;
      padding: 0;
      list-style: none;
      height: 40px;
      line-height: 40px;
      color: #2f2f2f;
      background: #fff;
      li{
        float: left;
        width: 18%;
        font-size: 14px;
        text-align: center;
        span{
        }
        i{
          font-style: normal;
        }
      }
      li:last-of-type{
        width: 10%;
        text-align: right;
        >span{
          margin-right: 20px;
        }
        .ft-switch{
          margin-right: 8px;
        }
      }
    }
  }
</style>
