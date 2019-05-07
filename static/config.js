export default {
    //部标平台登陆
    landing: 'http://116.62.127.229/version/index.html#!/locate?account=jt809admin&password=000000',
    //车辆监控
    monitoring: 'http://116.62.127.229/version/index.html#!/locate',
    //轨迹回放
    playback: 'http://116.62.127.229/version/index.html#!/path/trackPoint',
    //视频监控
    video: 'http://116.62.127.229/version/index.html#!/stream',
    //录像查询
    VideoQuery: 'http://116.62.127.229/version/index.html#!/record',
    //ADAS报警明细表
    AlarmDetails: 'http://116.62.127.229/version/index.html#!/form/adas',
    //DSM明细表
    UploadAlarmFile: 'http://116.62.127.229/version/index.html#!/form/dsmDetail',
    //车辆评分报告
    ADASEarlyWPR: 'http://116.62.127.229:8090/webgis/report/alarmStaticGrade.action?type=1&userId=1',
    //车队驾驶评分报告
    vehicleIEWA: 'http://116.62.127.229:8090/webgis/report/alarmStaticGrade.action?type=2&userId=1',
    //车队报警统计
    abnormalTPS: 'http://116.62.127.229:8090/webgis/report/alarmStatic.action?userId=1',
    //车队车辆上线率统计
    fireExtinguishingDAWS: 'http://116.62.127.229:8090/webgis/report/vehicleOnlineRate.action?userId=1',
    //车辆日行统计
    vehicleAPR: 'http://116.62.127.229:8091/report/vehicle/vehicleDayStatic',
    //车辆安全报告
    batteryAS: 'http://116.62.127.229:8091/report/vehicle/vehicleSafeReport',
    //驾驶员排名统计
    faultAS: 'http://116.62.127.229:8091/report/department/driverRankStatis?userId=1',
    //企业安全报告
    electronicFAS: 'http://116.62.127.229:8091/report/department/depSafeReport?userId=1',
    //里程日报表
    routePFS: 'http://116.62.127.229/version/index.html#!/form/dayForm',
    //超速明细表
    vehiclePFS: 'http://116.62.127.229/version/index.html#!/form/speedDetail',
    //停车明细表
    newEnergyRS: 'http://116.62.127.229/version/index.html#!/form/parkingOvertimeDetail',
    //用户操作日志
    vehicleLaunchRS: 'http://116.62.127.229/version/index.html#!/form/userLog',
    //用户媒体明细
    statisticsVUDL: 'http://116.62.127.229/version/index.html#!/form/user_mediaDetail',
    //adas登陆
    initUserSrc: 'http://116.62.127.229:8090/webgis/initUserInfo.action?userId=1'
   
}