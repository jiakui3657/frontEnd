<template>
  <div class="tableBox">
    <el-table
      :header-cell-style="{ 'background-color': '#5F7ABF', 'color': '#fff' }"
      height="200"
      :data="showTableData"
      stripe
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        min-width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="dataTime"
        label="上报时间"
        align="center"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="longitude"
        label="经度"
        align="center"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="latitude"
        align="center"
        label="纬度"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="currentSpeed"
        align="center"
        label="车速"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="currentMileage"
        align="center"
        label="里程"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="address"
        align="center"
        label="位置"
        show-overflow-tooltip
        min-width="100">
      </el-table-column>
    </el-table>
     <!-- 分页区 -->
    <el-pagination class="pagination-plane" background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageParams.page"
      :page-sizes="[10,20,30, 50]"
      :page-size="pageParams.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageParams.total">
    </el-pagination>
  </div>
</template>

<script>
  import news from './news'
  export default {
    props: ['tableData', 'play'],
    data() {
      return {
        showTableData: [],
        lastLocation: {},
        pageParams: {
          page: 1,
          limit: 10,
          total: 0
        }
      }
    },
    mounted() {
      // console.log('1111111' + this.tableData)
      // news.$emit('sendData', this.tableData)
    },
    watch: {
      tableData(val) {
        // console.log('--------------watch tableData------------')
        console.log(val)
        if (val) {
          this.showTableData = []
          this.pageParams.total = val.length
          this.initTableList()
        } else {
          this.pageParams.page = 0
          this.pageParams.total = 0
          this.showTableData = []
        }
        news.$emit('sendData', val)
      }
    },
    methods: {
      handleSizeChange(val) {
        console.log('handleSizeChange')
        this.pageParams.limit = val
        this.initTableList()
      },
      handleCurrentChange(v) {
        console.log('handleCurrentChange')
        this.pageParams.page = v
        this.initTableList()
      },
      initTableList() {
        if (this.pageParams.total > 0) {
          const self = this
          this.showTableData = []
          const startNum = (this.pageParams.page - 1) * this.pageParams.limit
          let endNum = (startNum + this.pageParams.limit)
          if (endNum > this.pageParams.total) {
            endNum = this.pageParams.total
          }
          for (let i = startNum; i < endNum; i++) {
            const itemJ = this.tableData[i]
            const key = itemJ.currentSpeed + '_' + itemJ.currentMileage
            new window.BMap.Geocoder().getLocation(new window.BMap.Point(itemJ.longitude, itemJ.latitude), function(rs) {
              const addComp = rs.addressComponents
              itemJ.address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber
              if (self.lastLocation.length > 20) {
                self.lastLocation = []
              }
              self.lastLocation[key] = itemJ.address
              self.tableData[i] = itemJ
            })
            this.showTableData.push(this.tableData[i])
          }
          console.log(this.showTableData)
        }
      }
    }
  }
</script>

<style>
  .el-pagination.is-background .el-pager li:not(.disabled).active {
      background-color: #5F7ABF;
      color: #fff;
  }
  .el-pagination {
      white-space: nowrap;
      padding: 2px 5px;
      color: #303133;
      font-weight: 700;
      background-color: #fff;
  }
  .tableBox {
    width:100%;
    height:200px;
    position: absolute;
    bottom: 30px;
    left: 0;
  }
  .tableBox .el-table--medium td, .el-table--medium th {
  	padding: 4px 0;
  }
  .el-table .cell{
    padding-left: 5px!important;
  }
  .tableBox .el-table__body{
    position: absolute;
    top: 0;
  }
</style>
