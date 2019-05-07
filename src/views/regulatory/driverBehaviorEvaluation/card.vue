<template>
  <div style="margin:15px 0;height:500px;">
      <div style="float:left;width:20%;margin:0;padding:0 10px 0 0;">
        <div style="height:500px;box-shadow: 0 0 10px #ccc;border-radius:5px;">
          <div style="height:70px;width:100%;position:relative;">
            <img src="../../../assets/navicon/driverCard1.png" width="100%" height="100%">
            <h4 style="position:absolute;top:0;margin:10px 0 0 10px;color:#fff;">疲劳指数排名</h4>
            <p style="position:absolute;bottom:10px;margin:0 0 0 10px;font-size:13px;color:#fff;">
              <span style="padding:4px 7px;cursor:pointer;" v-for="(todo, index) in todos" v-on:click="addClass(index)" v-bind:class="{ bgColor:index==current}">{{ todo.text }}</span>
            </p>
          </div>
          <div style="height:430px;padding:15px 10px;">
            <ul style="width:100%;height:100%;padding:0;margin:0;">
              <li class="lis" style="list-style:none;" v-for="(item, index) in vehicleNetworkOptions" :key="index">
                <el-row>
                  <el-col :span="5"><span>NO.{{index+1}}</span></el-col>
                  <el-col :span="19">
                    <div style="width:75%;display: inline-block;">
                      <div class="progress" :style="{width:progress}"></div>
                    </div>
                    <div style="width:20%;display: inline-block;color:#EC4D66;">{{item.score}}</div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :offset="5" :span="19">
                    <span style="font-size:13px;">{{item.driverName}}</span>
                  </el-col>
                </el-row>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div style="float:left;width:20%;margin:0;padding:0 10px 0 0;">
        <div style="height:500px;box-shadow: 0 0 10px #ccc;border-radius:5px;">
          <div style="height:70px;width:100%;position:relative;">
            <img src="../../../assets/navicon/driverCard2.png" width="100%" height="100%">
            <h4 style="position:absolute;top:0;margin:10px 0 0 10px;color:#fff;">专注指数排名</h4>
            <p style="position:absolute;bottom:10px;margin:0 0 0 10px;font-size:13px;color:#fff;">
              <span style="padding:4px 7px;cursor:pointer;" v-for="(todo, index) in todos1" v-on:click="addClass1(index)" v-bind:class="{ bgColor:index==current1}">{{ todo.text }}</span>
            </p>
          </div>
          <div style="height:430px;padding:15px 10px;">
            <ul style="width:100%;height:100%;padding:0;margin:0;">
              <li class="lis" v-for="(item, index) in focusIndexRank" :key="index" style="list-style:none;">
                <el-row>
                  <el-col :span="5"><span>NO.{{index+1}}</span></el-col>
                  <el-col :span="19">
                    <div style="width:75%;display: inline-block;">
                      <div class="progress" :style="{width:progress}"></div>
                    </div>
                    <div style="width:20%;display: inline-block;color:#EC4D66;">{{item.score}}</div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :offset="5" :span="19">
                    <span style="font-size:13px;">{{item.driverName}}</span>
                  </el-col>
                </el-row>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div style="float:left;width:20%;margin:0;padding:0 10px 0 0;">
        <div style="height:500px;box-shadow: 0 0 10px #ccc;border-radius:5px;">
          <div style="height:70px;width:100%;position:relative;">
            <img src="../../../assets/navicon/driverCard3.png" width="100%" height="100%">
            <h4 style="position:absolute;top:0;margin:10px 0 0 10px;color:#fff;">警惕指数排名</h4>
            <p style="position:absolute;bottom:10px;margin:0 0 0 10px;font-size:13px;color:#fff;">
              <span style="padding:4px 7px;cursor:pointer;" v-for="(todo, index) in todos2" v-on:click="addClass2(index)" v-bind:class="{ bgColor:index==current2}">{{ todo.text }}</span>
            </p>
          </div>
          <div style="height:430px;padding:15px 10px;">
            <ul style="width:100%;height:100%;padding:0;margin:0;">
              <li class="lis" v-for="(item, index) in guardIndexRank" :key="index" style="list-style:none;">
                <el-row>
                  <el-col :span="5"><span>NO.{{index+1}}</span></el-col>
                  <el-col :span="19">
                    <div style="width:75%;display: inline-block;">
                      <div class="progress" :style="{width:progress}"></div>
                    </div>
                    <div style="width:20%;display: inline-block;color:#EC4D66;">{{item.score}}</div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :offset="5" :span="19">
                    <span style="font-size:13px;">{{item.driverName}}</span>
                  </el-col>
                </el-row>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div style="float:left;width:20%;margin:0;padding:0 10px 0 0;">
        <div style="height:500px;box-shadow: 0 0 10px #ccc;border-radius:5px;">
          <div style="height:70px;width:100%;position:relative;">
            <img src="../../../assets/navicon/driverCard4.png" width="100%" height="100%">
            <h4 style="position:absolute;top:0;margin:10px 0 0 10px;color:#fff;">操控指数排名</h4>
            <p style="position:absolute;bottom:10px;margin:0 0 0 10px;font-size:13px;color:#fff;">
              <span style="padding:4px 7px;cursor:pointer;" v-for="(todo, index) in todos3" v-on:click="addClass3(index)" v-bind:class="{ bgColor:index==current3}">{{ todo.text }}</span>
            </p>
          </div>
          <div style="height:430px;padding:15px 10px;">
            <ul style="width:100%;height:100%;padding:0;margin:0;">
              <li class="lis" v-for="(item, index) in handleIndexRank" :key="index" style="list-style:none;">
                <el-row>
                  <el-col :span="5"><span>NO.{{index+1}}</span></el-col>
                  <el-col :span="19">
                    <div style="width:75%;display: inline-block;">
                      <div class="progress" :style="{width:progress}"></div>
                    </div>
                    <div style="width:20%;display: inline-block;color:#EC4D66;">{{item.score}}</div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :offset="5" :span="19">
                    <span style="font-size:13px;">{{item.driverName}}</span>
                  </el-col>
                </el-row>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div style="float:left;width:20%;margin:0;padding:0;">
        <div style="height:500px;box-shadow: 0 0 10px #ccc;border-radius:5px;">
          <div style="height:70px;width:100%;position:relative;">
            <img src="../../../assets/navicon/driverCard5.png" width="100%" height="100%">
            <h4 style="position:absolute;top:0;margin:10px 0 0 10px;color:#fff;">平稳指数排名</h4>
            <p style="position:absolute;bottom:10px;margin:0 0 0 10px;font-size:13px;color:#fff;">
              <span style="padding:4px 7px;cursor:pointer;" v-for="(todo, index) in todos4" v-on:click="addClass4(index)" v-bind:class="{ bgColor:index==current4}">{{ todo.text }}</span>
            </p>
          </div>
          <div style="height:430px;padding:15px 10px;">
            <ul style="width:100%;height:100%;padding:0;margin:0;">
              <li class="lis" v-for="(item, index) in steadyIndexRank" :key="index" style="list-style:none;">
                <el-row>
                  <el-col :span="5"><span>NO.{{index+1}}</span></el-col>
                  <el-col :span="19">
                    <div style="width:75%;display: inline-block;">
                      <div class="progress" :style="{width:progress}"></div>
                    </div>
                    <div style="width:20%;display: inline-block;color:#EC4D66;">{{item.score}}</div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :offset="5" :span="19">
                    <span style="font-size:13px;">{{item.driverName}}</span>
                  </el-col>
                </el-row>
              </li>
            </ul>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
  export default {
    props: ['vehicleNetwork', 'vehicleUpLine', 'vehicleAlarm', 'violation', 'prevention'],
    data() {
      return {
        vehicleNetworkOptions: [],
        focusIndexRank: [],
        guardIndexRank: [],
        handleIndexRank: [],
        steadyIndexRank: [],
        sortType: 2,
        progress: '100%',
        current: 0,
        current1: 0,
        current2: 0,
        current3: 0,
        current4: 0,
        todos: [
          { text: '最好' },
          { text: '最差' }
        ],
        todos1: [
          { text: '最好' },
          { text: '最差' }
        ],
        todos2: [
          { text: '最好' },
          { text: '最差' }
        ],
        todos3: [
          { text: '最好' },
          { text: '最差' }
        ],
        todos4: [
          { text: '最好' },
          { text: '最差' }
        ]
      }
    },
    watch: {
      vehicleNetwork(val, oldVal) {
        this.vehicleNetworkOptions = []
        if (val && val.length !== 0) {
          this.vehicleNetworkOptions = val
        }
      },
      vehicleUpLine(val, oldVal) {
        console.log(val)
        this.focusIndexRank = []
        if (val && val.length !== 0) {
          this.focusIndexRank = val
        }
      },
      vehicleAlarm(val, oldVal) {
        console.log(val)
        this.guardIndexRank = []
        if (val && val.length !== 0) {
          this.guardIndexRank = val
        }
      },
      violation(val, oldVal) {
        console.log(val)
        this.handleIndexRank = []
        if (val && val.length !== 0) {
          this.handleIndexRank = val
        }
      },
      prevention(val, oldVal) {
        console.log(val)
        this.steadyIndexRank = []
        if (val && val.length !== 0) {
          this.steadyIndexRank = val
        }
      }
    },
    methods: {
      addClass(index) {
        this.current = index
        if (index === 0) { // 最好
          this.sortType = 2
          this.$emit('sortType', this.sortType)
        } else if (index === 1) { // 最差
          this.sortType = 1
          this.$emit('sortType', this.sortType)
        }
      },
      addClass1(index) {
        this.current1 = index
        if (index === 0) { // 最好
          this.sortType_upline = 2
          this.$emit('sortType_upline', this.sortType_upline)
        } else if (index === 1) { // 最差
          this.sortType_upline = 1
          this.$emit('sortType_upline', this.sortType_upline)
        }
      },
      addClass2(index) {
        this.current2 = index
        if (index === 0) { // 最好
          this.sortType_alarm = 2
          this.$emit('sortType_alarm', this.sortType_alarm)
        } else if (index === 1) { // 最差
          this.sortType_alarm = 1
          this.$emit('sortType_alarm', this.sortType_alarm)
        }
      },
      addClass3(index) {
        this.current3 = index
        if (index === 0) { // 最好
          this.sortType_violation = 2
          this.$emit('sortType_violation', this.sortType_violation)
        } else if (index === 1) { // 最差
          this.sortType_violation = 1
          this.$emit('sortType_violation', this.sortType_violation)
        }
      },
      addClass4(index) {
        this.current4 = index
        console.log(index)
        if (index === 0) { // 最好
          this.sortType_prevention = 2
          this.$emit('sortType_prevention', this.sortType_prevention)
        } else if (index === 1) { // 最差
          this.sortType_prevention = 1
          this.$emit('sortType_prevention', this.sortType_prevention)
        }
      }
    }
  }
</script>

<style>
  div.progress {
    display: inline-block;
    background-color: #B5B5B5;
    border-radius: 0 10px 10px 0;
    height:10px;
    line-height: 10px;
  }
  .bgColor {
    background: rgba(33,33,33,0.41);
  }
  .lis {
    margin-bottom: 3px;
  }
  .lis:last-of-type{
    margin-bottom: 0;
  }
</style>
