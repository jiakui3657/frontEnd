<template>
  <div>
    <el-tabs type="card">
      <el-tab-pane label="监控信息">
      	<get-ident :picData='picData'></get-ident>
      </el-tab-pane>
      <el-tab-pane label="快速拍照">
      	<get-pics></get-pics>
      	<div style="text-align: center;margin: 20px 0;">
          <el-button style="border-radius:5px;padding: 9px 22px;border-color:#B0C7D3;color:#6C96AB;">取消</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="文本下发">
      	<send-message :msgs='msgs' :sendtittle='sendtittle'></send-message>
      	<div style="text-align: center;margin: 20px 0;">
          <el-button style="border-radius:5px;padding: 9px 22px;border-color:#B0C7D3;color:#6C96AB;">取消</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="监听通话">
        <listen></listen>
        <div style="text-align: center;margin: 20px 0;">
          <el-button style="border-radius:5px;padding: 9px 22px;border-color:#B0C7D3;color:#6C96AB;">取消</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import getIdent from './getIdent'
  import getPics from './getPics'
  import sendMessage from './sendMessage'
  import listen from './listen'
  export default {
    props: ['iDatas', 'msgs', 'sendtittle'],
    components: { getIdent, getPics, sendMessage, listen },
    data() {
      return {
        picData: [],
        msgData: []
      }
    },
    watch: {
      iDatas(val) {
        console.log(val)
        this.picData = val
      }
    }
  }
</script>

<style>
  .desBox .el-textarea__inner {
    min-height:130px !important;
    height: 130px !important;
  }
  .voiceBox .el-textarea__inner {
    min-height:110px !important;
    height: 110px !important;
  }
</style>
