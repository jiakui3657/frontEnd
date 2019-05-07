<template>
  <div class="bl">
    <span class="m">运营商平台</span>
    <el-select v-model="queryList.platformId" placeholder="请选择" class="im">
      <el-option
        v-for="item in platformOptions"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
    <span class="m">选择车辆</span>
    <el-input v-model="carValue" placeholder="请选择车辆" :disabled="chooseCar" @focus="allotDialogVisible = true; radioVal='-1'" style="display:inline-block; width:200px"></el-input>
    <!-- 分选择车辆弹出框 -->
    <el-dialog title="选择车辆" :visible.sync="allotDialogVisible" class="allotDialog" :close-on-click-modal="false">
      <el-row>
        <el-col :span="6" style="border: 1px solid #ccc; min-height: 400px; max-height: 600px; overflow: hidden">
          <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </el-col>
        <el-col :span="17" :offset="1">
          <div class="searchInput" style="overflow: hidden">
            车牌号: <el-input placeholder="请输入内容" v-model="queryList.vehicleNo" style="width: 200px;" size="small"></el-input>
              <el-button type="primary" size="small" @click="search">查询</el-button>
            <el-button type="primary"  size="small" style="float: right" @click="choose">确定</el-button>
          </div>
          <div>
            <el-table
            ref="multipleTable"
            :data="tableData"
            style="margin-top: 10px;width:100%"
            stripe
            border>
              <el-table-column
               width="40px">
                <template slot-scope="scope">
                  <el-radio v-model="radioVal" @change.native="getRow(scope.row)" :label="scope.row.id"></el-radio>
                </template>
              </el-table-column>
              <el-table-column
                label="车牌号"
                align="center"
                prop="vehicleNo">
              </el-table-column>
              <el-table-column
                prop="platformName"
                align="center"
                label="运营商平台">
              </el-table-column>
              <el-table-column
                prop="vehicleTypeName"
                align="center"
                label="车辆类型"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="vehicleMode"
                align="center"
                label="车型号"
                show-overflow-tooltip
                fixed="right">
              </el-table-column>
            </el-table>
          </div>
          <el-pagination background @current-change="handleCurrentChange" :current-page="queryList.page" :page-size="queryList.limit" layout="total, prev, pager, next" :total="total" style="margin-top: 20px">
          </el-pagination>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import { getPermsList } from '@/api/base/platform'
  import { getOwersTree } from '@/api/vehicle/choiceCar'
  import { fetchList } from '@/api/base/vehicle'
  import event from './eventBus'

  export default {
    data() {
      return {
        platformOptions: [],
        carValue: '',
        chooseCar: true,
        allotDialogVisible: false,
        data: [],
        radioVal: '-1',
        tableData: [],
        defaultProps: {
          children: 'children',
          label: 'text'
        },
        queryList: {
          page: 1,
          limit: 5,
          owersId: '',
          vehicleNo: '',
          platformId: ''
        },
        total: '',
        tmp: {}
      }
    },
    methods: {
      getRow(row) {
        this.tmp = row
      },
      handleNodeClick(val) {
        this.queryList.owersId = val.id
        this.getList()
      },
      handleCurrentChange(val) {
        this.queryList.page = val
        fetchList(this.queryList).then(res => {
          this.tableData = res.data.rows
          this.total = res.data.totalCount
        })
      },
      getList() {
        fetchList(this.queryList).then(res => {
          this.tableData = res.data.rows
          this.total = res.data.totalCount
        })
      },
      search() {
        this.getList()
      },
      choose() {
        if (this.radioVal === '-1') {
          this.$message({
            type: 'error',
            message: '请选择车辆'
          })
        } else {
          event.$emit('emitInfo', this.tmp)
          this.carValue = this.tmp.vehicleNo
          this.allotDialogVisible = false
        }
        console.log('选择的车辆车辆车辆车辆', this.tmp)
      }
    },
    mounted() {
      getPermsList().then(res => {
        this.platformOptions = res.data
      })
      // this.getList()
    },
    computed: {
      platformValue() {
        return this.queryList.platformId
      }
    },
    watch: {
      platformValue: {
        handler(val, oldVal) {
          if (val) {
            this.chooseCar = false
            this.getList()
            getOwersTree(val).then(res => {
              this.data = JSON.parse('[' + JSON.stringify(res.data) + ']')
            })
          } else {
            this.chooseCar = true
          }
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .bl {
  	height: 60px;
  	line-height: 60px;
  	padding: 0 20px;
    background: #E3ECFA;
    .m {
      margin-right: 5px;
    }
    .im {
      margin-right: 10px;
    }
  }
</style>
