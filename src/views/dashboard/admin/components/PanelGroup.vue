<template>
  <el-row class="panel-group" :gutter="40">
    <el-col :xs="4" :sm="4" :lg="4" class="card-panel-col">
      <div class='card-panel' @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-description">
          <count-to class="card-panel-num" :startVal="0" :endVal="102400" :duration="2600"></count-to>
          <div class="card-panel-text">运营商平台</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="4" :sm="4" :lg="4" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-description">
          <count-to class="card-panel-num" :startVal="0" :endVal="81212" :duration="3000"></count-to>
          <div class="card-panel-text">运营企业</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="4" :sm="4" :lg="4" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-description">
          <count-to class="card-panel-num" :startVal="0" :endVal="9280" :duration="3200"></count-to>
          <div class="card-panel-text">入网车辆</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="4" :sm="4" :lg="4" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-description">
          <count-to class="card-panel-num" :startVal="0" :endVal="13600" :duration="3600"></count-to>
          <div class="card-panel-text">在线车辆</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="4" :sm="4" :lg="4" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-description">
          <count-to class="card-panel-num" :startVal="0" :endVal="13600" :duration="3600"></count-to>
          <div class="card-panel-text">从业人员</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="4" :sm="4" :lg="4" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-description">
          <count-to class="card-panel-num" :startVal="0" :endVal="13600" :duration="3600"></count-to>
          <div class="card-panel-text">今日报警</div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from '@/components/CountTo'

export default {
  components: {
    CountTo
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    .card-panel-description {
      font-weight: bold;
      margin: 26px;
      text-align: center;
      .card-panel-text {
        line-height: 18px;
        color: #303030;
        font-size: 14px;
        margin: 12px 0;
      }
      .card-panel-num {
        font-size: 26px;
        color: #0A74FF;
      }
    }
  }
}
</style>
