<template>
  <div class="app-container">
    <el-container>
      <el-form ref="form" label-width="90px" inline style="background: #fff; margin: 0 20px; padding: 20px 10px 0 20px; border-radius: 5px; box-shadow: 0 0 10px #ccc">
        <el-form-item>
          <search-byArea-and-three areaName="车籍地" ref="areathree"
            :showCar="false"
            @selectAreaId="(id) => {listQuery.areaId = id}"
            @selectPlatformId="(id) => {listQuery.platformId = id}"
            @selectOwersId="(id) => {listQuery.owersId = id}">
          </search-byArea-and-three>
        </el-form-item>
        <el-form-item label="车辆类型">
          <el-select v-model="listQuery.vehicleType" placeholder="请选择" style="width:150px;" size="small">
            <el-option v-for="item in vehicleTypeList" :key="item.code" :label="item.value" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆颜色">
          <el-select v-model="listQuery.vehicleColor" placeholder="请选择" style="width:150px;" size="small">
            <el-option v-for="item in vehicleColorList" :key="item.code" :label="item.value" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="运营商平台">
            <el-select @change="platformChange(listQuery.platformId)" v-model="listQuery.platformId" placeholder="请选择" style="width:120px;" size="small">
              <el-option v-for="item in platformIdList" :key="item.platformId" :label="item.platformName" :value="item.platformId"></el-option>
            </el-form-item>
          </el-col> -->
        <!-- <el-form-item label="企业/业户">
          <el-select @focus="owersIdClick(listQuery.platformId, '请先选择平台')" v-model="listQuery.owersId" placeholder="请选择" style="width:120px;" size="small">
            <el-option v-for="item in owersList" :key="item.id" :label="item.owersName" :value="item.id"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="车牌号">
          <el-input maxlength="20" placeholder="请输入车牌" v-model.trim="listQuery.vehicleNo" style="width:150px;" size="small"></el-input>
        </el-form-item>
        <el-form-item label="运输行业类型" label-width="110">
          <el-select v-model="listQuery.vehicleTrans" placeholder="请选择" style="width:150px;" size="small">
            <el-option v-for="item in transTypeList" :key="item.code" :label="item.value" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运行状态">
          <el-select v-model="listQuery.activeStatus" placeholder="请选择" style="width:150px;" size="small">
            <el-option v-for="item in activeStatusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button icon="el-icon-search" @click="handleQuery" type="primary" size="small">查询</el-button>
          <el-button icon="el-icon-refresh" @click="handleReset" type="primary" size="small">重置</el-button>
          <el-button icon="el-icon-plus" @click="handleCreate" type="primary" size="small">新增</el-button>
          <el-button icon="el-icon-delete" @click="handleDelete" type="primary" size="small">删除</el-button>
          <el-button icon="el-icon-download" @click="handleExport" type="primary" size="small">导出</el-button>
        </el-form-item>
      </el-form>
      <el-main>
        <el-table @selection-change="handleSelect" :data="data" :columns="columns" v-loading.body="listLoading" border stripe highlight-current-row style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc" :header-cell-style="{ 'background-color': '#5F7ABF', 'color': '#fff', border: 'none !important' }">
          <el-table-column align="center" type="selection" width="40" @selection-change="handleSelect"></el-table-column>

          <el-table-column align="center" type="index" label="序号" fixed="left" width="60px"></el-table-column>

          <el-table-column align="center" v-for="column in columns" :key="column.key" :label="column.title" :width="column.width">
            <template slot-scope="scope">
              <!-- <span v-if="column.key === 'activeStatus'">{{scope.row[column.key] === '0' ? '离线' : scope.row[column.key] === '1' ? '在线' : '未知' }}</span> -->
              <span v-if="column.key === 'activeStatus'"><span v-if="scope.row[column.key] === '0'">离线</span><span v-if="scope.row[column.key] === '1'" style="color:#13CE66">在线</span></span>
              <span v-else>{{scope.row[column.key]}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作" fixed="right" width="200px">
            <template slot-scope="scope">
              <!-- <el-button icon="el-icon-document" size="small" type="primary" @click="getDriverInfo(scope.row)">
                获取驾驶员信息
              </el-button> -->
              <el-button icon="el-icon-edit" size="small" type="primary" @click="handleUpdate(scope.row)">
                编辑
              </el-button>
              <el-button icon="el-icon-delete" size="small" type="danger" @click="handleDelete(scope.row)">
                删除
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
    <!-- 新增车辆dialog -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="addEquipmentDialog" :close-on-click-modal="false">
      <!-- 新增终端dialog -->
      <el-dialog width="35%" title="新增终端" :visible.sync="addDeviceDialog" center append-to-body :close-on-click-modal="false">
        <el-form :model="addDevForm" :rules="deviceRules" ref="addDeviceForm" style="text-align:right;padding:0 5px;">
          <el-form-item label="运营商平台" prop="platformId">
            <el-select disabled v-model="addDevForm.platformId" placeholder="请选择" style="width:65%" size="small">
              <el-option v-for="item in devPlatList" :key="item.platformId" :label="item.platformName" :value="item.platformId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="企业/业户" prop="owersId">
            <el-select disabled v-model="addDevForm.owersId" placeholder="请选择" style="width:65%" size="small">
              <el-option v-for="item in devOwersList" :key="item.id" :label="item.owersName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="终端号" prop="deviceId">
            <el-input maxlength="20" v-model.trim="addDevForm.deviceId" placeholder="终端号" size="small" style="width:65%"></el-input>
          </el-form-item>
          <el-form-item label="终端厂商唯一编码" prop="producerId">
            <el-input maxlength="20" v-model.trim="addDevForm.producerId" placeholder="请输入终端厂商唯一编码" size="small" style="width:65%"></el-input>
          </el-form-item>
          <el-form-item label="终端型号" prop="modelType">
            <el-input maxlength="20" v-model.trim="addDevForm.modelType" placeholder="终端型号" size="small" style="width:65%"></el-input>
          </el-form-item>
          <el-form-item label="SIM卡号" prop="simcode">
            <el-input maxlength="20" v-model.trim="addDevForm.simcode" placeholder="SIM卡号" size="small" style="width:65%"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:right">
          <el-button type="primary" @click="addDeviceDialog = false">取 消</el-button>
          <el-button :disabled="isDisable" type="primary" @click="deviceAdd('addDeviceForm')">确 定</el-button>
        </div>
      </el-dialog>

      <el-form :model="form" :rules="rules" ref="addForm">

        <el-row class="create_dialog_row">
          <el-col :span="11">
            <el-form-item label="车牌号" prop="vehicleNo">
              <el-input maxlength="20" v-model.trim="form.vehicleNo" placeholder="车牌号" style="width:60%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1" >
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="11">
            <el-form-item label="车牌颜色" prop="vehicleColor">
              <el-select v-model="form.vehicleColor" placeholder="请选择" style="width:60%" size="small">
                <el-option v-for="item in vehicleColorList" :key="item.code" :label="item.value" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="create_dialog_row2">
          <el-form-item :span="23" fixed="left">
            <!-- <el-form-item label="车籍地" prop="nationality" v-if="dialogStatus !== 'update'">
              <el-col :span="2" style="width:9.8%;float:left;">
                <span>&nbsp;</span>
              </el-col>
              <el-col :span="19">
              <el-form-item prop="proV" style="width:30%;float:left;">
                <el-select @change="selectProvince(province)" v-model="province" placeholder="省" size="small">
                  <el-option v-for="item in provinceList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-col :span="1">
                <span>&nbsp;</span>
              </el-col>
              <el-form-item style="width:30%;float:left;">
                <el-select @change="selectCity(city)" v-model="city" placeholder="市" size="small">
                  <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-col :span="1">
                <span>&nbsp;</span>
              </el-col>
              <el-form-item style="width:30%;float:left;">
                <el-select @change="selectBlock(block)" v-model="block" placeholder="区" size="small">
                  <el-option v-for="item in areaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              </el-col>
            </el-form-item> -->
            <el-form-item label="车籍地" prop="nationality">
              <el-col :span="2" style="width:8.8%;float:left;">
                <span>&nbsp;</span>
              </el-col>
              <el-select :loading="loading" @change="selectOption(1,form.nationality)"
                @focus="getChildrenVehListByType(1)"
                v-model="form.nationality" size="small" clearable>
                <el-option v-for="item in areaList"
                  :key="item.areaCode" :label="item.areaName" :value="item.areaCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
        </el-row>
        <el-row class="create_dialog_row">
          <el-col :span="11">
            <el-form-item label="运营商平台" prop="platformId">
              <el-input disabled v-if="dialogStatus === 'update'" maxlength="20"
                v-model.trim="form.platformName" style="width:60%"></el-input>
              <el-select v-else :disabled="dialogStatus === 'update' || clickPlatform" clearable
                @focus="getChildrenVehListByType(2)" @change="selectOption(2,form.platformId)"
                v-model="form.platformId" :placeholder="platformPText" style="width:60%" size="small">
                <el-option v-for="item in platformAreaIdList"
                  :key="item.platformId" :label="item.platformName" :value="item.platformId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="11">
            <el-form-item label="企业/业户" prop="owersId">
            <el-input disabled v-if="dialogStatus === 'update'" maxlength="20"
                v-model.trim="form.owersName" style="width:60%"></el-input>
              <el-select v-else :disabled="dialogStatus === 'update'" clearable
                @focus="getChildrenVehListByType(3)"
                @change="selectOption(3,form.owersId)" v-model="form.owersId"
                placeholder="请选择" style="width:60%" size="small">
                <el-option v-for="item in dialogOwersList"
                  :key="item.owersId" :label="item.owersName" :value="item.owersId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="create_dialog_row">
          <el-col :span="11">
            <el-form-item label="车辆类型" prop="vehicleType">
              <el-select v-model="form.vehicleType" placeholder="请选择" style="width:60%" size="small">
                <el-option v-for="item in vehicleTypeList" :key="item.code" :label="item.value" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="11">
            <el-form-item label="运输行业类型" prop="transType">
              <el-select v-model="form.transType" placeholder="请选择" style="width:60%" size="small">
                <el-option v-for="item in transTypeList" :key="item.code" :label="item.value" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="create_dialog_row">
          <el-col :span="11">
            <el-form-item label="道路运输证号" prop="rtpn">
              <el-input maxlength="20" placeholder="道路运输证号" v-model.trim="form.rtpn" style="width:60%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="11">
            <el-form-item label="车型号" prop="vehicleMode">
              <el-input maxlength="20" placeholder="车型号" v-model.trim="form.vehicleMode" style="width:60%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="create_dialog_row">
          <el-col :span="23">
            <el-form-item label="终端号" prop="deviceId">
              <el-select @focus="selectDeviceId(form.platformId)" v-model="form.deviceId" @change="deviceChange" placeholder="请选择" style="width:78%" size="small">
                <el-option v-for="item in unBindList" :key="item.deviceId" :label="item.deviceId" :value="item.deviceId"></el-option>
              </el-select>
              <!-- <el-autocomplete @focus="getCurrentList" @select="handleSelectDevice" v-model.trim="form.deviceId" :fetch-suggestions="querySearch" class="inline-input" placeholder="终端号" style="width:78%"></el-autocomplete> -->
              <el-button type="text" @click="addDevice" v-if="dialogStatus === 'create'">
                <i class="el-icon-plus" style="color:#488aff;width:7%;"></i>
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>


      </el-form>

      <div slot="footer" class="dialog-footer" style="text-align:right">
        <el-button type="primary" @click="onDlgCancel">取 消</el-button>
        <el-button :disabled="isAdd" v-if="dialogStatus === 'create'" type="primary" @click="submit('addForm')">确 定</el-button>
        <el-button v-else type="primary" @click="confirmUpdate('addForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="驾驶员信息" :visible.sync="driverInfoDialog" width="30%" :close-on-click-modal="false">
      <el-row>
        <el-col :span="8">车牌号:</el-col>
        <el-col :span="14">{{driverInfo.vehicleNo}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8">驾驶员姓名:</el-col>
        <el-col :span="14">{{websData.driverName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8">身份证编号:</el-col>
        <el-col :span="14">{{websData.driverId}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8">从业资格证:</el-col>
        <el-col :span="14">{{websData.licence}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8">发证机构名称:</el-col>
        <el-col :span="14">{{websData.orgName}}</el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="driverInfoDialog = false" type="primary">关 闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  // @Author: outman_qiaopeng  Date: 2018-09-17 14:14:13
  import deptTree from '../../system/dept/components/deptTree'
  import SearchByAreaAndThree from '@/components/Search/SearchByAreaAndThree'
  import { getDownMenu } from '@/api/infomationM/dict'
  import { fetchList, deleteVehicle, createVehicle, updateVehicle, detailVehicle, unBindDeviceList, vehicleExcel } from '@/api/base/vehicle'
  import { getPermsListByArea } from '@/api/base/platform'
  import { owersListByPlatform } from '@/api/base/company'
  import { createDevice } from '@/api/base/device'
  import { validatePhoneNum, numAndLetter } from '@/utils/validate'
  import { getToken } from '@/utils/auth'
  import { getAreaList } from '@/api/base/area'
  import { getChildrenVehList } from '@/api/vehicle/choiceCar'
  export default {
    name: 'vehicleInfo',
    components: { deptTree, SearchByAreaAndThree },
    data() {
      return {
        isDisable: false,
        isAdd: false,
        websocket: '',
        websData: {},
        total: 0,
        deptName: '',
        visible: false,
        listLoading: false,
        addEquipmentDialog: false,
        driverInfoDialog: false,
        driverInfo: {},
        addDeviceDialog: false,
        deviceRules: {
          platformId: [{ required: true, message: '必选项', trigger: 'change' }],
          // owersId: [{ required: true, message: '必选项', trigger: 'change' }],
          deviceId: [{ required: true, message: '必填项', trigger: 'blur' }],
          producerId: [{ required: true, message: '必填项', trigger: 'blur' }],
          modelType: [{ required: true, message: '必填项', trigger: 'blur' }],
          simcode: [{ required: true, message: '必填项', trigger: 'blur' }]
        },
        form: {}, // 新增表单数据
        addDevForm: {},
        currSimCode: '',
        owersList: [],
        dialogOwersList: [],
        useFlagList: [],
        province: '',
        city: '',
        block: '',
        provinceList: [],
        cityList: [],
        areaList: [],
        activeStatusList: [ // 运行状态下拉框
          {
            label: '在线',
            value: '1'
          },
          {
            label: '离线',
            value: '0'
          }
        ],
        platformIdList: [], // 运营商平台下拉框
        platformAreaIdList: [], // 通过车籍地获取运营商平台下拉框
        vehicleColorList: [], // 车牌颜色下拉框
        vehicleTypeList: [], // 车辆类型下拉框
        transTypeList: [], // 运输运输行业类型下拉框
        data: [],
        // areaStyle: 'width:27%',
        columns: [
          {
            key: 'vehicleNo',
            title: '车牌号',
            width: '120'
          },
          {
            key: 'nationalityName',
            title: '车籍地',
            width: '180'
          },
          {
            key: 'platformName',
            title: '运营商平台',
            width: '150'
          },
          {
            key: 'owersName',
            title: '企业/业户',
            width: '180'
          },
          {
            key: 'deviceId',
            title: '终端号',
            width: '120'
          },
          {
            key: 'vehicleMode',
            title: '车型号',
            width: '150'
          },
          {
            key: 'vehicleTypeName',
            title: '车辆类型',
            width: '150'
          },
          {
            key: 'activeStatus',
            title: '运行状态'
          },
          {
            key: 'vehicleColorName',
            title: '车牌颜色'
          },
          {
            key: 'vehicleTransTypeName',
            title: '运输行业类型',
            width: '150'
          },
          {
            key: 'rtpn',
            title: '道路运输证号',
            width: '150'
          },
          // {
          //   key: 'rtoln',
          //   title: '道路运输经营许可证',
          //   width: '200'
          // },
          {
            key: 'onlineLastTime',
            title: '最后在线时间',
            width: '200'
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
          activeStatus: '',
          platformId: '',
          areaId: '',
          vehicleNo: '',
          owersId: '',
          vehicleType: '',
          vehicleColor: '',
          vehicleTrans: ''
        },
        rules: {
          vehicleNo: [{ required: true, message: '必填项', trigger: 'blur' }],
          platformId: [{ required: true, message: '必填项', trigger: 'change' }],
          owersId: [{ required: true, message: '必填项', trigger: 'change' }],
          vehicleColor: [{ required: true, message: '必填项', trigger: 'change' }],
          vehicleType: [{ required: true, message: '必填项', trigger: 'change' }],
          transType: [{ required: true, message: '必填项', trigger: 'change' }],
          rtpn: [{ required: true, message: '必填项', trigger: 'blur' }],
          proV: [{ required: true, message: '必填项', trigger: 'change' }],
          nationality: [{ required: true, message: '必填项', trigger: 'blur' }],
          deviceId: [{ required: true, message: '必填项', trigger: 'change' }]
        },
        textMap: {
          update: '修改车辆信息',
          create: '新增车辆'
        },
        dialogStatus: '',
        selectRows: [],
        unBindList: [],
        devOwersList: [],
        devPlatList: [],
        unBindListQuery: {
          platformId: ''
        },
        nationlityList: [], // 车籍地 修改时一个下拉框,
        queryCar: {
          type: 1,
          areaId: '',
          platformId: '',
          owersId: ''
        },
        loading: true,
        clickPlatform: true,
        platformPText: '请选择车籍地'
      }
    },
    mounted() {
      // 获取下拉框数据
      this.getDownMenuList('vehicle_color')
      this.getDownMenuList('vehicle_type')
      this.getDownMenuList('vehicle_trans_type')
      this.getPlatformList()
      this.getList()
      // this.getAllUnbind(this.unBindListQuery)
    },
    created() {
      this.initWebSocket()
      this.onlineSearch()
    },
    watch: {
      'form.nationality'(val) {
        if (val) {
          this.platformPText = '请选择'
          this.clickPlatform = false
        } else {
          this.form.platformId = ''
          this.queryCar.platformId = ''
          this.platformPText = '请选择车籍地'
          this.clickPlatform = true
        }
      }
    },
    methods: {
      getChildrenVehListByType(type) {
        this.queryCar.type = type
        this.form.deviceId = ''
        if (type === 2) {
          if (!this.form.nationality) {
            this.owersIdClick(this.form.nationality, '请先选择车籍地')
            return
          }
          this.form.owersId = ''
        } else if (type === 3) {
          if (!this.form.platformId) {
            this.owersIdClick(this.form.platformId, '请先选择平台')
            return
          }
        }
        getChildrenVehList(this.queryCar).then(res => {
          this.loading = false
          switch (type) {
            case 1:
              this.areaList = res.data
              break
            case 2:
              this.platformAreaIdList = res.data
              break
            case 3:
              this.dialogOwersList = res.data
              break
            default:
              break
          }
        })
      },
      selectArea(nationality) {
        // this.form.nationality = nationality
        // this.getNextp(nationality)
        this.queryCar.areaId = nationality
      },
      selectOption(type, id) {
        switch (type) {
          case 1:
            this.queryCar.areaId = id
            break
          case 2:
            this.queryCar.platformId = id
            break
          case 3:
            this.queryCar.owersId = id
            break
          default:
            break
        }
      },
      selectProvince(province) {
        this.form.proV = province
        this.form.nationality = province
        this.getNextp(province)
        getAreaList(province).then(response => {
          this.city = ''
          this.block = ''
          this.cityList = response.data
        })
      },
      selectCity(city) {
        this.form.nationality = city
        this.getNextp(city)
        getAreaList(city).then(response => {
          this.block = ''
          this.areaList = response.data
        })
      },
      selectBlock(block) {
        this.form.nationality = block
        this.getNextp(block)
      },
      getNextp(code) {
        this.form.platformId = ''
        getPermsListByArea({ nationality: code }).then(response => {
          this.platformAreaIdList = response.data
        })
      },
      initWebSocket() {
        const vm = this
        this.websocket = new WebSocket(process.env.WEBSOCKET_API)
        vm.websocket.onopen = function() {
          console.log('数据发送中...')
        }
        vm.websocket.onmessage = function(evt) {
          console.log('数据已接收...')
          console.log(JSON.parse(evt.data).Body)
          vm.websData = JSON.parse(evt.data).Body
          console.log(vm.websData)
        }
        vm.websocket.onerror = function() {
          vm.initWebSocket()
        }
      },
      send() {
        const data = {
          Command: '54',
          CommandType: 'Business',
          token: getToken('Admin-Token'),
          Body: {
            data: {
              vehicleNo: this.driverInfo.vehicleNo
            }
          }
        }
        this.websocket.send(JSON.stringify(data))
      },
      // 获取下拉框数据
      getDownMenuList(type) {
        getDownMenu(type).then(response => {
          switch (type) {
            case 'vehicle_color':
              this.vehicleColorList = response.data
              break
            case 'vehicle_type':
              this.vehicleTypeList = response.data
              break
            case 'vehicle_trans_type':
              this.transTypeList = response.data
              break
            default:
              break
          }
        })
      },
      getPlatformList() { // 获取运营商平台列表
        // getPermsList().then(response => {
        //   this.platformIdList = response.data
        // })
        const p = { type: 2 }
        getChildrenVehList(p).then(response => {
          this.platformIdList = response.data
        })
      },
      platformChange(val) { // 根据运营商平台获取业户列表
        owersListByPlatform(val).then(response => {
          console.log(response)
          this.listQuery.owersId = ''
          this.owersList = response.data
        })
      },
      dialogPlatformChange(val) { // 根据运营商平台获取业户列表
        owersListByPlatform(val).then(response => {
          this.form.owersId = ''
          this.dialogOwersList = response.data
        })
        this.unBindListQuery.platformId = val
        this.form.deviceId = ''
        this.getAllUnbind(this.unBindListQuery)
      },
      owersIdClick(id, msg) {
        if (!id || id === '') {
          this.$message({
            message: msg,
            type: 'info'
          })
        }
      },
      resetDeviceForm() {
        this.addDevForm = {
          producerId: '',
          deviceId: '',
          modelType: '',
          simcode: ''
        }
      },
      selectDeviceId(id) {
        if (!id || id === '') {
          this.$message({
            message: '请选择平台',
            type: 'info'
          })
          return
        } else {
          const p = {
            platformId: id,
            owersId: this.form.owersId
          }
          this.getAllUnbind(p)
        }
      },
      deviceChange(item) {
        // console.log('下拉数组' + JSON.stringify(this.unBindList))
        // alert(JSON.stringify(this.unBindList))
        // alert(item)
        for (var a = 0; a < this.unBindList.length; a++) {
          if (this.unBindList[a].deviceId === item) {
            this.form.deviceId = this.unBindList[a].deviceId
            this.form.simCode = this.unBindList[a].simcode
            this.currSimCode = this.unBindList[a].simcode
          }
        }
        // alert(this.currSimCode)
      },
      addDevice() { // 新增车辆页面增加设备终端
        if (!this.form.platformId) {
          this.$message({
            message: '请选择平台',
            type: 'error'
          })
          return
        } else if (!this.form.owersId) {
          this.$message({
            message: '请选择企业/业户',
            type: 'error'
          })
          return
        } else {
          const p = { type: 2 }
          getChildrenVehList(p).then(response => {
            this.devPlatList = response.data
            this.addDevForm.platformId = this.form.platformId
          })
          owersListByPlatform(this.form.platformId).then(response => {
            this.devOwersList = response.data
            this.addDevForm.owersId = this.form.owersId
          })
        }
        this.resetDeviceForm()
        this.addDeviceDialog = true
        this.$nextTick(() => {
          this.$refs['addDeviceForm'].clearValidate()
        })
      },
      deviceAdd(formName) {
        this.isDisable = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (!validatePhoneNum(this.addDevForm.simcode)) {
              this.$message({
                message: '请输入正确的SIM卡号',
                type: 'error'
              })
              this.isDisable = false
              return
            }
            if (!numAndLetter(this.addDevForm.deviceId)) {
              this.$message({
                message: '终端号只能输入数字',
                type: 'error'
              })
              this.isDisable = false
              return
            }
            this.listLoading = true
            this.form.simCode = this.addDevForm.simcode
            setTimeout(() => {
              this.isDisable = false
            }, 3000)
            createDevice(this.addDevForm).then(response => {
              this.listLoading = false
              if (response.code === 0) {
                this.addDeviceDialog = false
                this.unBindListQuery.platformId = this.form.platformId
                this.getAllUnbind(this.unBindListQuery)
                this.form.simCode = this.addDevForm.simcode
                this.form.deviceId = this.addDevForm.deviceId
                this.currSimCode = this.addDevForm.simcode
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
      },
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          console.log(response)
          this.data = response.data.rows
          this.total = response.data.totalCount
          this.listLoading = false
        })
      },
      getAllUnbind(query) {
        unBindDeviceList(query).then(response => {
          this.unBindList = response.data
        })
      },
      onlineSearch() { // 首页在线车辆查询方法
        this.listQuery.page = 1
        this.listQuery.activeStatus = this.$route.params.activeStatus
        this.getList()
      },
      handleQuery() { // 头部查询方法
        this.listQuery.page = 1
        this.getList()
      },
      handleReset() {
        this.listQuery.activeStatus = ''
        this.listQuery.platformId = ''
        this.listQuery.vehicleNo = ''
        this.listQuery.owersId = ''
        this.listQuery.vehicleType = ''
        this.listQuery.vehicleColor = ''
        this.listQuery.vehicleTrans = ''
        this.owersList = []
        this.$refs.areathree.reset()
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
          vehicleNo: '',
          vehicleColor: '',
          platformId: '',
          nationality: '',
          deviceId: '',
          simCode: '',
          vehicleType: '',
          transType: '',
          rtpn: '',
          vehicleMode: '',
          proV: '',
          nationalityName: '',
          owersId: '',
          block: '',
          nationlityList: ''
        }
        this.queryCar = {
          type: 1,
          areaId: '',
          platformId: '',
          owersId: ''
        }
      },
      handleCreate() { // 头部新增
        this.dialogOwersList = []
        this.unBindList = []
        this.currSimCode = ''
        this.resetForm()
        this.province = null
        this.city = null
        // this.areaStyle = 'width:27%'
        this.dialogStatus = 'create'
        this.addEquipmentDialog = true
        this.$nextTick(() => {
          this.$refs['addForm'].clearValidate()
        })
      },
      onDlgCancel() {
        this.addEquipmentDialog = false
        this.dialogOwersList = []
        this.currSimCode = ''
      },
      submit(formName) { // 表单内容提交
        this.isAdd = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.listLoading = true
            this.form.simCode = this.currSimCode
            // alert(JSON.stringify(this.form))
            setTimeout(() => {
              this.isAdd = false
            }, 3000)
            createVehicle(this.form).then(response => {
              this.listLoading = false
              if (response.code === 0) {
                this.getList()
                this.addEquipmentDialog = false
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
            this.isAdd = false
          }
        })
        this.dialogOwersList = []
      },
      confirmUpdate(formName) { // 修改
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.listLoading = true
            this.form.simCode = this.currSimCode
            // alert(JSON.stringify(this.form))
            updateVehicle(this.form).then(response => {
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
        this.dialogOwersList = []
      },
      handleDetail(id) { // 车辆详情
        this.listLoading = true
        detailVehicle(id).then(response => {
          console.log(response)
          owersListByPlatform(response.data.platformId).then(res => {
            console.log(res)
            this.dialogOwersList = res.data
          })
          this.queryCar.platformId = response.data.platformId
          getChildrenVehList(this.queryCar).then(res => {
            this.areaList = res.data
            this.form = response.data
            this.form.nationality = parseInt(response.data.nationality)

            this.unBindListQuery.platformId = response.data.platformId
            this.currSimCode = this.form.simCode
            unBindDeviceList(this.unBindListQuery).then(res => {
              this.unBindList = res.data
              const obj = {
                deviceId: this.form.deviceId
              }
              this.unBindList.push(obj)
            })
          })
          this.listLoading = false
        })
      },
      getDriverInfo(row) { // 获取驾驶员信息
        this.driverInfoDialog = true
        this.driverInfo = row
        this.send()
      },
      handleUpdate(row) { // 修改车辆
        this.resetForm()
        this.dialogStatus = 'update'
        // this.areaStyle = 'width:81%'
        this.addEquipmentDialog = true
        this.$nextTick(() => {
          this.$refs['addForm'].clearValidate()
        })
        this.handleDetail(row.id)
      },
      handleSelect(val) { // 选择处理事件
        this.selectRows = val
      },
      handleDelete(row) { // 删除车辆
        const userIds = []
        if (row && row.id) {
          userIds.push(row.id)
        } else {
          if (this.selectRows.length === 0) {
            this.$message({
              message: '请选择要删除的车辆',
              type: 'warning'
            })
            return
          }
          this.selectRows.forEach(row => {
            userIds.push(row.id)
          })
        }
        this.$confirm('此操作将删除车辆信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          deleteVehicle(userIds).then(response => {
            this.listLoading = false
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
      handleNodeClick(data) { // 树节点点击回调方法
        this.listQuery.deptId = data.id
        this.listQuery.deptName = data.text
        this.visible = false
      },
      handleExport() {
        if (this.total > 50000) {
          this.$message('导出数据不能大于50000')
          return
        }
        vehicleExcel(this.listQuery).then(result => {
          this.downloads(result)
        }).catch((result) => {
          this.downloads(result)
        })
      },
      downloads(data) {
        if (!data) {
          return
        }
        const url = window.URL.createObjectURL(new Blob([data]), { type: 'application/vnd.ms-excel' })
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', '车辆档案管理汇总.xls')
        document.body.appendChild(link)
        link.click()
      }
    },
    destroyed() {
      this.websocket.close()
    }
  }
</script>

<style scoped>
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
    padding: 5px 20px !important;
  }
  .create_dialog_row {
    text-align: right;
    padding: 0;
  }
  .create_dialog_row el-col span {
    width: 30%
  }
  .create_dialog_row el-col el-input {
    width: 70% !important
  }
  .create_dialog_row2 {
    text-align: left;
    padding: 0;
  }
  .create_dialog_row2 el-col span {
    width: 30%
  }
  .create_dialog_row2 el-col el-input {
    width: 20% !important
  }

  .el-form-item__label :last-child {
    width: 14% !important
  }
  /* .el-form-item--medium :last-child {
    text-align: right
  } */
</style>
