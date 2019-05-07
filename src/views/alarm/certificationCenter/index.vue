<template>
  <div class="wrapper">
    <el-header class="top_head">
      <span class="title">运营商平台</span>
      <el-select class="select" size="mini" clearable v-model="listQuery.platforrm" placeholder="请选择运营商平台">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <span class="title">企业/业户</span>
      <el-select class="select" size="mini" clearable v-model="listQuery.company" placeholder="请选择企业/业户">
        <el-option
          v-for="item in userOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <span class="title">车牌号</span>
      <el-input class="postInput" size="mini" v-model="listQuery.carPlate" placeholder="请输入车牌号"></el-input>
      <span class="title">认证类型</span>
      <el-select class="select" size="mini" clearable v-model="listQuery.attestType" placeholder="请选择认证类型">
        <el-option
          v-for="item in attestTypeOption"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <div class="block">
        <el-button class="searchBtn">查询</el-button>
        <el-button class="searchBtn">重置</el-button>
      </div>
    </el-header>
    <el-main class="content">
      <el-table
        border
        :header-cell-style="{ background: '#5F7ABF', color: '#fff' }"
        :data="tableData"
        highlight-current-row>
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          property="date"
          align="center"
          label="运营商平台">
        </el-table-column>
        <el-table-column
          property="name"
          align="center"
          label="企业/业户">
        </el-table-column>
        <el-table-column
          property="address"
          align="center"
          label="车牌号">
        </el-table-column>
        <el-table-column
          property="address"
          align="center"
          label="驾驶员">
        </el-table-column>
        <el-table-column
          property="address"
          align="center"
          label="联系方式">
        </el-table-column>
        <el-table-column
          property="address"
          align="center"
          label="认证类型">
        </el-table-column>
      </el-table>
    </el-main>
  </div>
</template>

<script>
  import { getPermsList } from '@/api/base/platform'
  export default {
    data() {
      return {
        listQuery: {
          platforrm: '',
          company: '',
          carPlate: '',
          attestType: '',
          attestResult: ''
        },
        options: [],
        userOptions: [],
        attestTypeOption: [{
          value: 0,
          label: 'IC卡'
        }, {
          value: 1,
          label: '人脸识别'
        }],
        tableData: []
      }
    },
    methods: {
      getPlatformList() {
        getPermsList().then(res => {
          if (res.code === 0) {
            this.options = res.data
          } else {
            console.log(res)
          }
        })
      }
    },
    mounted() {
      this.getPlatformList() // 获取运营商平台下拉框
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .wrapper {
    padding: 10px;
    .top_head {
      line-height: 60px;
      border-radius: 5px;
      box-shadow: 0 0 10px #ccc;
      background: #fff;
      .title {
        font-size: 13px;
        padding: 0 5px;
      }
      .title:first-child {
      	padding: 0 5px 0 0;
      }
      .postInput {
        width: 135px;
      }
      .block {
        float: right;
        .searchBtn {
          padding: 7px 20px;
          background-color: #5F7ABF;
          color: #fff;
        }
      }
      .select {
        width: 135px;
      }
    }
    .content {
      padding: 20px 0;
    }
  }
</style>
