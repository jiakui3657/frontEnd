<template>
  <div style="padding-bottom: 16px;">
  	<span style="margin-right:5px;">选择平台</span>
    <el-select v-model="platformValue" multiple placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <span style="margin-left: 20px;margin-right: 5px;">选择企业</span>
    <el-select
      v-model="companyValue"
      multiple
      collapse-tags
      placeholder="请选择">
      <el-option
        v-for="item2 in options"
        :key="item2.value"
        :label="item2.label"
        :value="item2.value">
      </el-option>
    </el-select>
    <el-button style="margin-left: 20px;padding:9px 30px;background-color:#447ED9;color:#fff;border-radius:0;">搜索</el-button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
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
          }
        ],
        platformValue: [],
        companyValue: []
      }
    }
  }
</script>