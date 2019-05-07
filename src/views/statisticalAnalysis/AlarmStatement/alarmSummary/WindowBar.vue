<template>
    <el-form-item label="司机姓名" style="margin-bottom: 0;">
      <!--<span @click="sendDriverName(driverName)">司机姓名</span>-->
      <el-input
        clearable
        v-model="driverName"
        size="mini"
        placeholder="选择司机" @focus="dialogVisible = true" style="width: 150px"></el-input>
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
            v-model="driverName"
            size="mini"
            clearable
            placeholder="请输入司机姓名" class="input-with-select" style="width: 100%;padding-left: 45px;margin-left: 24%;"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            @click="dialogHeadSearch(choiceDriverQuery.owersId, driverName)"
            size="mini" style="background-color: #5F7ABF;color: #fff;height: 28px;line-height: 7px;margin-bottom: 1px;margin-left: 75%;margin-right:10px;">查询</el-button>
        </el-col>
      </el-form>
      <el-table
        :data="choiceDriverData"
        highlight-current-row
        :header-cell-style="{ background: '#5F7ABF', color: '#fff' }"
        stripe
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
          label="姓名"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="owersName"
          align="center"
          label="所属机构">
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
    name: 'WindowBar',
    data() {
      return {
        // 选择司机请求参数
        choiceDriverQuery: {
          page: 1,
          limit: 10,
          OwersName: '',
          driverName: '',
          platformId: '',
          owersId: ''
        },
        // 选择司机表格数据
        choiceDriverData: [],
        owersName: [],
        driverName: '',
        // 分页器
        total: 4, // 默认数据总数
        pagesize: 2, // 每页的数据条数
        currentPage: 1, // 默认开始页面
        listQuery: {
          platforrm: '',
          date: '',
          postContent: ''
        },
        dialogVisible: false
      }
    },
    created() {
      this.getDriverList()
    },
    methods: {
      // 向父组件发送司机名称
      sendDriverName(row) {
        this.driverName = row.driverName
        console.log(this.driverName + '子组件')
        this.$emit('getDriverName', row)
        this.dialogVisible = false
      },
      // dialog查询
      dialogHeadSearch(owersId, driverName) {
        // console.log(owersId)
        this.choiceDriverQuery.owersId = owersId
        this.choiceDriverQuery.driverName = driverName
        this.getDriverList()
      },
      // 司机table信息
      getDriverList() {
        // this.listLoading = true
        // console.log(this.choiceDriverQuery.owersId)
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
        // this.pagesize = val
        // console.log(`每页 ${val} 条`)
      },
      // 监听切换页面数据变化
      handleCurrentChange(val) {
        this.choiceDriverQuery.page = val
        this.getDriverList()
        // this.currentPage = val
        // console.log(`当前页: ${val}`)
      }
    }
  }
</script>

<style lang="scss" scoped>
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
