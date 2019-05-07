<template>
  <div>
    <div style="height:360px;border: 1px solid #D1D1D1;border-radius:5px;padding:10px;">
          <div style="height:50px;border-bottom:1px dashed #DEDEDE;">
            <span>分辨率：</span>
              <el-select v-model="resolution" placeholder="请选择">
                <el-option
                  v-for="item in resolutions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <span>摄像头：</span>
              <el-select v-model="camera" placeholder="请选择">
                <el-option
                  v-for="item in cameras"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-button style="float:right;border-radius:5px;padding: 9px 18px;background:#628FA6;color:#fff;">拍照</el-button>
          </div>
          <div style="height:295px;overflow:auto;">
            <ul style="width:100%;height:100%;padding:10px 0 0 0;margin:0;">
              <li style="height:130px;padding:10px 25px;background:#F0F9FF;list-style:none;margin-bottom:10px;">
                <el-row style="padding:0 10px 10px 10px;border-bottom:1px solid #B6DFF0;margin-bottom:10px;">
                  <el-col :span="12">
                    <img src="../../../assets/navicon/creame.png" style="vertical-align:middle;">
                    <span style="color:#6893A7;vertical-align:middle;">快速拍照</span>
                  </el-col>
                  <el-col :span="12" style="text-align:right;">
                    <span style="color:#242223;">2018/11/11  14:31:00</span>
                  </el-col>
                </el-row>
                <el-row style="margin-bottom: 10px;color:#121011;text-align: center;">
                  <el-col :span="12">摄像头：<span>摄像头2</span></el-col>
                  <el-col :span="12">状态：<span>抓拍成功</span></el-col>
                </el-row>
                <el-row style="color:#121011;text-align: center;">
                  <el-col :span="12">分辨率：<span>320*420</span></el-col>
                  <el-col :span="12">操作：<span style="color:#51829A;cursor:pointer;">查看图片</span></el-col>
                </el-row>
              </li>
              <li style="height:130px;padding:10px 15px;background:#F0F9FF;list-style:none;margin-bottom:10px;">
                <el-row style="padding:0 10px 10px 10px;border-bottom:1px solid #B6DFF0;margin-bottom:10px;">
                  <el-col :span="12">
                    <img src="../../../assets/navicon/creame.png" style="vertical-align:middle;">
                    <span style="color:#6893A7;vertical-align:middle;">快速拍照</span>
                  </el-col>
                  <el-col :span="12" style="text-align:right;">
                    <span style="color:#242223;">2018/11/11  14:31:00</span>
                  </el-col>
                </el-row>
                <el-row style="margin-bottom: 10px;color:#121011;text-align: center;">
                  <el-col :span="12">摄像头：<span>摄像头2</span></el-col>
                  <el-col :span="12">状态：<span>抓拍成功</span></el-col>
                </el-row>
                <el-row style="color:#121011;text-align: center;">
                  <el-col :span="12">分辨率：<span>320*420</span></el-col>
                  <el-col :span="12">操作：<span style="color:#51829A;cursor:pointer;">查看图片</span></el-col>
                </el-row>
              </li>
            </ul>
          </div>
        </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        resolutions: [{
          value: 1,
          label: 'DRV1'
        }, {
          value: 2,
          label: 'DRV2'
        }, {
          value: 3,
          label: 'DRV3'
        }, {
          value: 4,
          label: 'DSM'
        }, {
          value: 5,
          label: 'ADAS'
        }],
        resolution: '',
        cameras: [{
          value: 1,
          label: '320*240'
        }, {
          value: 2,
          label: '640*480'
        }, {
          value: 3,
          label: '1280*768'
        }, {
          value: 4,
          label: '1240*768'
        }],
        camera: ''
      }
    }
  }
</script>