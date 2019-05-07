<template>
  <div class="wrapper">
    <img src="../../../../assets/navicon/sort2.png" width="100%" height="50">
    <h4 class="title">企业排名</h4>
    <p class="ctabs">
      <span v-model="query.type" class="ctabs_text" v-for="(todo, index) in todos" v-on:click="addClass(index)" v-bind:class="{ bgColor:index==current}">{{ todo.text }}</span>
    </p>
    <ul class="sortBox">
      <li v-for="item in options" :key="item.id">
        <el-row>
          <el-col :span="11" class="name">{{item.name}}</el-col>
          <el-col :span="2" class="points">
            <p class="point"></p>
          </el-col>
          <el-col :span="11" class="result">
            <div class="result_line">
              <div class="progress" :style="{width:item.score + '%'}"></div>
            </div>
            <div class="result_score" style="">{{item.score}}</div>
          </el-col>
        </el-row>
        <el-row class="shut">
          <el-col :span="24" class="spaces">
            <p class="targets"></p>
          </el-col>
        </el-row> 
      </li>
    </ul>
  </div>
</template>

<script>
  import { enterpriseRank } from '@/api/dashboard/dashboard'
  export default {
    data() {
      return {
        progress: '100%',
        current: 0,
        query: {
          type: 2
        },
        todos: [
          { text: '最好', value: 1 },
          { text: '最差', value: 2 }
        ],
        options: []
      }
    },
    methods: {
      addClass(index) {
        this.current = index
        if (index === 0) {
          this.query.type = 2
          this.getEnterpriseRank()
        } else if (index === 1) {
          this.query.type = 1
          this.getEnterpriseRank()
        }
      },
      getEnterpriseRank() {
        enterpriseRank(this.query).then(res => {
          if (res.code === 0) {
            if (res.data.length !== 0) {
              console.log(res)
              this.options = res.data
            }
          } else {
            console.log(res)
          }
        })
      }
    },
    created() {
      this.getEnterpriseRank()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .wrapper {
    height: 600px;
    position: relative;
    .title {
      position: absolute;
      top: 0;
      left: 8%;
      margin: 16px 0;
      color: #fff;
    }
    .ctabs {
      position: absolute;
      top: 0;
      right: 5%;
      margin: 18px 0;
      font-size: 13px;
      color:#fff;
      .ctabs_text {
        padding: 4px 7px;
        cursor: pointer;
      }
      .bgColor {
        background: rgba(33,33,33,0.41);
      }
    }
    .sortBox {
      margin: 0;
      padding: 10px;
      list-style: none;
      font-size: 13px;
      li:last-child {
        .shut {
          display: none;
        }
      }
      .name {
        text-align: right;
        height: 26px;
        line-height: 26px;
      }
      .points {
        text-align: center;
        height: 26px;
        line-height: 26px;
        .point {
          width: 10px;
          height: 10px;
          border: 2px solid #5AB746;
          border-radius: 50%;
          margin: 8px auto;
        }
      }
      .result {
        text-align: left;
        height: 26px;
        line-height: 26px;
        .result_line {
          width: 75%;
          display: inline-block;
        }
        .result_score {
          width: 20%;
          display: inline-block;
          text-align: center;
        }
        .progress {
          display: inline-block;
          background: linear-gradient(to right, rgba(64,194,168,1), rgba(61,229,181,1));
          background: -webkit-linear-gradient(to right, rgba(64,194,168,1), rgba(61,229,181,1));
          background: -o-linear-gradient(to right, rgba(64,194,168,1), rgba(61,229,181,1));
          background: -moz-linear-gradient(to right, rgba(64,194,168,1), rgba(61,229,181,1));
          height:10px;
          line-height: 10px;
        }
      }
      .spaces {
        height:26px;
        line-height: 26px;
        text-align: center;
        .targets {
          width: 1px;
          height: 20px;
          margin: 3px auto;
          border: 1px solid #B5B5B5;
        }
      }
    }
  }
</style>
