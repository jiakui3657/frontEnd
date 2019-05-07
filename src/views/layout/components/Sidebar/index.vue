<template>
  <div class="container">
    <div class="logo">
      <img src="@/assets/logo/logo1.png" alt="">
    </div>
    <el-menu
      mode="horizontal"
      :show-timeout="200"
      :default-active="$route.path"
      background-color="#39476C"
      text-color="#fff"
      active-text-color="#5F7ABF"
    >
    <sidebar-item v-for="route in permission_routers" :key="route.name" :item="route" :base-path="route.path"></sidebar-item>
    <div class="big" @click="openBig" v-show="showBig">
      <span>大屏监控</span>
    </div>
    <!--<div class="big" @click="handlePwd()" v-show="showChange">-->
        <!--<span>修改密码</span>-->
    <!--</div>-->
    </el-menu>
    <div class="personalCenter">
      <div class="personal">
        <el-popover
          placement="top"
          width="340"
          popper-class="userPopover"
          trigger="hover">
          <el-row>
            <el-col :span="10">用户名：</el-col>
            <el-col :span="14">{{userinfo.username}}</el-col>
          </el-row>
          <!--<el-row>
          <el-col :span="10">所属企业：</el-col>
          <el-col :span="14">{{userinfo.deptName}}</el-col>
          </el-row>-->
          <el-row>
            <el-col :span="10">所属角色：</el-col>
            <!--<el-col :span="14">{{userinfo.realname}}</el-col>-->
            <el-col :span="14">{{userinfo.roleName}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="10">账户启用时间：</el-col>
            <el-col :span="14">{{userinfo.enableTime}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="10">账户停用时间：</el-col>
            <el-col :span="14">{{userinfo.disableTime}}</el-col>
          </el-row>
          <div style="text-align: center; background-color: #5F7ABF; border-radius:4px; margin: 20px 0 10px 0;padding:5px 0;cursor:pointer; " @click="handlePwd()" v-show="showChange">
            <!--<span style="font-size:16px; color:#ffffff;" type="button" @click="handlePwd()">修改密码</span>-->
            修改密码
          </div>
          <img slot="reference" src="@/assets/navicon/nav_icon_account.png" title="个人中心">
          <!--<el-button slot="reference">删除</el-button>-->
        </el-popover>
      </div>
      <!--<div style="float: left; padding: 0 10px;" class="msg" @click="supervise">
        <img src="@/assets/navicon/nav_icon_message.png" alt="" title="消息" class="msg">
        <span class="msgIcon" v-if="countShow">{{ count }}</span>
      </div>-->
      <img src="@/assets/navicon/nav_icon_logout.png" alt="" title="退出登录" class="logout" @click="logout">
    </div>

    <!--<el-dialog title="修改密码" :visible.sync="dialogChangePwd" width="500px" append-to-body='true' close-on-click-modal="false">-->
    <el-dialog title="修改密码" :visible.sync="dialogChangePwd" width="500px" append-to-body close-on-click-modal>
      <el-form class="change-form" :model="changeForm" :rules="changeRules" ref="changeForm" label-position="left" >
        <!--<div class="title-container">
          <h3 class="title">修改密码</h3>
        </div>-->
        <el-form-item prop="oldpassword">
          <el-input name="oldpassword" :type="passwordType" @keyup.enter.native="submitPwd" autoComplete="off" readonly onfocus="this.removeAttribute('readonly')" v-model="changeForm.oldpassword" placeholder="旧密码" />
          <span class="show-pwd" @click="showPwd()">
            <img src="../../../../assets/login/icon-undisplay.png" v-show="hidPwd" label-position="left">
            <img src="../../../../assets/login/icon-display.png" v-show="!hidPwd">
          </span>
        </el-form-item>
        <el-form-item prop="newpassword">
          <el-input name="newpassword" :type="passwordType" @keyup.enter.native="submitPwd" autoComplete="off" readonly onfocus="this.removeAttribute('readonly')" v-model="changeForm.newpassword" placeholder="新密码" />
          <span class="show-pwd" @click="showPwd()">
            <img src="../../../../assets/login/icon-undisplay.png" v-show="hidPwd">
            <img src="../../../../assets/login/icon-display.png" v-show="!hidPwd">
          </span>
        </el-form-item>
        <el-form-item prop="enterpassword">
          <el-input name="enterpassword" :type="passwordType" @keyup.enter.native="submitPwd" autoComplete="off" readonly onfocus="this.removeAttribute('readonly')" v-model="changeForm.enterpassword" placeholder="再次输入密码" />
          <span class="show-pwd" @click="showPwd()">
            <img src="../../../../assets/login/icon-undisplay.png" v-show="hidPwd">
            <img src="../../../../assets/login/icon-display.png" v-show="!hidPwd">
          </span>
        </el-form-item>
        <!--<el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="submitPwd">登录</el-button>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogChangePwd = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitPwd()">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import { getCount } from '@/api/system/login'
import { changePasswordByOldPwd } from '@/api/system/user'
import utils from '@/api/base/utils'

export default {
  components: { SidebarItem, utils },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  data() {
    return {
      dialogChangePwd: false,
      changeForm: {
        oldpassword: '',
        newpassword: '',
        password: ''
      },
      changeRules: {
        oldpassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        newpassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        enterpassword: [{ required: true, message: '请再次输入密码', trigger: 'blur' }]
      },
      passwordType: 'password',
      showInfo: false,
      userinfo: {},
      count: '',
      perms: [],
      countShow: '',
      showBig: false,
      showChange: false,
      hidPwd: true,
      curPath: ''
    }
  },
  methods: {
    handlePwd() { // 修改密码方法
      // 修改密码
      this.dialogChangePwd = true
      this.changeForm.oldpassword = ''
      this.changeForm.newpassword = ''
      this.changeForm.enterpassword = ''
      this.$nextTick(() => {
        this.$refs['changeForm'].clearValidate()
      })
    },

    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
        this.hidPwd = false
      } else {
        this.passwordType = 'password'
        this.hidPwd = true
      }
    },
    submitPwd() {
      this.$refs['changeForm'].validate((valid) => {
        if (valid) {
          if (this.changeForm.enterpassword === this.changeForm.newpassword) {
            // 加密传送，要先解密然后加密
            this.changeForm.oldpassword = encodeURIComponent(utils.encrypt(this.changeForm.oldpassword))
            this.changeForm.enterpassword = encodeURIComponent(utils.encrypt(this.changeForm.enterpassword))
            changePasswordByOldPwd(this.changeForm.oldpassword, this.changeForm.enterpassword).then((response) => {
              if (response && response.code === 0) {
                this.dialogChangePwd = false
                this.$message({
                  message: '密码修改成功',
                  type: 'success'
                })
                this.$store.dispatch('FedLogOut')
                setTimeout(() => {
                  location.reload()
                }, 1000)
              } else {
                this.$message({
                  message: '密码修改失败',
                  type: 'error'
                })
              }
            })
          } else {
            alert('密码必须一致')
          }
        }
      })
    },
    showPersonalMsg() {
      this.showInfo = true
    },
    hidPersonalMsg() {
      this.showInfo = false
    },
    supervise() {
      if (this.perms.includes('moni:alarminfo')) {
        this.$router.push('/alarm/supervise')
      } else {
        this.$message({
          type: 'warning',
          message: '暂无报警信息'
        })
      }
    },
    logout() {
      this.$confirm('确定退出系统?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('FedLogOut')
        // this.$store.commit('SET_PERMS', '')
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
        setTimeout(() => {
          location.reload()
        }, 1000)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    },
    openBig() { // 大屏跳转
      window.open(this.curPath + '#/big_screen', '_blank')
    }
  },

  mounted() {
    this.$store.dispatch('GetUserInfo').then(res => {
      this.userinfo = res.data.user
      this.userinfo.roleName = this.userinfo.roleNameList.toString().replace('[').replace(']')
      this.perms = res.data.perms
      res.data.perms.includes('moni:alarminfo') ? this.countShow = true : this.countShow = false
      if (res.data.perms.indexOf('bigScreen:1') > -1) { // 大屏权限
        console.log('有大屏权限')
        this.showBig = true
        this.showChange = true // 用户修改密码
      } else {
        this.showBig = false
        this.showChange = true // 用户修改密码
        alert('没有大屏权限')
      }
    })
    getCount().then(res => {
      if (res && res.code === 0) {
        if (res.data.count === 0) {
          this.countShow = false
        } else {
          if (res.data.count > 99) res.data.count = '99+'
          this.count = res.data.count
        }
      }
    })
  },
  updatePwd(row) {
    this.dialogChangePwd = true
    this.changeForm.password = ''
    this.changeForm.newpassword = ''
  }
}
</script>
<style lang="scss" >
$dark_gray:#889aa4;
.show-pwd {
  position: absolute;
  right: 10px;
  top: 7px;
  font-size: 16px;
  color: $dark_gray;
  cursor: pointer;
  user-select: none;
}
#app {
  .container {
    width: 100%;
    height: 60px;
    display: flex;
    position: fixed;
    z-index: 21;
    top: 0;
    left: 0;
    .logo {
      width: 300px;
      padding-left: 10px;
      background-color: #39476C;
      img {
        width: 240px;
        height: 60px;
        float: left;
      }
    }
    .big {
      flex: 1;
      width: 115px;
      max-width: 115px;
      float: left;
      text-align: center;
      height: 60px !important;
      line-height: 60px;
      color: #fff;
      padding: 0 20px;
      font-size: 14px;
      cursor: pointer;
    }
    .big:hover {
      background: #21324F;
    }
    .el-menu--horizontal {
      flex: 1;
      height: 61px;
      display: flex;
      .slideBarItem {
        flex: 1;
        max-width: 115px;
        text-align: center;
        float: left;
        height: 60px !important;
        .el-submenu {
          .el-submenu__title {
            box-sizing: border-box;
            height: 60px !important;
          }
          &.is-active {
            background-color: #5F7ABF !important;
            color: #fff !important;
          }
          &:hover {
            .el-submenu__title {
              background-color: #5F7ABF !important;
            }
          }
          &.is-active {
            .el-submenu__title {
              background-color: #5F7ABF !important;
              color: #fff !important;
              i {
                color: #fff;
              }
            }
          }
          i {
            display: none;
          }
        }
        .el-menu-item.submenu-title-noDropdown {
          height: 60px;
          &:hover {
            background-color: #5F7ABF !important;
          }
          &.is-active {
            background-color: #5F7ABF !important;
            color: #fff !important;
          }
        }
      }
    }
    >.personalCenter {
    width: 200px;
    height: 61px;
    float: right;
    background:#39476C;
    padding: 15px 20px 0px 55px;
    border-bottom: solid 1px #e6e6e6;
    >img {
      vertical-align: middle;
      &:last-of-type {
        padding: 0 10px;
      }
    }
    .logout {
      cursor: pointer;
    }
    .msg {
      position: relative;
      cursor: pointer;
      .msgIcon {
        position: absolute;
        width: 20px;
        height: 20px;
        font-size: 10px;
        background-color: red;
        border-radius: 50%;
        line-height: 20px;
        text-align: center;
        color: #fff;
        top: -5px;
        right: 2px;
      }
    }
    >.personal {
      float: left;
      position: relative;
      cursor: pointer;
      padding: 0 10px;
        >img {
          width: 30px;
          height: 30px;
        }
      }
    }
  }

}
.userPopover{
  background-color: #39476C!important;
  font-size: 16px!important;
  color: #fff!important;
  border: 0;
  margin-top: 15px!important;
  max-height: 211px!important;
  .el-col {
    line-height: 2!important;
  }
  .popper__arrow, .el-popper .popper__arrow::after{
    display: none;
  }
}

</style>
