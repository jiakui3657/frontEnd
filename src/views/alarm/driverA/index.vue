<template>
  <div class="app-container">
    <el-container>
      <div
        style="
        background: #fff;
        line-height:43px;
        margin: 0 20px;
        light-height:15px;
        padding: 13px 10px 13px 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px #ccc">
          <span style="font-size: 14px">选择车辆</span>
          <el-input
            placeholder="请选择车辆"
            v-model.trim="listQuery.plateNo"
            style="width:100px;"
            size="small"
            readonly
            @focus="showChooseCar"
            clearable>
          </el-input>
          <span style="font-size: 14px">所属企业</span>
          <el-popover placement="bottom" width="250">
            <menu-tree
              style="height: 300px; overflow: auto"
              :treeMenuData="menus"
              :treeMenuProp="defaultProps"
              :checkedKeys="defaultChecked"
              @check-change="handleNodeChange">
            </menu-tree>
            <el-input
              slot="reference"
              placeholder="请选择"
              v-model.trim="listQuery.deptName"
              style="width:150px;"
              size="small"
              readonly>
            </el-input>
          </el-popover>
          <span style="font-size: 14px">车辆类型</span>
          <el-select
            v-model.trim="listQuery.vehicleType"
            placeholder="请选择"
            style="width:120px;"
            size="small">
            <el-option
              v-for="item in options3"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span style="font-size: 14px">采集类型</span>
          <el-select
            v-model.trim="listQuery.alarmSource"
            placeholder="请选择"
            style="width:120px;"
            size="small">
            <el-option
              v-for="item1 in options1"
              :key="item1.value"
              :label="item1.label"
              :value="item1.value">
            </el-option>
          </el-select>
          <span style="font-size: 14px">采集时间</span>
          <el-date-picker
            v-model.trim="listQuery.gatherTime"
            align="right"
            type="date"
            placeholder="采集日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions">
          </el-date-picker>
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
            style="width: 350px;"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
          <el-button
            class="fr"
            size="mini"
            style="margin-left:10px; bacground-color: #628FA6; margin-top: 8px;"
            @click="handleQuery">查询
          </el-button>
          <el-button
            class="fr"
            @click="reset"
            size="mini"
            style="margin-left:10px; margin-top:8px; bacground-color: #628FA6;">重置
          </el-button>
      </div>
      <el-main>
        <el-table
          ref="singleTable"
          :data="tableData"
          border
          style="width:100%;"
          highlight-current-row>
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="60">
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
            property="deptName"
            align="center"
            label="所属企业">
          </el-table-column>
          <!-- <el-table-column
            property="address"
            align="center"
            label="采集类型"
            width="140">
          </el-table-column> -->
          <el-table-column
            property="readResult"
            align="center"
            label="读卡状态">
          </el-table-column>
          <el-table-column
            property="driver"
            align="center"
            label="姓名">
          </el-table-column>
          <el-table-column
            property="licence"
            label="从业资格证号"
            align="center">
          </el-table-column>
          <el-table-column
            property="orgName"
            label="发证机构名称"
            align="center">
          </el-table-column>
          <el-table-column
            property="validTime"
            align="center"
            label="发证时间">
          </el-table-column>
          <el-table-column
            property="dataTime"
            align="center"
            label="到期时间">
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.page"
          :page-sizes="[10,20,30, 50]"
          :page-size="listQuery.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-footer>
    </el-container>
    <!-- 选择车俩 -->
    <el-dialog
      width="70%"
      title="选择车辆"
      :visible.sync="batchDialog"
      :close-on-click-modal="false"
      center>
      <el-container style="height: 500px; border: 1px solid #eee">
        <el-aside width="190px" style="background-color: rgb(238, 241, 246)">
          <el-tree
            :data="menus"
            :props="defaultProps"
            :treeMenuProp="defaultProps"
            :checkedKeys="defaultChecked"
            @node-click="deptFilter">
          </el-tree>
        </el-aside>
        <el-container>
          <el-main style="width:600px">
            <!-- <div style="border-bottom: 1px solid #eee; padding: 10px 20px">
              <el-input
                size="small"
                placeholder="请输入车牌号"
                v-model.trim="carQuery.plateNo"
                class="input-with-select"
                style="width: 200px;">
                <el-button slot="append" icon="el-icon-search" @click="vnFilter"></el-button>
              </el-input>
            </div> -->
            <el-table
              border
              ref="multipleTable"
              :data="tableData3"
              tooltip-effect="dark"
              style="width: 700px"
              @selection-change="handleSelectionChange">
              <el-table-column
                align="center"
                type="index"
                label="序号"
                width="50">
              </el-table-column>
              <el-table-column
                prop="plateNo"
                label="车牌号"
                align="center">
              </el-table-column>
              <el-table-column
                prop="driver"
                label="司机"
                align="center">
              </el-table-column>
              <el-table-column
                prop="detpName"
                label="所属机构"
                align="cebnter">
              </el-table-column>
              <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="chooseCar(scope.row)">选择</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              background
              @current-change="handlePageChange"
              :current-page="carQuery.page"
              :page-size="carQuery.limit"
              layout="total, prev, pager, next"
              :total="chooseTotal"
              style="margin-top: 20px">
            </el-pagination>
          </el-main>
        </el-container>
      </el-container>
    </el-dialog>
    <!-- 编辑模版弹框 -->
    <el-dialog
      :visible.sync="updateMsgDialog"
      :close-on-click-modal="false"
      title="批量处理" center>
      <el-input
        placeholder="输入消息模版"
        size="small"
        style="width: 80%; float: left; margin: 20px 5% 0 0"
        v-model.trim="content">
      </el-input>
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

<style lang="scss">
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
  .app-container {

    .el-input--medium .el-input__inner {
      height: 32px;
      line-height: 32px;
    }
  }
</style>




<script>
import { treeList, carlist } from '@/api/alarm/alarmPC'
import menuTree from './menuTree'
import vehicleDialog from './vehicleDialog'
import { diverList } from '@/api/alarm/diverA'

export default {
  name: 'intelligentEWP',
  components: { menuTree, vehicleDialog },
  data() {
    return {
      total: 0,
      listLoading: false,
      batchDialog: false,
      warningProcessDialog: false,
      chooseTotal: 0,
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
          title: '车辆类型',
          width: '100'
        },
        {
          key: 'driverName',
          title: '所属企业',
          width: '180'
        },
        {
          key: 'phone',
          title: '采集类型',
          width: '100'
        },
        {
          key: 'vehicleType',
          title: '读卡状态',
          width: '180'
        },
        {
          key: 'alarmSourceName',
          title: '姓名',
          width: '80'
        },
        {
          key: 'alarmName',
          title: '从业资格证',
          width: '100'
        },
        {
          key: 'alarmLevel',
          title: '发证机构名称',
          width: '220'
        },
        {
          key: 'alarmTime',
          title: '发证时间',
          width: '140'
        },
        {
          key: 'alarmAddress',
          title: '到期时间',
          width: '140'
        }
      ],
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        plateNo: null, // 车牌号
        deptName: null,
        gatherTime: null, // 采集时间
        status: null, // 状态
        startTime: null, // 开始时间
        endTime: null, // 结束时间
        vehicleType: null // 车辆类型
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
      vehicleInfo: { vehicleNo: '1111' },
      tableData: []
    }
  },
  created() {
    this.getDiver()
    this.gettree()
  },
  methods: {
    getDiver() {
      diverList(this.listQuery).then(res => {
        this.tableData = res.data.rows
        this.total = res.data.totalCount
      })
    },
    // 重置
    reset() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
        plateNo: null, // 车牌号
        gatherTime: null, // 采集时间
        startTime: null, // 开始时间
        endTime: null, // 结束时间
        status: null, // 状态
        deptName: null, // 企业名称
        vehicleType: null // 车辆类型
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
      console.log(row.plateNo)
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
      diverList(this.listQuery).then(res => {
        this.tableData = res.data.rows
        this.total = res.data.totalCount
      })
    },
    handleQuery() {
      // alert('处理时间')
      this.listQuery.pageNum = 1
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
      this.listQuery.deptId = val.id
      this.listQuery.deptName = val.text
      console.log('ceshisssasssssssssssssssssssssssssssssssssssssss' + this.listQuery.deptName)
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getnodetaininfo()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
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
    background-color: #628FA6;
    color: #fff
  }
  .app-container .el-dialog__header {
    background-color: #628FA6;
    height: 40px;
    padding-top: 10px;
  }
  
  .el-button--primary {
    background: #628FA6;
  }

  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background: #628FA6;
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
<style lang="scss">
  .app-container {

    .el-button--default {
      background-color: #628FA6;
      color: #fff;
    }
  }
</style>


