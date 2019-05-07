import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: submenu only apppear when children.length>=1
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
 **/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/authredirect', component: () => import('@/views/login/authredirect'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  { path: '/big_screen', component: () => import('@/views/bigScreen/index') },
  { path: '/druid', component: () => import('@/views/druid/index') },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      alwaysShow: true,
      name: 'dashboard',
      meta: { title: '首页', noCache: false, roles: ['home:1'] }
    }]
  }
]

export default new Router({
  routes: constantRouterMap
})

export const asyncRouterMap = [
  // 基础档案
  {
    path: '/base',
    component: Layout,
    name: 'base',
    redirect: '/base/device',
    meta: { title: '基础档案', noCache: true, roles: ['base:baseInfo'] },
    children: [{
      path: 'device',
      component: () => import('@/views/base/device/index'),
      name: 'device',
      meta: { title: '终端档案管理', noCache: true, roles: ['base:device'] }
    },
    {
      path: 'vehicleInfo',
      component: () => import('@/views/base/vehicle/index'),
      name: 'vehicleInfo',
      meta: { title: '车辆档案管理', noCache: true, roles: ['base:vehicle'] }
    },
    // {
    //   path: 'driver',
    //   component: () => import('@/views/base/driver/index'),
    //   name: 'driver',
    //   meta: { title: '驾驶员档案管理', noCache: true, roles: ['base:driver'] }
    // },
    {
      path: 'platform',
      component: () => import('@/views/base/platform/index'),
      name: 'platform',
      meta: { title: '运营商平台管理', noCache: true, roles: ['base:platform'] }
    },
    {
      path: 'company',
      component: () => import('@/views/base/company/index'),
      name: 'company',
      meta: { title: '企业/业户档案管理', noCache: true, roles: ['base:owers'] }
    }]
  },
  // 安全监管
  {
    path: '/vehicle',
    component: Layout,
    name: 'vehicle',
    redirect: '/vehicle/realtime',
    meta: { title: '安全监管', noCache: true, roles: ['moni:safety'] },
    children: [{
      path: 'textmessagesAS',
      component: () => import('@/views/vehicle/textmessagesAS/index'),
      name: 'textmessagesAS',
      meta: { title: '指令下发', noCache: true, roles: ['moni:textMessages'] }
    },
    // {
    //   path: 'instruction',
    //   component: () => import('@/views/vehicle/instruction/index'),
    //   name: 'instruction',
    //   meta: { title: '平台指令', noCache: true, roles: ['moni:monitoring'] }
    // },
    {
      path: 'monitoring',
      // component: () => import('@/views/vehicle/monitoring/index'),
      component: () => import('@/views/vehicle/realtime/index'),
      name: 'monitoring',
      meta: { title: '实时监控', noCache: false, roles: ['moni:monitoring'] }
    },
    {
      path: 'realtimeVideo',
      component: () => import('@/views/vehicle/realtimeVideo/index'),
      name: 'realtimeVideo',
      meta: { title: '视频监控', noCache: true, roles: ['moni:video'] }
    },
    // {
    //   path: 'video',
    //   component: () => import('@/views/vehicle/videoplayerdemo/index'),
    //   name: 'video',
    //   meta: { title: '视频测试', noCache: true }
    // },
    {
      path: 'playback',
      // component: () => import('@/views/vehicle/playback/index'),
      component: () => import('@/views/vehicle/replyingHRD/index'),
      name: 'playback',
      meta: { title: '轨迹回放', noCache: true, roles: ['moni:playBack'] }
    }
    // {
    //   path: 'VideoQuery',
    //   component: () => import('@/views/vehicle/VideoQuery/index'),
    //   name: 'VideoQuery',
    //   meta: { title: '录像查询', noCache: true, roles: ['moni:videoQuery'] }
    // },
    // {
    //   path: 'replay',
    //   component: () => import('@/views/vehicle/replay/index'),
    //   name: 'replay',
    //   meta: { title: '录像查询', noCache: true, roles: ['moni:videoQuery'] }
    // }
    ]
  },
  // 监管考核
  {
    path: '/regulatory',
    component: Layout,
    name: 'regulatory',
    redirect: '/regulatory/platformIndicators',
    meta: { title: '监管统计', noCache: true, roles: ['regula:1'] },
    children: [{
      path: 'platformIndicators',
      component: () => import('@/views/regulatory/platformIndicators/index'),
      name: 'platformIndicators',
      meta: { title: '地区监管统计', noCache: true, roles: ['regula:2'] }
    },
    {
      path: 'enterpriseAlarm',
      component: () => import('@/views/regulatory/enterpriseAlarm/index'),
      name: 'enterpriseAlarm',
      meta: { title: '企业监管统计', noCache: true, roles: ['regula:3'] }
    },
    {
      path: 'enterpriseData',
      component: () => import('@/views/regulatory/enterpriseData/index'),
      name: 'enterpriseData',
      meta: { title: '运营商平台监管统计', noCache: true, roles: ['regula:4'] }
    }
    // {
    //   path: 'driverBehaviorEvaluation',
    //   component: () => import('@/views/regulatory/driverBehaviorEvaluation/index'),
    //   name: 'driverBehaviorEvaluation',
    //   meta: { title: '驾驶员行为评价', noCache: true, roles: ['regula:6'] }
    // }
    ]
  },
  // 监控中心
  {
    path: '/alarm',
    component: Layout,
    name: 'alarm',
    redirect: '/alarm/intelligentEWP',
    meta: { title: '监控中心', noCache: true, roles: ['alarm:center'] },
    children: [
    // {
    //   path: 'AlarmDetails',
    //   component: () => import('@/views/alarm/AlarmDetails/index'),
    //   name: 'AlarmDetails',
    //   meta: { title: 'ADAS报警明细表', noCache: true, roles: ['alarm:details'] }
    // },
    // {
    //   path: 'UploadAlarmFile',
    //   component: () => import('@/views/alarm/UploadAlarmFile/index'),
    //   name: 'UploadAlarmFile',
    //   meta: { title: 'DSM报警明细表', noCache: true, roles: ['alarm:uploadFile'] }
    // },
      // {
      //   path: 'alarmCenter',
      //   component: () => import('@/views/alarm/alarmCenter/index'),
      //   name: 'alarmCenter',
      //   meta: { title: '报警中心1', noCache: true, roles: ['alarm:4'] }
      // },
      {
        path: 'supervise',
        component: () => import('@/views/alarm/supervise/index'),
        name: 'supervise',
        meta: { title: '报警中心', noCache: true, roles: ['alarm:7'] }
      },
      {
        path: 'history',
        component: () => import('@/views/alarm/history/index'),
        name: 'history',
        meta: { title: '督办中心', noCache: true, roles: ['alarm:8'] }
      },
      {
        path: 'announcementCenter',
        component: () => import('@/views/alarm/announcementCenter/index'),
        name: 'announcementCenter',
        meta: { title: '公告中心', noCache: true, roles: ['alarm:5'] }
      },
      {
        path: 'checkCenter',
        component: () => import('@/views/alarm/checkCenter/index'),
        name: 'checkCenter',
        meta: { title: '查岗中心', noCache: true, roles: ['alarm:9'] }
      }
      // {
      //   path: 'certificationCenter',
      //   component: () => import('@/views/alarm/certificationCenter/index'),
      //   name: 'certificationCenter',
      //   meta: { title: '认证中心', noCache: true, roles: ['alarm:6'] }
      // }
    ]
  },
  // 监管考核
  // {
  //   path: '/regulatory',
  //   component: Layout,
  //   name: 'regulatory',
  //   redirect: '/regulatory/platformIndicators',
  //   meta: { title: '监管考核', noCache: true, roles: ['regula:1'] },
  //   children: [{
  //     path: 'platformIndicators',
  //     component: () => import('@/views/regulatory/platformIndicators/index'),
  //     name: 'platformIndicators',
  //     meta: { title: '平台指标分析', noCache: true, roles: ['regula:2'] }
  //   },
  //   {
  //     path: 'enterpriseAlarm',
  //     component: () => import('@/views/regulatory/enterpriseAlarm/index'),
  //     name: 'enterpriseAlarm',
  //     meta: { title: '企业报警分析', noCache: true, roles: ['regula:3'] }
  //   },
  //   {
  //     path: 'enterpriseData',
  //     component: () => import('@/views/regulatory/enterpriseData/index'),
  //     name: 'enterpriseData',
  //     meta: { title: '企业数据分析', noCache: true, roles: ['regula:4'] }
  //   },
  //   {
  //     path: 'businessOperationRating',
  //     component: () => import('@/views/regulatory/businessOperationRating/index'),
  //     name: 'businessOperationRating',
  //     meta: { title: '企业运营评分', noCache: true, roles: ['regula:5'] }
  //   }
  //   // {
  //   //   path: 'driverBehaviorEvaluation',
  //   //   component: () => import('@/views/regulatory/driverBehaviorEvaluation/index'),
  //   //   name: 'driverBehaviorEvaluation',
  //   //   meta: { title: '驾驶员行为评价', noCache: true, roles: ['regula:6'] }
  //   // }
  //   ]
  // },
  // 统计分析
  {
    path: '/statisticalAnalysis',
    component: Layout,
    name: 'statisticalAnalysis',
    redirect: '/statisticalAnalysis/AlarmStatement/alarmSummary',
    meta: { title: '统计分析', noCache: false, roles: ['stat:1'] },
    children: [{
      path: 'InstallSummary',
      component: () => import('@/views/statisticalAnalysis/EnterpriseStatement/InstallSummary/index'),
      name: 'InstallSummary',
      meta: { title: '安装率统计', noCache: false, roles: ['stat:10'] }
    },
    {
      path: 'alarmSummary',
      component: () => import('@/views/statisticalAnalysis/AlarmStatement/alarmSummary/index'),
      name: 'alarmSummary',
      meta: { title: '系统报警汇总', noCache: false, roles: ['stat:2'] }
    },
    {
      path: 'callPoliceAlarm',
      component: () => import('@/views/statisticalAnalysis/AlarmStatement/callPoliceAlarm/index'),
      name: 'callPoliceAlarm',
      meta: { title: '主动安全报警统计', noCache: false, roles: ['stat:7'] }
    },
    {
      path: 'accidentAlarm',
      component: () => import('@/views/statisticalAnalysis/AlarmStatement/accidentAlarm/index'),
      name: 'accidentAlarm',
      meta: { title: '事故报警统计', noCache: false, roles: ['stat:4'] }
    },
    {
      path: 'violationAlarm',
      component: () => import('@/views/statisticalAnalysis/AlarmStatement/violationAlarm/index'),
      name: 'violationAlarm',
      meta: { title: '违规报警统计', noCache: false, roles: ['stat:5'] }
    },
    {
      path: 'faultAlarm',
      component: () => import('@/views/statisticalAnalysis/AlarmStatement/faultAlarm/index'),
      name: 'faultAlarm',
      meta: { title: '报警处理率', noCache: false, roles: ['stat:6'] }
    },
    {
      path: 'alarmDetail',
      component: () => import('@/views/statisticalAnalysis/AlarmStatement/alarmDetail/index'),
      name: 'alarmDetail',
      meta: { title: '报警平均处理时长', noCache: false, roles: ['stat:3'] }
    },
    {
      path: 'alarmPassRate',
      component: () => import('@/views/statisticalAnalysis/AlarmStatement/alarmPassRate/index'),
      name: 'alarmPassRate',
      meta: { title: '报警数据合格率', noCache: false, roles: ['stat:3'] }
    },
    {
      path: 'overseeRates',
      component: () => import('@/views/statisticalAnalysis/AlarmStatement/overseeRates/index'),
      name: 'overseeRates',
      meta: { title: '督办处理率', noCache: false, roles: ['stat:3'] }
    },
    {
      path: 'inspection',
      component: () => import('@/views/statisticalAnalysis/AlarmStatement/inspection/index'),
      name: 'inspection',
      meta: { title: '查岗响应率', noCache: false }
    },
    // 企业报表
    {
      path: 'TravelSummary',
      component: () => import('@/views/statisticalAnalysis/EnterpriseStatement/TravelSummary/index'),
      name: 'TravelSummary',
      meta: { title: '平台服务连通率', noCache: false, roles: ['stat:9'] }
    },
    {
      path: 'MileageSummary',
      component: () => import('@/views/statisticalAnalysis/EnterpriseStatement/MileageSummary/index'),
      name: 'MileageSummary',
      meta: { title: '企业里程汇总', noCache: false, roles: ['stat:8'] }
    },
    // {
    //   path: 'OnlineSummary',
    //   component: () => import('@/views/statisticalAnalysis/EnterpriseStatement/OnlineSummary/index'),
    //   name: 'OnlineSummary',
    //   meta: { title: '企业上线率汇总', noCache: false, roles: ['stat:10'] }
    // },
    // {
    //   path: 'OnlineDetail',
    //   component: () => import('@/views/statisticalAnalysis/EnterpriseStatement/OnlineDetail/index'),
    //   name: 'OnlineDetail',
    //   meta: { title: '企业上线率明细报表', noCache: false, roles: ['stat:11'] }
    // },
    // {
    //   path: 'WeeHoursSummary',
    //   component: () => import('@/views/statisticalAnalysis/EnterpriseStatement/WeeHoursSummary/index'),
    //   name: 'WeeHoursSummary',
    //   meta: { title: '企业凌晨营运汇总报表', noCache: false, roles: ['stat:12'] }
    // },
    // {
    //   path: 'WeeHoursDetail',
    //   component: () => import('@/views/statisticalAnalysis/EnterpriseStatement/WeeHoursDetail/index'),
    //   name: 'WeeHoursDetail',
    //   meta: { title: '企业凌晨营运明细报表', noCache: false, roles: ['stat:13'] }
    // },
    // 车辆报表
    // {
    //   path: 'VehicleStatement',
    //   component: () => import('@/views/statisticalAnalysis/VehicleStatement/VehicleMileageSummary/index'),
    //   name: 'VehicleStatement',
    //   meta: { title: '车辆里程汇总表', noCache: false, roles: ['stat:14'] }
    // },
    // {
    //   path: 'VehicleMileageDetail',
    //   component: () => import('@/views/statisticalAnalysis/VehicleStatement/VehicleMileageDetail/index'),
    //   name: 'VehicleMileageDetail',
    //   meta: { title: '车辆里程明细表', noCache: false, roles: ['stat:15'] }
    // },
    // {
    //   path: 'VehicleDrivingSummary',
    //   component: () => import('@/views/statisticalAnalysis/VehicleStatement/VehicleDrivingSummary/index'),
    //   name: 'VehicleDrivingSummary',
    //   meta: { title: '车辆行车汇总表', noCache: false, roles: ['stat:16'] }
    // },
    {
      path: 'VehicleDrivingDetail',
      component: () => import('@/views/statisticalAnalysis/VehicleStatement/VehicleDrivingDetail/index'),
      name: 'VehicleDrivingDetail',
      meta: { title: '车辆行车明细', noCache: false, roles: ['stat:17'] }
    },
    {
      path: 'VehicleOnlineRateDetail',
      component: () => import('@/views/statisticalAnalysis/VehicleStatement/VehicleOnlineRateDetail/index'),
      name: 'VehicleOnlineRateDetail',
      meta: { title: '车辆上线率明细', noCache: false, roles: ['stat:18'] }
    }
    // 司机报表
    // {
    //   path: 'DriverMileageSummary',
    //   component: () => import('@/views/statisticalAnalysis/DriverStatement/DriverMileageSummary/index'),
    //   name: 'DriverMileageSummary',
    //   meta: { title: '司机里程汇总表', noCache: false }
    // },
    // {
    //   path: 'DriverMileageDetail',
    //   component: () => import('@/views/statisticalAnalysis/DriverStatement/DriverMileageDetail/index'),
    //   name: 'DriverMileageDetail',
    //   meta: { title: '司机里程明细表', noCache: false }
    // },
    // {
    //   path: 'DriverDrivingSummary',
    //   component: () => import('@/views/statisticalAnalysis/DriverStatement/DriverDrivingSummary/index'),
    //   name: 'DriverDrivingSummary',
    //   meta: { title: '司机行程汇总表', noCache: false }
    // },
    // {
    //   path: 'DriverDrivingDetail',
    //   component: () => import('@/views/statisticalAnalysis/DriverStatement/DriverDrivingDetail/index'),
    //   name: 'DriverDrivingDetail',
    //   meta: { title: '司机行程明细表', noCache: false }
    // },
    // {
    //   path: 'DriverOnlineRateDetail',
    //   component: () => import('@/views/statisticalAnalysis/DriverStatement/DriverOnlineRateDetail/index'),
    //   name: 'DriverOnlineRateDetail',
    //   meta: { title: '司机在线率明细表', noCache: false }
    // }
    // {
      //   path: 'logging',
      //   component: () => import('@/views/statisticalAnalysis/logging/index'),
      //   name: 'logging',
      //   meta: { title: '登录日志', noCache: false }
      // },
      // {
      //   path: 'operationalLogbook',
      //   component: () => import('@/views/statisticalAnalysis/operationalLogbook/index'),
      //   name: 'operationalLogbook',
      //   meta: { title: '操作日志', noCache: false }
      // },
      // {
      //   path: 'instructionsTL',
      //   component: () => import('@/views/statisticalAnalysis/instructionsTL/index'),
      //   name: 'instructionsTL',
      //   meta: { title: '指令日志', noCache: false }
      // }
    ]
  },
  // 权限管理
  {
    path: '/informationM',
    component: Layout,
    redirect: '/informationM/organizationalM',
    meta: { title: '信息管理', noCache: true, roles: ['sys:permiss'] },
    children: [{
      path: 'userM',
      component: () => import('@/views/system/user/list'),
      name: 'userM',
      meta: { title: '用户管理', noCache: true, roles: ['sys:user'] }
    },
    // {
    //   path: 'organizationalM',
    //   component: () => import('@/views/informationM/organizationalM/index'),
    //   name: 'organizationalM',
    //   meta: { title: '机构管理', noCache: true, roles: ['sys:dept'] }
    // },
    {
      path: 'roleM',
      component: () => import('@/views/system/role/index'),
      name: 'roleM',
      meta: { title: '角色管理', noCache: true, roles: ['sys:role'] }
    }, {
      path: 'menuM',
      component: () => import('@/views/informationM/menuM/index'),
      name: 'menuM',
      meta: { title: '菜单管理', noCache: true, roles: ['sys:menu'] }
    }, {
      path: 'dictM',
      component: () => import('@/views/informationM/dictM/index'),
      name: 'dictM',
      meta: { title: '字典管理', noCache: true, roles: ['sys:dict'] }
    }]
  },
  { path: '/big_screen', component: () => import('@/views/bigScreen/index') },
  // {
  //   path: '',
  //   component: Layout,
  //   redirect: 'big_screen',
  //   children: [{
  //     path: 'big_screen',
  //     component: () => import('@/views/bigScreen/index'),
  //     alwaysShow: true,
  //     name: 'big_screen',
  //     meta: { title: '大屏监控', noCache: false, roles: ['bigScreen:1'] }
  //   }]
  // },
  // 404
  { path: '*', redirect: '/404', hidden: true }
]
