<template>
  <div class="app-container">
    <el-container>
      <div style="background: #fff;height:53px; margin: 10px 20px;line-height:48px;padding:5px 10px; border-radius: 5px; box-shadow: 0 0 10px #ccc">
                <span style="font-size: 14px">选择车辆</span>
                <el-input placeholder="请选择车辆" v-model.trim="listQuery.plateNo" style="width:100px;" size="small" readonly @focus="showChooseCar" clearable></el-input>
                <span style="font-size: 14px">报警类型</span>
                <el-select v-model.trim="listQuery.vehicleType" placeholder="请选择" style="width:120px;" size="small">
                  <el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span style="font-size: 14px">证据类型</span>
                <el-select v-model.trim="listQuery.alarmSource" placeholder="请选择" style="width:120px;" size="small">
                  <el-option v-for="item1 in options1" :key="item1.value" :label="item1.label" :value="item1.value"></el-option>
                </el-select>
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
              <el-button  type="primary" size="mini" style="margin-left:10px;float: right;    margin-top: 9px;background-color: rgb(98,143,166);" @click="handleQuery">查询</el-button>
            <el-button  @click="reset"  type="primary" size="mini" style="margin-left:10px;float: right;    margin-top: 9px;background-color: rgb(98,143,166);">重置</el-button>
      </div>
      <el-main>
        <!-- 未处理-->
        <el-table :data="carsdata" :columns="columns" :header-cell-style="{ 'background-color': '#628FA6', 'color': '#fff', border: 'none !important' }" v-loading.body="listLoading" border stripe style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc" @selection-change="handleSelect">
          <el-table-column align="center" type="selection" width="40" @selection-change="handleSelect"></el-table-column>
          <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>
          <el-table-column align="center" v-for="column in columns" :key="column.key" :label="column.title">
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
    <el-dialog   width="70%" title="选择车辆" :visible.sync="batchDialog"  :close-on-click-modal="false" center>
      <el-container style="height: 500px; border: 1px solid #eee">
      <el-aside width="190px" style="background-color: rgb(238, 241, 246)">
      <el-tree :data="menus" :props="defaultProps" :treeMenuProp="defaultProps" :checkedKeys="defaultChecked"  @node-click="deptFilter"></el-tree>
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
      label="车牌号">
    </el-table-column>
    <el-table-column
      prop="driver"
      label="司机">
    </el-table-column>
    <el-table-column
      prop="detpName"
      label="所属机构">
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
  .zjwrap{
    width: 100%;
    text-align: left;
  }
  .zj1{
    width: 15%;
    float: left;
  }
  .zj2{
    width: 20%;
    float: left;
  }
  .zj3{
    width: 20%;
    float: left;
  }
  .zj4{
    width: 40%;
    float: left;
  }
</style>

<script>
import { treeList, carlist, alarmlist } from '@/api/alarm/alarmPC'
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
      chooseTotal: '',
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
      options1: [
        {
          label: '图片',
          value: '1'
        },
        {
          label: '视频',
          value: '0'
        }
      ],
      options3: [
        {
          label: '车辆向前碰撞报警',
          value: '0'
        },
        {
          label: '车道偏离报警',
          value: '1'
        },
        {
          label: '车距过近报警',
          value: '2'
        },
        {
          label: '疲劳驾驶报警',
          value: '3'
        },
        {
          label: '分神驾驶报警',
          value: '4'
        },
        {
          label: '接打电话报警',
          value: '5'
        },
        {
          label: '抽烟报警',
          value: '6'
        },
        {
          label: '驾驶人异常报警',
          value: '7'
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
        handlerType: '' // 处理方式
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
        startTime: '', // 报警开始时间
        endTime: '', // 报警结束时间
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
      // this.carQuery = {
      //   page: 1,
      //   limit: 5,
      //   plateNo: '',
      //   deptId: ''
      // }
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
      alarmlist(this.listQuery).then(res => {
        this.carsdata = res.data.rows
        this.total = res.data.totalCount
      })
    },
    handleQuery() {
      // alert('处理时间')
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

