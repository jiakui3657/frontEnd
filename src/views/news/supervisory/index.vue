<template>
  <div class="app-container">
    <el-container>
      <div style="width:100%;background: #fff;height:53px; margin: 10px 20px;line-height:48px;padding:5px 10px; border-radius: 5px; box-shadow: 0 0 10px #ccc">
        <span style="font-size: 14px">督办状态</span>
        <el-select size="mini" v-model="status" placeholder="请选择" style="width:80px;">
          <el-option
            v-for="item in options"
            :key="item.code"
            :label="item.value"
            :value="item.code">
          </el-option>
        </el-select>
        <span style="font-size: 14px">督办时间</span>
        <el-date-picker
          style="width:190px;"
          v-model="date"
          size="mini"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
        <span style="font-size: 14px">车辆类型</span>
        <el-select size="mini" v-model="carType" placeholder="请选择" style="width:80px;">
          <el-option
            v-for="item in carTypeOption"
            :key="item.code"
            :label="item.value"
            :value="item.code">
          </el-option>
        </el-select>
        <span style="font-size: 14px">报警类型</span>
        <el-select size="mini" v-model="almType" placeholder="请选择" style="width:80px;">
          <el-option
            v-for="item in almTypeOption"
            :key="item.code"
            :label="item.value"
            :value="item.code">
          </el-option>
        </el-select>
        <span style="font-size: 14px">报警等级</span>
        <el-select size="mini" v-model="almLevel" placeholder="请选择" style="width:80px;">
          <el-option
            v-for="item in almLevelOption"
            :key="item.code"
            :label="item.value"
            :value="item.code">
          </el-option>
        </el-select>
        <span style="font-size: 14px">报警来源</span>
        <el-select size="mini" v-model="almSource" placeholder="请选择" style="width:80px;">
          <el-option
            v-for="item in almSourceOption"
            :key="item.code"
            :label="item.value"
            :value="item.code">
          </el-option>
        </el-select>
        <span style="font-size: 14px">督办延迟</span>
        <el-select size="mini" v-model="delayed" placeholder="请选择" style="width:80px;">
          <el-option
            v-for="item in delayedOption"
            :key="item.code"
            :label="item.value"
            :value="item.code">
          </el-option>
        </el-select>
      </div>
    </el-container>
    <el-main>
       <el-table
        :data="tableData"
        border
        stripe
        :header-cell-style="{'background': '#628FA6', 'color': '#fff','border': 'none !important'}"
        style="width: 100%">
        <el-table-column
          fixed
          align="center"
          label="序号"
          type="index"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="platfromName"
          align="center"
          label="上级平台"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="plateNo"
          align="center"
          label="车牌号"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="deptName"
          align="center"
          label="所属企业"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="vehicleType"
          label="车辆类型"
          align="center"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="alarmType"
          label="报警类型"
          align="center"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="alarmLevel"
          label="报警等级"
          align="center"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="alarmSource"
          label="报警来源"
          align="center"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="speed"
          label="速度"
          align="center"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="位置"
          align="center"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="督办时间"
          align="center"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="result"
          label="督办状态"
          align="center"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="delay"
          label="督办延迟"
          align="center"
          min-width="120">
        </el-table-column>
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          min-width="100">
          <template slot-scope="scope">
            <a @click="handleClick(scope.row)">
              <img src="../../../assets/navicon/urge.png" style="vertical-align: middle;">
            </a>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <!-- 分页区 -->
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :page-sizes="[5, 15, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-footer>
    <!-- 弹出框 -->
    <el-dialog
      class="areaBox"
      title="督办指令回复"
      :visible.sync="centerDialogVisible"
      width="30%">
      <div style="width:100%;height:170px;border:1px solid #dcdfe6;border-radius:5px;padding:0 10px;">
        <p>上级平台：<span>{{ plat }}</span></p>
        <p>报警类型：<span>{{ alarmType }}</span></p>
        <p>报警时间：<span>{{ alarmStart }}</span></p>
        <p>督办时间：<span>{{ createTime }}</span></p>
      </div>
      <div style="margin-top:20px;width:100%;min-height:130px;border:1px solid #dcdfe6;border-radius:5px;padding:15px 10px;">
        <div style="display:inline-block;width:20%;height:100%;line-height:130px;margin:0;text-align:center;">督办应答：</div>
          <el-input class="area" style="width:79%;height:100%;margin:0;" type="textarea" v-model="desc"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button style="padding:7px 22px;background: #628FA6; color: #fff; border-radius: 5px">回复</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getData } from '@/api/news/new'
  import { getDownMenu } from '@/api/infomationM/dict'
  export default {
    data() {
      return {
        centerDialogVisible: false,
        desc: '',
        // 督办状态
        options: [],
        // 车辆类型
        carTypeOption: [],
        // 报警类型
        almTypeOption: [],
        // 报警等级
        almLevelOption: [],
        // 报警来源
        almSourceOption: [],
        // 督办延迟
        delayedOption: [],
        status: '',
        date: '',
        carType: '',
        almType: '',
        almLevel: '',
        almSource: '',
        delayed: '',
        tableData: [], // 表格数据
        listQuery: {
          page: 1,
          limit: 5
        },
        total: 0,
        alarmType: '',
        plat: '',
        createTime: '',
        alarmStart: ''
      }
    },
    methods: {
      handleClick(row) {
        console.log(row)
        console.log(row.platfromName)
        this.plat = row.platfromName
        this.alarmType = row.alarmType
        this.createTime = row.createTime
        // this.alarmStart = row.alarmStart
        this.centerDialogVisible = true
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getdatalist()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getdatalist()
      },
      getdatalist() {
        getData(this.listQuery).then(res => {
          res.data.rows.forEach(item => {
            if (item.alarmLevel === 1) {
              item.alarmLevel = '一级'
            } else if (item.alarmLevel === 2) {
              item.alarmLevel = '二级'
            }
            if (item.result === 0) {
              item.result = '处理中'
            } else if (item.result === 1) {
              item.alarmLevel = '已处理完毕'
            } else if (item.result === 2) {
              item.alarmLevel = '不作处理'
            } else if (item.result === 3) {
              item.alarmLevel = '将来处理'
            }
          })
          this.tableData = res.data.rows
          this.total = res.data.totalCount
        })
      },
      reset() {
        this.status = ''
        this.date = ''
        this.carType = ''
      },
      // 获取下拉列表
      getDownMenuList(type) {
        getDownMenu(type).then(res => {
          switch (type) {
            case 'vehicle_type':
              this.carTypeOption = res.data
              break
            case 'urge_result':
              this.options = res.data
              break
            case 'alarm_lel':
              this.almLevelOption = res.data
              break
            case 'alarm_source':
              this.almSourceOption = res.data
              break
            case 'urge_delay':
              this.delayedOption = res.data
              break
            default:
              break
          }
        })
      }
    },
    mounted() {
      this.getdatalist()
      this.getDownMenuList('urge_result') // 督办状态下拉
      this.getDownMenuList('vehicle_type') // 车辆类型下拉
      this.getDownMenuList('alarm_lel') // 报警等级下拉
      this.getDownMenuList('alarm_source') // 报警来源下拉
      this.getDownMenuList('urge_delay') // 督办延迟
    }
  }
</script>

<style>
  .area .el-textarea__inner {
    min-height:130px !important;
  }
  .areaBox .el-dialog__footer {
    text-align:center !important;
  }
</style>
