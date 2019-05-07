<template style="overflow:hidden">
  <div class="j-realtime">
    <transition name="fade">
      <div class="left_aside" :class="{'left_aside_small': !vehicleTableShow}" v-show="isShowTable" @click="leftAsideClick">
        <!-- 右键菜单 -->
        <div v-show = "treeMenu" class="right_menu" id = "menu">
          <ul>
            <li tabindex="-1" class="menu__item" id="menu-4994-1-0" @click = "instructionsIssue('first')">快速拍照</li>
            <li tabindex="-1" class="menu__item" id="menu-4994-1-1" @click = "instructionsIssue('second')">文本下发</li>
            <li tabindex="-1" class="menu__item" id="menu-4994-1-2" @click = "instructionsIssue('third')">语音监听</li>
            <li tabindex="-1" class="menu__item" id="menu-4994-1-3">立即定位</li>
            <li tabindex="-1" class="menu__item" id="menu-4994-1-4"  @click="deviceControl = true">终端控制</li>
            <li tabindex="-1" class="menu__item" id="menu-4994-1-5" @click="outerVisible = true">部标参数配置</li>
            <li tabindex="-1" class="menu__item" id="menu-4994-1-6" @click = "drivingConfigClick(1)" >安全驾驶配置</li>
            <li tabindex="-1" class="menu__item" id="menu-4994-1-7">设备信息</li>
            <li tabindex="-1" class="menu__item" id="menu-4994-1-8" @click="openVideo">视频</li>
          </ul>
        </div>
        <!-- 车辆汇总统计区 -->
        <div style="height: 55px; width: 100%; font-size: 12px; padding-top: 10px; padding-bottom: 10px;">
          <div class="left_top_veh" @click="monitorChange(-1)">
            <div>
              <span class="veh_count" :class="activeStatus==-1? 'monitor_all_checked' : 'monitor_all_normal'"></span>
            </div>
            <div>
              <span :class="activeStatus==-1? 'font_active' : 'font_normal'">全部({{asideObj.allVehicle}})</span>
            </div>
          </div>
          <div class="left_top_veh" @click="monitorChange(1)">
            <div>
              <span class="veh_count" :class="activeStatus==1? 'monitor_online_checked' : 'monitor_online_normal'"></span>
            </div>
            <div>
              <span :class="activeStatus==1? 'font_active' : 'font_normal'">在线({{asideObj.onlineVehicle}})</span>
            </div>
          </div>
          <div class="left_top_veh" @click="monitorChange(0)">
            <div>
              <span class="veh_count" :class="activeStatus==0? 'monitor_offline_checked' : 'monitor_offline_normal'"></span>
            </div>
            <div>
              <span :class="activeStatus==0? 'font_active' : 'font_normal'">离线({{asideObj.offlineVehicle}})</span>
            </div>
          </div>
        </div>
        <!-- 搜索结果区 -->
        <el-popover trigger="manual" width="225" placement="bottom" v-model="resultPop">
          <div v-for="result in resultList" :key="result.vin" @click="selectCurVehicle(result)" class="search_result_item">
            <div style="padding:2px 0;">
              <div style="float:left">车牌号</div>
              <div style="float:right">{{result.vehicleNo}}</div>
              <br style="clear:both">
            </div>
            <!-- <div style="padding:2px 0;">
              <div style="float:left">VIN号</div>
              <div style="float:right">{{result.vin}}</div>
              <br style="clear:both">
            </div> -->
            <div style="padding:2px 0;">
              <div style="float:left">企业/业户</div>
              <div style="float:right">{{result.owersName}}</div>
              <br style="clear:both">
            </div>
             <div style="padding:2px 0;">
              <div style="float:left">运营商平台</div>
              <div style="float:right">{{result.platformName}}</div>
              <br style="clear:both">
            </div>
            <div style="padding:2px 0;" :class="result.activeStatus === '1' ? 'online' : 'offline'">
              <div style="float:left">车辆状态</div>
              <div style="float:right">{{result.activeStatus === '1' ? '在线' : '离线'}}</div>
              <br style="clear:both">
            </div>
          </div>
          <!-- <el-button v-show="loadmoreBtn" @click="loadmore" style="width:100%;text-align:center" type="text">查看更多</el-button> -->
          <el-input @focus="searchFocus" @blur="searchBlur" slot="reference" v-model.trim="queryStr" placeholder="请输入车牌号" prefix-icon="el-icon-search" size="mini"></el-input>
        </el-popover>
        <!-- 车辆树 -->
        <el-tree ref="tree" :default-expanded-keys="expandedTree" 
          :class="vehicleTableShow ? 'el-tree-j' : 'el-tree-j el-tree-j-max'"
          lazy @node-click="handleNodeClick" :load="loadDeptNode" @node-contextmenu="treeMenuRihgtClick" :default-checked-keys="checkedList" :render-content="renderContent" @check="getCurrentKey" :show-checkbox="showCheckbox" :highlight-current="true" :data="treeData" :props="defaultProps" node-key="fullPath"
          :expand-on-click-node="false" style="margin-top:5px;font-size:12px" ></el-tree>
        <!-- <el-tree ref="tree" :default-expanded-keys="expandedTree" class="el-tree-max" :class="{'el-tree-small': !vehicleTableShow}" lazy @node-click="handleNodeClick"  @node-contextmenu="treeMenuRihgtClick" :default-checked-keys="checkedList" :render-content="renderContent" @check="getCurrentKey" :show-checkbox="showCheckbox" :highlight-current="true" :data="treeData" :props="defaultProps" node-key="id" :expand-on-click-node="false" style="margin-top:5px;font-size:12px"></el-tree>
       -->
      </div>
    </transition>
    <!-- 视频 -->
    <el-dialog
      title="提示"
      :visible.sync="videoShow"
      width="30%">
      <real-video></real-video>
    </el-dialog>
    <!-- 侧边栏关闭/打开按钮 -->
    <span :class="tableBtnRealtime" @click="tableBtnClick"></span>
    <!-- 右侧地图区 -->
    <el-container class="real_time" :class="{'real_time_small': !vehicleTableShow}">
      <!-- 报警、事件提醒按钮 -->
     <!-- <div class="right_msg_tip" @click="toggleRightPanel">
        <i class="alarm"></i>
        &lt;!&ndash; <span>{{totalMsg}}</span> &ndash;&gt;
        <span>({{alarmList[0].length + alarmList[1].length + alarmList[2].length + alarmList[3].length + alarmList[4].length + alarmList[5].length +platformMsgList[0].length + platformMsgList[1].length}})</span>
      </div>-->
      <!-- 报警、事件提醒信息面板 -->
      <transition name="rightPanel">
      <div class="right_msg_panel" v-show="rightPannelShow">
        <div class="header">
          <i class="logo" @click="toggleRightPanel"></i>
          <div class="title">
            <div class="title_event" :class="msgType==1?'selected':'normal'" @click="msgTypeClick(1)">报警事件</div>
            <div class="title_msg" :class="msgType==2?'selected':'normal'" @click="msgTypeClick(2)">平台消息</div>
          </div>
        </div>
        <!-- 报警事件消息面板 -->
        <div class="main" v-show="msgType==1">
          <div style="display: inline-block;">
            <div class="alarm_content" :class="alarmItem==0?'selected':''" @click="alarmItemClick(0)">
              <div>
                <i class="ico speedover"></i>
                超速驾驶
              </div>
              <div style="color: rgb(148, 166, 198); font-size: 22px;">
                {{alarmList[0].length}}
              </div>
            </div>
            <div class="alarm_content" :class="alarmItem==1?'selected':''" @click="alarmItemClick(1)">
              <div>
                <i class="ico tired_drive"></i>
                疲劳驾驶
              </div>
              <div style="font-size: 22px;color: #F89695;">
                {{alarmList[1].length}}
              </div>
            </div>
            <div class="alarm_content" :class="alarmItem==2?'selected':''" @click="alarmItemClick(2)">
              <div>
                <i class="ico drive_safe"></i>
                安全驾驶
              </div>
              <div style="font-size: 22px;color: #6BBBA3;">
                {{alarmList[2].length}}
              </div>
            </div>
          </div>
          <div style="display: inline-block;">
            <div class="alarm_content" :class="alarmItem==3?'selected':''" @click="alarmItemClick(3)">
              <div>
                <i class="ico driver_cj"></i>
                驾驶员采集
              </div>
              <div style="font-size: 22px;color: #FEAF5C;">
                {{alarmList[3].length}}
              </div>
            </div>
            <div class="alarm_content" :class="alarmItem==4?'selected':''" @click="alarmItemClick(4)">
              <div>
                <i class="ico driver_identify"></i>
                驾驶员识别
              </div>
              <div style="font-size: 22px;color: #7EB2E8;">
                {{alarmList[4].length}}
              </div>
            </div>
            <div class="alarm_content" :class="alarmItem==5?'selected':''" @click="alarmItemClick(5)">
              <div>
                <i class="ico driver_camera"></i>
                自动抓拍
              </div>
              <div style="font-size: 22px;color: #75A97C;">
                {{alarmList[5].length}}
              </div>
            </div>
          </div>
          <hr style="border:1px solid F3F3F3">
          <div>
            <template>
              <el-table
              :data="alarmList[alarmItem]" height="218"
                size="mini" class="alarm_table" :show-header="false">
                <el-table-column
                  prop="AlarmTime"
                  label="时间"
                  width="90"
                  :formatter="timeFormatter">
                </el-table-column>
                <el-table-column
                  prop="AlarmContent"
                  label="类型"
                  width="90">
                </el-table-column>
                <el-table-column
                  prop="VehicleNo"
                  label="车牌号">
                </el-table-column>
              </el-table>
            </template>
          </div>
        </div>
        <!-- 平台消息面板信息 -->
        <div class="main" v-show="msgType==2">
          <div style="display: inline-block;">
            <div class="platform_msg_content" :class="platformItem==0?'selected':''" @click="platformItemClick(0)">
              <div>
                <i class="ico alarm_oversee"></i>
                报警督办
              </div>
              <div style="color: rgb(148, 166, 198); font-size: 22px;">
                {{platformMsgList[0].length}}
              </div>
            </div>
            <div class="platform_msg_content" :class="platformItem==1?'selected':''" @click="platformItemClick(1)">
              <div>
                <i class="ico pt_monitor"></i>
                查岗消息
              </div>
              <div style="font-size: 22px;color: #F89695;">
                {{platformMsgList[1].length}}
              </div>
            </div>
          </div>
          <hr style="border:1px solid F3F3F3">
          <div>
            <template>
              <el-table
                :data="platformMsgList[platformItem]"
                class="platform_msg_table" size="mini" :show-header="false">
                <el-table-column
                  prop="date"
                  label="时间"
                  width="90">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="类型"
                  width="90">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="车牌号">
                </el-table-column>
              </el-table>
            </template>
          </div>
        </div>
      </div>
      </transition>
      <div></div>
      <el-main style="padding:0">
        <baidu-map name="baiduMap" :center="center" @ready="handler" :zoom="zoom" :scroll-wheel-zoom="true" class="map">
          <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>
          <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
          <bml-marker-clusterer :averageCenter="true">
            <bm-marker v-for="vehicle in vehicleList" :key="vehicle.BaseVehicle.VehicleId" @click="openDialog(vehicle)" :position="{lng: vehicle.DataVehicle.PosData.Longitude, lat: vehicle.DataVehicle.PosData.Latitude}" :icon="{ url: require('../../../assets/realtime/' + vehicle.BaseVehicle.Icon), size: {width: 50, height: 50 }}">
              <bm-label :content="vehicle.BaseVehicle.VehicleNo" :offset="labelOffset" :zIndex="10" :labelStyle="{ color: 'black', fontSize : '12px', padding:'0px 0px', border: 'none', borderRadius:'0px'}"/>
            </bm-marker>
          </bml-marker-clusterer>
          <!-- :title="vehicleInfo.BaseVehicle!=undefined?vehicleInfo.BaseVehicle.VehicleNo:''+'('+vehicleInfo.BaseVehicle!=undefined?vehicleInfo.BaseVehicle.VehicleTypeName:''+')'" -->
          <!-- lng水平方向 lat垂直方向 -->
          <bm-info-window :position="{lng: infoWindow.lng, lat: infoWindow.lat+0.00024}" :title="`${vehicleInfo.BaseVehicle!=undefined?vehicleInfo.BaseVehicle.VehicleNo:''}  (${vehicleInfo.BaseVehicle!=undefined?vehicleInfo.BaseVehicle.TransType:''})`" :width="200" :height="210" :show="infoWindow.show" @close="infoWindowClose" @open="infoWindowOpen">
            <!-- <p v-text="infoWindow.contents"></p>
            <button>Clear</button> -->
            <el-tabs value="first" >
              <el-tab-pane label="实时信息" name="first">
                <div style="font-size:10px;line-height:12px" class="info-window">
                  <div style="float:left;width:260px">
                    <p class='nomalColor'>
                      位置：{{vehicleInfo.BaseVehicle!=undefined?vehicleInfo.BaseVehicle.Address:''}}
                    </p>
                   <p class='nomalColor'>
                      速度：{{vehicleInfo.DataVehicle!=undefined?vehicleInfo.DataVehicle.OvrallData.CurrentSpeed:''}} km/h
                   </p>
                   <p class='nomalColor'>
                       里程：{{vehicleInfo.DataVehicle!=undefined?vehicleInfo.DataVehicle.OvrallData.CurrentMileage:''}} km
                   </p>
                  <p class='nomalColor'>
                      方向：{{vehicleInfo.DataVehicle!=undefined?vehicleInfo.DataVehicle.PosData.Direction:''}}
                  </p>
                   <p class='nomalColor'>

                     上传频率： >10s
                   </p>
                   <!-- <p class='nomalColor'>
                     行车记录仪速度：0km/h
                   </p> -->
                     <!-- <p>
                      <span style='color:#5f7abf;'><b>丨</b></span><b>车辆状态：</b>
                    </p>
                    <div style="display:flex; flex-direction:column;">
                      <div style='display:flex'> -->
                          <!-- ACC数据  {{vehicleInfo.DataVehicle!=undefined?vehicleInfo.DataVehicle.OvrallData.Acc:''}} -->

                         <!-- <p style='margin-right:10px'><img src="../../../assets/infoWindow-icon/yibiaopanActive.png" alt="" class='mr5'>ACC </p>
                         <p><img src="../../../assets/infoWindow-icon/locationActive.png" alt="" class='mr5'>定位 </p>
                      </div>
                      <div style='display:flex'> -->
                        <!-- 油路数据 {{vehicleInfo.DataVehicle!=undefined?vehicleInfo.DataVehicle.OvrallData.Fuel:''}}-->
                        <!-- 电路数据 {{vehicleInfo.DataVehicle!=undefined?vehicleInfo.DataVehicle.OvrallData.Elec:''}}-->
                        <!-- <p style='margin-right:10px'><img src="../../../assets/infoWindow-icon/gasActive.png" alt="" class='mr5'>油路 </p>
                         <p><img src="../../../assets/infoWindow-icon/electricityActive.png" alt="" class='mr5'>电路 </p>
                      </div>
                    </div>-->
                  </div>
                  <!--<div style="float: left;height: 80px;width: 80px;margin-left: 58px;border:1px solid #000"></div>-->
                  <div style="clear:both"></div>

                  <!--<div style="float:left;margin-left: 58px;width:80px;text-align:center"><a href="">人工比对</a></div>-->
                  <!-- <p  style='color:#595959;'>行驶记录仪速度：</p>  -->
                  <p style='color:#999999;'>时间：{{vehicleInfo.BaseVehicle!=undefined?vehicleInfo.BaseVehicle.PosTime:''}}</p>

                  <div class="j-bm-info-window">
                    <el-tooltip class="item" effect="dark" content="轨迹回放" placement="bottom-start">
                      <!-- <router-link 
                        :to="{name:'playback', params: { vId: vehicleInfo.BaseVehicle.VehicleNo, vNo: vehicleInfo.BaseVehicle.VehicleId }}">
                        <img src="../../../assets/realtime/info_replay.png" alt="">
                      </router-link> -->
                      <img src="../../../assets/realtime/info_replay.png" @click="toPlayback('playback')" alt="">
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="视频监控" placement="bottom-start">
                      <img src="../../../assets/realtime/info_video.png" @click="showVideoDialog" alt="">
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="车辆应急接入监管平台" placement="bottom-start">
                      <img src="../../../assets/realtime/info_car_sys.png" @click="toTextmessagesAS('carsys')" alt="">
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="车辆单向监听" placement="bottom-start">
                      <img src="../../../assets/realtime/info_car_listen.png" @click="toTextmessagesAS('carlisten')" alt="">
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="车辆拍照" placement="bottom-start">
                      <img src="../../../assets/realtime/info_car_photo.png" @click="toTextmessagesAS('carphoto')" alt="">
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="下发车辆报文" placement="bottom-start">
                      <img src="../../../assets/realtime/info_text.png" @click="toTextmessagesAS('cartext')" alt="">
                    </el-tooltip>
                  </div>
                  <!--<div>连续驾驶：{{vehicleInfo.BaseVehicle!=undefined?vehicleInfo.BaseVehicle.RunningTime:''}}</div>-->
                  <!--<div>
                    <span class="label">操作：</span>
                    <span class="cmdop">跟踪</span>
                    <span class="cmdop">回放</span>
                    <span class="cmdop">视频</span>
                  </div>
                  <div>
                    <span class="label"></span>
                    <span class="cmdop">图片</span>
                    <span class="cmdop">文本</span>
                    <span class="cmdop">监听</span>
                  </div>-->
                </div>
              </el-tab-pane>
              <el-tab-pane label="车辆信息" name="second">
                <div style="font-size:10px;line-height:12px" class="info-window">
                  <div style="float:left;width:100%">
                    <p class='nomalColor'>
                      车牌号：{{vehicleInfo.BaseVehicle!=undefined?vehicleInfo.BaseVehicle.VehicleNo:''}}
                    </p>
                     <p class='nomalColor'>
                     运营商平台：{{vehicleInfo.BaseVehicle!=undefined?vehicleInfo.BaseVehicle.Platform:''}}
                    </p>
                    <p class='nomalColor'>
                     企业/业户：：{{vehicleInfo.BaseVehicle!=undefined?vehicleInfo.BaseVehicle.Owers:''}}
                    </p>
                     <p class='nomalColor'>
                     sim卡号：{{vehicleInfo.BaseVehicle!=undefined?vehicleInfo.BaseVehicle.SimCode:''}}
                    </p>
                     <p class='nomalColor'>
                      车辆类型：{{vehicleInfo.BaseVehicle!=undefined?vehicleInfo.BaseVehicle.VehicleTypeName:''}}
                    </p>
                     <p class='nomalColor'>
                      道路运输证号：{{vehicleInfo.BaseVehicle!=undefined?vehicleInfo.BaseVehicle.Rtpn:''}}
                    </p>
                      <p class='nomalColor'>
                      运输行业类型：{{vehicleInfo.BaseVehicle!=undefined?vehicleInfo.BaseVehicle.TransType:''}}
                    </p>
                      <p class='nomalColor'>
                      车籍地：{{vehicleInfo.BaseVehicle!=undefined?vehicleInfo.BaseVehicle.Nationality:''}}
                    </p>

                    <!--<div>
                      <span class="vehLabel">车辆品牌：</span>
                      <span>{{vehicleInfo.BaseVehicle!=undefined?vehicleInfo.BaseVehicle.Brand:''}}</span>
                    </div>
                    <div>
                      <span class="vehLabel">司机姓名：</span>
                      <span>{{vehicleInfo.BaseVehicle!=undefined?vehicleInfo.BaseVehicle.DriverName:''}}</span>
                    </div>
                    <div>
                      <span class="vehLabel">驾驶证号：</span>
                      <span>{{vehicleInfo.BaseVehicle!=undefined?vehicleInfo.BaseVehicle.DriverLicense:''}}</span>
                    </div>
                    <div>
                      <span class="vehLabel">身份证号：</span>
                      <span>{{vehicleInfo.BaseVehicle!=undefined?vehicleInfo.DataVehicle.DriverIdCard:''}}</span>
                    </div>
                    <div>
                      <span class="vehLabel">联系电话：</span>
                      <span>{{vehicleInfo.BaseVehicle!=undefined?vehicleInfo.BaseVehicle.DriverMobile:''}}</span>
                    </div>-->
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>

          </bm-info-window>
        </baidu-map>
      </el-main>
      <!-- 安全驾驶配置 -->
      <drivingConfig ref="DC"></drivingConfig>
      <!-- 车辆监控指令下发 -->
      <fix ref="II"></fix>

    <!-- 车辆信息弹出框 -->
      <transition name="slide-fade">
        <vehicle-dialog :class="infoDialog" @traceReview="traceReview" :vehicleInfo="vehicleInfo" :address="address" :street="street" v-if="isShowDialog" @dialogClose="dialogClose"></vehicle-dialog>
      </transition>
    </el-container>

    <!-- 指令参数设置弹框 -->

    <!-- 指令参数设置弹框 -->
    <dev-param-set-dialog  ref="DPSD" ></dev-param-set-dialog>
    <!-- 终端控制弹框 -->
    <dev-control-dialog ref="DCD" ></dev-control-dialog>

    <!-- 状态栏 -->
    <!-- <div class="status_bar" :class="{'tool_bar_small': !vehicleTableShow}">
      <div class="item" :class="statusItem===0?'selected':''" @click="statusItemClick(0)"><i class="bar_ico ico_all"></i>全部({{vehicleList.length}})</div>
      <div class="item" :class="statusItem===1?'selected':''" @click="statusItemClick(1)"><i class="bar_ico ico_online"></i>在线({{onlineVehicleList.length}})</div>
      <div class="item" :class="statusItem===2?'selected':''" @click="statusItemClick(2)"><i class="bar_ico ico_offline"></i>离线({{offlineVehicleList.length}})</div>
      <div class="item" :class="statusItem===3?'selected':''" @click="statusItemClick(3)"><i class="bar_ico ico_run"></i>行驶({{runningVehicleList.length}})</div>
      <div class="item" :class="statusItem===4?'selected':''" @click="statusItemClick(4)"><i class="bar_ico ico_stop"></i>停车({{stopVehicleList.length}})</div>
      <div class="item" :class="statusItem===5?'selected':''" @click="statusItemClick(5)"><i class="bar_ico ico_alarm"></i>报警({{alarmVehicleList.length}})</div>
    </div> -->
    <!-- 工具栏 -->
    <!-- <div class="tool_bar" :class="{'tool_bar_small': !vehicleTableShow}">
      <div class="item" @click="clearSubscribe()"><i class="bar_ico ico_delete"></i>清空</div>
      <div class="item" @click="drawArea"><i class="bar_ico ico_search"></i>拉框查找</div>
      <div class="item"><i class="bar_ico ico_map_tool"></i>地图工具</div>
      <div class="item"><i class="bar_ico ico_settings"></i>信息设置</div>
    </div> -->
    <!-- 视频监控弹出框 -->
    <el-dialog
      title="视频监控"
      :visible.sync="videoDialog"
      width="60%"
      center>
      <!-- <div class="channe-btn">
        <span class="active" v-for="item in channeList" @click="subChanne(item)">{{item.text}}</span>
      </div> -->
      <el-container class="el-container-videos">
        <el-main class="el-main-players" :class="videos.modelClass" v-if="videoDialog">
          <p>车牌号：{{vehicleInfo.BaseVehicle.VehicleNo}}</p>
          <div class="player">
            <video-player :options="options1" :pid="pid1" ref="player1ref" aria-controls="controls"></video-player>
            <div class="plfloat">
             <el-button class="videoBtns" size="small" @click="doPlay('video1', 1)">▶</el-button>
             <el-button class="videoBtns" size="small" @click="doPause('video1', 1)">█</el-button>
            </div>
          </div>
          <div class="player">
            <video-player :options="options2" :pid="pid2" ref="player2ref"></video-player>
            <div class="plfloat">
             <el-button class="videoBtns" @click="doPlay('video2', 2)">▶</el-button>
             <el-button class="videoBtns" @click="doPause('video2', 2)">█</el-button>
            </div>
          </div>
          <div class="player">
            <video-player :options="options3" :pid="pid3" ref="player3ref"></video-player>
            <div class="plfloat">
             <el-button class="videoBtns" @click="doPlay('video3', 3)">▶</el-button>
             <el-button class="videoBtns" @click="doPause('video4', 3)">█</el-button>
            </div>
          </div>
          <div class="player">
            <video-player :options="options4" :pid="pid4" ref="player4ref"></video-player>
            <div class="plfloat">
             <el-button class="videoBtns" @click="doPlay('video4', 4)">▶</el-button>
             <el-button class="videoBtns" @click="doPause('video4', 4)">█</el-button>
            </div>
          </div>
        </el-main>
        <el-main v-if="loadingZZ" class="zzloading">
          <div class="zzloading-spinner">
            <i class="el-icon-loading"></i>
            <p class="zzloading-text">正在获取所有视频，请等待 {{nums}} s</p>
            <span class="zzloading-cannel" @click="() => {this.loadingZZ = false;this.nums = 10}">取消</span>
          </div>
        </el-main>
      </el-container>
    </el-dialog>
    <!-- 底部车辆表格 -->
    <div class="el-footer">
      <template>
        <el-button :icon="vehicleTableShow ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" class="toggle-table-btn" size="mini" @click="toggleVehicleTable"></el-button>
        <div v-show="vehicleTableShow">
          <el-table
            :data="statusItem==0?vehicleList:(statusItem==1?onlineVehicleList:(statusItem==2?offlineVehicleList:(statusItem==3?runningVehicleList:(statusItem==4?stopVehicleList:(statusItem==5?alarmVehicleList:vehicleList)))))"
            style="width: 100%;"
            height="200"
            size="mini"
            border
            stripe
            @row-click="vehicleRowClick"
            :class="{'el-table-close': !vehicleTableShow}"
            :header-cell-style="{ background: '#5f7abf', color: '#fff', border: 'none !important' }">
            <!-- <el-table-column prop="date" label="操作" width="65px" align="center">
              <template slot-scope="scope">
                <el-button-group>
                  <el-tooltip class="item" effect="dark" content="取消订阅" placement="top-start">
                    <el-button @click="cancelSubscribe(scope.row)" class="el-icon-remove-outline" size="mini" round></el-button>
                  </el-tooltip>
                </el-button-group>
              </template>
            </el-table-column> -->
            <el-table-column prop="BaseVehicle.VehicleNo" label="车牌号" width="100" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="BaseVehicle.Platform" label="运营商平台" width="150" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="BaseVehicle.Owers" label="企业/业户" width="150" show-overflow-tooltip align="center"></el-table-column>
            <!--<el-table-column prop="BaseVehicle.PlateColor" label="车牌颜色" width="100"></el-table-column>-->
            <el-table-column prop="BaseVehicle.PosTime" label="定位时间" width="150" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="DataVehicle.OvrallData.Speed" label="速度(km/h)" width="100" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="DataVehicle.OvrallData.CurrentMileage" label="里程(km)" width="100" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="DataVehicle.PosData.Longitude" label="经度" width="100" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="DataVehicle.PosData.Latitude" label="纬度" width="100" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="BaseVehicle.VehicleTypeName" label="车辆类型" width="100" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="BaseVehicle.Rtpn" label="道路运输证号"  width="120" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="BaseVehicle.TransType" label="运输行业类型" width="120" show-overflow-tooltip align="center"></el-table-column>
            <!--<el-table-column prop="BaseVehicle.Nationality" label="车籍地" width="100" show-overflow-tooltip align="center"></el-table-column>-->
            <el-table-column prop="BaseVehicle.Address" label="位置"   show-overflow-tooltip align="center"></el-table-column>
          </el-table>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  // @Author: outman_qiaopeng  Date: 2018-10-15 14:37:24
  const debounce = (function() {
    let timer = 0
    return function(func, delay) {
      clearTimeout(timer)
      timer = setTimeout(func, delay)
    }
  })()
  import { BmlMarkerClusterer } from 'vue-baidu-map'
  import vehicleDialog from './vehicleDialog'
  import drivingConfig from './drivingConfig'
  import { getDownMenu } from '@/api/infomationM/dict'
  import fix from './fix'
  import { getBaseDept, getVehicleList } from '@/api/vehicleMonitor/realtime'
  import { detailVehicle } from '@/api/base/vehicle'
  import { getToken } from '@/utils/auth'
  import { formatDate } from '@/utils/date.js'
  import devParamSetDialog from './devParamSetDialog'
  import devControlDialog from './devControlDialog'
  import videoPlayer from '../realtimeVideo/videoPlayer'
  var videojs = require('video.js')
  require('videojs-flash')
  export default {
    name: 'realtime',
    components: { videoPlayer, BmlMarkerClusterer, vehicleDialog, devParamSetDialog, devControlDialog, drivingConfig, fix},
    data() {
      return {
        videoDialog: false,
        loadingZZ: false,
        nums: 10,
        channeList: [],
        videos: {
          modelClass: 'el-main-players-model4'
        },
        VideosNumber: {
          type: Object
        },
        playnow: 1,
        pid1: 'my-player1',
        pid2: 'my-player2',
        pid3: 'my-player3',
        pid4: 'my-player4',
        options1: {
          autoplay: true, // 是否自动播放
          muted: false, // 是否静音
          controls: false,
          fluid: true, // 宽高自适应
          sources: [{
            type: 'rtmp/flv',
            // src: 'rtmp://58.200.131.2:1935/livetv/hunantv'
            src: 'rtmp://1.85.32.4/live/livestream' // 默认视频
          }]
        },
        options2: {
          autoplay: true, // 是否自动播放
          muted: false, // 是否静音
          controls: false,
          fluid: true, // 宽高自适应
          sources: [{
            src: 'rtmp://1.85.32.4/live/livestream', // 默认视频
            type: 'rtmp/flv'
          }]
        },
        options3: {
          autoplay: true, // 是否自动播放
          muted: false, // 是否静音
          controls: false,
          fluid: true, // 宽高自适应
          sources: [{
            src: 'rtmp://1.85.32.4/live/livestream', // 默认视频
            type: 'rtmp/flv'
          }]
        },
        options4: {
          autoplay: true, // 是否自动播放
          muted: false, // 是否静音
          controls: false,
          fluid: true, // 宽高自适应
          sources: [{
            src: 'rtmp://1.85.32.4/live/livestream', // 默认视频
            type: 'rtmp/flv'
          }]
        },
        vehicleActiveNo:'',//预备存储当前展开的车辆信息的车牌号
        timerChangeColor:null,//改变颜色的定时器
        transTypeList: null,
        expandedTree:[],//默认展开的树节点'1-610000','1-610100'
        videoShow:false,
        vehicleTableShow:true,
        infoWindow: {
          lng:0,
          lat:0,
          show: false,
          contents: ''
        },
        testDialogVisible: true,
        tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }],
        deviceControl: false, //终端控制弹框默认隐藏
        outerVisible: false, // 控制彈框顯示隱藏 false 不顯示
        from_ADAS: {
            name : '1',
            resource : '12',

        },
        from_DSM: {
            name : '2',
            resource : '12',

        },
        value3: '',
        value2: '',
        value1: '',
        snapshot: [{
              value: '1',
              label: '不开启'
            }, {
              value: '2',
              label: '定时抓拍'
            }, {
              value: '3',
              label: '定距抓拍'
            }],
        picture: [{
              value: '1',
              label: '704*576'
            }],
        video: [{
              value: '1',
              label: 'D1'
            }, {
              value: '2',
              label: 'CIF'
            }],

        tableData_ADAS: [{
              date: '王小虎',
              name: '2016-05-04',
              address: '上海市普陀区'
            }, {
             date: '王小虎',
              name: '2016-05-04',
              address: '上海市普陀区'
            }],
        tableData_DSM: [{
              date: '王小虎',
              name: '2016-05-04',
              address: '上海市普陀区'
            }, {
              date: '王小虎',
              name: '2016-05-04',
              address: '上海市普陀区'
            }],
        tabChecked_DC : 'first',
        drivingConfig : false,
        center:{
          lng: 108.949756,
          lat: 34.346005
        },
        msgTotal:0,
        alarmList:[[]],
        platformMsgList:[[]],
        overspeedAlarmList:[],
        tiredAlarmList:[],
        safeAlarmList:[],
        driverCollectAlarm:[],
        driverCheckAlarm:[],
        autoSnapAlarm:[],
        statusItem:0,
        rightPannelShow:false,
        platformItem:0,
        alarmItem:0,
        msgType:1,
        treeMenu:false,
        activeStatus:-1,
        tableBtnRealtime: 'tableBtnRealtime',
        infoDialog: 'infoDialog',
        isShowTable: true,
        showCheckbox: true,
        loadmoreBtn: false,
        queryStr: '',
        deptTreeQuery: { id: '' },
        tyreData: [],
        fireData: [],
        bmsData: [],
        extremeData: {},
        driveDataList: [],
        vehicleInfo: {},
        address: '',
        street: '',
        resultPop: false,
        resultCard: false,
        status: 'all',
        isShowDialog: false,
        formLabelWidth: '80px',
        zoom: 12,
        labelOffset: { width: -10, height: -22 },
        treeData: [],
        deptVehCount:{},// 机构车辆数，key=节点ID，value=车辆总数、在线数、离线数
        data3: [{
          id: 1,
          label: '一级 2',
          children: [{
            id: 3,
            label: '二级 2-1',
            children: [{
              id: 4,
              label: '三级 3-1-1'
            }, {
              id: 5,
              label: '三级 3-1-2',
              disabled: true
            }]
          }, {
            id: 2,
            label: '二级 2-2',
            disabled: true,
            children: [{
              id: 6,
              label: '三级 3-2-1'
            }, {
              id: 7,
              label: '三级 3-2-2',
              disabled: true
            }]
          }]
        }],
        // defaultProps: {
        //   children: 'children',
        //   label: 'label'
        // },
        defaultProps: {
          children: 'children',
          label: 'text',
          isLeaf:'isLeaf'
        },
        asideObj: {
          allVehicle:0,
          onlineVehicle:0,
          offlineVehicle:0
        },
        lastsubscribcar: {
          vId: null,
          hasputcenter: false
        },
        websocket: null,
        vehicleList: [],
        onlineVehicleList:[],
        offlineVehicleList:[],
        runningVehicleList:[],
        stopVehicleList:[],
        alarmVehicleList:[],
        resultList: [],
        checkedList: [],
        vehicleId: '',
        topDeptId: '',
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        vehicleIdTmpList: [],
        vehicleTmpObj: {}
      }

    },
    created() {
      this.initWebSocket()
      this.alarmList[0] = []
      this.alarmList[1] = []
      this.alarmList[2] = []
      this.alarmList[3] = []
      this.alarmList[4] = []
      this.alarmList[5] = []
      this.platformMsgList[0] = []
      this.platformMsgList[1] = []
      this.getDownMenuList('vehicle_trans_type')
    },
    destroyed() {
      this.websocket.close()
    },
    mounted() {
      this.getBaseTree()
      setInterval(() => {
        this.toMapPoint()
      },500)
    },
    watch: {
      vehicleList(vehicleList){
        vehicleList.forEach((vehicle,index)=>{
          //在线状态判断
          if(vehicle.BaseVehicle.OnlineStatus==1){
            this.updateVehList(this.onlineVehicleList,vehicle)
          }else if(vehicle.BaseVehicle.OnlineStatus==0){
            this.updateVehList(this.offlineVehicleList,vehicle)
          }

          //行驶状态判断
          if(vehicle.BaseVehicle.Running==1){
            this.updateVehList(this.runningVehicleList,vehicle)
          }else if(vehicle.BaseVehicle.Running==0){
            this.updateVehList(this.runningVehicleList,vehicle)
          }
        })
      },
      alarmList(){
        this.msgTotal = vm.alarmList[0].length + vm.alarmList[1].length + vm.alarmList[2].length + vm.alarmList[3].length + vm.alarmList[4].length + vm.alarmList[5].length
      },
      queryStr(queryStr) {
        if (this.queryStr.length < 4) {
          return
        }
        debounce(() => {
          this.searchList()
        }, 100)
      },
      status(status) {
        this.$refs.tree.filter(status)
      },
      isShowTable() {
        if (this.isShowTable) {
          this.infoDialog = 'infoDialogOther'
          this.tableBtnRealtime = 'tableBtnRealtime'
        } else {
          this.infoDialog = 'infoDialog'
          this.tableBtnRealtime = 'tableBtnRealtimeOther'
        }
      }
    },
    computed:{
      totalMsg:function(){
        return this.alarmList[0].length + this.alarmList[1].length + this.alarmList[2].length + this.alarmList[3].length + this.alarmList[4].length + this.alarmList[5].length +this.platformMsgList[0].length + this.platformMsgList[1].length
      }
    },
    methods: {
      showVideoDialog() {
        this.videoDialog = true
        const param = [{ 'vehicleId': this.vehicleInfo.BaseVehicle.VehicleId, 'channelIds': ['1','2','3','4']}]
        this.subChanne(param)
        // this.deptTreeQuery = { id: `4-${this.vehicleInfo.BaseVehicle.VehicleId}`, nodeType: 4, type: 'vedio' }
        // getBaseDept(this.deptTreeQuery).then(res => {
        //   this.channeList = res.data
        // })
      },
      subChanne(param) {
        // this.chlNumber = []
        // this.chlNumber.push(val.id.split('-')[2])
        // this.rihgtVehicleId = val.id.split('-')[1]
        
        const data = {
          Command: '57',
          CommandType: 'Business',
          token: getToken('Admin-Token'),
          Body: {
            data: {
              param: param,
              avitemType: 0 // 数据类型：0音视频 1视频 2双向对讲 3监听 4中心广播 5透传
            }
          }
        }
        console.log('当前请求参数是:' + '[' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + ']', JSON.stringify(data))
        this.websocket.send(JSON.stringify(data))
        this.loadingZZ = true
        const a = () => {
          setTimeout(() => {
            if (this.loadingZZ) {
              this.nums--
              if (this.nums >= 1) {
                a()
              } else {
                this.$message.error('未获取到视频，请重试或更换车辆/通道')
                this.loadingZZ = false
                this.nums = 10
              }
            }
          }, 1000)
        }
        a()
      },
      doPlay(val, idx) {
        let arr = []
        arr.push(idx + '')
        const param = [{ 'vehicleId': this.vehicleInfo.BaseVehicle.VehicleId, 'channelIds': arr }]
        this.subChanne(param)
      },
      // 停止
      doPause(val, idx) {
        let arr = []
        arr.push(idx + '')
        const param = [{ 'vehicleId': this.vehicleInfo.BaseVehicle.VehicleId, 'channelIds': arr }]
        this.docontrol(param)
      },
      docontrol(param) { // 视频控制方法
        const data = {
          Command: '58',
          CommandType: 'Business',
          token: getToken('Admin-Token'),
          Body: {
            data: {
              param: param,
              avitemType: 0 // 数据类型：0音视频 1视频 2双向对讲 3监听 4中心广播 5透传
            }
          }
        }
        console.log('当前请求参数是：' + '[' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + ']', JSON.stringify(data))
        this.websocket.send(JSON.stringify(data))
      },
      start(val, index) {
        // ws接口改变，地址现在由页面拼接：http://[服务器ip地址]:[端口号]/[车牌号码].[车牌颜色].[逻辑通道号].[音视频标志].[时效口令]
        // const fileUrl = 'rtmp://' + val.serverIp + ':' + val.serverPort + '/live/' + val.vehicleNo + '.' + val.vehicleColor + '.' + 1 + '.' + 0 + '.' + val.authorizeCode// 临时地址
        const fileUrl = 'rtmp://1.85.32.4:1935/live/' + val.vehicleNo + '.' + val.vehicleColor + '.' + index + '.' + 0 + '.' + val.authorizeCode// 临时地址
        // const fileUrl = 'rtmp://58.200.131.2:1935/livetv/hunantv'
        const type = 'rtmp/flv'
        console.log(fileUrl)
        // this.playnow = Number(index)
        // this.playnow = 1
        switch (this.playnow) {
          case 1:
            // 在窗口1播放视频
            this.options1.sources.splice(0)
            this.options1.sources[0] = { src: fileUrl, type: type }
            this.$set(this.VideosNumber, 'video1', val.vehicleId + '-' + index)
            this.$refs.player1ref.player = videojs('my-player1', this.options1, function onPlayerReady() {
              var player = this
              player.src({ src: fileUrl, type: type })
              setTimeout(() => {
                this.play()
              }, 5000)
            })
            this.playnow = this.playnow + 1
            break
          case 2:
            // 在窗口2播放视频
            this.$set(this.VideosNumber, 'video2', val.vehicleId + '-' + index)
            this.options2.sources[0] = { src: fileUrl, type: type }
            this.$refs.player2ref.player = videojs('my-player2', this.options2, function onPlayerReady() {
              var player = this
              player.src({ src: fileUrl, type: type })
              setTimeout(() => {
                this.play()
              }, 5000)
            })
            this.playnow = this.playnow + 1
            break
          case 3:
            // 在窗口3播放视频
            this.$set(this.VideosNumber, 'video3', val.vehicleId + '-' + index)
            this.options3.sources[0] = { src: fileUrl, type: type }
            this.$refs.player3ref.player = videojs('my-player3', this.options3, function onPlayerReady() {
              var player = this
              player.src({ src: fileUrl, type: type })
              setTimeout(() => {
                this.play()
              }, 5000)
            })
            this.playnow = this.playnow + 1
            break
          case 4:
            // 在窗口4播放视频
            this.$set(this.VideosNumber, 'video4', val.vehicleId + '-' + index)
            this.options4.sources[0] = { src: fileUrl, type: type }
            this.$refs.player4ref.player = videojs('my-player4', this.options4, function onPlayerReady() {
              var player = this
              player.src({ src: fileUrl, type: type })
              setTimeout(() => {
                this.play()
              }, 5000)
            })
            this.playnow = this.playnow + 1
            break
          default:
            break
        }
      },
      // 车辆实时信息点击进入轨迹回放页面
      toPlayback(name) {
        const vNo = this.vehicleInfo.BaseVehicle.VehicleNo
        const vId = this.vehicleInfo.BaseVehicle.VehicleId
        if (name) {
          this.$router.push({name:name, params: { vId: vId, vNo: vNo }})
        }
      },
      toTextmessagesAS(name) {
        if (name) {
          const vNo = this.vehicleInfo.BaseVehicle.VehicleNo
          const vId = this.vehicleInfo.BaseVehicle.VehicleId
          this.$router.push({name:'textmessagesAS', params: { activename: name, vId: vId, vNo: vNo }})
        }
      },
      getDownMenuList(type) {
        getDownMenu(type).then(response => {
          switch (type) {
            case 'vehicle_trans_type':
              this.transTypeList = response.data
              // console.log('车辆类型数据加载完成。。。' + JSON.stringify(this.transTypeList))
              break
            default:
              break
          }
        })
      },
      drawArea(){
        // console.log('--------------drawarea........')
         var styleOptions = {
          strokeColor: 'red', // 边线颜色。
          fillColor: 'red', // 填充颜色。当参数为空时，圆形将没有填充效果。
          strokeWeight: 3, // 边线的宽度，以像素为单位。
          strokeOpacity: 0.8, // 边线透明度，取值范围0 - 1。
          fillOpacity: 0.3, // 填充的透明度，取值范围0 - 1。
          strokeStyle: 'solid' // 边线的样式，solid或dashed。
        }
        var map = this.$refs.baiduMap
        var drawingManager = new window.BMapLib.DrawingManager(map, {
          isOpen: true, // 是否开启绘制模式
          enableDrawingTool: false, // 是否显示工具栏
          drawingToolOptions: {
            anchor: window.BMAP_ANCHOR_TOP_RIGHT, // 位置
            offset: new BMap.Size(5, 5),// 偏离值
            drawingModes : [BMAP_DRAWING_RECTANGLE]
          },
          rectangleOptions: styleOptions // 矩形的样式
        })
        drawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE)
        // console.log('-----------------------------drawingManager='+drawingManager)
        drawingManager.open()
      },
      openVideo(){
        this.videoShow = true
      },
      toggleVehicleTable(){
        this.vehicleTableShow=!this.vehicleTableShow
      },
      clearSubscribe(){//清空,取消全部订阅
        this.vehicleList = []
        this.onlineVehicleList = []
        this.offlineVehicleList = []
        this.runningVehicleList = []
        this.stopVehicleList = []
        this.alarmVehicleList = []
        this.$refs.tree.setCheckedKeys([])
        this.subscribe(15, -1, -1)
        this.vehicleInfo = {}
        this.infoWindow.show = false
      },
      updateVehList(vehList,vehicleData){//判断数组中是不包括指定车辆,存在则更新，不存在则添加
        let index = -1;
        for(let i=0;i<vehList.length;i++){
          if(vehList[i].BaseVehicle.VehicleId==vehicleData.BaseVehicle.VehicleId){
            index = i
            break;
          }
        }
        if(index==-1){
          vehList.push(vehicleData)
        }else{
          this.$set(vehList,index,vehicleData)
        }
      },
      vehicleRowClick(row, event, column){
        // console.log('--->row：'+JSON.stringify(row))
        this.center.lng = row.DataVehicle.PosData.Longitude
        this.center.lat = row.DataVehicle.PosData.Latitude
      },
      timeFormatter(row, column, cellValue, index) {
        return cellValue ? formatDate(new Date(cellValue), 'hh:mm:ss') : ''
      },
      statusItemClick(statusItem){
        this.statusItem = statusItem
        aelrt(222+",statusItem="+statusItem)
      },
      alarmItemClick(item){
        this.alarmItem = item
      },
      platformItemClick(item){
        this.platformItem = item
      },
      leftAsideClick(){
        this.treeMenu = false
      },
      drivingConfigClick() {
        this.$refs.DC.drivingConfig = true
        this.$refs.DC.vehicleId = this.rihgtVehicleId
        this.$refs.DC.refreshBtn()
      },
      deviceControlClick() {
        this.$refs.DCD.deviceControl = true
        this.$refs.DCD.vehicleId = this.rihgtVehicleId
        this.$refs.DCD.refreshWifiUpdate()
        this.$refs.DCD.refreshWifiUpdate()
        this.$refs.DCD.refreshOtherControl()
      },
      outerVisibleClick() {
        this.$refs.DPSD.outerVisible = true
        // console.log(this.$refs.DPSD);
        this.$refs.DPSD.vehicleId = this.rihgtVehicleId
        this.$refs.DPSD.refreshBut()
      },
      instructionsIssue(event) {
        this.$refs.II.instructionsIssue = true
        this.$refs.II.vehicleId = this.rihgtVehicleId
        this.$refs.II.tabChecked_II = event
      },
      treeMenuRihgtClick(event,object,value,element){
        if(value.key.substring(0,value.key.indexOf('-'))=='4'){
          // this.treeMenu = true;
          let menu = document.querySelector("#menu");
        /* 菜单定位基于鼠标点击位置 */
          menu.style.left = event.clientX + 20 + "px" ;
          menu.style.top = event.clientY -95 + "px";
        }
        // console.log("右键被点击的event:",event);
        // console.log("右键被点击的object:",object);
        // console.log("右键被点击的value:",value);
        // console.log("右键被点击的element:",element);
      },
      monitorChange(status){
        this.activeStatus = status
        this.getBaseTree()
        //this.subscribeTop(24, this.topDeptId)
      },
      getBaseTree() {
        this.deptTreeQuery = { id: '', activeStatus:this.activeStatus==-1?'':this.activeStatus}
        // alert('getBaseDept' + 1)
        // alert(JSON.stringify(this.deptTreeQuery))
        getBaseDept(this.deptTreeQuery).then(res => { // 加载机构树顶级节点
          if (res.code === 0) {
            if (this.websocket.readyState === 1) {
              console.log('订阅首个节点？？？？？' + JSON.stringify(res.data[0]))
              this.subscribeTop(24, res.data[0].fullPath)
              this.subscribeTop(5, res.data[0].fullPath)
              this.subscribeExpend(4, 'online', res.data[0].fullPath)
            }
            this.topDeptId = res.data[0].fullPath
            console.log('-->>tree data:'+JSON.stringify(res.data))
            console.log('-->>？？？？？？？？？？？？？？this.topDeptId:　'+this.topDeptId)
            res.data.forEach(item => {
              if (item.fullPath === 'organTreeInfo:0--1:0-0:') {
                item.disabled = true
              }
            })
            this.treeData = res.data
            const deptVeh = this.deptVehCount[this.topDeptId] // 取机构车辆缓存数据
            this.$set(this.treeData[0], 'allVehicle', (deptVeh?deptVeh.allVehicle:0))
            this.$set(this.treeData[0], 'onlineVehicle', (deptVeh?deptVeh.onlineVehicle:0))
            this.$set(this.treeData[0], 'offlineVehicle', (deptVeh?deptVeh.allVehicle:0))
            //this.$set(this.treeData[0], 'children', [])
            //this.treeData[0].children.push({})
          } else {
            this.$message({ message: res.msg, type: 'error' })
          }
        })
      },
      searchFocus() {
        if (this.queryStr.length > 1) {
          this.searchList()
        }
      },
      searchBlur() {
        this.resultPop = false
      },
      tableBtnClick() {
        this.isShowTable = !this.isShowTable
        if (this.isShowTable) {
          this.infoDialog = 'infoDialogOther'
          this.tableBtnRealtime = 'tableBtnRealtime'
        } else {
          this.infoDialog = 'infoDialog'
          this.tableBtnRealtime = 'tableBtnRealtimeOther'
        }
      },
      traceReview() { // 跳转轨迹回放
        this.$router.push({name: 'replyingHRD', params: { vId: this.vehicleInfo.vId, vNo: this.vehicleInfo.vNo }})
      },
      searchList() { // 搜索框查询车辆列表
        const queryObj = { text: this.queryStr, activeStatus: this.activeStatus }

       getVehicleList(queryObj).then(res => {
          if (res.code === 0) {
            this.resultList = res.data
            if (res.data.length > 0) {
              this.resultPop = true
              // this.loadmoreBtn = true
            } else {
              this.resultPop = false
              // this.$message.info('暂无数据')
              // this.loadmoreBtn = false
            }
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      getDeptVehicleCount(id) { // 企业车辆总数和在线数统计
        const data = {
          Command: 24,
          CommandType: 'online',
          Token: getToken(),
          Body: {
            UnitId: id
          }
        }
        if (this.websocket.readyState === 1) {
          this.websocket.send(JSON.stringify(data))
        } else {
          this.$message.error('机构车辆数量获取失败，请稍候重试!')
        }
      },
      handleQuery() { // 查询框获得焦点
        this.resultPop = false
      },
      // loadmore() { // 加载更多
      //   this.resultCard = true
      // },
      // radioChange() { // 条件查询
      //   switch (this.status) {
      //     case 'all':
      //       this.getBaseTree('all')
      //       break
      //     case 'online':
      //       this.getBaseTree('online')
      //       break
      //     case 'offline':
      //       this.getBaseTree('offline')
      //       break
      //     default:
      //       break
      //   }
      // },
      selectCurVehicle(vehicle) { // 订阅选择查到的车辆
        if (this.checkedList.indexOf('3-' + vehicle.vehicleId) > -1) {
          // this.$message.info('当前车辆已经订阅位置信息')
        } else {
          this.checkedList.push('3-' + vehicle.vehicleId)
          this.$refs.tree.setCheckedKeys(this.checkedList)
        }
        this.subscribe(1, 1, vehicle.vehicleId)
        this.resultPop = false
      },
      contains(arrays, obj) { // 返回数组包含指定元素的下标
        var i = arrays.length
        while (i--) {
          if (arrays[i] === obj) {
            return i
          }
        }
        return false
      },
      updateDeptVehList(deptVehCount,deptData){//判断数组中是不包括指定车辆,存在则更新，不存在则添加
        for (const key in deptData) {
          if (deptVehCount.hasOwnProperty(key)) {
          }else{

          }
        }
      },
      doicon(isOnline, type, direction) {
        const directions = ['北方', '东北', '东方', '东南', '南方', '西南', '西方', '西北']
        const passengerOLIcons = ['car_passenger_OL_N.png', 'car_passenger_OL_EN.png', 'car_passenger_OL_E.png', 'car_passenger_OL_ES.png', 'car_passenger_OL_S.png', 'car_passenger_OL_WS.png', 'car_passenger_OL_W.png', 'car_passenger_OL_WN.png']
        const passengerOFLIcons = ['car_passenger_OFL_N.png', 'car_passenger_OFL_EN.png', 'car_passenger_OFL_E.png', 'car_passenger_OFL_ES.png', 'car_passenger_OFL_S.png', 'car_passenger_OFL_WS.png', 'car_passenger_OFL_W.png', 'car_passenger_OFL_WN.png']
        const tourismOLIcons = ['car_tourism_OL_N.png', 'car_tourism_OL_EN.png', 'car_tourism_OL_E.png', 'car_tourism_OL_ES.png', 'car_tourism_OL_S.png', 'car_tourism_OL_WS.png', 'car_tourism_OL_W.png', 'car_tourism_OL_WN.png']
        const tourismOFLIcons = ['car_tourism_OFL_N.png', 'car_tourism_OFL_EN.png', 'car_tourism_OFL_E.png', 'car_tourism_OFL_ES.png', 'car_tourism_OFL_S.png', 'car_tourism_OFL_WS.png', 'car_tourism_OFL_W.png', 'car_tourism_OFL_WN.png']
        const dangerOLIcons = ['car_danger_OL_N.png', 'car_danger_OL_EN.png', 'car_danger_OL_E.png', 'car_danger_OL_ES.png', 'car_danger_OL_S.png', 'car_danger_OL_WS.png', 'car_danger_OL_W.png', 'car_danger_OL_WN.png']
        const dangerOFLIcons = ['car_danger_OFL_N.png', 'car_danger_OFL_EN.png', 'car_danger_OFL_E.png', 'car_danger_OFL_ES.png', 'car_danger_OFL_S.png', 'car_danger_OFL_WS.png', 'car_danger_OFL_W.png', 'car_danger_OFL_WN.png']
        const otherOLIcons = ['car_other_OL_N.png', 'car_other_OL_EN.png', 'car_other_OL_E.png', 'car_other_OL_ES.png', 'car_other_OL_S.png', 'car_other_OL_WS.png', 'car_other_OL_W.png', 'car_other_OL_WN.png']
        const otherOFLIcons = ['car_other_OFL_N.png', 'car_other_OFL_EN.png', 'car_other_OFL_E.png', 'car_other_OFL_ES.png', 'car_other_OFL_S.png', 'car_other_OFL_WS.png', 'car_other_OFL_W.png', 'car_other_OFL_WN.png']
        if(type == '客运班线') {
          const index = directions.indexOf(direction)
          const icon = isOnline == '1' ? passengerOLIcons[index] : passengerOFLIcons[index]
          return icon
        } else if(type == '旅游包车') {
          const index = directions.indexOf(direction)
          const icon = isOnline == '1' ? tourismOLIcons[index] : tourismOFLIcons[index]
          return icon
        } else if(type == '危险货运') {
          const index = directions.indexOf(direction)
          const icon = isOnline == '1' ? dangerOLIcons[index] : dangerOFLIcons[index]
          return icon
        } else {
          const index = directions.indexOf(direction)
          const icon = isOnline == '1' ? otherOLIcons[index] : otherOFLIcons[index]
          return icon
        }
      },
      initWebSocket() { // 初始化websocket
        const vm = this
        vm.websocket = new WebSocket(process.env.WEBSOCKET_API)
        // vm.websocket = new WebSocket('ws://192.168.5.137:6947')
        vm.websocket.onopen = function() {
          console.log('websocket连接成功：' + process.env.WEBSOCKET_API)
          if (vm.topDeptId && vm.topDeptId !== '') {
            vm.subscribeTop(5, vm.topDeptId)
            vm.subscribeTop(24, vm.topDeptId)
            vm.subscribeExpend(4, 'online', vm.topDeptId)
          }
        }
        vm.websocket.onmessage = function(evt) {
          const obj = JSON.parse(evt.data)
          // console.log('['+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds()+'] receive command('+obj.Command+') message:' + JSON.stringify(obj))
          switch (obj.Command) {
            case '57': { // 获得sim号
              // console.log(obj.Body)
              if (obj.Body.result === 0) {
                if (!vm.loadingZZ) return
                vm.loadingZZ = false
                vm.nums = 10
                switch (vm.index) {
                  case 1:
                    vm.start(obj.Body, vm.index)
                    vm.index = vm.index + 1
                    break
                  case 2:
                    vm.start(obj.Body, vm.index)
                    vm.index = vm.index + 1
                    break
                  case 3:
                    vm.start(obj.Body, vm.index)
                    vm.index = vm.index + 1
                    break
                  case 4:
                    vm.start(obj.Body, vm.index)
                    vm.index = 1
                    break
                  default: {
                    break
                  }
                }
              } else if (obj.Body.result === 1) {
                vm.loadingZZ = false
                vm.nums = 10
                this.$message({ type: 'error', message: '失败' })
              } else if (obj.Body.result === 2) {
                vm.loadingZZ = false
                vm.nums = 10
                this.$message({ type: 'error', message: '不支持' })
              } else if (obj.Body.result === 3) {
                vm.loadingZZ = false
                vm.nums = 10
                this.$message({ type: 'error', message: '回话结束' })
              } else if (obj.Body.result === 4) {
                vm.loadingZZ = false
                vm.nums = 10
                this.$message({ type: 'error', message: '时效口令错误' })
              } else if (obj.Body.result === 5) {
                vm.loadingZZ = false
                vm.nums = 10
                this.$message({ type: 'error', message: '不满足跨域条件' })
              }
              break
            }
            case '15': // 取消订阅应答
              // console.log('['+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds()+'] receive command('+obj.Command+') message:' + JSON.stringify(obj))
              const vehIds = obj.Body.VehIds;
              for(let i =0;i<vehIds.length;i++){
                vm.deleteArray2(vm.vehicleIdTmpList,vehIds[i])
                vm.deleteArray(vm.vehicleList,vehIds[i])
                vm.deleteArray(vm.onlineVehicleList,vehIds[i])
                vm.deleteArray(vm.offlineVehicleList,vehIds[i])
                vm.deleteArray(vm.runningVehicleList,vehIds[i])
                vm.deleteArray(vm.stopVehicleList,vehIds[i])
                vm.deleteArray(vm.alarmVehicleList,vehIds[i])
              }
              break;
            case '26': // 订阅->轨迹数据
              //如果当前有打开的车辆信息窗口
              // if(vm.infoWindow.show){
              //   console.log(666666)
              //   // 改变所在label字体颜色
              //   var labels = document.getElementsByTagName('label');
              //   for(var i=0;i<labels.length;i++){
              //     //console.log(labels[i].innerHTML);
              //     if(labels[i].innerHTML==vm.vehicleActiveNo){
              //       console.log(labels[i])
              //       labels[i].style.color = 'red'
              //     }
              //   }
              // }
              // console.log('['+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds()+'] receive command('+obj.Command+') message:' + JSON.stringify(obj))
              // console.log('收到实时定位数据，车辆Id:' + obj.Body.BaseVehicle.VehicleId)
              // console.log('运输运输行业类型：' + JSON.stringify(vm.transTypeList))
              if (!vm.vehicleIdTmpList) {
                vm.vehicleIdTmpList.push(obj.Body.BaseVehicle.VehicleId)
                vm.vehicleTmpObj[obj.Body.BaseVehicle.VehicleId] = obj
              } else {
                if (vm.vehicleIdTmpList.indexOf(obj.Body.BaseVehicle.VehicleId) === -1) {
                  vm.vehicleIdTmpList.push(obj.Body.BaseVehicle.VehicleId)
                }
                vm.vehicleTmpObj[obj.Body.BaseVehicle.VehicleId] = obj // 将当前车辆obj赋值给vehicleTmObj
              }

              // vm.toMapPoint()

              

              // statusItem==0?vehicleList:(statusItem==1?onlineVehicleList:(statusItem==2?offlineVehicleList:(statusItem==3?runningVehicleList:(statusItem==4?stopVehicleList:(statusItem==5?alarmVehicleList:vehicleList))))
              // console.log('statusItem:' + this.statusItem + ' ')
              // console.log('收到实时定位数据，车辆Id:' + obj.Body.BaseVehicle.VehicleId)
              // console.log('statusItem***********************' + vm.statusItem)
              // console.log('vehicleList***********************' + JSON.stringify(vm.vehicleList) + '***********************' )
              break
            case '27': // 实时接收已展开过的节点下车辆上下线通知
              // console.log('['+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds()+'] receive command('+obj.Command+') message:' + JSON.stringify(obj))

              const offlineVeh = obj.Body.Offline
              const onlineVeh = obj.Body.Online

              offlineVeh.forEach(nodePath => {
                if (vm.$refs.tree.getNode(nodePath) !== null) {
                  vm.$refs.tree.getNode(nodePath).data.online = '0'
                }
              });

              onlineVeh.forEach(nodePath => {
                if (vm.$refs.tree.getNode(nodePath) !== null) {
                  vm.$refs.tree.getNode(nodePath).data.online = '1'
                }
              })
              break
            case '33': // 企业车辆总数,在线数,离线数统计
              console.log('['+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds()+'] receive command('+obj.Command+') message:' + JSON.stringify(obj))
              vm.asideObj = obj.Body
              // console.log('??????????????????????' + JSON.stringify(obj))
              vm.treeData[0].onlineVehicle = obj.Body.onlineVehicle
              vm.treeData[0].allVehicle = obj.Body.allVehicle
              vm.deptVehCount[vm.topDeptId] = obj.Body //缓存顶级节车辆数，32 command不返回顶级节点
              // vm.treeData[0].offlineVehicle= obj.body.offlineVehicle
              break
            case '32': // 获取企业所有节点车辆在线数
              // console.log('['+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds()+'] receive command('+obj.Command+') message:' + JSON.stringify(obj))
              const nodeArr = []
              const data = obj.Body
              // console.log(JSON.stringify("???????????" + data))
              for (const key in data) {
                // if (data.hasOwnProperty(key)) {
                //   const obj1 = { id: key, count: data[key] }
                //   nodeArr.push(obj1)
                // }
                //更新机构车辆数缓存
                vm.deptVehCount[key] = data[key]
                //更新机构树节点的车辆总数、在线数、离线数
                // vm.setDataTotree(vm.treeData[0].children, key, data[key])
                // vm.$refs.tree.updateKeyChildren(key, data[key])
              }

              if (vm.treeData[0].children) {
                let childrenData = vm.treeData[0].children
                vm.updataTree(childrenData)
              }

              //更新下级机构的车辆总数
              // for (let i = 0; i < nodeArr.length; i++) {
              //   vm.setDataTotree(vm.treeData[0].children, nodeArr[i].id, nodeArr[i].count)
              // }
              break
            default:
              break
          }
        }
        vm.websocket.onerror = function() {
          vm.initWebSocket()
        }
      },
      toMapPoint() {
        let vid5arr = []
        if (!this.vehicleIdTmpList) return
        if (this.vehicleIdTmpList.length < 5) vid5arr = this.vehicleIdTmpList
        else {
          for (let i = 0; i < 5; i++) {
            vid5arr.push(this.vehicleIdTmpList[i])
          }
        }
        vid5arr.forEach((vid) => {
          const vm = this
          let obj = this.vehicleTmpObj[vid]
          for(var i=0; i < vm.transTypeList.length; i++) { // 运输运输行业类型
            if(obj.Body.BaseVehicle.TransType === vm.transTypeList[i].code) {
              /* 客运班线：道路旅客运输10、班车客运11
                  旅游包车：包车客运12、定线旅游13、非定线旅游14
                  危险货运：道路货物运输20、道路普通货物运输21、货物专用运输22、大型物件运输23、道路危险货物运输30、
                  营运性危险货物运输31、非经营性危险货物运输32 */
              const passenger = ['10', '11']
              const tourism = ['12', '13', '14']
              const danger = ['20', '21', '22', '23', '30', '31', '32']
              // console.log('************************' + obj.Body.BaseVehicle.TransType)
              if(passenger.indexOf(obj.Body.BaseVehicle.TransType) > 0) { // 自定义分类,未匹配到显示本身
                // console.log('************************ 客运班线')
                obj.Body.BaseVehicle.TransType = '客运班线'
              } else if(tourism.indexOf(obj.Body.BaseVehicle.TransType) > 0) {
                // console.log('************************ 旅游包车')
                obj.Body.BaseVehicle.TransType = '旅游包车'
              } else if(danger.indexOf(obj.Body.BaseVehicle.TransType) > 0) {
                // console.log('************************ 危险货运')
                obj.Body.BaseVehicle.TransType = '危险货运'
              } else {
                obj.Body.BaseVehicle.TransType = vm.transTypeList[i].value
              }
            }
          }
          if((obj.Body.DataVehicle.PosData.Direction >= 0 && obj.Body.DataVehicle.PosData.Direction < 22.5) || (obj.Body.DataVehicle.PosData.Direction >= 337.5 && obj.Body.DataVehicle.PosData.Direction <= 360)) {
            obj.Body.DataVehicle.PosData.Direction = '北方'
            obj.Body.BaseVehicle.Icon = vm.doicon(obj.Body.BaseVehicle.OnlineStatus, obj.Body.BaseVehicle.TransType, '北方')
          } else if(obj.Body.DataVehicle.PosData.Direction >= 22.5 && obj.Body.DataVehicle.PosData.Direction < 67.5) {
            obj.Body.DataVehicle.PosData.Direction = '东北'
            obj.Body.BaseVehicle.Icon = vm.doicon(obj.Body.BaseVehicle.OnlineStatus, obj.Body.BaseVehicle.TransType, '东北')
          } else if(obj.Body.DataVehicle.PosData.Direction >= 67.5 && obj.Body.DataVehicle.PosData.Direction < 112.5) {
            obj.Body.DataVehicle.PosData.Direction = '东方'
            obj.Body.BaseVehicle.Icon = vm.doicon(obj.Body.BaseVehicle.OnlineStatus, obj.Body.BaseVehicle.TransType, '东方')
          } else if(obj.Body.DataVehicle.PosData.Direction >= 112.5 && obj.Body.DataVehicle.PosData.Direction < 157.5) {
            obj.Body.DataVehicle.PosData.Direction = '东南'
            obj.Body.BaseVehicle.Icon = vm.doicon(obj.Body.BaseVehicle.OnlineStatus, obj.Body.BaseVehicle.TransType, '东南')
          } else if(obj.Body.DataVehicle.PosData.Direction >= 157.5 && obj.Body.DataVehicle.PosData.Direction < 202.5) {
            obj.Body.DataVehicle.PosData.Direction = '南方'
            obj.Body.BaseVehicle.Icon = vm.doicon(obj.Body.BaseVehicle.OnlineStatus, obj.Body.BaseVehicle.TransType, '南方')
          } else if(obj.Body.DataVehicle.PosData.Direction >= 202.5 && obj.Body.DataVehicle.PosData.Direction < 247.5) {
            obj.Body.DataVehicle.PosData.Direction = '西南'
            obj.Body.BaseVehicle.Icon = vm.doicon(obj.Body.BaseVehicle.OnlineStatus, obj.Body.BaseVehicle.TransType, '西南')
          } else if(obj.Body.DataVehicle.PosData.Direction >= 247.5 && obj.Body.DataVehicle.PosData.Direction < 292.5) {
            obj.Body.DataVehicle.PosData.Direction = '西方'
            obj.Body.BaseVehicle.Icon = vm.doicon(obj.Body.BaseVehicle.OnlineStatus, obj.Body.BaseVehicle.TransType, '西方')
          } else if(obj.Body.DataVehicle.PosData.Direction >= 292.5 && obj.Body.DataVehicle.PosData.Direction < 337.5) {
            obj.Body.DataVehicle.PosData.Direction = '西北'
            obj.Body.BaseVehicle.Icon = vm.doicon(obj.Body.BaseVehicle.OnlineStatus, obj.Body.BaseVehicle.TransType, '西北')
          }
          // console.log('vehicle***********************' + JSON.stringify(obj.Body.BaseVehicle))

          const dataVehicle = obj.Body.DataVehicle;
          const baseVehicle = obj.Body.BaseVehicle;
          const vdata = obj.Body;
          const point = new BMap.Point(dataVehicle.PosData.Longitude, dataVehicle.PosData.Latitude)
          new BMap.Geocoder().getLocation(point, function(rs) {
            vdata.BaseVehicle.PC = rs.addressComponents.province + rs.addressComponents.city
            vdata.BaseVehicle.Street = rs.addressComponents.district + rs.addressComponents.street + rs.addressComponents.streetNumber
            vdata.BaseVehicle.Address = vdata.BaseVehicle.PC + vdata.BaseVehicle.Street
            for(let j = 0; j < vm.vehicleList.length; j++){
              // console.log('*****************vid:' + vm.lastsubscribcar.vId + '********hasputcenter:' + vm.lastsubscribcar.hasputcenter)
              let v = vm.vehicleList[j]
              if((vm.lastsubscribcar.vId == v.BaseVehicle.VehicleId) && vm.lastsubscribcar.hasputcenter == false) { // 收到实时数据为最后一次订阅的车辆，首次应该重置地图中心点
                // console.log('重置地图中心点。。。。。。。。。。。')
                vm.center.lat = v.DataVehicle.PosData.Latitude
                vm.center.lng = v.DataVehicle.PosData.Longitude
                var map = vm.$refs.baiduMap
                // alert(JSON.stringify(map))
                vm.zoom =20
                vm.lastsubscribcar.hasputcenter = true
              }
              // console.log('循环++++++++++：v.BaseVehicle.VehicleId： ' + v.BaseVehicle.VehicleId)
              if(v.BaseVehicle.VehicleId == obj.Body.BaseVehicle.VehicleId) {
                v.BaseVehicle.Address = vdata.BaseVehicle.PC + vdata.BaseVehicle.Street
              } else {
                // 非自己的数据无须更新
              }
              vm.$set(vm.vehicleList,j,v)
            }
          })

          if (vm.vehicleList.length === 0) {
            vm.vehicleList.push(vdata)
          } else {
            const arr = []
            for (let i = 0; i < vm.vehicleList.length; i++) {
              arr.push(vm.vehicleList[i].BaseVehicle.VehicleId)
            }
            if (arr.indexOf(baseVehicle.VehicleId) > -1) {
              const j = vm.contains(arr, baseVehicle.VehicleId)
              vm.vehicleList[j] = vdata
            } else {
              vm.vehicleList.push(vdata)
            }
            if(vm.vehicleInfo.BaseVehicle!=undefined&&vm.vehicleInfo.BaseVehicle.VehicleId===baseVehicle.VehicleId){
              // 处理 运输运输行业类型
              vm.vehicleInfo = vdata
            }
          }

          // vm.vehicleIdTmpList.map((item) => {
          //   return item !== vid
          // })
          vm.deleteArray2(vm.vehicleIdTmpList,vid)
        })
        
        
      },
      updataTree(childrenData) {
        childrenData.forEach(child => {
          if (child.children && child.children instanceof Array) {
            this.updataTree(child.children)
          } 
          if (child.type !== '4') {
            const deptVeh = this.deptVehCount[child.fullPath] // 取机构车辆缓存数据
            this.$set(child, 'allVehicle', (deptVeh?deptVeh.allVehicle:0))
            this.$set(child, 'onlineVehicle', (deptVeh?deptVeh.onlineVehicle:0))
            this.$set(child, 'offlineVehicle', (deptVeh?deptVeh.offlineVehicle:0))
          } else {
            // this.$set(child, 'online', '1')
          }
        })
      },
      setDataTotree(treeData, pId, obj) { // 机构树填值
        if (treeData) {
          for (let i = 0; i < treeData.length; i++) {
            const td = treeData[i]
            if (td.type !== '4') {
              if (td.id) {
                if (td.id === pId) {
                  treeData[i].allVehicle = obj.allVehicle
                  treeData[i].onlineVehicle = obj.onlineVehicle
                  treeData[i].offlineVehicle = obj.offlineVehicle
                  return
                } else {
                  this.setDataTotree(treeData[i].children, pId, obj)
                }
              }
            } else {
              if (td.id === pId) {
                treeData[i].online = obj.online
              } else {
                this.setDataTotree(treeData[i].children, pId, obj)
              }
            }
          }
        }
      },
      subscribe(command, isdept, id) { // 发送websocket消息，获取车辆或者机构下车辆经纬度信息
        const data = {
          Command: command,
          CommandType: 'track',
          Token: getToken(),
          Body: {
            isdept: isdept,
            id: id
          }
        }
        console.log('ws请求参数：', data)
        if (this.websocket.readyState === 1) {
          this.websocket.send(JSON.stringify(data))
        } else {
          console.log('websocket信息发送失败')
        }
      },
      renderContent(h, { node, data, store }) { // 渲染tree
        if (data.type === '1') {
          if(this.activeStatus==-1){
            return (
              <span style="height:18px;line-height:18px">
                <i class='tree_dept_icon'></i>
                <span>{node.label}</span>
                <span>({data.onlineVehicle}/{data.allVehicle})</span>
              </span>
            )
          }else if(this.activeStatus==1){
            return (
              <span style="height:18px;line-height:18px">
                <i class='tree_dept_icon'></i>
                <span>{node.label}</span>
                <span>({data.onlineVehicle})</span>
              </span>
            )
          }else if(this.activeStatus==0){
            return (
              <span style="height:18px;line-height:18px">
                <i class='tree_dept_icon'></i>
                <span>{node.label}</span>
                <span>({data.allVehicle - data.onlineVehicle})</span>
              </span>
            )
          }
        } else if (data.type === '4') {
          if (data.online === '1') {
            return (
              <span class="online">
                <i class='tree_veh_online_icon'></i>
                <span>{node.label}</span>
              </span>
            )
          } else {
            return (
              <span class="offline">
                <i class='tree_veh_offline_icon'></i>
                <span>{node.label}</span>
              </span>
            )
          }
        } else if (data.type === '2') {
          if(this.activeStatus==-1){
            return (
              <span>
                <i class='tree_line_icon'></i>
                <span>{node.label}</span>
                <span>({data.onlineVehicle}/{data.allVehicle})</span>
              </span>
            )
          }else if(this.activeStatus==1){
            return (
              <span>
                <i class='tree_line_icon'></i>
                <span>{node.label}</span>
                <span>({data.onlineVehicle})</span>
              </span>
            )
          }else if(this.activeStatus==0){
            return (
              <span>
                <i class='tree_line_icon'></i>
                <span>{node.label}</span>
                <span>({data.allVehicle - data.onlineVehicle})</span>
              </span>
            )
          }
        }else if (data.type === '3') {
          if(this.activeStatus==-1){
            return (
              <span>
                <i class='tree_owers_icon'></i>
                <span>{node.label}</span>
                <span>({data.onlineVehicle}/{data.allVehicle})</span>
              </span>
            )
          }else if(this.activeStatus==1){
            return (
              <span>
                <i class='tree_owers_icon'></i>
                <span>{node.label}</span>
                <span>({data.onlineVehicle})</span>
              </span>
            )
          }else if(this.activeStatus==0){
            return (
              <span>
                <i class='tree_owers_icon'></i>
                <span>{node.label}</span>
                <span>({data.allVehicle - data.onlineVehicle})</span>
              </span>
            )
          }
        }
      },
      subscribeExpend(command, commandType, deptId) { // 实时接收已展开过的节点下车辆上下线通知
        const data = {
          Command: command,
          CommandType: commandType,
          Token: getToken(),
          Body: {
            deptId: deptId
          }
        }
        if (this.websocket.readyState === 1) {
          console.log(formatDate(new Date(), 'hh:mm:ss') + '==实时接收已展开过的节点下车辆上下线通知请求参数：', JSON.stringify(data))
          this.websocket.send(JSON.stringify(data))
        } else {
          console.log('websocket信息发送失败')
        }
      },
      subscribeTop(command, deptId) { // 获取企业节点车辆在线数
        const data = {
          Command: command,
          CommandType: 'online',
          Token: getToken(),
          Body: {
            TopDeptId: deptId
          }
        }
        if (this.websocket.readyState === 1) {
          console.log(formatDate(new Date(), 'hh:mm:ss') + '==获取企业节点车辆在线数请求参数：', JSON.stringify(data))
          this.websocket.send(JSON.stringify(data))
        } else {
          console.log('websocket信息发送失败')
        }
      },
      loadDeptNode(node,resolve){
        // console.log("1---1")
        const deptId = node.key
        const vm = this
        // if (data.children.length > 1) {
        //   return
        // } else {
        this.deptTreeQuery = { id: node.data.fullPath, activeStatus:this.activeStatus==-1?'':this.activeStatus, nodeType: node.data.type}
        // alert('getBaseDept' + 2)
        if(node.level === 0) {
          return
        }
        getBaseDept(this.deptTreeQuery).then(res => {
          // console.log('tree data：'+JSON.stringify(res))
          if (res.code === 0) {
            const checkArr = this.checkedList
            const childrenData = res.data
            const _this = this
            // alert(JSON.stringify(childrenData))
            if (childrenData.length === 0) {
              node.isLeaf = true // 叶子
              resolve([])
              return
            }
            for (let i = 0; i < childrenData.length; i++) {
              const child = childrenData[i]
              if (this.checkedList.indexOf(node.key) > -1) {
                checkArr.push(child.fullPath)
              }
              if (child.type !== '4') {
                const deptVeh = this.deptVehCount[child.fullPath] // 取机构车辆缓存数据
                this.$set(child, 'allVehicle', (deptVeh?deptVeh.allVehicle:0))
                this.$set(child, 'onlineVehicle', (deptVeh?deptVeh.onlineVehicle:0))
                this.$set(child, 'offlineVehicle', (deptVeh?deptVeh.offlineVehicle:0))
              } else {
                this.$set(child, 'online', '0')
              }
            }
            const allarr = this.treeData
            if (node.level !== 0) {
              // 异步加载树节点 push到treedata中给websocket32使用
              let a = (allarr) => {
                allarr.forEach((item, index, arr) => {
                  if (item.children && item.children instanceof Array) {
                    a(item.children)
                  } else {
                    if (item.fullPath === node.key) {
                      arr[index].children = childrenData
                    } 
                  }
                })
              }
              a(allarr)
            }
            this.treeData = allarr
            childrenData.forEach(item => {
              if(item.fullPath === 'organTreeInfo:0--1:0-0:1-610000:') {
                item.disabled = true
              }
              if (this.activeStatus === 0) {
                item.disabled = true
              }
            })
            resolve(childrenData)
            this.subscribeExpend(4, 'online', deptId)
            setTimeout(() => {
              if (childrenData.length > 0) {
                _this.$refs.tree.setCheckedKeys(checkArr)
              } else {
                _this.$refs.tree.setCheckedKeys(_this.checkedList)
              }
            }, 10)
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      handleNodeExpand(data, node) {
        const deptId = data.id
        const vm = this
        // console.log("1---3")
        // if (data.children.length > 1) {
        //   return
        // } else {
        this.deptTreeQuery = { id: node.data.fullPath, activeStatus:this.activeStatus==-1?'':this.activeStatus, nodeType: node.data.type}
        // alert('getBaseDept' + 3)
        getBaseDept(this.deptTreeQuery).then(res => {
          // console.log('tree data：'+JSON.stringify(res))
          if (res.code === 0) {
            const checkArr = this.checkedList
            const arr = res.data
            const _this = this
            if (arr.length === 0) {
              //data.isLeaf = true
              node.isLeaf = true
              //vm.$set(data, 'isLeaf', false)
              //console.log('-----------node:'+node.isLeaf)
              //node.expanded = false
              //this.$message.info('暂无下级数据')
              return
            }
            for (let i = 0; i < arr.length; i++) {
              const element = arr[i]
              if (this.checkedList.indexOf(data.id) > -1) {
                checkArr.push(element.fullpath)
              }
              if (element.type !== '4') {
                if (!element.children) {
                  this.$set(element, 'children', [])
                  //element.children.push({})
                }
                const deptVeh = this.deptVehCount[element.id] // 取机构车辆缓存数据
                this.$set(element, 'text', element.text)
                this.$set(element, 'allVehicle', (deptVeh?deptVeh.allVehicle:0))
                this.$set(element, 'onlineVehicle', (deptVeh?deptVeh.onlineVehicle:0))
                this.$set(element, 'offlineVehicle', (deptVeh?deptVeh.offlineVehicle:0))
              } else {
                this.$set(element, 'online', '0')
              }
            }
            data.children = arr
            this.subscribeExpend(4, 'online', deptId)
            setTimeout(() => {
              if (arr.length > 0) {
                _this.$refs.tree.setCheckedKeys(checkArr)
              } else {
                _this.$refs.tree.setCheckedKeys(_this.checkedList)
              }
            }, 10)
          } else {
            this.$message.error(res.msg)
          }
        })
        // }
      },
      getCurrentKey(data, node) { // 获取当前选中节点的key
        const id = data.id
        const fullpath = data.fullPath
        this.checkedList = node.checkedKeys
        console.log('data' + JSON.stringify(data))
        console.log('checkedList' + JSON.stringify(this.checkedList))
        if (this.checkedList.indexOf(data.fullPath) > -1) {
          console.log("订阅。。。。。。。。。。。")
          if (data.type === '4') {
            this.infoWindow.show = false
            // this.subscribe(1, 1, id.substring(2))
            this.subscribe(1, 1, fullpath)
            this.lastsubscribcar.vId = id.substring(2)
            this.lastsubscribcar.hasputcenter = false
          } else {
            this.infoWindow.show = false
            // this.subscribe(1, 0, id)
            this.subscribe(1, 0, fullpath)
          }
        } else {
          if (data.type === '4') {
            this.infoWindow.show = false
            if (id === this.vehicleInfo.vId + '') {
              this.isShowDialog = false
            }
            // this.subscribe(15, 1, id.substring(2))
            this.subscribe(15, 1, fullpath)
            // this.subscribe(15, 1, id.split('-')[1])
            this.deleteArray(this.vehicleList, data.id)
            if(this.lastsubscribcar.vId === id.substring(2)) {
              this.lastsubscribcar.vId = null
              this.lastsubscribcar.hasputcenter = false
            }
          } else {
            this.infoWindow.show = false
            // this.subscribe(15, 0, id)
            this.subscribe(15, 0, fullpath)
            // this.checkedList = node.checkedKeys 已经将 this.checkedList 刷新无需以下操作

            // const vehicleArray = []
            // const arr = this.getSelectArr(vehicleArray, this.treeData[0].children, data.id)
            // console.log('arr:??????' + JSON.stringify(arr))
            // for (let i = 0; i < arr.length; i++) {
            //   this.deleteArray(this.vehicleList, arr[i].id)
            // }
          }
        }
      },
      cancelSubscribe(row) {
        this.infoWindow.show = false
        this.subscribe(15, 1, row.BaseVehicle.VehicleId)
        this.deleteArray(this.vehicleList, row.BaseVehicle.VehicleId)
        console.log('车辆id：' + row.BaseVehicle.VehicleId)
        if (this.$refs.tree.getNode(row.BaseVehicle.FullPath) !== null) {
          this.$refs.tree.getNode(row.BaseVehicle.FullPath).checked = false
          // console.log('nodenodenodenode' + node)
        }
      },
      getSelectArr(vehicleArray, arr, deptId) {
        if (arr) {
          for (let i = 0; i < arr.length; i++) {
            const td = arr[i]
            if (td.type === '3') {
              vehicleArray.push(td)
            } else {
              this.getSelectArr(vehicleArray, arr[i].children, deptId)
            }
          }
          return vehicleArray
        }
      },
      deleteArray(list, id) { // 删除数组中的某个元素
        for (let i = 0; i < list.length; i++) {
          if (list[i].BaseVehicle.VehicleId === id) {
            if (i === 0) {
              list.shift()
              return list
            } else if (i === list.length - 1) {
              list.pop()
              return list
            } else {
              list.splice(i, 1)
              return list
            }
          }
        }
      },
      deleteArray2(list, id) { // 删除数组中的某个元素
        for (let i = 0; i < list.length; i++) {
          if (list[i] === id) {
            if (i === 0) {
              list.shift()
              return list
            } else if (i === list.length - 1) {
              list.pop()
              return list
            } else {
              list.splice(i, 1)
              return list
            }
          }
        }
      },
      handler({ BMap, map }) { // 地图加载完成
        this.zoom = 20
        var mapType1 = new BMap.MapTypeControl(
          {
            mapTypes: [BMAP_NORMAL_MAP,BMAP_SATELLITE_MAP],
            anchor: BMAP_ANCHOR_TOP_RIGHT
          }
        );
        map.addControl(mapType1);          //2D图，卫星
      },
      handleNodeClick(val) { // 结点点击事件
        this.leftAsideClick()
      },
      dialogClose() { // 关闭车辆信息dialog
        this.isShowDialog = false
      },
      openDialog(vehicle) { // 打开车辆信息dialog
        // this.vehicleId = vehicle.vId
        // this.vehicleInfo = vehicle
        // this.address = vehicle.address
        // this.street = vehicle.street
        // //this.isShowDialog = true
        // if (this.isShowTable) {
        //   this.infoDialog = 'infoDialogOther'
        // } else {
        //   this.infoDialog = 'infoDialog'
        // }

        // 经度
        this.infoWindow.lng = vehicle.DataVehicle.PosData.Longitude
        // 纬度
        this.infoWindow.lat = vehicle.DataVehicle.PosData.Latitude
        this.infoWindow.show = true
        // 保存当前车辆信息的车牌号
        this.vehicleActiveNo = vehicle.BaseVehicle.VehicleNo
        this.vehicleInfo = vehicle
        //console.log(this.zoom)
      },
      infoWindowClose(type, target, point){
        this.infoWindow.show = false
        clearInterval(this.timerChangeColor)
      },
      infoWindowOpen (type, target, point) {
        this.infoWindow.show = true
        //修改当前显示的车辆的车牌颜色
        this.timerChangeColor = setInterval(()=>{
          var labels = document.getElementsByTagName('label')
          for(var i=0;i<labels.length;i++){
            if(labels[i].innerHTML==this.vehicleActiveNo){
              labels[i].style.color='red'
            }
          }
        },100)

      },
      msgTypeClick(type){
        this.msgType = type
      },
      toggleRightPanel(){
        this.rightPannelShow = !this.rightPannelShow
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scope>
/* @import '../../../styles/video-js.min.css'; */
.j-realtime .el-dialog__header {
    background-color: #5F7ABF;
    height: 50px;
    padding-top: 12px;
  }
  .j-realtime .el-dialog__header span {
    color: #fff;
    font-size: 14px
  }
  .j-realtime .el-dialog__header i {
    color: #fff;
  }
  .j-realtime .el-dialog__headerbtn .el-dialog__close {
    color:#fff;
  }
  .j-realtime .styledialog {
    width: 52.5%;
  }
  .j-realtime.el-dialog__headerbtn{
    top: 10px;
  }
  .j-realtime .el-dialog__body{
    padding-bottom: 0;
  }
  .j-realtime .filter-btn {
    background-color: #5F7ABF;
    border-color: #5F7ABF;
  }
  .channe-btn {
    span {
      border: 1px solid #eee;
      padding: 5px 10px;
      margin-right: 10px;
      cursor: pointer;
      &.active {
        border: 1px solid #409eff;
        color: #409eff;
      }
    }
  }
  .el-container-videos {
    transition: height 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
    position: relative;
  }
  .j-realtime .zzloading {
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 2000;
    position: absolute;
    top: 60px;
    right: 0;
    bottom: 10px;
    left: 0;
    transition: opacity .3s;
  }
  .j-realtime .zzloading .zzloading-spinner {
    top: 40%;
    width: 100%;
    text-align: center;
    position: absolute;
    color: #409EFF;
  }
  .j-realtime .zzloading .zzloading-text {
    margin: 3px 0;
    font-size: 14px;
  }
  .j-realtime .zzloading .zzloading-cannel {
    font-size: 14px;
    border: 1px solid #409eff;
    margin: 20px auto;
    display: block;
    width: 80px;
    text-align: center;
    height: 26px;
    line-height: 24px;
    border-radius: 13px;
    cursor: pointer;
  }
  .plfloat {
    position: absolute;
    bottom: 5px;
    right: 5px;
  }
  .videoBtns {
    padding: 8px 15px;
    background: rgba(97,95,95,.4);
    border: none;
  }
  .videoBtns:hover,.videoBtns:active {
    background: rgba(97,95,95,.4);
  }
  .el-main-players {
    padding: 0;
    overflow: hidden;
    margin: 10px 0;
    .player {
      position: relative;
      float: left;
      border: 1px solid #eeeeee;
    }
    &.el-main-players-model1 {
      .player:first-child {
        width: 100%;
        height: 100%;
      }
    }
    &.el-main-players-model4 {
      .player {
        width: 50%;
        height: 50%;
      }
    }
    &.el-main-players-model6 {
      .player {
        width: 33.3333%;
        height: 33.3333%;
        &:first-child {
          width: 66.66%;
          height: 66.66%;
        }
      }
    }
    &.el-main-players-model8 {
      .player {
        width: 25%;
        height: 25%;
        &:first-child {
          width: 75%;
          height: 75%;
        }
      }
    }
    &.el-main-players-model9 {
      .player {
        width: 33.3333%;
        height: 33.3333%;
      }
    }
    &.el-main-players-model16 {
      .player {
        width: 25%;
        height: 25%;
      }
    }
  }
  .j-bm-info-window {
    display:flex;
    margin: 10px 0;
    img {
      width: 15px;
      height: 15px;
      margin-right: 10px;
    }
    div {
      font-size: 20px;
      color: #00a2ff;
      margin-right: 5px;
      cursor: pointer;
    }
  }
   .toggle-table-btn {
     position: absolute;
     border-radius: 10px 10px 0 0;
     padding: 3px 20px;
     left: 50%;
     margin-top: -20px;
     margin-left: -27px;
     color: #fff;
     background-color: #5f7abf;
     border-color: #5f7abf;
   }
    .toggle-table-btn:focus, .toggle-table-btn:hover {
      color: #fff;
      border-color: #5f7abf;
      background-color: #5f7abf;
    }
   .el-button-group .el-button:first-child:last-child {
     border-radius: 4px;
     background-color: #628FA6;
     color: #fff;
   }
   .el-footer {
     padding: 0;
     position: relative;
   }
   .el-footer .el-table{
     width: 100%;
     height: 200px;
     /* transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1); */
     border-top: none;
   }
   .el-footer .el-table-close {
     height: 0;
   }
   /* 弹出框顶部first second 标题字体大小 */
   .el-tabs__item{
     font-size:18px;
   }
   /* 圆角效果 */
    .BMap_pop div:nth-child(1){
        border-radius:10px 0 0 0 ;

    }
      .BMap_pop div:nth-child(3) div{
        border-radius:0 10px 0 0;

    }
    .BMap_pop div:nth-child(5){
        border-radius:0 0 0 10px;
    }
    .BMap_pop div:nth-child(7){
        border-radius:0 0 10px 0 ;
    }
   /* 顶部颜色*/
    div.BMap_bubble_title{
      background:#fff;
      color:#f00;
      font-size:20px;
      border-radius:0 !important;
      line-height:25px !important;
      padding-left:10px !important;
      border-radius:2px !important;
      height:25px !important;
      width:200px !important;
      z-index: 10000 !important;
    }
    /* 关闭图片 */
    div.BMap_pop>img{
      width: 10px !important;
      height: 10px !important;
      left: 228px !important;
      top: 10px !important;
    }
   .info-window{
    font-size: 10px !important;
    line-height: 12px !important;
   }
   .info-window .mr5{
     margin-right:5px;
   }
   /* 弹出框标题顶部字体大小 */
   div.BMap_pop div.BMap_bubble_title>p{
     margin:0;
     font-size: 14px;
     color:#fff;
   }
   /* 底部表格显示 */
   .el-table{
     overflow: auto !important;
   }
   div.BMap_top{
     background:#5f7abf;
   }
   div.BMap_bubble_title{
       line-height: 60px;
   }
  .info-window .cmdop{
      color:#88A8BB;
      width: 60px;
      display: inline-block;
      cursor:pointer
  }
  .info-window .vehLabel{
      width: 80px;
      display: inline-block;
      text-align: right;
      padding-right: 20px
  }
  .info-window p{
      margin:0px;
     margin-bottom:5px

  }
  .nomalColor{
    color:#444;
  }
  .setBox .el-tabs__item {
    padding: 0 11%;
  }
  .dedBtn {
    border: 1px solid #628FA6 !important;
    color:#628FA6
  }
  .saveBtn {
    background: #628FA6;
    color:#fff;
  }
  .selfform .el-form-item__label, .selfform .trick {
    font-size: 12px;
    color: #101010;
    font-weight: 400;
  }
  .selfChoosen_veh .el-form-item__content {
    margin-left: 15px !important;
  }
  .selfChoosen_veh .el-radio__label {
    font-size:13px;
  }
  body{
    color:#333333
  }
  .monitor_all_normal{
    background-image: url('../../../assets/realtime/monitor_all_normal.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    color: #333333
  }
  .monitor_all_checked{
    background-image: url('../../../assets/realtime/monitor_all_checked.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    color: #4178bd
  }
  .monitor_online_normal{
    background-image: url('../../../assets/realtime/monitor_online_normal.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    color: #333333
  }
  .monitor_online_checked{
    background-image: url('../../../assets/realtime/monitor_online_checked.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    color: #4178bd
  }
  .monitor_offline_normal{
    background-image: url('../../../assets/realtime/monitor_offline_normal.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    color: #333333
  }
  .monitor_offline_checked{
    background-image: url('../../../assets/realtime/monitor_offline_checked.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    color: #4178bd
  }
  .font_normal{
    color: #333333
  }
  .font_active{
    color: #4178bd
  }
  .tree_dept_icon{
    width: 14px;
    height: 14px;
    display: inline-block;
    background-image: url('../../../assets/realtime/tree_area.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    margin-right: 5px
  }
  .tree_line_icon{
    width: 14px;
    height: 14px;
    display: inline-block;
    background-image: url('../../../assets/realtime/tree_platform.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    margin-right: 5px
  }
  .tree_owers_icon{
    width: 14px;
    height: 14px;
    display: inline-block;
    background-image: url('../../../assets/realtime/tree_owers.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    margin-right: 5px
  }
  .tree_veh_online_icon{
    width: 14px;
    height: 14px;
    display: inline-block;
    background-image: url('../../../assets/realtime/veh_online.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    margin-right: 5px
  }
  .tree_veh_offline_icon{
    width: 14px;
    height: 14px;
    display: inline-block;
    background-image: url('../../../assets/realtime/veh_offline.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    margin-right: 5px
  }
  .left_close{
    background-image: url('../../../assets/realtime/close.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
  }
  .left_open{
    background-image: url('../../../assets/realtime/open.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
  }
  .left_top_veh{
    float:left;
    width:33.33333%;
    height:40px;
    text-align:center;
    cursor:pointer
  }
  .left_top_veh div{
    height:20px;
    line-height:20px;
  }
  .left_top_veh .veh_count{
    width:18px;
    height:18px;
    display:inline-block
  }
  .real_time {
    max-width: 100%;
    min-height: calc(100vh - 295px);
  }
  .real_time_small{
    max-width: 100%;
    min-height: calc(100vh - 95px);
  }
  .left_aside {
    z-index: 50;
    /* padding: 5px; */
    width: 320px;
    max-width: 320px;
    float: left;
    max-height: calc(100vh - 295px);
    background-color: #FFFFFF
  }
  .j-realtime .el-tree-j {
    position: relative;
    cursor: default;
    background: #fff;
    color: #606266;
    // max-height: calc(100vh - 154px);
    height: calc(100vh - 385px);
    overflow: auto;
    background: #fff;
  }
  .j-realtime .el-tree-j-max {
    height: calc(100vh - 185px);
  }

  .el-tree>.el-tree-node{
    min-width:100%;
    max-height: calc(100vh - 385px);
    display: inline-block;
  }
  

.el-tree-small {
    position: relative;
    cursor: default;
    background: #fff;
    color: #606266;
    max-height: calc(100vh - 175px);
    overflow: auto;
  }
  .left_aside_small {
    z-index: 50;
    /* padding: 5px; */
    width: 320px;
    max-width: 320px;
    float: left;
    max-height: calc(100vh - 95px);
    background-color: #FFFFFF
  }
  .el-popover {
    height: 350px;
    overflow-y: scroll;
    font-size: 12px;
    color: #333333;
  }
  .left_aside .el-radio-button--medium .el-radio-button__inner {
    padding: 5px 5px;
    font-size: 12px;
    border-radius: 0;
    width: 75px;
  }
  .map {
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0;
  }
  .el-tree--highlight-current .el-tree-node.is-checked>.el-tree-node__content .demo {
    /* border: 1px solid #409EFF;
    padding: 0 3px;
    border-radius: 4px; */
    color: #409EFF;
  }
  .online {
    color: #36ab60;
  }
  .offline {
    color: #333333;
  }
  .tableBtnRealtime {
    transition : 'all .5s ease';
    position: absolute;
    top: 82px;
    left: 320px;
    z-index: 100;
    display: inline-block;
    width: 22px;
    height: 26.4px;
    background-image: url('../../../assets/realtime/close.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    cursor: pointer
  }
  .tableBtnRealtimeOther {
    transition : 'all .5s ease';
    position: absolute;
    top: 82px;
    left: 0;
    z-index: 100;
    display: inline-block;
    width: 22px;
    height: 26.4px;
    background-image: url('../../../assets/realtime/open.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    cursor: pointer
  }
  .infoDialog {
    margin-left: calc(100vw - 360px);
  }

  .el-tree-node__content:hover {
    /* background-color: #f5f7fa; */
  }
  .el-checkbox__input .is-checked{
    background-image: url('../../../assets/realtime/vehicle_check.png');
    background-repeat:no-repeat;
  }

  .search_result_item{
    border-bottom:1px solid #dddddd;
    margin:0 0 10px 0;
    cursor:pointer
  }
  .search_result_item:hover{
    background-color: rgb(184, 208, 233)
  }
  .el-footer {
    /* padding: 0 20px; */
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -ms-flex-negative: 0;
    flex-shrink: 0;
  }

  .status_bar{
    font-size: 11px;
    border: 1px solid #e8e8e8;
    height: 30px;
    line-height: 30px;
    position: absolute;
    /* float: left; */
    z-index: 1000000000;
    bottom: 204px;
    left: 20px;
    border-radius: 5px;
    background-color: #FFFFFF;
  }

  .status_bar_small{
    bottom: 4px;
  }

  .status_bar .item{
    width:80px;
    float: left;
    text-align: center;
    cursor: pointer;
  }

  .status_bar .item:hover{
    background-color: #E8F1F6
  }

  .status_bar .selected{
    background-color: #E8F1F6
  }

  .bar_ico{
    display: inline-block;
    width: 15px;
    height: 15px;
    margin-bottom: -2px;
    margin-right: 5px;
  }

  .status_bar .ico_all{
    background-image: url('../../../assets/realtime/status_all.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
  }

  .status_bar .ico_online{
    background-image: url('../../../assets/realtime/status_online.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
  }

  .status_bar .ico_offline{
    background-image: url('../../../assets/realtime/status_offline.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
  }

  .status_bar .ico_run{
    background-image: url('../../../assets/realtime/status_run.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
  }

  .status_bar .ico_stop{
    background-image: url('../../../assets/realtime/status_stop.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
  }

  .status_bar .ico_alarm{
    background-image: url('../../../assets/realtime/status_alarm.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
  }

  .tool_bar{
    font-size: 11px;
    border: 1px solid #e8e8e8;
    height: 30px;
    line-height: 30px;
    position: absolute;
    /* float: left; */
    z-index: 1000000000;
    bottom: 204px;
    right: 20px;
    border-radius: 5px;
    background-color: #FFFFFF;
  }

  .tool_bar_small{
    bottom: 4px;
  }

  .tool_bar .item{
    width:80px;
    float: left;
    text-align: center;
    cursor: pointer;
  }

  .tool_bar .item{
    width:80px;
    float: left;
    text-align: center;
    cursor: pointer;
  }

  .tool_bar .item:hover{
    background-color: #E8F1F6
  }

  .tool_bar .ico_delete{
    background-image: url('../../../assets/realtime/ico_delete.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
  }

  .tool_bar .ico_map_tool{
    background-image: url('../../../assets/realtime/ico_map_tool.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
  }

  .tool_bar .ico_search{
    background-image: url('../../../assets/realtime/ico_search.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
  }

  .tool_bar .ico_settings{
    background-image: url('../../../assets/realtime/ico_settings.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
  }

  .right_menu{
    font-size: 11px;
    position: absolute;
    background: #FFFFFF;
    z-index: 10000000000;
    /* line-height: 22px; */
    width: 120px;
    border: 1px solid #6B96AB;
    border-radius: 5px;
  }

  .right_menu ul{
    list-style: none;
    margin: 0px;
    padding: 0px;
  }
  .right_menu li{
    line-height: 30px;
    cursor: pointer;
    padding: 0 10px;
  }
  .right_menu li:hover{
    background-color: #C6DEEA
  }

  .el-footer .el-table{
    position: relative;
    overflow: hidden;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    width: 100%;
    max-width: 100%;
    font-size: 12px;
    color: #606266;
  }

  .vehHeader{
    /* height: 30px; */
    background-color: #628FA6;
    /* color: #FFFFFF */
  }

  .right_msg_tip{
    width: 60px;
    height: 30px;
    position: absolute;
    z-index: 1000000;
    right: 0px;
    top: 35px;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    background-color: #F15533;
    color: #FFFFFF;
    font-size: 11px;
    line-height: 30px;
    cursor: pointer;
  }

  .right_msg_tip .alarm{
    background-image: url('../../../assets/realtime/tip_alarm.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    display: inline-block;
    width: 15px;
    height: 15px;
    margin-bottom: -3px;
    margin-left: 5px;
    margin-right: 2px;
  }

  .right_msg_panel{
    width: 350px;
    height: 455px;
    position: absolute;
    z-index: 1000000;
    right: 0px;
    top: 35px;
    color: #FFFFFF;
    font-size: 11px;
    /* border: 1px solid #F15533; */
  }
  /* 右侧面板隐藏动画效果 */
  .rightPanel-leave { margin-right: 0px; }
  .rightPanel-leave-active { transition: all 2s;}
  .rightPanel-leave-to { right: -350px; opacity: 0;}
  /* 右侧面板显示动画效果 */
  .rightPanel-enter { right: -350px;opacity: 0; }
  .rightPanel-enter-active { transition: all 2s;}
  .rightPanel-enter-to { right: 0px;opacity: 1;}

  .right_msg_panel .logo{
    background-image: url('../../../assets/realtime/alarm_pannel_logo.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    display: inline-block;
    width: 32px;
    height: 32px;
    margin-left: 2px;
    margin-top: 3px;
    float: left;
    cursor: pointer;
  }

  .right_msg_panel .header{
    height: 40px;
    width: 100%;
    border: 1px solid #b3b3b3;
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px;
    background-color: #FFFFFF;
  }

  .right_msg_panel .header .title_event{
    float: left;
    height: 25px;
    border:1px solid rgb(180, 180, 181);
    margin-top: 6px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    width: 100px;
    line-height: 25px;
    text-align: center;
    cursor: pointer;
  }

  .right_msg_panel .header .title_msg{
    float: left;
    width: 100px;
    height: 25px;
    line-height: 25px;
    border:1px solid rgb(180, 180, 181);
    margin-top: 6px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    text-align: center;
    cursor: pointer;
  }

  .right_msg_panel .header .selected{
    background-color: #628FA6;
    color: #FFFFFF;
  }

  .right_msg_panel .header .normal{
    background-color: #ffffff;
    color: #000000;
  }

  .right_msg_panel .main .alarm_content:hover{
    background-color: #9DE2F3
  }

  .right_msg_panel .main .selected{
    background-color: #9DE2F3
  }

  .right_msg_panel .main .ico{
    background-repeat:no-repeat;
    background-size:100% 100%;
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-bottom: -2px;
  }

  .right_msg_panel .main .platform_msg_content:hover{
    background-color: #9DE2F3
  }

  .right_msg_panel .main .alarm_content .speedover{
    background-image: url('../../../assets/realtime/over_speed.png');
  }

  .right_msg_panel .main .alarm_content .tired_drive{
    background-image: url('../../../assets/realtime/tired_drive.png');
  }

  .right_msg_panel .main .alarm_content .drive_safe{
    background-image: url('../../../assets/realtime/drive_safe.png');
  }

  .right_msg_panel .main .alarm_content .driver_cj{
    background-image: url('../../../assets/realtime/driver_cj.png');
  }

  .right_msg_panel .main .alarm_content .driver_identify{
    background-image: url('../../../assets/realtime/driver_identify.png');
  }

  .right_msg_panel .main .alarm_content .driver_camera{
    background-image: url('../../../assets/realtime/camera.png');
  }

  .right_msg_panel .main .platform_msg_content .alarm_oversee{
    background-image: url('../../../assets/realtime/alarm_oversee.png');
  }

  .right_msg_panel .main .platform_msg_content .pt_monitor{
    background-image: url('../../../assets/realtime/pt_monitor.png');
  }

  @media screen and (max-width: 1366px) {
    .infoDialogOther {
      margin-left: calc(100vw - 595px);
    }
    .right_msg_panel {
    width: 280px;
    height: 360px;
    position: absolute;
    z-index: 1000000;
    right: 0px;
    top: 15px;
    color: #FFFFFF;
    font-size: 11px;
  }
  .right_msg_panel .main {
    width: 265px;
    margin-left: 15px;
    border-left: 1px solid #afacac;
    border-right: 1px solid #afacac;
    border-bottom: 1px solid #afacac;
    height: 292px;
    background-color: #FFFFFF;
  }
  .right_msg_panel .main .alarm_content {
    font-size: 11px;
    width: 80px;
    height: 55px;
    margin-left: 5px;
    /* border: 1px solid #afacac; */
    /* background-color: #FFFFFF; */
    float: left;
    margin-top: 15px;
    border-radius: 5px;
    color: #000000;
    font-size: 12px;
    line-height: 25px;
    text-align: center;
    cursor: pointer;
  }
  .right_msg_panel .title{
    width: 222px;height: 40px;float: right;
  }

  .right_msg_panel .main .platform_msg_content{
    font-size: 11px;
    width: 110px;
    height: 55px;
    margin-left: 15px;
    /* background-color: #FFFFFF; */
    float: left;
    margin-top: 15px;
    border-radius: 5px;
    color: #000000;font-size: 12px;line-height: 30px;text-align: center;
    cursor: pointer;
  }
  .alarm_table{
    height:130px;
    width:100%
  }
  .platform_msg_table{
    height: 203px;
    width: 100%;
  }
}


  @media screen and (min-width: 1400px) and (max-width: 1920px) {
    .infoDialogOther {
      margin-left: calc(100vw - 700px);
    }

    .right_msg_panel .main{
      width: 335px;
      margin-left: 15px;
      border-left: 1px solid #afacac;
      border-right: 1px solid #afacac;
      border-bottom: 1px solid #afacac;
      height: 410px;
      background-color: #FFFFFF;
    }

    .right_msg_panel .main .alarm_content{
      font-size: 11px;
      width: 90px;
      height: 70px;
      margin-left: 15px;
      /* border: 1px solid #afacac; */
      /* background-color: #FFFFFF; */
      float: left;
      margin-top: 15px;
      border-radius: 5px;
      color: #000000;font-size: 12px;line-height: 30px;text-align: center;
      cursor: pointer;
    }

    .right_msg_panel .title{
      width: 252px;height: 40px;float: right;
    }

    .right_msg_panel .main .platform_msg_content{
      font-size: 11px;
      width: 90px;
      height: 70px;
      margin-left: 45px;
      /* background-color: #FFFFFF; */
      float: left;
      margin-top: 15px;
      border-radius: 5px;
      color: #000000;font-size: 12px;line-height: 30px;text-align: center;
      cursor: pointer;
    }
    .alarm_table{
      height:218px;
      width: 100%;
    }
    .platform_msg_table{
      height: 306px;
      width: 100%;
    }
  }
</style>
