<template>
    <el-form-item label="选择司机" style="margin-bottom: 0;">
      <!--<span @click="sendDriverName(driverName)">司机姓名</span>-->
      <el-input
        clearable
        v-model="driverName"
        size="mini"
        placeholder="选择司机" @focus="getdriver()" style="width: 150px"></el-input>
      <el-dialog
      class="dialog"
      title="选择司机"
      :visible.sync="dialogVisible"
      style="min-height: 400px;"
      width="50%">
      <el-form style="margin-bottom: 10px;overflow: hidden;">
        <el-col :span="8">
          <el-select
            @focus="getDriverList"
            class="select" size="mini"
            clearable
            v-model="choiceDriverQuery.owersId" style="width: 100%;padding-right: 10px"   placeholder="企业/业户">
            <el-option
              v-for="item in choiceDriverData"
              :key="item.id"
              :label="item.owersName"
              :value="item.owersId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :gutter="4" :span="11">
          <el-input
            v-model="choiceDriverQuery.driverName"
            size="mini"
            clearable
            placeholder="请输入司机姓名" class="input-with-select" style="width: 80%;padding-left: 45px;margin-left: 5%;"></el-input>
        </el-col>
        <el-col :span="5">
          <el-button @click="dialogHeadSearch()" size="mini" type="primary">查询</el-button>
          <el-button @click="chooseCar" size="small" type="primary">确定</el-button>
        </el-col>
      </el-form>
      <el-table
        :data="choiceDriverData"
        highlight-current-row
        :header-cell-style="{ background: '#5F7ABF', color: '#fff' }"
        stripe  @selection-change="handleSelectionChange"
        style="width: 100%;">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="55">
        </el-table-column>
        <el-table-column
          prop="driverName"
          label="司机姓名"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="owersName"
          align="center"
          label="企业/业户">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <img
              @click="sendDriverName(scope.row)"
              src="@/assets/navicon/handle.png" style="cursor: pointer"/>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 10px;"
        small
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="choiceDriverQuery.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="choiceDriverQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-dialog>
    </el-form-item>
</template>

<script>
  import { fetchList } from '@/api/base/driver'
  export default {
    props: ['platformId'],
    name: 'WindowBar',
    data() {
      return {
        // 选择司机请求参数
        choiceDriverQuery: {
          page: 1,
          limit: 10,
          OwersName: null,
          driverName: null,
          platformId: null,
          owersId: null
        },
        // 选择司机表格数据
        choiceDriverData: [],
        // 分页器
        total: 4, // 默认数据总数
        pagesize: 2, // 每页的数据条数
        currentPage: 1, // 默认开始页面
        dialogVisible: false,
        driverName: '',
        superviseData: ''
      }
    },
    created() {
    },
    watch: {
      platformId(val) {
        this.choiceDriverQuery.platformId = val
      }
    },
    methods: {
      getdriver() {
        if (this.choiceDriverQuery.platformId === null) {
          this.dialogVisible = false
          this.$message('请选择平台')
        } else {
          this.dialogVisible = true
          this.getDriverList()
        }
      },
      // 向父组件发送司机名称
      sendDriverName(row) {
        this.driverName = row.driverName
        console.log(this.driverName + '子组件')
        this.$emit('getDriverName', row.id)
        this.dialogVisible = false
      },
      // dialog查询
      dialogHeadSearch() {
        this.getDriverList()
      },
      // 司机table信息
      getDriverList() {
        fetchList(this.choiceDriverQuery).then(res => {
          this.total = res.data.totalCount
          this.currentPage = res.data.currPage
          this.pagesize = res.data.pageSize
          this.choiceDriverData = res.data.rows
        })
      },
      // 分页器
      // 监听每页显示数据条数
      handleSizeChange(val) {
        this.choiceDriverQuery.limit = val
        this.getDriverList()
      },
      // 监听切换页面数据变化
      handleCurrentChange(val) {
        this.choiceDriverQuery.page = val
        this.getDriverList()
      },
      chooseCar() {
        if (this.superviseData.length === 0) {
          this.$message({
            type: 'error',
            message: '请选择司机'
          })
          this.dialogVisible = true
        } else {
          console.log(this.superviseData)
          const arr = []
          const tmp = []
          this.superviseData.forEach(item => {
            arr.push(item.id)
            tmp.push(item.driverName)
          })
          this.driverName = tmp.join()
          this.$emit('getDriverName', arr.join())
          this.dialogVisible = false
        }
      },
      handleSelectionChange(val) {
        this.superviseData = val
        console.log(this.superviseData)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-button--primary {
    color: #fff;
    background-color: #5F7ABF;
    border-color: #5F7ABF;
  }
  .title {
    /*font-size: 13px;*/
    padding: 0 5px;
  }
  .title:first-child {
    padding: 0 5px 0 0;
  }
  /deep/ .dialog{
    .el-dialog__header {
      background: #5f7abf;
      height: 40px;
      line-height: 33px;
      padding-top: 3px;
    }
    .el-dialog__header span {
      color: #fff;
      font-size: 14px
    }
    .el-dialog__header i {
      color: #fff;
    }
    .el-dialog__headerbtn{
      top: 11px;
    }
    .el-dialog__body{
      padding: 20px 20px 10px 20px;
    }
    .el-dialog__footer {
       padding: 0;
    }
  }
</style>
