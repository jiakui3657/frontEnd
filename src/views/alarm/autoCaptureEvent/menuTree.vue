<template>
  <div class="app-container">
    <el-container>
            <el-header style="background: #fff; padding: 13px 10px 0 20px; border-radius: 5px; box-shadow: 0 0 10px #ccc">
              <el-row :gutter="20">
                  <el-col :span="3">
                    <el-form-item label="选择车辆">
            <el-input placeholder="请选择车辆" v-model.trim="listQuery.plateNo" style="width:100px;" size="small" readonly clearable></el-input>
          </el-form-item>
                    <!-- <span style="font-size: 14px">选择车辆</span>
                    <el-select v-model="value" placeholder="全部" style="display:inline-block;width:75px;">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.plateNo"
                          :value="item.plateNo">
                        </el-option>
                    </el-select> -->
                  </el-col>
                  <el-col :span="3"><span style="font-size: 14px">所属企业</span>
                  <el-select v-model="value" placeholder="全部" style="display:inline-block;width:75px;">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.deptName"
                          :value="item.deptName">
                        </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="3"><span style="font-size: 14px">车辆类型</span>
                  <el-select v-model="value" placeholder="全部" style="display:inline-block;width:75px;">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="3"><span style="font-size: 14px">抓拍对象</span>
                  <el-select v-model="value" placeholder="全部" style="display:inline-block;width:75px;">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="3"><span style="font-size: 14px">抓拍类型</span>
                  <el-select v-model="value" placeholder="全部" style="display:inline-block;width:75px;">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="5" style="width:22%"><span style="font-size: 14px">查询时间</span>
                    <div class="block" style="display:inline-block;width:142px;">
                          <el-date-picker
                            v-model="value2"
                            type="datetime"
                            placeholder="选择日期时间"
                            align="right"
                            :picker-options="pickerOptions1">
                          </el-date-picker>
                    </div>
                  </el-col>
                  <el-col :span="3" style="width:14.5%"><el-button type="primary" >查询</el-button><el-button type="warning" >重置</el-button></el-col>
              </el-row>
            </el-header>
             <el-table
              :data="tableData"
              border
              stripe
              show-header
              style="width: 100%;border-radius: 5px;margin:20px auto">
                <el-table-column
                  prop="date"
                  label="序号"
                  width="80"
                  >
                </el-table-column>
                <el-table-column
                  prop="plateNo"
                  label="车牌号"
                  width="150">
                </el-table-column>
                <el-table-column
                  prop="vehicleType"
                  label="车辆类型"
                   width="150"
                  >
                </el-table-column>
                <el-table-column
                  prop="deptName"
                  label="所属企业"
                  width="150">
                </el-table-column>
                <el-table-column
                  prop="createTime"
                  label="时间"
                  width="160">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="抓拍对象"
                   width="150">
                </el-table-column>
                 <el-table-column
                  prop="address"
                  label="照片"
                   width="150">
                </el-table-column>
                 <el-table-column
                  prop="address"
                  label="抓拍类型"
                   width="150">
                </el-table-column>
                 <el-table-column
                  prop="address"
                  label="参数"
                   width="150">
                </el-table-column>
            </el-table>
       </el-container>
      <el-footer>
         <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage2"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="100"
              layout="sizes, prev, pager, next"
              :total="10">
            </el-pagination>
           </div>
      </el-footer>
      <!-- <el-footer>
        <el-row>
            <el-col :span="4"><span>所有车辆</span><span>1</span></el-col>
            <el-col :span="4"><span>车辆上线</span></el-col>
            <el-col :span="4"><span>在线率</span></el-col>
            <el-col :span="4"><span>今日报警</span></el-col>
            <el-col :span="4"><span>今日处理</span></el-col>
            <el-col :span="4">
                      <el-switch
                            style="display: block"
                            v-model="close"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            active-text="报警声音"
                            >
                          </el-switch>
            </el-col>
         </el-row>
      </el-footer> -->
       <el-dialog
     title="选择车辆"
     :visible.sync="chooseDialogVisible"
     :close-on-click-modal='false'
     style="min-height: 400px;"
     width="70%">
      <el-row>
        <el-col :span="6">
          <el-tree :data="menus" @node-click="deptFilter" :props="defaultProps" default-expand-all :expand-on-click-node="false" style="background: #fff; height: 400px; overflow: auto"></el-tree>
        </el-col>
        <el-col :span="18" style="min-height: 400px; box-shadow: -5px 1px 5px #eee;">
          <div style="border-bottom: 1px solid #eee; padding: 10px 20px">
            <el-input size="small" placeholder="请输入车牌号" v-model.trim="carQuery.plateNo" class="input-with-select" style="width: 200px;">
              <el-button slot="append" icon="el-icon-search" @click="vnFilter"></el-button>
            </el-input>
          </div>
          <div style="padding: 10px 20px">
            <el-table
            ref="multipleTable"
            :data="carData"
            style="margin-top: 10px;width:100%"
            stripe
            v-loading="allotLoading"
            border>
              <el-table-column
                label="序号"
                width="50px"
                align="center"
                type="index">
              </el-table-column>
              <el-table-column
                label="车牌号"
                align="center"
                prop="plateNo">
              </el-table-column>
              <el-table-column
                prop="activeStatus"
                align="center"
                label="状态">
              </el-table-column>
              <el-table-column
                prop="driver"
                align="center"
                label="司机">
              </el-table-column>
              <el-table-column
                prop="deptName"
                align="center"
                label="所属企业">
              </el-table-column>
              <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="chooseCar(scope.row)">选择</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination background @current-change="handlePageChange" :current-page="carQuery.page" :page-size="carQuery.limit" layout="total, prev, pager, next" :total="chooseTotal" style="margin-top: 20px">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<style>
.el-date-editor.el-input, .el-date-editor.el-input__inner{
  width: 175px;
}
</style>

<script>
import { getData } from '@/api/alarm/autoCaptureEvent'
export default {
  name: 'autoCaptureEvent',
  data() {
    return {
      // 开关
      off: true,
      close: true,
      // 分页
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
      // 分页
      data: {
        pageSize: 10,
        pageNum: 1
      },
      navData: {},
      options: [{
        // deptName,//所属企业
        // // plateNo,//所选车辆
        // // deviceType,//车辆类型
        // // dataTime,//查询时间
      }],
      value: '',
      pickerOptions1: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      value1: '',
      value2: '',
      value3: '',
      value5: '',
      tableData: [{
        // date: '1',
        // name: '王小虎',
        // address: '上海市普陀区金沙江路 1518 弄'
      }]
    }
  },
  created() {
    //  console.log(this.data);
    this.getData(this.data)
  },
  methods: {
    getData(data) {
      getData(data).then(res => {
        // console.log(res.data.rows);
        this.options = res.data.rows
        this.tableData = res.data.rows
        console.log(this.tableData)
      })
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }

}
</script>
<style scope>
.app-container .el-table__header-wrapper table thead tr th{
  background-color: #4077BC;
    color: #fff;
}
</style>

