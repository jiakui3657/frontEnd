<template>
  <div class="j-bl">
    <span v-if="showArea">
      <span class="m">{{areaName}}</span>
      <el-select size="small" :loading="loading" clearable v-model="queryCar.areaId" 
        @change="selectOption(1,queryCar.areaId)" @focus="getChildrenVehListByType(1)" placeholder="请选择" class="im">
        <el-option
          v-for="item in areaList"
          :key="item.areaCode"
          :label="item.areaName"
          :value="item.areaCode">
        </el-option>
      </el-select>
    </span>
    <span class="m">运营商平台</span>
    <el-select size="small" :loading="loading" clearable v-model="queryCar.platformId" @change="selectOption(2,queryCar.platformId)"
      @focus="getChildrenVehListByType(2)" placeholder="请选择" class="im">
      <el-option
        v-for="item in platformList"
        :key="item.platformId"
        :label="item.platformName"
        :value="item.platformId">
      </el-option>
    </el-select>
    <span v-if="showOwers">
      <span class="m">企业/业户</span>
      <el-select :disabled="disabled" size="small" :loading="loading" clearable v-model="queryCar.owersId" @focus="getChildrenVehListByType(3)"
        @change="selectOption(3,queryCar.owersId)" placeholder="请选择" class="im">
        <el-option
          v-for="item in owersList"
          :key="item.owersId"
          :label="item.owersName"
          :value="item.owersId">
        </el-option>
      </el-select>
    </span>
    <span v-if="showCar">
      <span class="m" style="font-size:14px;font-weight: 700;color:#606266;padding:0 10px;">选择车辆</span>
      <el-input :disabled="disabled" size="small" v-model="carValue" placeholder="请选择车辆" @focus="showChooseCar" readonly style="display:inline-block; width:150px"></el-input>
    </span>
    <el-dialog title="选择车辆" :visible.sync="allotDialogVisible" class="allotDialog" :close-on-click-modal="false">
      <el-row>
        <el-col :span="23" :offset="1">
          <div class="searchInput" style="overflow: hidden">
            车牌号: <el-input placeholder="请输入内容" v-model="queryCar.plateNo" style="width: 200px;" size="small"></el-input>
              <el-button type="primary" size="small" @click="search">查询</el-button>
            <el-button type="primary" size="small" style="float:right;" @click="choose">确定</el-button>
          </div>
          <div>
            <el-table
            v-loading="loading"
            ref="multipleTable"
            :data="tableData"
            :header-cell-style="{ 'background-color': '#5F7ABF', 'color': '#fff' }"
            style="margin-top: 10px;width:100%"
            stripe
            border>
              <el-table-column
               width="30px">
                <template slot-scope="scope">
                  <el-radio v-model="radioVal" @change.native="getRow(scope.row)" :label="scope.row.id"></el-radio>
                </template>
              </el-table-column>
              <el-table-column
                label="车牌号"
                align="center"
                prop="vehicleNo"
                min-width="100px">
              </el-table-column>
              <el-table-column
                prop="activeStatus"
                align="center"
                label="状态"
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
                min-width="120px"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="owersName"
                align="center"
                label="企业/业户"
                min-width="120px"
                show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </div>
          <el-pagination small background @current-change="handleCurrentChange"  :current-page="queryCar.page" :page-size="queryCar.limit" layout="total, prev, pager, next" :total="total" style="margin-top: 20px">
          </el-pagination>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import { getChildrenVehList } from '@/api/vehicle/choiceCar'
  export default {
    props: {
      areaName: {
        type: String,
        default: '所属地区'
      },
      showArea: {
        type: Boolean,
        default: true
      },
      showOwers: {
        type: Boolean,
        default: true
      },
      showCar: {
        type: Boolean,
        default: true
      },
      carNo: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        platformList: [],
        areaList: [],
        owersList: [],
        queryCar: {
          page: 1,
          limit: 5,
          type: 1,
          areaId: '',
          platformId: '',
          owersId: '',
          plateNo: ''
        },
        loading: true,
        disabled: true,
        carValue: '',
        total: 0,
        allotDialogVisible: false,
        tableData: [],
        radioVal: '-1'
      }
    },
    watch: {
      'queryCar.platformId'(val) {
        this.carValue = ''
        this.queryCar.owersId = ''
        if (!val && !this.queryCar.areaId) {
          this.owersList = []
          this.disabled = true
        } else {
          this.disabled = false
        }
      },
      'queryCar.areaId'(val) {
        this.carValue = ''
        this.queryCar.owersId = ''
        if (!val && !this.queryCar.platformId) {
          this.owersList = []
          this.disabled = true
        } else {
          this.disabled = false
        }
      },
      'queryCar.owersId'(val) {
        this.carValue = ''
      },
      carValue(val) {
        if (!val) this.radioVal = '-1'
      },
      carNo(val) {
        if (val) this.carValue = val
      }
    },
    methods: {
      getChildrenVehListByType(type) {
        this.queryCar.type = type
        if (type === 3) {
          if (this.showArea) {
            if (!this.queryCar.platformId && !this.queryCar.areaId) {
              this.owersIdClick(this.queryCar.platformId, '请先选择平台或地区')
              return
            }
          } else {
            if (!this.queryCar.platformId) {
              this.owersIdClick(this.queryCar.platformId, '请先选择平台')
              return
            }
          }
        }
        getChildrenVehList(this.queryCar).then(res => {
          this.loading = false
          switch (type) {
            case 1:
              this.areaList = res.data
              break
            case 2:
              this.platformList = res.data
              break
            case 3:
              this.owersList = res.data
              break
            default:
              break
          }
        })
      },
      selectOption(type, id) {
        switch (type) {
          case 1:
            this.queryCar.areaId = id
            this.$emit('selectAreaId', id)
            break
          case 2:
            this.queryCar.platformId = id
            this.$emit('selectPlatformId', id)
            break
          case 3:
            this.queryCar.owersId = id
            this.$emit('selectOwersId', id)
            break
          default:
            break
        }
      },
      owersIdClick(id, msg) {
        if (!id || id === '') {
          this.$message({
            message: msg,
            type: 'info'
          })
        }
      },
      showChooseCar() {
        this.queryCar.type = 4
        if (!this.queryCar.platformId && !this.queryCar.areaId) {
          this.$message('请先选择平台或所属地区  ')
        } else {
          this.getList()
          this.allotDialogVisible = true
        }
      },
      search() {
        // this.tableData = []
        this.loading = true
        this.queryCar.page = 1
        this.getList()
      },
      handleCurrentChange(val) {
        this.queryCar.page = val
        this.getList()
      },
      getList() {
        this.queryCar.type = 4
        getChildrenVehList(this.queryCar).then(res => {
          this.loading = false
          res.data.rows.forEach(item => {
            if (item.activeStatus === 1) {
              item.activeStatus = '在线'
            } else {
              item.activeStatus = '离线'
            }
          })
          this.tableData = res.data.rows
          this.total = res.data.totalCount
        })
      },
      getRow(row) {
        // console.log(row.id)
        this.tmp = row
      },
      choose() {
        if (this.radioVal === '-1') {
          this.$message({
            type: 'error',
            message: '请选择车辆'
          })
        } else {
          // this.$emit('emitInfo', this.tmp)
          this.carValue = this.tmp.vehicleNo
          this.allotDialogVisible = false
          this.$emit('chooseCar', this.tmp)
        }
      },
      reset() {
        this.queryCar = {
          type: 1,
          areaId: '',
          platformId: '',
          owersId: '',
          page: 1,
          limit: 5,
          plateNo: ''
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .j-bl {
    // background: #E3ECFA;
    display: inline;
    color:#606266;
    .m {
      margin-right: 5px;
      font-size: 14px;
      font-weight: 700;
    }
    .im {
      margin-right: 10px;
    }
  }
</style>
