<template>
  <div class="app-container">
    <el-container>
      <el-form ref="form" label-width="90px" inline style="background: #fff; margin: 0 20px; padding: 20px 10px 0 20px; border-radius: 5px; box-shadow: 0 0 10px #ccc">
        <el-form-item label="平台名称">
          <el-input maxlength="20" placeholder="平台名称" v-model.trim="listQuery.name" style="width:150px;" size="small"></el-input>
        </el-form-item>
        <!--<el-form-item label="接入地区">-->
          <!--<el-input maxlength="20" placeholder="接入地区" v-model.trim="listQuery.areaName" style="width:150px;" size="small"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="创建时间段">
          <el-date-picker :clearable="canClear" :editable="false" size="small" style="width: 250px" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="startEnd" type="daterange" range-separator="——" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button icon="el-icon-search" @click="handleQuery" type="primary" size="small">查询</el-button>
          <el-button icon="el-icon-refresh" @click="handleReset" type="primary" size="small">重置</el-button>
          <el-button icon="el-icon-plus" @click="handleCreate" type="primary" size="small">新增</el-button>
          <!-- <el-button icon="el-icon-download" @click="handleExport" type="primary" size="small">导出</el-button> -->
        </el-form-item>
      </el-form>
      <el-main>
        <el-table :data="data" :columns="columns" v-loading.body="listLoading" border stripe highlight-current-row style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc" :header-cell-style="{ 'background-color': '#5F7ABF', 'color': '#fff', border: 'none !important' }">

          <el-table-column align="center" type="index" label="序号" fixed="left" width="60px"></el-table-column>

          <el-table-column align="center" v-for="column in columns" :key="column.key" :label="column.title" :width="column.width">
            <template slot-scope="scope">
              <span v-if="column.key === 'masterStatusName'" :style=scope.row.masterColor>{{scope.row[column.key]}}</span>
              <span v-else-if="column.key === 'slaveStatusName'" :style=scope.row.slaveColor>{{scope.row[column.key]}}</span>
              <span v-else>{{scope.row[column.key]}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作" fixed="right" min-width="400px">
            <template slot-scope="scope">

              <el-button icon="el-icon-edit" size="mini" type="primary" @click="handleUpdate(scope.row)">
                编辑
              </el-button>
              <el-button icon="el-icon-delete" size="mini" type="danger" @click="handleDelete(scope.row)">
                删除
              </el-button>
              <el-button  size="mini" type="primary" @click="handleSubmit(scope.row)" :disabled="JSON.stringify(scope.row.masterStatusName) == JSON.stringify('连接') ? (JSON.stringify(scope.row.slaveStatusName) == JSON.stringify('连接') ? true : false) : true">
                链路登录
              </el-button>
              <el-button  size="mini" type="danger" @click="handleDistroy(scope.row)" :disabled="JSON.stringify(scope.row.masterStatusName) == JSON.stringify('连接') ? (JSON.stringify(scope.row.slaveStatusName) == JSON.stringify('断开') ? true : false) : true">
                链路注销
              </el-button>
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
    <!-- 运营商平台dialog -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="addEquipmentDialog"  :close-on-click-modal="false">
      <el-form :model="form" :rules="rules" ref="addForm" label-position="left">
        <el-row class="create_dialog_row">
          <el-col :span="23">
            <el-form-item label="平台名称" prop="name">
              <el-input maxlength="20" placeholder="输入平台名称" v-model="form.name" style="width:84%"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="1">
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="11">
            <el-form-item label="加密参数" prop="encryptParam">
              <el-input maxlength="20" placeholder="加密参数" v-model.trim="form.encryptParam" style="width:70%"></el-input>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row class="create_dialog_row">
          <el-col :span="11">
            <el-form-item label="视频是否转码" prop="transcodingFlag" style="width:90%;">
              <el-radio v-model="form.transcodingFlag" label="0">需要</el-radio>
              <el-radio v-model="form.transcodingFlag" label="1">不需要</el-radio>
            </el-form-item>
            <el-form-item label="是否加密" prop="isEncrypt" style="width:90%;">
              <el-radio @change="selectEncrypt" v-model="form.isEncrypt" label="1">加密</el-radio>
              <el-radio @change="selectNotEncrypt" v-model="form.isEncrypt" label="0">不加密</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="11" class="encrypt">
            <el-form-item label="M1" prop="m1">
              <el-input :disabled="isEncryptType" placeholder="加密参数M1(数值型)" maxlength="20" v-model.trim="form.m1" style="width:70%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="create_dialog_row">
          <el-col :span="11">
            <el-form-item label="IA1" prop="ia1" class="encrypt">
              <el-input :disabled="isEncryptType" placeholder="加密参数IA1(数值型)" maxlength="20" v-model.trim="form.ia1" style="width:70%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="11">
            <el-form-item label="IC1" prop="ic1" class="encrypt">
              <el-input :disabled="isEncryptType" placeholder="加密参数IC1(数值型)" maxlength="20" v-model.trim="form.ic1" style="width:70%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="create_dialog_row">
          <el-col :span="11">
            <el-form-item label="接入码" prop="accessCode">
              <el-input maxlength="20" placeholder="接入码" disabled v-model.trim="form.accessCode" style="width:70%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="11">
            <el-form-item label="平台编码" prop="platformCode">
              <el-input maxlength="20" placeholder="平台编码" disabled v-model.trim="form.platformCode" style="width:70%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="create_dialog_row">
          <el-col :span="11">
            <el-form-item label="接入用户" prop="account">
              <el-input maxlength="20" placeholder="接入用户名" v-model.trim="form.account" style="width:70%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="11">
            <el-form-item label="接入密码" prop="password">
              <el-input maxlength="20"  :type="pwdType" placeholder="接入密码" v-model.trim="form.password" style="width:70%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="create_dialog_row">
          <el-col :span="11">
            <el-form-item label="从链路IP" prop="slaveIp">
              <el-input maxlength="20" placeholder="从链路IP" v-model.trim="form.slaveIp" style="width:70%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="11">
            <el-form-item label="从链路端口" prop="slavePort" class="encrypt1">
              <el-input maxlength="10" placeholder="从链路端口" v-model.trim="form.slavePort" style="width:70%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!--<el-row class="create_dialog_row">-->
        <!--<el-col :span="23">-->
        <!--<el-form-item label="接入地区" prop="area" style="text-align: left;margin:10px 0 0 10px;">-->
        <!--<el-select v-if="dialogStatus === 'create'" @change="selectProvince(province)" v-model="province" placeholder="省" size="small" disabled>-->
        <!--<el-option v-for="item in provinceList"  :key="item.id" :label="item.name" :value="item.id" >-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--<el-select v-if="dialogStatus === 'create'" @change="selectCity(form.area)" v-model="form.area" placeholder="市"  size="small">-->
        <!--<el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.id"></el-option>-->
        <!--</el-select>-->
        <!--&lt;!&ndash;<el-select v-if="dialogStatus === 'create'" v-model="form.area" placeholder="区" style="width:28%" size="small">&ndash;&gt;-->
        <!--&lt;!&ndash;<el-option v-for="item in areaList" :key="item.id" :label="item.name" :value="item.id"></el-option>&ndash;&gt;-->
        <!--&lt;!&ndash;</el-select>&ndash;&gt;-->
        <!--<el-input style="width:84%" disabled v-if="dialogStatus === 'update'" maxlength="50" v-model.trim="form.nationalityName"></el-input>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--</el-row>-->
        <el-row>
        <el-col :span="23">
          <el-form-item label="所属区域" prop="area" class="deptTreeInput" label-width="80px">
            <!--<el-input placeholder="前选择所属区域" v-model="inputText" disabled style="width: 100%"></el-input>-->
            <!--<el-button icon="el-icon-search" style="float: left; width: 15%" @click="showAreaTree(vId, vPath)"></el-button>-->
            <!--<div v-show="areaTreeShow" style="position: absolute;top:36px;left:0;width:100%;border:1px solid #ccc;z-index: 9;box-sizing: border-box;">-->
            <div v-show="areaTreeShow">
              <el-tree :data="treeData" :check-strictly="true" default-expand-all
                       show-checkbox=""  node-key="id" ref="tree" highlight-current
                       :props="defaultProps"
                       @check="getCurrentKey"
                       class="el-tree-max"
                       style="min-height: 100px; max-height: 200px; margin-top:5px; overflow: auto">
              </el-tree>
            </div>
          </el-form-item>
        </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer" style="text-align:right">
        <el-button type="primary" @click="addEquipmentDialog = false">取 消</el-button>
        <el-button :disabled="isDisable" v-if="dialogStatus === 'create'" type="primary" @click="confirmCreate('addForm')">确 定</el-button>
        <el-button v-else @click="confirmUpdate('addForm')" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  // @Author: outman_qiaopeng  Date: 2018-09-17 14:14:13
  import { fetchList, deletePlatform, createPlatform, updatePlatform, detailPlatform, getOnlyNum } from '@/api/base/platform'
  import { getPermsList } from '@/api/base/platform'
  import { getAreaList, getAreaTree } from '@/api/base/area'
  import { parseTime } from '@/utils'
  import { validateIpAdr, validatePort } from '@/utils/validate'
  import { randomstring } from '@/utils/createRandomString'
  import { getToken } from '@/utils/auth' // 发送报文
  export default {
    name: 'platform',
    data() {
      return {
        inputText: '',
        inputArr: [],
        checkedArr: [],
        vId: -2,
        vPath: 'organTree:0-0:',
        treeData: null,
        areaTreeShow: false,
        websocket: null,
        isDisable: false,
        controls: false,
        total: 0,
        listLoading: false,
        addEquipmentDialog: false,
        useFlagList: [],
        isEncryptType: true,
        startEnd: [],
        platformList: [],
        province: 610000,
        city: '',
        provinceList: [],
        provincesString: null,
        cityList: [],
        areaList: [],
        areaListDialog: [],
        data: [],
        canClear: false,
        dialogStatus: '',
        textMap: {
          update: '变更运营商平台',
          create: '新增运营商平台'
        },
        columns: [
          {
            key: 'name',
            title: '平台名称',
            width: '200'
          },
          {
            key: 'accessCode',
            title: '接入码',
            width: '120'
          },
          {
            key: 'platformCode',
            title: '平台编码',
            width: '120'
          },
          {
            key: 'account',
            title: '接入用户名',
            width: '100'
          },
          {
            key: 'masterStatusName',
            title: '主链路状态',
            width: '100'
          },
          {
            key: 'slaveStatusName',
            title: '从链路状态',
            width: '100'
          },
          {
            key: 'slaveIp',
            title: '从链路IP',
            width: '120'
          },
          {
            key: 'slavePort',
            title: '从链路端口',
            width: '100'
          },
          {
            key: 'createTime',
            title: '创建时间',
            width: '200'
          }
        ],
        listQuery: {
          page: 1,
          limit: 10,
          platformId: '',
          areaName: '',
          beginDate: '',
          endDate: '',
          name: ''
        },
        pwdType: 'text',
        form: {},
        rules: {
          name: [{ required: true, message: '必填项', trigger: 'blur' }],
          area: [{ required: true, message: '必填项', trigger: 'change' }],
          accessCode: [{ required: true, message: '必填项', trigger: 'blur' }],
          account: [{ required: true, message: '必填项', trigger: 'blur' }],
          platformCode: [{ required: true, message: '必填项', trigger: 'blur' }],
          password: [{ required: true, message: '必填项', trigger: 'blur' }],
          slaveIp: [{ required: true, message: '必填项', trigger: 'blur' }],
          slavePort: [{ required: true, message: '必填项', trigger: 'blur' }],
          isEncrypt: [{ required: true, message: '必填项', trigger: 'blur' }],
          transcodingFlag: [{ required: true, message: '必填项', trigger: 'blur' }],
          masterStatusName: [{ required: true, message: '必填项', trigger: 'blur' }],
          slaveStatusName: [{ required: true, message: '必填项', trigger: 'blur' }]
        },
        isNum: /^[0-9]*$/,
        defaultProps: {
          children: 'children',
          label: 'text',
          isLeaf: 'isLeaf'
        }
      }
    },
    mounted() {
      this.getList()
      this.getPlatformList()
    },
    created() {
      this.getArea()
      this.selectProvince(this.province)
      this.initWebSocket()
    },
    watch: {
      startEnd: {
        handler(val, oldVal) {
          if (val) {
            this.listQuery.beginDate = val[0]
            this.listQuery.endDate = val[1]
          }
        },
        deep: true
      }
    },
    methods: {
      getCurrentKey(data, node) { // 获取当前选中节点的key
        console.log('================================' + JSON.stringify(data))
        // const id = data.id
        this.checkedList = node.checkedKeys
        this.checkedArr = this.checkedList
        if (this.checkedList.indexOf(data.id) > -1) {
          this.inputArr.push(data.text)
          // this.forminputArr.push(data.text)
        } else {
          // this.inputArr.remove(data.text)
          var index = this.inputArr.indexOf(data.text)
          // var indexf = this.forminputArr.indexOf(data.text)
          if (index > -1) {
            this.inputArr.splice(index, 1)
          }
          // if (indexf > -1) {
          //   this.forminputArr.splice(indexf, 1)
          // }
        }
        this.inputText = JSON.stringify(this.inputArr).replace('[', '').replace(']', '').replace(/"/g, '')
        // this.inputText = JSON.stringify(this.forminputArr).replace('[', '').replace(']', '').replace(/"/g, '')
        console.log(JSON.stringify('数据' + JSON.stringify(data.text)))
        console.log(JSON.stringify(this.checkedArr))
        // console.log('选择节点key' + JSON.stringify(node.checkedNodes.id))
      },
      removeCurrentKey() { // 清除当前选中节点的key
        if (this.checkedArr.length !== 0) {
          this.$refs.tree.setCheckedKeys([])
        }
      },
      // setCheckedKeys() {
      //   for (var i = 0; i < this.eventnodeArr.length; i++) {
      //     this.eventArr.push(this.eventnodeArr[i])
      //   }
      // },
      loadDeptNode(node, resolve) {
        if (node.data === null) {
          return
        }
        if (node.level === 0) {
          return
        }
        // console.log('node====?????===' + JSON.stringify(node.data))
        getAreaTree(node.data.id, this.vPath).then(res => {
          const childrenData = res.data
          if (childrenData.length === 0) {
            node.isLeaf = true // 叶子
            resolve([])
            return
          }
          resolve(childrenData)
        })
      },
      showAreaTree() {
        this.areaTreeShow = true
        getAreaTree().then(res => {
          this.treeData = [].concat(res.data)
        })
      },
      // showAreaTree(id, nodePath) { //异步树加载方法
      //   this.areaTreeShow = true
      //   getAreaTree(id, nodePath).then(res => {
      //     // console.log('机构树------' + JSON.stringify(res))
      //     res.data[0].disabled = true
      //     this.treeData = res.data
      //     // console.log('数组树------' + JSON.stringify(this.treeData))
      //   })
      //   // this.vId = this.vId + 1
      // },
      // 链路登录
      handleSubmit(scope) {
        var platformCode = scope.platformCode
        // 发送websocket
        const data = {
          Command: '75',
          CommandType: 'Business',
          token: getToken('Admin-Token'),
          Body: {
            data: {
              'platformCode': platformCode
            }
          }
        }
        if (this.websocket.readyState === 1) {
          // console.log('登录')
          // console.log(data)
          this.websocket.send(JSON.stringify(data))
          // this.$message.success('登录成功!')
        } else {
          this.$message.error('登录失败，请稍候重试!')
        }
      },
      // 链路注销
      handleDistroy(scope) {
        var platformCode = scope.platformCode
        // 发送websocket
        const data = {
          Command: '55',
          CommandType: 'Business',
          token: getToken('Admin-Token'),
          Body: {
            data: {
              'platformCode': platformCode
            }
          }
        }
        if (this.websocket.readyState === 1) {
          this.websocket.send(JSON.stringify(data))
        } else {
          this.$message.error('注销失败，请稍候重试!')
        }
      },
      initWebSocket() {
        const vm = this
        vm.websocket = new WebSocket(process.env.WEBSOCKET_API)
        vm.websocket.onopen = function() {
          // vm.$message.success('websocket连接成功')
        }
        vm.websocket.onmessage = function(evt) {
          vm.getList()
        }
        vm.websocket.onerror = function() {
          // vm.$message.error('websocket连接失败，正在尝试重新连接。。。')
          vm.initWebSocket()
        }
      },
      selectEncrypt(val) {
        this.isEncryptType = false
      },
      selectNotEncrypt(val) {
        this.isEncryptType = true
        this.form.m1 = ''
        this.form.ia1 = ''
        this.form.ic1 = ''
      },
      getPlatformList() { // 获取运营商平台列表
        getPermsList().then(response => {
          this.platformList = response.data
        })
      },
      getArea() {
        getAreaList(-1).then(response => {
          this.provinceList = response.data
        })
      },
      selectProvince(province) {
        getAreaList(province).then(response => {
          this.cityList = response.data
        })
      },
      selectCity(city) {
        console.log('======>city:' + city)
        getAreaList(city).then(response => {
          this.areaList = response.data
        })
      },
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          response.data.rows.forEach(item => {
            if (item.masterStatus === '2') {
              item.masterColor = 'color: red'
            } else if (item.masterStatus === '1') {
              item.masterColor = 'color: green'
            }
            if (item.slaveStatus === '2') {
              item.slaveColor = 'color: red'
            } else if (item.slaveStatus === '1') {
              item.slaveColor = 'color: green'
            }
          })
          this.data = response.data.rows
          this.total = response.data.totalCount
          console.log(this.data)
          this.listLoading = false
        })
      },
      handleQuery() { // 头部查询方法
        this.listQuery.page = 1
        this.getList()
      },
      handleReset() {
        this.listQuery.platformId = ''
        this.listQuery.areaName = ''
        this.listQuery.beginDate = ''
        this.listQuery.endDate = ''
        this.listQuery.name = ''
        this.startEnd = []
        // this.handleQuery()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      // 重置表单
      resetForm() {
        this.form = {
          name: '',
          area: '',
          platformCode: '',
          accessCode: '',
          account: '',
          password: '',
          slaveIp: '',
          slavePort: '',
          transcodingFlag: '',
          isEncrypt: '',
          m1: '',
          ia1: '',
          ic1: '',
          masterStatusName: '',
          slaveStatusName: ''
        }
      },
      handleCreate() { // 头部新增
        this.resetForm()
        this.dialogStatus = 'create'
        this.isEncryptType = true
        this.province = 610000
        this.city = ''
        this.addEquipmentDialog = true
        this.pwdType = 'text'
        this.$nextTick(() => {
          this.$refs['addForm'].clearValidate()
        })
        this.areaListDialog = this.areaList
        this.getOnlyNumber()
        // this.showAreaTree(this.vId, this.vPath)
        this.showAreaTree()
        this.removeCurrentKey()
        this.eventArr = []
        this.inputArr = []
      },
      getOnlyNumber() {
        getOnlyNum().then(response => {
          this.form.platformCode = response.data.number
          this.form.accessCode = response.data.number
          this.form.account = response.data.number
          this.form.password = randomstring(10)
        })
      },
      confirmCreate(formName) {
        if (this.checkedArr.length < 1) {
          // alert('至少选择一个')
          this.$message({
            message: '至少选择一个',
            type: 'error'
          })
          return
        }
        // alert(JSON.stringify(this.checkedArr))
        this.form.area = this.checkedArr.toString().replace('[').replace(']')
        this.isDisable = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (!validateIpAdr(this.form.slaveIp)) {
              this.$message({
                message: '请输入合法ip地址',
                type: 'error'
              })
              this.isDisable = false
              return
            }
            if (!validatePort(this.form.slavePort)) {
              this.$message({
                message: '请输入合法端口',
                type: 'error'
              })
              this.isDisable = false
              return
            }
            if (this.form.isEncrypt === '1') {
              if (!this.form.m1 || !this.form.ia1 || !this.form.ic1) {
                this.$message({
                  message: '加密状态为加密时，请输入加密参数m1、ia1、ic1',
                  type: 'error'
                })
                this.isDisable = false
                return
              }
              if (!this.isNum.test(this.form.m1) || !this.isNum.test(this.form.ia1) || !this.isNum.test(this.form.ic1)) {
                this.$message({
                  message: '加密参数m1、ia1、ic1必须为数值型',
                  type: 'error'
                })
                this.isDisable = false
                return
              }
            }
            this.listLoading = true
            setTimeout(() => {
              this.isDisable = false
            }, 2000)
            console.log('======>' + JSON.stringify(this.form))
            createPlatform(this.form).then(response => {
              this.listLoading = false
              this.isDisable = false
              if (response.code === 0) {
                this.getList()
                this.addEquipmentDialog = false
                this.getPlatformList()
                this.$message({
                  message: '新增成功',
                  type: 'success'
                })
              } else {
                this.$message({
                  message: response.msg,
                  type: 'error'
                })
              }
            })
          } else {
            this.isDisable = false
          }
        })
        // this.removeCurrentKey() // 调用清除选中节点
        // this.areaTreeShow = false // 点击确认后隐藏树
      },
      confirmUpdate(formName) {
        if (this.checkedArr.length < 1) {
          // alert('至少选择一个')
          this.$message({
            message: '至少选择一个',
            type: 'error'
          })
          return
        }
        console.log('???????????' + JSON.stringify(this.checkedArr))
        this.form.area = this.checkedArr.toString().replace('[').replace(']')
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (!validateIpAdr(this.form.slaveIp)) {
              this.$message({
                message: '请输入合法ip地址',
                type: 'error'
              })
              return
            }
            if (!validatePort(this.form.slavePort)) {
              this.$message({
                message: '请输入合法端口',
                type: 'error'
              })
              return
            }
            if (this.form.isEncrypt === '1') {
              if (!this.form.m1 || !this.form.ia1 || !this.form.ic1) {
                this.$message({
                  message: '加密状态为加密时，请输入加密参数m1、ia1、ic1',
                  type: 'error'
                })
                return
              }
              if (!this.isNum.test(this.form.m1) || !this.isNum.test(this.form.ia1) || !this.isNum.test(this.form.ic1)) {
                this.$message({
                  message: '加密参数m1、ia1、ic1必须为数值型',
                  type: 'error'
                })
                return
              }
            }
            this.listLoading = true
            updatePlatform(this.form).then(response => {
              this.listLoading = false
              if (response.code === 0) {
                this.getList()
                this.addEquipmentDialog = false
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
              } else {
                this.$message({
                  message: response.msg,
                  type: 'error'
                })
              }
            })
          }
        })
        this.eventArr = []
      },
      handleDetail(id) { // 终端详情
        this.listLoading = true
        detailPlatform(id).then(response => {
          // alert(JSON.stringify(response.data))
          this.listLoading = false
          this.form.area = response.data.area
          this.form = response.data
          if (response.data.isEncrypt === '1') {
            this.isEncryptType = false
          } else {
            this.isEncryptType = true
          }
          // this.areaList = [
          //   {
          //     id: response.data.area,
          //     name: response.data.areaName
          //   }
          // ]
        })
      },
      handleUpdate(row) { // 修改终端
        this.handleDetail(row.id)
        console.log('41234213434' + JSON.stringify(row))
        this.resetForm()
        this.dialogStatus = 'update'
        this.addEquipmentDialog = true
        this.pwdType = 'password'
        this.showAreaTree()
        const areas = row.area
        console.log('areas   ??????' + areas)
        this.checkedArr = areas
        const aArr = areas.split(',')
        var barr = []
        console.log('节点数据' + aArr)
        for (var i = 0; i < aArr.length; i++) {
          barr.push(aArr[i])
        }
        this.$nextTick(() => {
          this.$refs['addForm'].clearValidate()
          this.$refs.tree.setCheckedKeys(barr)
        })
        // this.removeCurrentKey()
        // 设置默认选中
        // this.forminputArr = []
        // this.inputArr.push(this.forminputArr)
        // this.inputText = JSON.stringify(this.forminputArr).replace('[', '').replace(']', '').replace(/"/g, '')
      },
      handleDelete(row) { // 删除终端
        this.$confirm('此操作将删除运营商平台信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          deletePlatform(row.id).then(response => {
            this.listLoading = false
            console.log(response)
            if (response.code === 0) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getList()
            } else {
              this.$message({
                message: response.msg,
                type: 'error'
              })
            }
          })
        }).catch(() => {
          this.$message({
            message: '已取消删除',
            type: 'info'
          })
        })
      },
      handleExport() { // 导出
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['运营商平台', '接入辖区市', '接入码', '接入用户名', '主链路状态', '从链路状态', '从链路IP', '从链路端口', '创建时间']
          const filterVal = ['name', 'areaName', 'accessCode', 'account', 'masterStatusName', 'slaveStatusName', 'slaveIp', 'slavePort', 'createTime']
          const list = this.data
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '运营商平台管理第' + this.listQuery.page + '页',
            autoWidth: true
          })
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      }
    }
  }
</script>

<style scoped>
  div.cell button{
    margin-left:13px !important;
    margin-top:2px !important;
  }
  .app-container >>> .el-dialog__header {
    background-color: #5F7ABF;
    height: 40px;
    padding-top: 10px;
  }
  .app-container >>> .el-dialog__header span {
    color: #fff;
    font-size: 14px
  }
  .app-container >>> .el-dialog__header i {
    color: #fff;
  }
  .app-container >>> .el-dialog__headerbtn{
    top: 10px;
  }
  .el-button--primary {
    color: #fff;
    background-color: #5F7ABF;
    border-color: #5F7ABF;
  }
  .el-popover {
    height: 300px;
    overflow-y: scroll;
  }
  .el-dialog__body {
    overflow: auto !important;
    /*height: 120vh;*/
    padding: 5px 20px !important;
  }
  .create_dialog_row {
    text-align: right;
    padding: 0;
  }
  .create_dialog_row el-col span {
    width: 20%
  }
  .deptTreeInput {
    position: relative;
  }
  .encrypt >>> .el-form-item__label{
   padding-left: 1%;
  }
  .encrypt1 >>> .el-form-item__label{
   padding-right: 0!important;
  }
  /* .create_dialog_row el-col el-input {
    width: 0% !important
  } */
  /* .el-form-item__label {
    width: 30%;
    text-align: left !important
  } */
  .el-form-item__label :last-child {
    width: 14% !important
  }
  /* .el-form-item--medium :last-child {
    text-align: right
  } */
</style>
