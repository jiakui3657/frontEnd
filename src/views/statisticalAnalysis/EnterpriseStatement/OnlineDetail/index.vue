<template>
  <div class="app-container">
    <el-container>
      <el-form ref="form" :model="listQuery" label-width="70px" inline style="background: #fff; margin: 0 20px; padding: 20px 10px 0 20px; border-radius: 5px; box-shadow: 0 0 10px #ccc">
        <el-form-item label="运营商平台">
          <el-select  @change="platformChange(listQuery.platformId)" v-model="listQuery.platformId" placeholder="请选择" style="width:150px;" size="small" clearable  filterable>
            <el-option v-for="item in platformIdList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业/业户" label-width="80px">
          <el-select @focus="owersIdClick(listQuery.platformId)" v-model="listQuery.owersId" placeholder="请选择" style="width:150px;" size="small" clearable filterable>
            <el-option v-for="item in owersList" :key="item.id" :label="item.owersName" :value="item.id"></el-option>
          </el-select>
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
            style="width: 300px"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="margin-left:10px; float: right">
          <el-button @click="handleQuery" size="small" style="background-color: #5F7ABF;border-radius: 5px;color:#fff;">查询</el-button>
          <el-button @click="reset" size="small" style="background-color: #5F7ABF;border-radius: 5px;color:#fff;">重置</el-button>
        </el-form-item>
      </el-form>
      <el-main>
        <el-table :data="data" :columns="columns" v-loading.body="listLoading" border stripe style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc" @selection-change="handleSelect" :header-cell-style="{ 'background-color': '#5F7ABF', 'color': '#fff' }">
          <el-table-column align="center" type="index" width="50" label="序号" fixed="left"></el-table-column>
          <el-table-column align="center" v-for="column in columns" :key="column.key" :label="column.title" :min-width="column.width" show-overflow-tooltip :fixed="column.fixed">
            <template slot-scope="scope">
              <span>{{scope.row[column.key]}}</span>
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
    <!-- <footer-bar></footer-bar> -->
  </div>
</template>

<script>
  import { enterpriseOnlineDetail } from '@/api/statistics/statistics'
  import menuTree from './menuTree'
  import FooterBar from '../FooterBar'
  import { getPermsList } from '@/api/base/platform'
  import { owersListByPlatform } from '@/api/base/company'
  import { formatDate } from '@/utils/date.js'
  export default {
    components: { menuTree, FooterBar },
    data() {
      var date = function() {
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        return start
      }
      return {
        total: 0,
        listLoading: true,
        batchDialog: false,
        activeIndex: '1',
        option: '1',
        radio: '-1',
        textarea: '',
        selectRows: [], // 选中的行数据
        count: 0,
        data: [],
        columns: [
          {
            key: 'vehicleNo',
            title: '车牌号',
            width: '100'
          },
          {
            key: 'platformName',
            title: '运营商平台',
            width: '100'
          },
          {
            key: 'owersName',
            title: '企业/业户',
            width: '100'
          },
          {
            key: 'onlineTime',
            title: '在线时长',
            width: '100'
          },
          {
            key: 'offlineTime',
            title: '离线时长',
            width: '100'
          },
          {
            key: 'totalTime',
            title: '总时长',
            width: '100'
          },
          {
            key: 'onlineRate',
            title: '在线率(%)',
            width: '100'
          }
        ],
        listQuery: {
          page: 1,
          pageSize: 10,
          startTime: formatDate(date(), 'yyyy-MM-dd'),
          endTime: formatDate(new Date(), 'yyyy-MM-dd'),
          platformId: null,
          owersName: null,
          owersId: null
        },
        platformIdList: [],
        owersList: [],
        startEnd: [date(), new Date()],
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
              text: '最近15天',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 15)
                picker.$emit('pick', [start, end])
              }
            }
          ]
        }
      }
    },
    created() {
      this.getSpeedList()
      this.getPlatformList()
    },
    methods: {
      reset() {
        this.listQuery = {
          page: 1,
          pageSize: 10,
          startTime: null,
          endTime: null,
          owersName: null,
          platformId: null,
          owersId: null
        }
        this.startEnd = ''
      },
      getSpeedList() { // 分页获取智能预警列表
        this.listLoading = true
        console.log(this.listQuery)
        enterpriseOnlineDetail(this.listQuery).then(res => {
          if (res.code === 0) {
            console.log(res)
            this.listLoading = false
            this.data = res.data.rows
            this.total = res.data.totalCount
          }
        })
      },
      handleSelect(val) { // 选择处理事件
        this.selectRows = val
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getSpeedList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getSpeedList()
      },
      handleQuery() {
        console.log(this.listQuery)
        this.listQuery.page = 1
        this.listQuery.pageSize = 10
        this.getSpeedList()
      },
      handleNodeClick(val) {
        console.log(val)
        this.listQuery.deptId = val.id
        this.listQuery.owersName = val.text
      },
      getPlatformList() { // 获取运营商平台列表
        getPermsList().then(response => {
          this.platformIdList = response.data
        })
      },
      platformChange(val) { // 根据运营商平台获取业户列表
        if (val === null || val === '') {
          return
        }
        owersListByPlatform(val).then(response => {
          console.log(response)
          this.listQuery.owersId = ''
          this.owersList = response.data
        })
      },
      owersIdClick(id) {
        if (!id || id === '') {
          this.$message({
            message: '请先选择平台',
            type: 'info'
          })
        }
      }
    },
    watch: {
      startEnd(val) {
        if (val) {
          console.log(val)
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
    background-color: #4077BC;
    color: #fff
  }
  .app-container .el-dialog__header {
    background-color: #4077BC;
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
    color: #4077BC;
    cursor: pointer;
  }
  .app-container .el-dialog__headerbtn {
    top: 10px
  }
</style>

