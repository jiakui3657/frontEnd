<template>
  <div class="app-container">
    <el-container>
      <el-form
        ref="form"
        :model="listQuery"
        label-width="70px"
        inline style=
          "background: #fff;
          margin: 0 20px;
          padding: 20px 10px 0 20px;
          border-radius: 5px;
          box-shadow: 0 0 10px #ccc">
        <el-form-item label="登陆账号">
          <el-input
            v-model.trim="listQuery.userName"
            style="width:100px;" size="small"
            clearable>
          </el-input>
        </el-form-item>
        
        <el-form-item label="查询时间">
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
        </el-form-item>        
        <el-form-item style="margin-left:10px; float: right">
          <el-button
            @click="handleQuery"
            size="small"
            style="background-color: #628FA6;border-radius: 5px;color:#fff;">查询
          </el-button>
        </el-form-item>
        <el-form-item style="margin-left:10px; float: right">
          <el-button
            @click="reset"
            size="small"
            style="background-color: #628FA6;border-radius: 5px;color:#fff;">重置
          </el-button>
        </el-form-item>
      </el-form>
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
            property="username"
            align="center"
            label="登录账号">
          </el-table-column>
          <el-table-column
            property="realname"
            align="center"
            label="用户名称">
          </el-table-column>
          <el-table-column
            property="loginTime"
            align="center"
            label="登陆时间">
          </el-table-column>
          <el-table-column
            property="ip"
            align="center"
            label="IP地址">
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
   
  </div>
</template>

<script>
import { getLogin } from '@/api/statisticalAnalysis/logging'

export default {
  name: 'intelligentEWP',
  data() {
    return {
      total: 0,
      listLoading: true,
      batchDialog: false,
      warningProcessDialog: false,
      activeIndex: '1',
      option: '1',
      radio: '-1',
      textarea: '',
      selectRows: [], // 选中的行数据
      count: 0,
      options: [],
      data: [],
      columns: [
        {
          key: '',
          title: '登陆账号',
          width: '366'
        },
        {
          key: '',
          title: '用户名称',
          width: '366'
        },
        {
          key: '',
          title: '登陆时间',
          width: '366'
        },
        {
          key: '',
          title: 'IP地址',
          width: '370'
        }
      ],
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
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        userName: null,
        startTime: null,
        endTime: null
      },
      defaultChecked: [],
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      menus: [],
      startEnd: [],
      updateMsgDialog: false,
      msgTemplate: [],
      content: '',
      chooseDialogVisible: false,
      carQuery: {
        page: 1,
        limit: 5,
        plateNo: '',
        deptId: ''
      },
      chooseTotal: 0,
      allotLoading: false,
      carData: [],
      vehicleTypeOptions: [],
      alarmSourceOptions: [],
      isHandlerTypeOptions: [
      ],
      handlerTypeOptions: [],
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getLogin(this.listQuery).then(res => {
        this.tableData = res.data.rows
        this.total = res.data.totalCount
        this.listQuery.pageNum = res.data.totalPage
      })
    },
    handleQuery() {
      this.getList()
    },
    reset() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
        userName: null,
        startTime: null,
        endTime: null
      }
      this.startEnd = []
    },
    handleSelect() {},
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
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
  .app-container .el-dialog__header span {
    color: #fff;
    font-size: 14px
  }
  .app-container .el-dialog__header i {
    color: #fff;
  }
  .msgManager:hover {
    color: #628FA6;
    cursor: pointer;
  }
  .app-container .el-dialog__headerbtn {
    top: 10px
  }
</style>

<style lang="scss" scoped>
  .el-table--border {
    border-radius: 5px 5px 0 0;
  }
</style>


