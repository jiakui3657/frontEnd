<template>
  <div style="height:180px;">
    <el-row style="height:100%;">
      <el-col :span="4" style="height:100%;">
        <pie :chart-data="ChartData"></pie>
      </el-col>
      <el-col :span="5" style="height:100%;">
        <ul style="list-style: none;padding:25px 0px 10px 0;height:100%;margin:0;">
          <li style="color:#666666;font-size:15px;margin-bottom:20px;">
            <span>运营商平台名称</span>：<span>{{platData.platformName}}</span>
          </li>
          <li style="color:#666666;font-size:15px;margin-bottom:20px;">
            <span>排名</span>：<span>{{platData.serialNumber}}</span>
          </li>
          <li style="color:#666666;font-size:15px;margin-bottom:20px;">
            <span>评价</span>：<span>{{platData.appraise}}</span>
          </li>
          <li style="color:#666666;font-size:15px;margin-bottom:20px;">
            <span>评价时间</span>：<span>{{platData.startTime}}</span> -- <span>{{platData.endTime}}</span>
          </li>
        </ul>
      </el-col>
      <el-col :span="5" style="height:100%;">
        <ul style="list-style: none;padding:10px 0;height:100%;margin:0;">
          <li style="color:#666666;font-size:15px;height:80px;padding:10px 0;">
            <el-row style="height:60px;">
              <el-col :span="8" style="height:60px;text-align:center;">
                <img src="../../../assets/navicon/icon_03.png" width="50" style="margin-top:5px;">
              </el-col>
              <el-col :span="16" style="height:60px;border-right: 1px solid #ccc;padding-right: 20%;">
                 <p style="margin:0 0 3px 0;text-align:center;font-weight:normal;color:#5E7BC1;font-size:32px;">{{totalCompany}}</p>
                 <p style="margin:0;text-align:center;">服务企业总数</p>
              </el-col>
            </el-row>
          </li>
          <li style="color:#666666;font-size:15px;height:80px;padding:10px 0;">
            <el-row style="height:60px;">
              <el-col :span="8" style="height:60px;text-align:center;">
                <img src="../../../assets/navicon/icon_18.png" width="50" style="margin-top:5px;">
              </el-col>
              <el-col :span="16" style="height:60px;border-right: 1px solid #ccc;padding-right: 20%;">
                 <p style="margin:0 0 3px 0;text-align:center;font-weight:normal;color:#5E7BC1;font-size:32px;">{{allCars}}</p>
                 <p style="margin:0;text-align:center;">所有车辆(辆)</p>
              </el-col>
            </el-row>
          </li>
        </ul>
      </el-col>
      <el-col :span="5" style="height:100%;">
        <ul style="list-style: none;padding:10px 0;height:100%;margin:0;">
          <li style="color:#666666;font-size:15px;height:80px;padding:10px 0;">
            <el-row style="height:60px;">
              <el-col :span="8" style="height:60px;text-align:center;">
                <img src="../../../assets/navicon/icon_05.png" width="50" style="margin-top:5px;">
              </el-col>
              <el-col :span="16" style="height:60px;border-right: 1px solid #ccc;padding-right: 20%;">
                 <p style="margin:0 0 3px 0;text-align:center;font-weight:normal;color:#5E7BC1;font-size:32px;">{{goodCompany}}</p>
                 <p style="margin:0;text-align:center;">合格企业总数</p>
              </el-col>
            </el-row>
          </li>
          <li style="color:#666666;font-size:15px;height:80px;padding:10px 0;">
            <el-row style="height:60px;">
              <el-col :span="8" style="height:60px;text-align:center;">
                <img src="../../../assets/navicon/icon_14.png" width="50" style="margin-top:5px;">
              </el-col>
              <el-col :span="16" style="height:60px;border-right: 1px solid #ccc;padding-right: 20%;">
                 <p style="margin:0 0 3px 0;text-align:center;font-weight:normal;color:#5E7BC1;font-size:32px;">{{inlineCars}}</p>
                 <p style="margin:0;text-align:center;">上线车辆(辆)</p>
              </el-col>
            </el-row>
          </li>
        </ul>
      </el-col>
      <el-col :span="5" style="height:100%;">
      	<ul style="list-style: none;padding:10px 0;height:100%;margin:0;">
          <li style="color:#666666;font-size:15px;height:80px;padding:10px 0;">
            <el-row style="height:60px;">
              <el-col :span="8" style="height:60px;text-align:center;">
                <img src="../../../assets/navicon/icon_08.png" width="50" style="margin-top:5px;">
              </el-col>
              <el-col :span="16" style="height:60px;padding-right: 20%;">
                 <p style="margin:0 0 3px 0;text-align:center;font-weight:normal;color:#5E7BC1;font-size:32px;">{{badCompany}}</p>
                 <p style="margin:0;text-align:center;">不合格企业总数</p>
              </el-col>
            </el-row>
          </li>
          <li style="color:#666666;font-size:15px;height:80px;padding:10px 0;">
            <el-row style="height:60px;">
              <el-col :span="8" style="height:60px;text-align:center;">
                <img src="../../../assets/navicon/icon_16.png" width="50" style="margin-top:5px;">
              </el-col>
              <el-col :span="16" style="height:60px;padding-right: 20%;">
                 <p style="margin:0 0 3px 0;text-align:center;font-weight:normal;color:#5E7BC1;font-size:32px;">{{users}}</p>
                 <p style="margin:0;text-align:center;">从业人数</p>
              </el-col>
            </el-row>
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import pie from './pie'
  const ChartData = {
    pieData: {
      pieChartData: []
    }
  }
  export default {
    props: ['platData'],
    components: { pie },
    data() {
      return {
        sortOPtions: [],
        totalCompany: 0,
        allCars: 0,
        goodCompany: 0,
        inlineCars: 0,
        badCompany: 0,
        users: 0,
        ChartData: ChartData.pieData
      }
    },
    watch: {
      platData(val, oldVal) {
        if (val && val.length !== 0) {
          this.totalCompany = val.totalEnterprise
          this.allCars = val.totalVehicle
          this.goodCompany = val.owersQualified
          this.inlineCars = val.totalOnline
          this.badCompany = val.owersUnqualified
          this.users = val.totalDriver
          this.ChartData.pieChartData = []
          this.ChartData.pieChartData.push(val.score)
        }
      }
    },
    created() {
      this.ChartData.pieChartData = []
    }
  }
</script>
