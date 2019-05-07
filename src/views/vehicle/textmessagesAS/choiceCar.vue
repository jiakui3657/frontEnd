<template>
  <div class="bl">
    <span class="m">所属地区</span>
    <el-select v-model="queryCar.areaId" :loading="loading" @change="selectNextDept(1)" 
      @focus="selectNextDept(1)" placeholder="请选择" class="im">
      <el-option
        v-for="item in provinceList"
        :key="item.areaCode"
        :label="item.areaName"
        :value="item.areaCode">
      </el-option>
    </el-select>
    <span class="m">运营商平台</span>
    <el-select v-model="queryCar.platformId" :loading="loading" @change="selectNextDept(2)" 
      @focus="selectNextDept(2)" placeholder="请选择" class="im">
      <el-option
        v-for="item in platformList"
        :key="item.platformId"
        :label="item.platformName"
        :value="item.platformId">
      </el-option>
    </el-select>
    <span class="m">企业/业户</span>
    <el-select v-model="queryCar.owersId" :loading="loading"
      @focus="selectNextDept(3)" placeholder="请选择" :disabled="chooseCar" class="im">
      <el-option
        v-for="item in userList"
        :key="item.owersId"
        :label="item.owersName"
        :value="item.owersId">
      </el-option>
    </el-select>
    <!-- <span class="m">运营商平台</span>
    <el-select v-model="queryList.platformId" placeholder="请选择" class="im">
      <el-option
        v-for="item in platformOptions"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select> -->
    <span class="m">选择车辆</span>
    <el-input v-model="carValue" placeholder="请选择车辆" :disabled="chooseCar" @focus="selectNextDept(4)" style="display:inline-block; width:150px"></el-input>
    <el-button style="margin-left:10px;" icon="el-icon-refresh" @click="handleReset" type="primary" size="small">重置</el-button>
    <!-- 分选择车辆弹出框 -->
    <el-dialog title="选择车辆" :visible.sync="allotDialogVisible" class="allotDialog" :close-on-click-modal="false">
      <el-row>
        <!-- <el-col :span="6" style="border: 1px solid #ccc; min-height: 400px; max-height: 600px; overflow: hidden">
          <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </el-col> -->
        <el-col :span="22" :offset="1">
          <div class="searchInput" style="overflow: hidden">
            车牌号: <el-input placeholder="请输入内容" v-model="queryCar.plateNo" style="width: 200px;" size="small"></el-input>
              <el-button type="primary" size="small" @click="selectNextDept(4)">查询</el-button>
            <el-button type="primary"  size="small" style="float: right" @click="choose">确定</el-button>
          </div>
          <div>
            <el-table
            ref="multipleTable"
            :data="tableData"
            style="margin-top: 10px;width:100%"
            :header-cell-style="{ 'background-color': '#5F7ABF', 'color': '#fff' }"
            stripe
            v-loading="loading"
            border>
              <el-table-column
               width="30px">
                <template slot-scope="scope">
                  <!-- <el-radio v-model="radioVal" @change.native="getRow(scope.row)" :label="scope.row.id"></el-radio> -->
                  <el-radio v-model="radioVal" @change.native="getRow(scope.row)" :label="scope.row.id">&nbsp;</el-radio>
                </template>
              </el-table-column>
              <el-table-column
                label="车牌号"
                align="center"
                prop="vehicleNo"
                show-overflow-tooltip
                min-width="100px">
              </el-table-column>
              <el-table-column
                    prop="activeStatus"
                    align="center"
                    label="状态"
                    show-overflow-tooltip
                    min-width="50px">
                    <template slot-scope="scope">
                      <span v-if="scope.row.activeStatus === '在线'" style="color:#13CE66">{{ scope.row.activeStatus }}</span>
                      <span v-else>{{ scope.row.activeStatus }}</span>
                    </template>
              </el-table-column>
              <el-table-column
                    prop="platformName"
                    align="center"
                    label="运营商平台"
                    show-overflow-tooltip
                    min-width="120px">
              </el-table-column>
              <el-table-column
                    prop="owersName"
                    align="center"
                    label="企业/业户"
                    show-overflow-tooltip
                    min-width="120px">
               </el-table-column>
            </el-table>
          </div>
          <el-pagination small background @current-change="handleCurrentChange" :current-page="queryCar.page" :page-size="queryCar.limit" layout="total, prev, pager, next" :total="total" style="margin-top: 20px">
          </el-pagination>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import { getPermsList } from '@/api/base/platform'
  import { getOwersTree, getChildrenVehList } from '@/api/vehicle/choiceCar'
  import { fetchList } from '@/api/base/vehicle'
  import event from './eventBus'

  export default {
    props: {
      vehicleNo: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        platformOptions: [],
        provinceList: [],
        platformList: [],
        userList: [],
        loading: true,
        carValue: this.vehicleNo || '',
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
        queryCar: {
          plateNo: '',
          page: 1,
          limit: 5,
          type: 1,
          areaId: '',
          platformId: '',
          owersId: ''
        },
        chooseUser: true,
        total: '',
        tmp: {}
      }
    },
    methods: {
      selectNextDept(type) {
        this.queryCar.type = type
        if (this.queryCar.areaId || this.queryCar.platformId) {
          this.chooseCar = false
        } else {
          this.chooseCar = true
        }
        getChildrenVehList(this.queryCar).then(res => {
          this.loading = false
          if (type === 1) {
            this.provinceList = res.data
            // this.chooseCar = false
          } else if (type === 2) {
            this.platformList = res.data
            // this.chooseCar = false
          } else if (type === 3) {
            this.userList = res.data
          } else if (type === 4) {
            this.allotDialogVisible = true
            this.radioVal = '-1'
            res.data.rows.forEach(item => {
              if (item.activeStatus === 1) {
                item.activeStatus = '在线'
              } else if (item.activeStatus === 0) {
                item.activeStatus = '离线'
              }
            })
            this.tableData = res.data.rows
            this.total = res.data.totalCount
            this.loading = false
            if (this.tmp.id) {
              this.radioVal = this.tmp.id
            }
          }
        })
      },
      getRow(row) {
        this.tmp = row
      },
      handleNodeClick(val) {
        this.queryList.owersId = val.id
        this.selectNextDept(4)
      },
      handleCurrentChange(val) {
        this.queryCar.page = val
        this.selectNextDept(4)
      },
      handleReset() {
        this.queryCar = {
          plateNo: '',
          page: 1,
          limit: 5,
          type: 1,
          areaId: '',
          platformId: '',
          owersId: ''
        }
        this.chooseCar = true
        this.carValue = ''
        this.radioVal = '-1'
        this.tmp = {}
        event.$emit('emitInfo', '')
      },
      getList() {
        this.loading = true
        fetchList(this.queryList).then(res => {
          res.data.rows.forEach(item => {
            console.log(item.activeStatus)
            if (item.activeStatus === '1') {
              item.activeStatus = '在线'
            } else if (item.activeStatus === '0') {
              item.activeStatus = '离线'
            }
          })
          this.tableData = res.data.rows
          this.total = res.data.totalCount
          this.loading = false
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
          event.$emit('emitInfo', this.tmp.vehicleNo)
          this.carValue = this.tmp.vehicleNo
          this.allotDialogVisible = false
        }
      }
    },
    mounted() {
      getPermsList().then(res => {
        this.platformOptions = res.data
      })
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
      },
      vehicleNo(val) {
        this.carValue = val
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .bl {
  	// height: 60px;
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
<style>
  .el-dialog__headerbtn {
      position: absolute;
      top: 20px;
      right: 20px;
      padding: 0;
      background: 0 0;
      border: none;
      outline: 0;
      cursor: pointer;
      font-size: 16px;
  }
  .bl .el-dialog__header i {
      color: #fff;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active{
    background-color: #5F7ABF;
  }
  .bl .el-button--primary {
      color: #fff;
      background-color: #5F7ABF;
      border-color: #5F7ABF;
  }
  .bl .el-dialog__header span {
    color: #fff;
    font-size: 14px;
  }
  .bl .el-dialog__header {
    background-color: #5F7ABF;
    height: 50px;
    padding-top: 0px;
  }
</style>
