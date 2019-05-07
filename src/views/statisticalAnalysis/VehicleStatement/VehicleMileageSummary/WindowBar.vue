<template>
  <el-form-item label="选择车辆">
    <el-input placeholder="请选择车辆" style="width:100px;" size="small" readonly clearable @focus="dialogTableVisible = true"></el-input>
    <el-dialog class="dialog" title="选择车辆" :visible.sync="dialogTableVisible">
      <el-col :span="6">
          <el-tree :data="menus" @node-click="deptFilter" :props="defaultProps" default-expand-all :expand-on-click-node="false" style="background: #fff; height: 400px; overflow: auto"></el-tree>
      </el-col>
      <div class="clearfix">
        <div class="wrap">
          <div class="top clearfix">
            <div class="seach">
              <el-input placeholder="请输入车牌号" size="small" v-model="input10" class="input-with-select">
                <el-button
                  size="small"
                  class="veh-num-button"
                  slot="append" icon="el-icon-search"
                  style=" background: #5f7abf;color: #fff;">
                </el-button>
              </el-input>
            </div>
            <div class="opt-wrap">
              <el-form-item label="车辆类型" class="input-with-select">
                <el-select v-model="value" placeholder="全部" size="small" clearable  filterable>
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-button size="small" class="cancer-button">取消</el-button>
              </el-form-item>
            </div>
          </div>
          <div class="table-wrap">
            <el-table
              ref="multipleTable"
              :data="tableData3.slice((currentPage-1)*pagesize,currentPage*pagesize)"
              style="width: 100%;"
              :row-class-name="tableRowClassName"
              :header-cell-style="{ background: '#5f7abf', color: '#fff', fontWeight:100, textAlign: 'center'}"
              @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                label="序号"
                width="120">
                <template slot-scope="scope">{{ scope.row.date }}</template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="车牌号"
                width="120">
              </el-table-column>
              <el-table-column
                prop="address"
                label="车辆类型">
              </el-table-column>
              <el-table-column
                prop="address"
                label="所属机构">
              </el-table-column>
            </el-table>
            <el-pagination
              background
              small
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[2, 4, 6, 8]"
              :page-size="2"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableData3.length">
            </el-pagination>
          </div>
        </div>
      </div>
    </el-dialog>
  </el-form-item>
</template>

<script>
export default {
  name: 'WindowBar',
  data() {
    return {
      // dialog
      // 分页器
      input10: '',
      total: 4, // 默认数据总数
      pagesize: 2, // 每页的数据条数
      currentPage: 1, // 默认开始页面
      gridData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px',
      // 弹窗表格
      data2: [
        {
          id: 1,
          label: '一级 1',
          children: [
            {
              id: 4,
              label: '二级 1-1',
              children: [
                {
                  id: 9,
                  label: '三级 1-1-1'
                },
                {
                  id: 10,
                  label: '三级 1-1-2'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '一级 2',
          children: [
            {
              id: 5,
              label: '二级 2-1'
            },
            {
              id: 6,
              label: '二级 2-2'
            }
          ]
        },
        {
          id: 3,
          label: '一级 3',
          children: [
            {
              id: 7,
              label: '二级 3-1'
            },
            {
              id: 8,
              label: '二级 3-2'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tableData3: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      },
      {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      },
      {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      },
      {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      },
      {
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      },
      {
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      },
      {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      multipleSelection: [],
      // 下拉菜单
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      value: ''
    }
  },
  methods: {
    // 分页器
    // 监听每页显示数据条数
    handleSizeChange(val) {
      this.pagesize = val
      console.log(`每页 ${val} 条`)
    },
    // 监听切换页面数据变化
    handleCurrentChange(val) {
      this.currentPage = val
      console.log(`当前页: ${val}`)
    },
    // 隔行变色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1 || rowIndex === 3 || rowIndex === 5) {
        return 'warning-row'
      }
    },
    // 弹出窗表格
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style lang="scss">
  .dialog{
      .el-dialog{
        min-height: 400px;
        border-radius: 7px;
        width: 70%;
      }
      .el-tree{
        width: 27%;
        float: left;
        height: 400px;
        overflow: auto;
      }
      .wrap{
      // box-shadow: -10px 0px 0px #5f7abf ;
        float: left;
        width: 73%;
        .top{
          width: 100%;
          padding: 0 0 0 10px;
          margin-top: 20px;
          .seach{
            width: 30%;
            float: left;
            .veh-num-input{
              width: 76%;
              .el-input__inner{
                border-radius: 6px 0 0 6px;
              }
            }
            .veh-num-button{
              border-radius: 0 6px 6px 0;
              .el-icon-search{
              }
            }
          }
          .opt-wrap{
            width: 50%;
            float: right;
            .el-button{
              background-color: #5f7abf;
              color: #fff;
            }
            .el-form-item{
              width: 100%;
              .el-form-item__label{
                float: left;
              }
              .el-form-item__content{
                /*float: left;*/
                width: calc(100% - 70px);
                .el-select{
                  width: calc(60%);
                }
                .cancer-button{
                  width: 36%;
                }
              }
            }
          }

        }
        .table-wrap{
          padding: 0 0 0 10px;
          .el-table{
            margin: 20px 0;
            border: 1px solid #ccc;
            border-radius: 6px;
          }
        }
      }
      .el-table .warning-row {
        background: #f7f7f7;
      }
      .el-dialog__header{
        border-radius: 6px 6px 0 0;
        padding: 10px 20px;
        background: #5f7abf;
        .el-dialog__title{
          color: #fff;
          font-size: 16px;
          font-weight: 100;
        }
        .el-dialog__close{
          color: #fff;
          font-size: 22px;
          line-height: 16px;
        }
      }
      .el-dialog__body{
        padding-top: 10px;
      }
    }
</style>
