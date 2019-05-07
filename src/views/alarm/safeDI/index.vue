<template>
  <div class="app-container">
    <el-container>
      <div style="background: #fff;  line-height:43px; margin: 0 20px;light-height:15px; padding: 13px 10px 0 20px; border-radius: 5px; box-shadow: 0 0 10px #ccc">
        <div class="wrapsafe">
          <div class="safe1">
            <span style="font-size: 14px">处理状态</span>
              <el-select v-model.trim="listQuery.bindStatus" placeholder="请选择" style="width:100px;" size="small">
              <el-option v-for="item2 in optiontime" :key="item2.value" :label="item2.label" :value="item2.value"></el-option>
            </el-select>
          </div>
          <div  class="safe2">
            <span style="font-size: 14px">选择车辆</span>
            <el-input placeholder="请选择车辆" v-model.trim="listQuery.plateNo" style="width:100px;" size="small" readonly @focus="showChooseCar" clearable></el-input>
          </div>
          <div class="safe3">
            <span style="font-size: 14px">车辆类型</span>
            <el-select v-model.trim="listQuery.vehicleType"  placeholder="请选择" style="width:120px;" size="small">
              <el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
         <div class="safe4">
            <span style="font-size: 14px">所属企业</span>
            <el-popover placement="bottom" width="250">
              <menu-tree style="height: 300px; overflow: auto" :treeMenuData="menus" :treeMenuProp="defaultProps" :checkedKeys="defaultChecked"  @check-change="handleNodeChange"></menu-tree>
              <el-input slot="reference" placeholder="请选择" v-model.trim="listQuery.deptName" style="width:150px;" size="small" readonly></el-input>
            </el-popover>
        </div>
      </div>
      <div class="wrapsafe">
        <div class="safe1">
          <span style="font-size: 14px">安全类型</span>
            <el-select v-model.trim="listQuery.alarmType" placeholder="请选择" style="width:120px;" size="small">
              <el-option v-for="item in optionssafe" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </div>
        <div class="safe2">
            <span style="font-size: 14px">报警等级</span>
            <el-select v-model.trim="listQuery.alarmLevel" placeholder="请选择" style="width:90px;" size="small">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </div>
        <div class="safe3">
            <span style="font-size: 14px">处理方式</span>
            <el-select  v-model.trim="listQuery.handleType" placeholder="请选择" style="width:120px;" size="small">
              <el-option v-for="item3 in options2" :key="item3.value" :label="item3.label" :value="item3.value"></el-option>
            </el-select>
        </div>
        <div class="safe4">
           <span style="font-size: 14px">查询时间</span>
            <el-date-picker
              v-model.trim="startEnd"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="——"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="left"
              size="small"
              style="width: 350px"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
        </div>
      </div>
       <el-button  type="primary" size="mini" style="margin-left:10px;float：right;float: right; margin-bottom: 15px;background-color: rgb(98,143,166);" @click="handleQuery">查询</el-button>
       <el-button  @click="reset"  type="primary" size="mini" style="margin-left:10px;float: right; margin-bottom: 15px;background-color: rgb(98,143,166);">重置</el-button>
            <!-- <span style="font-size: 14px">车辆类型</span>
            <el-popover placement="bottom" width="250">
              <menu-tree style="height: 300px; overflow: auto" :treeMenuData="menus" :treeMenuProp="defaultProps" :checkedKeys="defaultChecked" @check-change="handleNodeChange"></menu-tree>
              <el-input slot="reference" placeholder="请选择" v-model.trim="listQuery.alarmTypeName" style="width:150px;" size="small" readonly></el-input>
            </el-popover> -->
            <!-- <span style="font-size: 14px">已选择{{count}}种</span> -->
            <!-- <span style="font-size: 14px">报警类型</span>
            <el-input placeholder="请选择" v-model.trim="listQuery.vehicleId" style="width:100px;" size="small" readonly></el-input> -->

            <!-- <span style="font-size: 14px">查询时间</span> -->
            <!-- <el-date-picker v-model="listQuery.startDate" type="date" placeholder="开始时间" style="width:150px;" size="small"></el-date-picker>
            —
            <el-date-picker v-model="listQuery.endDate" type="date" placeholder="结束时间" style="width:150px;" size="small"></el-date-picker>
            <el-select v-model="listQuery.timeZone" placeholder="自定义" style="width:120px;" size="small">
              <el-option v-for="item in timeZones" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select> -->
      </div>
      <el-main>
        <!-- 未处理-->
        <el-table :data="carsdata" :columns="columns" v-if="nodetailtable"  v-loading.body="listLoading" border stripe style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc" @selection-change="handleSelect">
          <el-table-column align="center" type="selection" width="40" @selection-change="handleSelect"></el-table-column>
          <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>

          <el-table-column align="center" v-for="column in columns" :key="column.key" :label="column.title" :width="column.width">
            <template slot-scope="scope">
              <el-button v-if="column.key === 'alarmName'" type="text" @click="handleDetail(scope.row)">{{scope.row[column.key]}}</el-button>
              <span v-else>{{scope.row[column.key]}}</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 已处理
        <el-table :data="carsdata" :columns="columnsed" v-loading.body="listLoading" v-if="hs" border stripe style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc" @selection-change="handleSelect">
          <el-table-column align="center" type="selection" width="40" @selection-change="handleSelect"></el-table-column>
          <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>

          <el-table-column align="center" v-for="column in columnsed" :key="column.key" :label="column.title" :width="column.width">
            <template slot-scope="scope">
              <el-button v-if="column.key === 'alarmName'" type="text" @click="handleDetail(scope.row)">{{scope.row[column.key]}}</el-button>
              <span v-else>{{scope.row[column.key]}}</span>
            </template>
          </el-table-column>
        </el-table> -->
      </el-main>
      <el-footer>
        <!-- 分页区 -->
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
          :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-footer>
    </el-container>
    <!-- 选择车辆对话框 :visible.sync="batchDialog"-->
    <el-dialog   width="70%" title="选择车辆" :visible.sync="batchDialog"  :close-on-click-modal="false" center>
      <el-container style="height: 500px; border: 1px solid #eee">
      <el-aside width="190px" style="background-color: rgb(238, 241, 246)">
      <el-tree :data="menus" :props="defaultProps" :treeMenuProp="defaultProps" :checkedKeys="defaultChecked"  @node-click="deptFilter"></el-tree>
      <!-- <span style="font-size: 14px">所属企业</span> -->
      <!-- <el-popover placement="bottom" width="250">
        <menu-tree style="height: 300px; overflow: auto" :treeMenuData="menus" :treeMenuProp="defaultProps" :checkedKeys="defaultChecked"></menu-tree>
        <el-input slot="reference" placeholder="请选择" v-model.trim="listQuery.alarmTypeName" style="width:150px;" size="small" readonly></el-input>
      </el-popover> -->
  </el-aside>

  <el-container>
    <el-main style="width:600px">
      <el-table
      ref="multipleTable"
      :data="tableData3"
      tooltip-effect="dark"
      style="width: 700px"
      @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column type="index" label="序号" width="50"></el-table-column>
    <el-table-column
      prop="plateNo"
      label="车牌号"
      width="120">
    </el-table-column>
    <el-table-column
      prop="driver"
      label="司机"
      width="120">
    </el-table-column>
    <el-table-column
      prop="detpName"
      label="所属机构"
      width="120">
    </el-table-column>
    <el-table-column>
       <template slot-scope="scope">
        <el-button type="text" @click="chooseCar(scope.row)">选择</el-button>
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
    <!-- 编辑模版弹框 -->
    <el-dialog :visible.sync="updateMsgDialog" :close-on-click-modal="false" title="批量处理" center>
      <el-input placeholder="输入消息模版" size="small" style="width: 80%; float: left; margin: 20px 5% 0 0" v-model.trim="content"></el-input>
      <el-button type="primary" size="small" style="width: 15%; margin-top: 20px">添加模版</el-button>
      <el-table
       :data="msgTemplate"
       style="width: 100%; margin-top: 20px"
       border
       stripe>
        <el-table-column
         label="序号"
         type="index"
         width="100"
         align="center">
        </el-table-column>
        <el-table-column
         prop="content"
         label="模版内容"
         align="center">
        </el-table-column>
        <el-table-column
         label="删除"
         width="100"
         align="center">
          <template slot-scope="scope">
            <img src="@/assets/operate/delete.png" title="删除" style="cursor: pointer;">
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateMsgDialog = false">取 消</el-button>
      </div>
    </el-dialog>
      <vehicle-dialog :vehicleInfo="vehicleInfo" :driveDatalist="[]"></vehicle-dialog>
  </div>
</template>

<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  .el-aside {
    color: #333;
  }
  .wrapsafe{
    width: 100%;
    text-align: left;
  }
  .safe1{
    width: 20%;
    float: left;
  }
  .safe2{
    width: 20%;
    float: left;
  }
  .safe3{
    width: 20%;
    float: left;
  }
  .safe4{
    width: 40%;
    float: left;
  }
</style>




<script>
import { safeidList, carlist, treeList } from '@/api/alarm/safeDI.js'
import menuTree from './menuTree'
import vehicleDialog from './vehicleDialog'
// import { fetchMenuTree } from '@/api/infomationM/menu'
export default {
  name: 'intelligentEWP',
  components: { menuTree, vehicleDialog },
  data() {
    return {
      total: 0,
      listLoading: false,
      batchDialog: false,
      warningProcessDialog: false,
      hs: false,
      chooseTotal: '',
      nodetailtable: true,
      chooseDialogVisible: false,
      activeIndex: '1',
      option: '1',
      radio: '-1',
      textarea: '',
      checkedCities: ['紧急', 'TTS播读'],
      selectRows: [], // 选中的行数据
      cartableData: [],
      tableData3: [],
      carsdata: [],
      count: 0,
      carQuery: {
        page: 1,
        limit: 5,
        plateNo: '',
        deptId: ''
      },
      options: [
        {
          label: '一级',
          value: '1'
        },
        {
          label: '二级',
          value: '2'
        }
      ],
      optiontime: [
        {
          label: '已处理',
          value: '0'
        },
        {
          label: '未处理',
          value: '1'
        }
      ],
      options1: [
        {
          label: '平台报警',
          value: '1'
        },
        {
          label: '终端报警',
          value: '0'
        }
      ],
      options2: [
        {
          label: '未处理',
          value: '0'
        },
        {
          label: '快速拍照',
          value: '1'
        },
        {
          label: '语音下发',
          value: '2'
        },
        {
          label: '监听电话',
          value: '3'
        },
        {
          label: '电话通知',
          value: '4'
        },
        {
          label: '停车休息',
          value: '5'
        },
        {
          label: '警报提醒',
          value: '6'
        },
        {
          label: '暂不处理',
          value: '7'
        },
        {
          label: '报警误报',
          value: '8'
        },
        {
          label: '其他',
          value: '9'
        }
      ],
      options3: [
        {
          label: '客运班车',
          value: '0'
        },
        {
          label: '旅游包车',
          value: '1'
        },
        {
          label: '危险货运',
          value: '2'
        },
        {
          label: '重型货运',
          value: '3'
        },
        {
          label: '普通货运',
          value: '4'
        },
        {
          label: '公交客运',
          value: '5'
        },
        {
          label: '出租客运',
          value: '6'
        },
        {
          label: '教练员车',
          value: '7'
        },
        {
          label: '其他车辆',
          value: '8'
        }
      ],
      optionssafe: [
        {
          label: '车辆向前碰撞报警',
          value: '500001'
        },
        {
          label: '车辆偏离报警',
          value: '500002'
        },
        {
          label: '车距过近报警',
          value: '500003'
        },
        {
          label: '疲劳驾驶报警',
          value: '200010'
        },
        {
          label: '分神驾驶报警',
          value: '200001'
        },
        {
          label: '接打电话报警',
          value: '200004'
        },
        {
          label: '抽烟报警',
          value: '200003'
        },
        {
          label: '驾驶人异常报警',
          value: '200011'
        }
      ],
      data: [],
      columns: [
        {
          key: 'plateNo',
          title: '车牌号',
          width: '100'
        },
        {
          key: 'name',
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
          key: 'alarmType',
          title: '安全类型',
          width: '140'
        },
        {
          key: 'alarmLevel',
          title: '安全等级',
          width: '140'
        },
        {
          key: 'speed',
          title: '速度',
          width: '140'
        },
        {
          key: 'alarmTime',
          title: '时间',
          width: '140'
        },
        {
          key: 'bindStatus',
          title: '处理状态',
          width: '140'
        },
        {
          key: 'handleType',
          title: '处理方式',
          width: '140'
        }
      ],
      listQuery: {
        page: 1,
        limit: 10,
        isHandlerType: 0, // 是否处理
        plateNo: '', // 车牌号
        deptName: '',
        deptId: '',
        startDate: '', // 报警开始时间
        endDate: '', // 报警结束时间
        vehicleType: '', // 车辆类型
        alarmType: '', // 安全类型
        alarmLevel: '', // 安全级别
        bindStatus: '', // 处理状态
        handleType: '' // 处理方式
      },
      defaultChecked: [],
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      menus: [],
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
      },
      updateMsgDialog: false,
      msgTemplate: [],
      content: '',
      vehicleInfo: { vehicleNo: '1111' }
    }
  },
  created() {
    this.getnodetaininfo()
    this.gettree()
    this.getcarlist()
  },
  methods: {
    // 重置
    reset() {
      this.listQuery = {
        page: 1,
        pageSize: 10,
        isHandlerType: 0, // 是否处理
        plateNo: '', // 车牌号
        startDate: '', // 报警开始时间
        endDate: '', // 报警结束时间
        vehicleType: '', // 车辆类型
        alarmLevel: '', // 报警等级
        alarmSource: '', // 报警来源
        handleTimeLong: '', // 处理时长
        handlerType: '' // 处理方式
      }
    },
    handlePageChange(val) {
      this.carQuery.page = val
      this.getcarlist()
    },
    showChooseCar() {
      this.carQuery = {
        page: 1,
        limit: 5,
        plateNo: '',
        deptId: ''
      }
      // alert('test')
      this.getcarlist()
      this.batchDialog = true
    },
    chooseCar(row) {
      this.batchDialog = false
      this.listQuery.plateNo = row.plateNo
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
    // 获取车辆列表
    getcarlist() {
      carlist(this.carQuery).then(res => {
        // console.log('所有车辆列所有车辆列表所有车辆列表表' + JSON.stringify(res.data))
        this.tableData3 = res.data.rows
        this.chooseTotal = res.data.totalCount
      })
    },
    // 获取首页所有未处理的信息
    getnodetaininfo() {
      safeidList(this.listQuery).then(res => {
        for (var i = 0; i < res.data.rows.length; i++) {
          if (res.data.rows[i].bindStatus === 0) {
            res.data.rows[i].bindStatus = '已处理'
          } else {
            res.data.rows[i].bindStatus = '未处理'
          }
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
      this.listQuery.limit = 10
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
      console.log(val)
      this.listQuery.deptId = val.id
      this.listQuery.deptName = val.text
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
        this.listQuery.startDate = val[0]
        this.listQuery.endDate = val[1]
      } else {
        this.listQuery.startDate = ''
        this.listQuery.endDate = ''
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
  .app-container .el-dialog__header {
    background-color: rgb(98,143,166);
    height: 40px;
    padding-top: 10px;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active{
    background-color: rgb(98,143,166);
  }
  .el-button--primary{
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
</style>

