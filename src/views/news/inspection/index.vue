<template>
  <div class="app-container">
    <el-container>
      <div style="width:100%;background: #fff;height:53px; margin: 10px 20px;line-height:48px;padding:5px 10px; border-radius: 5px; box-shadow: 0 0 10px #ccc">
        <span style="font-size: 14px">回复状态</span>
        <el-select v-model="listQuery.status" size="mini" placeholder="请选择" style="width:100px;">
          <el-option
            v-for="item in options"
            :key="item.code"
            :label="item.value"
            :value="item.code">
          </el-option>
        </el-select>
        <span style="font-size: 14px">督办时间</span>
        <el-date-picker
          style="width:324px;"
          v-model="date"
          size="mini"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <span style="font-size: 14px">查岗类型</span>
        <el-select v-model="listQuery.type" placeholder="请选择" size="mini" style="width:110px;">
          <el-option
            v-for="item in TypeOption"
            :key="item.code"
            :label="item.value"
            :value="item.code">
          </el-option>
        </el-select>
        <el-button @click="reset" size="mini" style="float:right;margin-top:8px;background: #628FA6; color: #fff; border-radius: 5px">重置</el-button>
        <el-button @click="search" size="mini" style="float:right;margin-top:8px;margin-right:10px;background: #628FA6; color: #fff; border-radius: 5px">查询</el-button>
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
          prop="platformName"
          align="center"
          label="上级平台"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="type"
          align="center"
          label="查岗类型"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="reqTime"
          align="center"
          label="查岗时间"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="req"
          label="查岗内容"
          align="center"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="status"
          label="回复状态"
          align="center"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="ack"
          label="回复内容"
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
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <div style="width:100%;height:130px;border:1px solid #dcdfe6;border-radius:5px;padding:0 10px;">
        <p>上级平台：<span>{{ plat }}</span></p>
        <p>查岗内容：<span>{{ reqContent }}</span></p>
        <p>查岗时间：<span>{{ reqDate }}</span></p>
      </div>
      <div style="margin-top:20px;width:100%;min-height:130px;border:1px solid #dcdfe6;border-radius:5px;padding:15px 10px;">
        <div style="display:inline-block;width:20%;height:100%;line-height:130px;margin:0;text-align:center;">查岗应答：</div>
          <el-input class="area" style="width:79%;height:100%;margin:0;" type="textarea" v-model="desc"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button style="padding:7px 22px;background: #628FA6; color: #fff; border-radius: 5px">回复</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchData } from '@/api/news/new'
  import { getDownMenu } from '@/api/infomationM/dict'
  export default {
    data() {
      return {
        centerDialogVisible: false,
        desc: '',
        // 督办状态
        options: [],
        date: '',
        // 查岗类型
        TypeOption: [],
        tableData: [], // 表格数据
        listQuery: {
          page: 1,
          limit: 5,
          status: '',
          type: '',
          startDate: '',
          endDate: ''
        },
        total: 0,
        plat: '',
        reqContent: '',
        reqDate: ''
      }
    },
    watch: {
      date: {
        handler(val, oldVal) {
          console.log(val)
          if (val) {
            this.listQuery.startDate = val[0]
            this.listQuery.endDate = val[1]
          }
        }
      }
    },
    methods: {
      handleClick(row) {
        console.log(row)
        this.plat = row.platformName
        this.reqContent = row.req
        this.reqDate = row.reqTime
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
        console.log(this.listQuery)
        fetchData(this.listQuery).then(res => {
          res.data.rows.forEach(item => {
            if (item.type === 1) {
              item.type = '查岗'
            } else if (item.type === 2) {
              item.type = '平台间报文'
            }
            if (item.status === '0') {
              item.status = '已回复'
            } else if (item.status === '1') {
              item.status = '未回复'
            }
          })
          console.log(res.data.rows)
          this.tableData = res.data.rows
          this.total = res.data.totalCount
        })
      },
      reset() {
        this.listQuery.status = ''
        this.date = ''
        this.listQuery.type = ''
        this.listQuery.startDate = ''
        this.listQuery.endDate = ''
      },
      search() {
        this.listQuery.page = 1
        this.getdatalist()
      },
      // 获取下拉列表
      getDownMenuList(type) {
        getDownMenu(type).then(res => {
          switch (type) {
            case 'urged_type':
              this.TypeOption = res.data
              break
            case 'urge_status':
              this.options = res.data
              break
            default:
              break
          }
        })
      }
    },
    mounted() {
      this.getdatalist()
      this.getDownMenuList('urged_type') // 查岗类型下拉
      this.getDownMenuList('urge_status') // 督办状态下拉
    }
  }
</script>

<style>
  .area .el-textarea__inner {
    min-height:130px !important;
  }
</style>
