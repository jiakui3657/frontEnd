<template>
  <div class="wrapper">
    <header class="top_head">
      <el-row class="head_row">
          <span class="title">处理情况</span>
          <el-select @change="changeType" class="inputWidth" size="mini" v-model="filterForm.fixTypeValue">
            <el-option
              v-for="item in fixTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span class="title">运营商平台</span>
          <el-select class="inputWidth" clearable size="mini" v-model="filterForm.platFormValue">
            <el-option
              v-for="item in platFormOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <span class="title">选择车辆</span>
          <el-input class="inputWidth" size="mini" readonly @focus="dialogVisible = true" v-model="filterForm.cars"></el-input>
          <span class="title">报警类型</span>
          <el-popover
            placement="bottom"
            title="标题"
            width="200"
            trigger="click"
            content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
            <el-input slot="reference" class="inputWidth" size="mini" v-model="filterForm.alarmTypeValue" ></el-input>
          </el-popover>
      </el-row>
      <el-row class="head_row">
          <span class="title">报警等级</span>
          <el-select class="inputWidth" size="mini" v-model="filterForm.alarmLevelValue">
            <el-option
              v-for="item in alarmLevelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span class="title" v-show="H">处理耗时</span>
          <el-select v-show="H" class="inputWidth" size="mini" clearable v-model="filterForm.fixTimeValue">
            <el-option
              v-for="item in fixTimeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span class="title" v-show="E">延迟时长</span>
          <el-select v-show="E" class="inputWidth" size="mini" v-model="filterForm.delayTimeValue">
            <el-option
              v-for="item in delayTimeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span class="title" v-show="S">查询时间</span>
          <el-date-picker v-show="S"
            size="mini"
            class="dateWidth"
            v-model="filterForm.searchDate"
            type="datetimerange"
            :picker-options="pickerOptions2"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
          </el-date-picker>
          <div class="btnGroup">
            <el-button class="Btn" v-show="noTime">批量督办</el-button>
            <el-button class="Btn">查询</el-button>
            <el-button class="Btn">重置</el-button>
          </div>
      </el-row>
    </header>
    <el-main class="content">
      <!-- 待处理列表 -->
      <el-table
        v-show="wait"
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
          property="plartformName"
          align="center"
          label="运营商平台">
        </el-table-column>
        <el-table-column
          property="owersName"
          align="center"
          label="企业/业户">
        </el-table-column>
        <el-table-column
          property="plateNo"
          align="center"
          label="车牌号">
        </el-table-column>
        <el-table-column
          property="vehicleType"
          align="center"
          label="车辆类型">
        </el-table-column>
        <el-table-column
          property="driverName"
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
          label="报警类型">
        </el-table-column>
        <el-table-column
          property="address"
          align="center"
          label="报警等级">
        </el-table-column>
        <el-table-column
          property="address"
          align="center"
          label="报警时间">
        </el-table-column>
        <el-table-column
          property="address"
          align="center"
          label="报警速度">
        </el-table-column>
        <el-table-column
          property="address"
          align="center"
          label="报警位置">
        </el-table-column>
      </el-table>
      <!-- 已处理列表 -->
      <el-table
        v-show="already"
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
          label="车辆类型">
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
          label="报警类型">
        </el-table-column>
        <el-table-column
          property="address"
          align="center"
          label="报警等级">
        </el-table-column>
        <el-table-column
          property="address"
          align="center"
          label="报警时间">
        </el-table-column>
        <el-table-column
          property="address"
          align="center"
          label="报警速度">
        </el-table-column>
        <el-table-column
          property="address"
          align="center"
          label="报警位置">
        </el-table-column>
        <el-table-column
          property="address"
          align="center"
          label="处理时间">
        </el-table-column>
        <el-table-column
          property="address"
          align="center"
          label="处理耗时">
        </el-table-column>
      </el-table>
      <!-- 未及时处理列表 -->
      <el-table
        v-show="noTime"
        border
        :header-cell-style="{ background: '#5F7ABF', color: '#fff' }"
        :data="tableData"
        highlight-current-row>
        <el-table-column
          type="selection"
          align="center"
          width="55">
        </el-table-column>
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
          label="车辆类型">
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
          label="报警类型">
        </el-table-column>
        <el-table-column
          property="address"
          align="center"
          label="报警等级">
        </el-table-column>
        <el-table-column
          property="address"
          align="center"
          label="报警时间">
        </el-table-column>
        <el-table-column
          property="address"
          align="center"
          label="报警速度">
        </el-table-column>
        <el-table-column
          property="address"
          align="center"
          label="报警位置">
        </el-table-column>
        <el-table-column
          property="address"
          align="center"
          min-width="150"
          label="延迟处理时长">
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="50">
      </el-pagination>
    </el-footer>
    <!-- 选择车辆弹出框 -->
    <el-dialog
      class="carPage"
      title="选择车辆"
      :visible.sync="dialogVisible"
      width="80%"
      :close-on-click-modal="false">
      <el-row>
        <el-col :span="6" style="border: 1px solid #ccc; min-height: 400px; max-height: 600px; overflow: hidden">
              <!-- <el-tree :highlight-current="true" :data="treeData" :props="defaultProps" @node-click="handleNodeClick" :render-content="renderContent"></el-tree> -->
          <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </el-col>
        <el-col :span="17" :offset="1">
          <div class="searchInput" style="overflow: hidden">
            <el-input placeholder="请输入车牌号" style="width: 200px;" size="mini">
              <el-button slot="append" icon="el-icon-search" style="background-color:#5F7ABF;color:#fff;border-radius:0 5px 5px 0;" size="mini"></el-button>
            </el-input>
            <div class="searchBox">
              <span>车辆类型</span>
              <el-select size="mini" v-model="carType" class="choice">
                <el-option
                  v-for="item in carTypeOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-button size="mini" style="background-color:#5F7ABF;color:#fff;border-radius:5px;">确定</el-button>
            </div>
          </div>
          <div>
            <el-table
              ref="multipleTable"
              :data="choiceCarData"
              :header-cell-style="{ background: '#5F7ABF', color: '#fff' }"
              style="margin-top: 10px;"
              stripe
              border>
              <el-table-column
                width="40px">
                <template slot-scope="scope">
                  <el-radio v-model="radioVal" @change.native="getRow(scope.row)" :label="scope.row.id"></el-radio>
                </template>
              </el-table-column>
              <el-table-column
                label="车牌号"
                align="center"
                prop="plateNo">
              </el-table-column>
                <el-table-column
                  prop="activeStatus"
                  align="center"
                  label="状态">
              </el-table-column>
              <el-table-column
                prop="driverName"
                align="center"
                label="司机">
              </el-table-column>
              <el-table-column
                prop="deptName"
                align="center"
                label="所属机构">
              </el-table-column>
            </el-table>
          </div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 30]"
            :page-size="5"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="50" style="margin-top: 20px">
          </el-pagination>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import { getPermsList } from '@/api/alarm/supervise'
  import { getAlarmType } from '@/api/alarm/history'
  export default {
    data() {
      return {
        dialogVisible: false,
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'text'
        },
        choiceCarData: [],
        currentPage: 1,
        S: false,
        H: false,
        E: false,
        wait: true,
        already: false,
        noTime: false,
        tableData: [],
        fixTypeOptions: [{
          value: 0,
          label: '待处理'
        }, {
          value: 1,
          label: '已处理'
        }, {
          value: 2,
          label: '未及时处理'
        }],
        filterForm: {
          fixTypeValue: 0,
          platFormValue: '',
          cars: '',
          alarmTypeValue: '',
          alarmLevelValue: '',
          fixTimeValue: '',
          searchDate: '',
          delayTimeValue: ''
        },
        platFormOptions: [],
        platUserOptions: [],
        alarmLevelOptions: [],
        alarmTypeOptions: [],
        carType: 0,
        carTypeOption: [{
          value: 0,
          label: '全部'
        }, {
          value: 1,
          label: '客运班车'
        }, {
          value: 2,
          label: '危险货运'
        }, {
          value: 3,
          label: '旅游包车'
        }],
        fixTimeOptions: [{
          value: 0,
          label: '10分钟以内'
        }, {
          value: 1,
          label: '30分钟以内'
        }, {
          value: 2,
          label: '2小时以内'
        }, {
          value: 3,
          label: '6小时以内'
        }, {
          value: 4,
          label: '24小时以内'
        }, {
          value: 5,
          label: '超过一天'
        }],
        delayTimeOption: [{
          value: 0,
          label: '6小时-12小时'
        }, {
          value: 1,
          label: '12小时-24小时'
        }, {
          value: 2,
          label: '1天-3天'
        }, {
          value: 3,
          label: '3天以上'
        }],
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        }
      }
    },
    methods: {
      changeType(e) { // 显示隐藏控制
        if (e === 0) {
          this.H = false
          this.E = false
          this.S = false
          this.wait = true
          this.already = false
          this.noTime = false
        } else if (e === 1) {
          this.E = false
          this.H = true
          this.S = true
          this.wait = false
          this.already = true
          this.noTime = false
        } else if (e === 2) {
          this.H = false
          this.E = true
          this.S = true
          this.wait = false
          this.already = false
          this.noTime = true
        }
      },
      permsLists() { // 运营商平台列表
        getPermsList().then(res => {
          if (res.code === 0 && res.data.length !== 0) {
            this.platFormOptions = res.data
          } else {
            this.$message.info('系统错误！')
          }
        })
      },
      alarmTypes() { // 报警类型列表
        getAlarmType().then(res => {
          if (res.code === 0 && res.data.length !== 0) {
            this.alarmTypeOptions = res.data
          } else {
            this.$message.info('系统错误！')
          }
        })
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
      },
      handleNodeClick(val) {
        console.log(val)
      }
    },
    mounted() {
      this.permsLists()
      this.alarmTypes()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .wrapper {
    padding: 10px;
    .top_head {
      padding: 10px;
      background: #fff;
      box-shadow: 0 0 10px #ccc;
      font-size: 13px;
      .head_row {
        margin-bottom: 10px;
        .title {
          padding: 0 5px 0 15px;
        }
        .Btn {
          padding: 6px 20px;
          background-color: #5F7ABF;
          color: #fff;
          font-size: 13px;
        }
        .inputWidth {
          width: 110px;
        }
        .dateWidth {
          width: 206px;
        }
        .btnGroup {
          float: right;
        }
      }
      .head_row:last-child {
        margin-bottom: 0;
      }
    }
    .pagination {
      padding: 0;
    }
    .content {
      padding: 20px 0;
    }
    .carPage {
      .el-dialog__header {
        background: #5F7ABF !important;
      }
      .searchBox {
        float: right;
        .choice {
          width: 110px;
        }
      }
    }
  }
</style>
