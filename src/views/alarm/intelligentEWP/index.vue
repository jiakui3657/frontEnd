<template>
  <div class="app-container">
    <el-container>
      <el-header style="height:30px;">
        <el-row :gutter="5">
          <el-col :span="3" style="font-size:12px;">
            <span>处理情况</span>
            <el-select v-model="listQuery.handleSituation" placeholder="请选择" style="width:90px;" size="small">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
          <el-col :span="7" style="font-size:12px;">
            <span>预警类型</span>
            <el-popover placement="bottom" width="250">
              <menu-tree :treeMenuData="menus" :treeMenuProp="defaultProps" :checkedKeys="defaultChecked"></menu-tree>
              <el-input slot="reference" placeholder="预警类型" v-model="listQuery.warningTypes" style="width:150px;" size="small"></el-input>
            </el-popover>
            <span>已选择{{count}}种</span>
            <el-button @click="batchProcess" type="primary" size="mini" plain style="margin-left:10px;">批量处理</el-button>
          </el-col>
          <el-col :span="3" style="font-size:12px;">
            <span>选择车辆</span>
            <el-input placeholder="选择车辆" v-model="listQuery.vehicle" style="width:100px;" size="small"></el-input>
          </el-col>
          <el-col :span="7" style="font-size:12px;">
            <span>查询时间</span>
            <el-date-picker v-model="listQuery.startDate" type="date" placeholder="开始时间" style="width:150px;" size="small"></el-date-picker>
            - 
            <el-date-picker v-model="listQuery.endDate" type="date" placeholder="结束时间" style="width:150px;" size="small"></el-date-picker>
          </el-col>
          <el-col :span="4">
            <el-select v-model="listQuery.timeZone" placeholder="自定义" style="width:120px;" size="small">
              <el-option v-for="item in timeZones" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button @click="handleQuery" type="primary" size="mini" plain style="margin-left:10px;">查询</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-table :data="data" :columns="columns" v-loading.body="listLoading" border stripe highlight-current-row style="width:100%;" @selection-change="handleSelect">
          <el-table-column align="center" type="selection" width="40" @selection-change="handleSelect"></el-table-column>
          
          <el-table-column align="center" v-for="column in columns" :key="column.key" :label="column.title" :width="column.width">
            <template slot-scope="scope">
              <el-button v-if="column.key === 'type'" type="text" @click="handleDetail(scope.row)">{{scope.row[column.key]}}</el-button>
              <span v-else>{{scope.row[column.key]}}</span>
            </template>
          </el-table-column>

        </el-table>
      </el-main>
      <el-footer>
        <!-- 分页区 -->
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
          :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-footer>

    </el-container>
    <!-- 批量处理对话框 -->
    <el-dialog title="批量处理" :visible.sync="batchDialog">
      <el-tabs v-model="activeIndex">
        <el-tab-pane label="人工批量处理" name="1">
          <el-form>
            <el-form-item label="处理方式" style="margin-bottom:0">
              <el-radio-group v-model="radio">
                <el-row>
                  <el-radio :label="3">电话通知</el-radio>
                  <el-radio :label="6" style="margin-left:50px;">建议停车</el-radio>
                  <el-radio :label="9" style="margin-left:50px;">警告提醒</el-radio>
                </el-row>
                <el-row>
                  <el-radio :label="13">停车休息</el-radio>
                  <el-radio :label="16" style="margin-left:50px;">语音下发</el-radio>
                  <el-radio :label="19" style="margin-left:50px;">其他</el-radio>
                </el-row>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="处理描述">
              <el-input type="textarea" :rows="5" placeholder="请输入处理描述信息" v-model="textarea"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="消息批量下发" name="2">
          <el-form style="padding-bottom:0">
            <el-form-item label="设备">
              <el-select v-model="listQuery.timeZone" placeholder="自定义" style="width:60%">
                <el-option v-for="item in timeZones" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="listQuery.timeZone" placeholder="选择消息模板" style="width:100%">
                <el-option v-for="item in timeZones" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <el-input type="textarea" :rows="5" placeholder="请输入下发消息" v-model="textarea"></el-input>
            </el-form-item>
            <el-form-item label="标志" style="margin:0 30px 0 0">
              <el-checkbox-group v-model="checkedCities">
                <el-checkbox label="紧急" style="margin-left:30px;"></el-checkbox>
                <el-checkbox label="终端显示器显示" disabled></el-checkbox>
                <el-checkbox label="TTS播读"></el-checkbox>
                <el-checkbox label="广告屏显示" disabled></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="batchDialog = false">取 消</el-button>
        <el-button type="primary" @click="batchDialog = false">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 预警处理dialog -->
    <el-dialog :visible.sync="warningProcessDialog">
      <el-row slot="title">
        <el-col :span="6">闽CYH300</el-col>
        <el-col :span="13" align="center">车道偏移</el-col>
      </el-row>
      <el-tabs stretch type="card" v-model="option">
        <el-tab-pane name="1">
          <span slot="label"><i class="el-icon-date"></i> 监控信息</span>
          监控信息
        </el-tab-pane>
        <el-tab-pane name="2">
          <span slot="label"><i class="el-icon-date"></i> 图片抓拍</span>
          图片抓拍
        </el-tab-pane>
        <el-tab-pane name="3">
          <span slot="label"><i class="el-icon-date"></i> 文本下发</span>
          文本下发
        </el-tab-pane>
        <el-tab-pane name="4">
          <span slot="label"><i class="el-icon-date"></i> 三电数据</span>
          三电数据
        </el-tab-pane>
        <el-tab-pane name="5">
          <span slot="label"><i class="el-icon-date"></i> 外设数据</span>
          外设数据
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="warningProcessDialog = false">取 消</el-button>
        <el-button type="primary" @click="warningProcessDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// @Author: outman_qiaopeng  Date: 2018-09-12 14:37:32
import { fetchList } from '@/api/alarm/intelligentEWP'
import menuTree from '@/components/MenuTree'
import { fetchMenuTree } from '@/api/infomationM/menu'

export default {
  name: 'intelligentEWP',
  components: { menuTree },
  data() {
    return {
      total: 0,
      listLoading: false,
      batchDialog: false,
      warningProcessDialog: false,
      activeIndex: '1',
      option: '1',
      radio: '',
      textarea: '',
      checkedCities: ['紧急', 'TTS播读'],
      selectRows: [], // 选中的行数据
      count: 2,
      options: [
        {
          label: '未处理',
          value: '1'
        },
        {
          label: '已处理',
          value: '0'
        }
      ],
      timeZones: [
        {
          label: '最近3天',
          value: '1'
        },
        {
          label: '最近7天',
          value: '2'
        },
        {
          label: '近一个月',
          value: '3'
        }
      ],
      data: [
        {
          orderNum: '',
          vehicleNum: '',
          line: '',
          driver: '',
          phoneNum: '1111111111111',
          type: '哈哈哈哈',
          time: '',
          address: ''
        }
      ],
      columns: [
        {
          key: 'orderNum',
          title: '序号',
          width: '60'
        },
        {
          key: 'vehicleNum',
          title: '车牌号',
          width: '100'
        },
        {
          key: 'line',
          title: '线路',
          width: '80'
        },
        {
          key: 'driver',
          title: '司机',
          width: '100'
        },
        {
          key: 'phoneNum',
          title: '联系电话',
          width: '140'
        },
        {
          key: 'type',
          title: '预警类型',
          width: '200'
        },
        {
          key: 'time',
          title: '预警时间',
          width: '200'
        },
        {
          key: 'address',
          title: '预警位置'
        }
      ],
      listQuery: {
        page: 1,
        limit: 10,
        handleSituation: '0',
        warningTypes: '',
        vehicle: '',
        startDate: '',
        endDate: '',
        timeZone: ''
      },
      defaultChecked: [],
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      menus: []
    }
  },
  created() {
    this.getMenuTree()
    // this.getList()
  },
  methods: {
    getMenuTree() {
      fetchMenuTree().then(response => {
        this.menus = response.data.children
        const tmp = response.data.children
        for (let i = 0; i < tmp.length; i++) {
          this.defaultChecked.push(tmp[i].id)
        }
      })
    },
    getList() { // 分页获取智能预警列表
      fetchList(this.listQuery).then(response => {
        this.data = response.data
        this.total = response.data
      })
    },
    handleSelect(val) { // 选择处理事件
      this.selectRows = val
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleQuery() {
      this.listQuery.page = 1
      this.listQuery.limit = 10
      this.getList()
    },
    batchProcess() { // 批量处理按钮
      this.batchDialog = true
    },
    handleDetail(row) { // 预警详情
      this.warningProcessDialog = true
    }
  }
}
</script>

<style>
  .canClick {
    color: #488aff
  }
  .el-popover {
    height: 300px;
    overflow-y: scroll;
  }
  .el-radio-group {
    margin: 36px 0 0 50px;
  }
  .el-dialog__body {
    padding: 5px 20px;
  }
</style>

