<template>
  <div class="app-container">
    <el-container>
      <div style="background: #fff;  line-height:60px; margin: 0 20px;light-height:15px; padding: 13px 10px 0 20px; border-radius: 5px; box-shadow: 0 0 10px #ccc">
        <div class="wrappc">
            <div class="topbox1">
              <span style="font-size: 14px;font-weight:600;margin-right:7px;">处理情况</span>
              <el-select v-model.trim="listQuery.isHandlerType"  placeholder="请选择" style="width:120px;" size="small" @change='changesel(listQuery.isHandlerType)'>
                <el-option v-for="item in optionsd" :key="item.value" :label="item.label" :value="item.value" ></el-option>
              </el-select>
            </div>
            <div class="topbox2">
              <span style="font-size: 14px;font-weight:600;margin-right:7px;">选择车辆</span>
              <el-input placeholder="请选择车辆" v-model.trim="listQuery.plateNo" style="width:100px;" size="small" readonly @focus="showChooseCar" clearable></el-input>
            </div>
            <div class="topbox3">
               <span style="font-size: 14px;font-weight:600;margin-right:7px;">报警类型</span>
                <el-popover placement="bottom" width="250">
                  <menu-tree style="height: 300px; overflow: auto" :treeMenuData="menus1" :treeMenuProp="defaultProps1" :checkedKeys="defaultChecked1"  @check-change="handleNodeChange"></menu-tree>
                  <el-input slot="reference" placeholder="请选择" v-model.trim="listQuery.codeName" style="width:180px;" size="small" readonly></el-input>
                </el-popover>
            </div>
            <div class="topbox4">
                <span style="font-size: 14px;font-weight:600;margin-right:7px;">所属企业</span>
                <el-popover placement="bottom" width="350">
                  <menu-tree style="height: 300px; overflow: auto" :treeMenuData="menus" :treeMenuProp="defaultProps" :checkedKeys="defaultChecked"  @check-change="handleNodeChange"></menu-tree>
                  <el-input slot="reference" placeholder="请选择" v-model.trim="listQuery.deptName" style="width:218px;" size="small" readonly></el-input>
                </el-popover>
            </div>
            <div class="topbox5">
              <span v-if="hs" style="font-size: 14px;font-weight:600;margin-right:7px;">处理方式</span>
                <el-select v-if="hs" v-model.trim="listQuery.handlerType" placeholder="请选择" style="width:120px;font-weight:600;margin-right:7px;" size="small">
                  <el-option v-for="item3 in options2" :key="item3.code" :label="item3.value" :value="item3.code"></el-option>
                </el-select>
            </div>
        </div>
        <div class="wrappc">
        <div class="topbox1">
          <span style="font-size: 14px;font-weight:600;margin-right:7px;">车辆类型</span>
          <el-select v-model.trim="listQuery.vehicleType" placeholder="请选择" style="width:120px;" size="small">
            <el-option v-for="item in options3" :key="item.code" :label="item.value" :value="item.code"></el-option>
          </el-select>
        </div>
        <div class="topbox2">
          <span style="font-size: 14px;font-weight:600;margin-right:7px;">报警等级</span>
          <el-select v-model.trim="listQuery.alarmLevel" placeholder="请选择" style="width:100px;" size="small">
            <el-option v-for="item in options" :key="item.code" :label="item.value" :value="item.code"></el-option>
          </el-select>
        </div>
         <div class="topbox3">
            <span style="font-size: 14px;font-weight:600;margin-right:7px;">报警来源</span>
            <el-select v-model.trim="listQuery.alarmSource" placeholder="请选择" style="width:180px;" size="small">
              <el-option v-for="item1 in options1" :key="item1.code" :label="item1.value" :value="item1.code"></el-option>
            </el-select>
         </div>
          <div class="topbox4">
            <span style="font-size: 14px;font-weight:600;margin-right:7px;">查询时间</span>
            <el-date-picker
              v-model.trim="startEnd"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="——"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="left"
              size="small"
              style="width: 218px"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </div>
          <div class="topbox5">
           <span style="font-size: 14px;font-weight:600;margin-right:7px;" v-if="hs">处理耗时</span>
            <el-select v-if="hs" v-model.trim="listQuery.handleTimeLong" placeholder="请选择" style="width:120px;" size="small">
              <el-option v-for="item2 in optiontime" :key="item2.code" :label="item2.value" :value="item2.code"></el-option>
            </el-select>
         </div>
        </div>
        <el-button size="mini" style="margin-left:20px;float: right; margin-bottom: 15px;background-color: #628FA6;color:#fff;border-radius: 5px;" @click="handleQuery">查询</el-button>
        <el-button  @click="reset" size="mini" style="margin-left:20px;float: right;margin-bottom: 15px;background-color: #628FA6;color:#fff;border-radius: 5px;">重置</el-button>
      </div>


      <el-main>
        <!-- 未处理-->
        <el-table :data="carsdata" :columns="columns" v-if="nodetailtable"  v-loading.body="listLoading" :header-cell-style="{ background: '#628FA6', color: '#fff' }" border stripe style="width:100%; border-radius: 5px;box-shadow: 0 0 10px #ccc" @selection-change="handleSelect">
          <!-- <el-table-column align="center" type="selection" width="40" @selection-change="handleSelect"></el-table-column> -->
          <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>
          <el-table-column align="center" v-for="column in columns" :key="column.key" :label="column.title" :min-width="column.width">
            <template slot-scope="scope">
              <el-button v-if="column.key === 'alarmName'" type="text" @click="handleDetail(scope.row)">{{scope.row[column.key]}}</el-button>
              <span v-else>{{scope.row[column.key]}}</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 已处理 -->
        <el-table :data="carsdata" :header-cell-style="{ background: '#628FA6', color: '#fff' }" :columns="columnsed" v-loading.body="listLoading" v-if="hs" border stripe style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc" @selection-change="handleSelect">
          <!-- <el-table-column align="center" type="selection" width="40" @selection-change="handleSelect"></el-table-column> -->
          <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>
          <el-table-column align="center" v-for="column in columnsed" :key="column.key" :label="column.title" :min-width="column.width">
            <template slot-scope="scope">
              <el-button v-if="column.key === 'alarmName'" type="text" @click="handleDetail(scope.row)">{{scope.row[column.key]}}</el-button>
              <span v-else>{{scope.row[column.key]}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <!-- 分页区 -->
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
          :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-footer>
    </el-container>
    <!-- 选择车辆对话框 :visible.sync="batchDialog"-->
    <el-dialog width="70%" title="选择车辆" :visible.sync="batchDialog"  :close-on-click-modal="false" center>
      <el-container style="height: 500px; border: 1px solid #eee">
        <el-aside width="190px" style="background-color: rgb(238, 241, 246)">
         <el-tree :data="menus" :props="defaultProps" :treeMenuProp="defaultProps" :checkedKeys="defaultChecked"  @node-click="deptFilter"></el-tree>
        </el-aside>
      <el-container>
        <el-main style="width:600px">
          <el-table
            ref="multipleTable"
            :header-cell-style="{ background: '#628FA6', color: '#fff' }"
            :data="tableData3"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange">
            <!-- <el-table-column
              type="selection">
            </el-table-column> -->
            <el-table-column type="index" label="序号" align="center"></el-table-column>
            <el-table-column
              prop="plateNo"
              align="center"
              label="车牌号">
            </el-table-column>
            <el-table-column
            prop="driver"
            align="center"
            label="司机">
            </el-table-column>
            <el-table-column
              prop="detpName"
              align="center"
              label="所属机构">
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <a @click="chooseCar(scope.row)">
                  <img src="../../../assets/navicon/pick.png" style="vertical-align: middle;">
                </a>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination background @current-change="handlePageChange" :current-page="carQuery.page" :page-size="carQuery.limit" layout="total, prev, pager, next" :total="chooseTotal" style="margin-top: 20px"></el-pagination>
        </el-main>
    </el-container>
  </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button @click="batchDialog = false">取 消</el-button>
        <el-button type="primary" @click="batchDialog = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 报警处理弹框 -->
    <el-dialog title="报警处理" :visible.sync="doDialogVisible" :close-on-click-modal="false">
      <fix-alarm :iDatas='iDatas' :msgs='msgs' :sendtittle='sendtittle'></fix-alarm>
    </el-dialog>
  </div>
</template>

<script>
import { treeList, carlist, alarmlist, alarmtypetree } from '@/api/alarm/alarmPC'
import menuTree from './menuTree'
import vehicleDialog from './vehicleDialog'
import fixAlarm from './fixAlarm'
import { getDownMenu } from '@/api/infomationM/dict'
import { getRecords } from '@/api/alarm/vehicle'
import { getMsg } from '@/api/vehicleMonitor/realtime'

export default {
  name: 'intelligentEWP',
  components: { menuTree, vehicleDialog, fixAlarm },
  data() {
    return {
      msgs: [],
      iDatas: [],
      doDialogVisible: false,
      total: 0,
      listLoading: false,
      batchDialog: false,
      warningProcessDialog: false,
      hs: false,
      chooseTotal: '',
      nodetailtable: true,
      chooseDialogVisible: false,
      selectRows: [], // 选中的行数据
      tableData3: [],
      carsdata: [],
      carQuery: {
        page: 1,
        limit: 5,
        plateNo: '',
        deptId: ''
      },
      options: [], // 报警等级
      optiontime: [], // 处理耗时
      options1: [], // 报警来源
      options2: [], // 处理方式下拉
      optionsd: [
        {
          label: '待处理',
          value: 0
        },
        {
          label: '已处理',
          value: 1
        }
      ],
      options3: [], // 车辆类型
      // data: [],
      columns: [
        {
          key: 'plateNo',
          title: '车牌号',
          width: '100'
        },
        {
          key: 'deptName',
          title: '所属企业',
          width: '100'
        },
        {
          key: 'driverName',
          title: '司机',
          width: '100'
        },
        {
          key: 'phone',
          title: '联系方式',
          width: '140'
        },
        {
          key: 'vehicleType',
          title: '车辆类型',
          width: '140'
        },
        {
          key: 'alarmSourceName',
          title: '报警来源',
          width: '140'
        },
        {
          key: 'alarmName',
          title: '报警类型',
          width: '140'
        },
        {
          key: 'alarmLevel',
          title: '报警等级',
          width: '140'
        },
        {
          key: 'speed',
          title: '速度',
          width: '140'
        },
        {
          key: 'alarmTime',
          title: '报警时间',
          width: '140'
        },
        {
          key: 'alarmAddress',
          title: '位置',
          width: '140'
        }
      ],
      columnsed: [
        {
          key: 'plateNo',
          title: '车牌号',
          width: '100'
        },
        {
          key: 'deptName',
          title: '所属企业',
          width: '100'
        },
        {
          key: 'driverName',
          title: '司机',
          width: '100'
        },
        {
          key: 'phone',
          title: '联系方式',
          width: '140'
        },
        {
          key: 'vehicleType',
          title: '车辆类型',
          width: '140'
        },
        {
          key: 'alarmSourceName',
          title: '报警来源',
          width: '140'
        },
        {
          key: 'alarmName',
          title: '报警类型',
          width: '140'
        },
        {
          key: 'alarmLevel',
          title: '报警等级',
          width: '140'
        },
        {
          key: 'speed',
          title: '速度',
          width: '140'
        },
        {
          key: 'alarmTime',
          title: '报警时间',
          width: '140'
        },
        {
          key: 'handlerTime',
          title: '处理时间',
          width: '140'
        },
        {
          key: 'handleTimeLong',
          title: '处理耗时',
          width: '140'
        },
        {
          key: 'handlerUserId',
          title: '处理用户',
          width: '140'
        },
        {
          key: 'handlerTypeName',
          title: '处理方式',
          width: '140'
        },
        {
          key: 'alarmAddress',
          title: '位置',
          width: '140'
        }
      ],
      sendtittle: [],
      listQuery: {
        page: 1,
        pageSize: 10,
        isHandlerType: 0, // 是否处理
        plateNo: '', // 车牌号
        deptName: '',
        deptId: '',
        startTime: '', // 报警开始时间
        endTime: '', // 报警结束时间
        vehicleType: '', // 车辆类型
        alarmLevel: '', // 报警等级
        alarmSource: '', // 报警来源
        handleTimeLong: '', // 处理时长
        handlerType: '', // 处理方式
        codeName: '',
        code: '',
        alarmType: ''
      },
      defaultChecked: [],
      defaultChecked1: [],
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      defaultProps1: {
        children: 'children',
        label: 'label'
      },
      menus: [],
      menus1: [],
      startEnd: [],
      multipleSelection: [],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近1天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近3天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近7天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近1月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
      // updateMsgDialog: false,
      // msgTemplate: [],
      // content: '',
      // vehicleInfo: { vehicleNo: '1111' }
    }
  },
  created() {
    this.getnodetaininfo()
    this.gettree()
    this.getcarlist()
    this.gettypetree()
    this.getmsgData()
    this.getDownMenuList('handler_type')
    this.getDownMenuList('alarm_source')
    this.getDownMenuList('alarm_lel')
    this.getDownMenuList('vehicle_type')
    this.getDownMenuList('urge_delay')
  },
  methods: {
    // 获取下拉列表urge_delay
    getDownMenuList(type) {
      getDownMenu(type).then(res => {
        switch (type) {
          case 'handler_type':
            this.options2 = res.data
            break
          case 'alarm_source':
            this.options1 = res.data
            break
          case 'alarm_lel':
            this.options = res.data
            break
          case 'vehicle_type':
            this.options3 = res.data
            break
          case 'urge_delay':
            this.optiontime = res.data
            break
          default:
            break
        }
      })
    },
    // 重置
    reset() {
      this.listQuery = {
        page: 1,
        pageSize: 10,
        isHandlerType: 0, // 是否处理
        plateNo: '', // 车牌号
        deptName: '',
        deptId: '',
        startTime: '', // 报警开始时间
        endTime: '', // 报警结束时间
        vehicleType: '', // 车辆类型
        alarmLevel: '', // 报警等级
        alarmSource: '', // 报警来源
        handleTimeLong: '', // 处理时长
        handlerType: '', // 处理方式
        codeName: '',
        code: '',
        alarmType: ''
      }
      this.startEnd = ''
    },
    handlePageChange(val) {
      this.carQuery.page = val
      this.getcarlist()
    },
    handleDetail(row) {
      // console.log(row)
      this.sendtittle = row
      getRecords(row.id).then(res => {
        if (res.code === 0) {
          this.iDatas = res.data
        }
      })
      this.doDialogVisible = true
    },
    showChooseCar() {
      this.getcarlist()
      this.batchDialog = true
    },
    chooseCar(row) {
      this.batchDialog = false
      this.listQuery.plateNo = row.plateNo
    },
    // 切换处理
    changesel(e) {
      if (e === 1) {
        // 已经处理了
        this.hs = true
        this.getnodetaininfo()
        this.nodetailtable = false
      } else {
        // 未处理
        this.nodetailtable = true
        this.getnodetaininfo()
        this.hs = false
      }
    },
    deptFilter(data) {
      this.carQuery.deptId = data.id
      if (data.id === '0') {
        this.carQuery.deptId = ''
      }
      this.carQuery.page = 1
      this.getcarlist()
    },
    // 获取机构树
    gettree() {
      treeList().then(res => {
        this.menus = [res.data]
      })
    },
    gettypetree() {
      alarmtypetree().then(res => {
        this.menus1 = [res.data.整车报警, res.data.平台报警]
      })
    },
    // 获取消息模板
    getmsgData() {
      getMsg().then(res => {
        console.log(res)
        if (res.code === 0) {
          this.msgs = res.data
          console.log(res.data)
        }
      })
    },
    // 获取车辆列表
    getcarlist() {
      carlist(this.carQuery).then(res => {
        this.tableData3 = res.data.rows
        console.log(res.data.rows)
        this.chooseTotal = res.data.totalCount
      })
    },
    // 获取首页所有未处理的信息
    getnodetaininfo() {
      alarmlist(this.listQuery).then(res => {
        for (var i = 0; i < res.data.rows.length; i++) {
          if (res.data.rows[i].alarmLevel === 1) {
            res.data.rows[i].alarmLevel = '一级'
          } else {
            res.data.rows[i].alarmLevel = '二级'
          }
        }
        this.carsdata = res.data.rows
        this.total = res.data.totalCount
      })
    },
    handleQuery() {
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      this.getnodetaininfo()
    },
    handleNodeClick(val) {
      console.log(val)
      this.listQuery.deptId = val.id
      this.listQuery.deptName = val.text
    },
    // 点击选择车辆
    batchProcess() {
      this.batchDialog = true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleNodeChange(val) {
      console.log('s' + JSON.stringify(val))
      this.listQuery.deptId = val.id
      this.listQuery.deptName = val.text
      this.listQuery.alarmType = val.code
      this.listQuery.codeName = val.label
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getnodetaininfo()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getnodetaininfo()
    },
    handleSelect(val) { // 选择处理事件
      this.selectRows = val
    }
  },
  watch: {
    startEnd(val) {
      if (val) {
        this.listQuery.startTime = val[0]
        this.listQuery.endTime = val[1]
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }
    }
  }
}
</script>

<style scope>
  .canClick {
    color: #488aff
  }
  .app-container .el-popover {
    height: 300px;
    overflow-y: scroll;
  }
  /* .app-container .el-radio-group {
    margin: 36px 0 0 50px;
  } */
  .app-container .el-dialog__body {
    padding: 5px 20px;
  }
  .app-container .el-table__header-wrapper table thead tr th {
    background-color: rgb(98,143,166);
    color: #fff
  }
  .el-button--primary{
    background-color: rgb(98,143,166);
  }
  .app-container .el-dialog__header {
    background-color: rgb(98,143,166);
    height: 40px;
    padding-top: 10px;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active{
    background-color: rgb(98,143,166);
  }
  .app-container .el-dialog__header span {
    color: #fff;
    font-size: 14px
  }
  .app-container .el-dialog__header i {
    color: #fff;
  }
  .msgManager:hover {
    color: #4077BC;
    cursor: pointer;
  }
  .app-container .el-dialog__headerbtn {
    top: 10px
  }
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  .el-aside {
    color: #333;
  }
  .wrappc{
    width: 100%;
    float: left;
  }
  .topbox1{
    width: 17%;
    float: left;
    text-align:left;
  }
  .topbox2{
    width: 16%;
    float: left;
  }
  .topbox3{
    width: 22%;
    float: left;
  }
  .topbox4{
    width: 25%;
    float: left;
  }
  .topbox5{
    width: 17%;
    float: left;
  }
</style>

