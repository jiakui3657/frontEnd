<template>
  <div class="proofList">
    <el-table
      :data="proofList"
      stripe
      style="width: 100%;  border-radius: 5px; box-shadow: 0 0 10px #ccc"
      :header-cell-style="{ background: '#628FA6', color: '#fff', border: 'none !important' }"
      @expand-change="handleExpand">
      <el-table-column
        label="查询信息">
        <template slot-scope="scope">
          <span>{{ scope.row.plateNo }}</span>
          <span style="float: right">{{ scope.row.listCount }}个</span>
        </template>
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane
              v-for="(item, index) in proofTime"
              :key="index"
              :label="item.dateTime +'('+ item.timeCount + ')'"
              :name="item.dateTime">
              <el-row :gutter="10">
                <el-col
                  :span="4"
                  style="margin-bottom: 10px;"
                  v-for="(val, keys) in proofInfo"
                  :key="keys">
                  <div class="grid-content bg-purple-dark" style="background: #EFF3F8">
                    <div class="img">
                      <img v-if="val.mediaType === 0" :src="val.mediaUrl" alt="">
                      <video controls v-else>
                        <source :src="val.mediaUrl" type="audio/ogg">
                      </video>
                    </div>
                    <div class="imgContent">
                      <p>{{ val.alarmType }}</p>
                      <p>时间：{{ val.alarmStartTime }}</p>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getProofListInfo } from '@/api/alarm/earlyWEI'
export default {
  name: 'proofList',
  props: {
    proofList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      activeName: 'first',
      proofQuery: {
        vehicleId: null,
        alarmTime: null
      },
      proofTime: [],
      proofInfo: []
    }
  },
  mounted() {
    console.log(this.proofList)
  },
  methods: {
    handleExpand(row, expandedRows) {
      if (expandedRows.length > 1) {
        expandedRows.shift()
      }
      this.proofQuery.vehicleId = row.vehicleId
      this.proofQuery = {
        vehicleId: row.vehicleId,
        alarmTime: null
      }
      getProofListInfo(this.proofQuery).then(res => {
        if (res.data.timeAndCode !== null) {
          this.proofQuery.alarmTime = res.data.timeAndCode[0].dateTime
          this.activeName = res.data.timeAndCode[0].dateTime
        }
        this.proofTime = res.data.timeAndCode
        this.proofInfo = res.data.evidenceInfo
      })
    },

    // 请求证据列表
    getproof(query) {
      getProofListInfo(query).then(res => {
        this.proofTime = res.data.timeAndCode
        this.proofInfo = res.data.evidenceInfo
      })
    },
    getproofInfo(time) {
      this.proofQuery.alarmTime = time
      this.getproof(this.proofQuery)
    },

    handleClick() {}
  },
  watch: {
    'activeName': function(time) {
      console.log(time)
      this.proofQuery.alarmTime = time
      this.getproof(this.proofQuery)
    }
  }
}
</script>

<style>
  .proofList .el-tabs__nav-wrap::after {
    height: 0;
  }

  .proofList .el-tabs__active-bar {
    background: none;
  }

  .proofList .el-table__expanded-cell[class*=cell] {
    padding: 0 20px 15px;
  }
  .proofList .el-tabs__header {
    margin: 0;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }
</style>

<style lang="scss" scoped>
  .grid-content {

    .img {
      height: 120px;
      width: 100%;

      img, video {
        width: 100%;
        height:100%;
      }
    }

    .imgContent {
      padding-left: 15px;
      padding-bottom: 1px;

    }
  }
</style>



