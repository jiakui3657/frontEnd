<template>
  <div class="login-container">
    <div class="login-center">
      <div class="login-left">
        <img src="../../assets/login/logo.png" class="loginImg">
      </div>
      <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
        <div class="title-container">
          <h3 class="title">账号登录</h3>
        </div>
        <el-form-item prop="username">
          <span class="svg-container svg-container_login">
            <img src="../../assets/login/icon-account.png">
          </span>
          <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="账号" />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <img src="../../assets/login/icon-mima.png">
          </span>
          <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="密码" />
          <span class="show-pwd" @click="showPwd">
            <img src="../../assets/login/icon-undisplay.png" v-show="hidPwd">
            <img src="../../assets/login/icon-display.png" v-show="!hidPwd">
          </span>
          <div class="rememberUser">
            <el-checkbox v-model="checked" @change="handleChange">记住账号</el-checkbox>
          </div>
        </el-form-item>
        <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
      </el-form>
    </div>
    <!-- <iframe :src="iframeSrc" width="0" height="0" frameborder="0" scrolling="auto"></iframe>
    <iframe :src="initUserSrc" width="0" height="0" frameborder="0" scrolling="auto"></iframe> -->
  </div>
</template>
<script>
// import { isvalidUsername } from '@/utils/validate'
import config from '../../../static/config.js'
import utils from '@/api/base/utils'
export default {
  name: 'login',
  data() {
    /* const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      // if (value.length < 6) {
      //   callback(new Error('The password can not be less than 6 digits'))
      // } else {
      //   callback()
      // }
      callback()
    } */
    return {
      url: '',
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      iframeSrc: '',
      initUserSrc: '',
      checked: false,
      hidPwd: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
        this.hidPwd = false
      } else {
        this.passwordType = 'password'
        this.hidPwd = true
      }
    },
    handleChange(val) {
      if (val) {
        localStorage.setItem('userName', this.loginForm.username)
        localStorage.setItem('passWord', this.loginForm.password)
      } else {
        localStorage.setItem('userName', '')
        localStorage.setItem('passWord', '')
      }
      localStorage.setItem('checked', this.checked)
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        this.loginForm.password = utils.encrypt(this.loginForm.password)
        if (valid) {
          this.loading = true
          this.$store.dispatch('LoginByUsername', this.loginForm).then((res) => {
            console.log('123444')
            console.log(res)
            this.loading = false
            this.$router.push({ path: '/' })
            if (!this.checked) this.loginForm.password = ''
          }).catch((data) => {
            this.loading = false
            this.loginForm.password = ''
            // this.loginForm.password = utils.decrypt(this.loginForm.password)
            this.$message({
              type: 'error',
              message: data.msg
            })
          })
        } else {
          // console.log('error submit!!')
          this.loginForm.password = ''
          return false
        }
      })
    }
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
    this.iframeSrc = config.landing
    this.initUserSrc = config.initUserSrc
  },
  mounted() {
    this.loginForm.username = localStorage.getItem('userName')
    this.loginForm.password = localStorage.getItem('passWord')
    this.checked = localStorage.getItem('checked') === 'true'
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  /* 修复input 背景不协调 和光标变色 */

  $bg:#fff;
  $light_gray:#333;
  $cursor: #333;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input{
      color: $cursor;
      &::first-line {
        color: $light_gray;
      }
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  height: 100%;
  width: 100%;
  padding: 5% 10%;
  background: #fff url("../../assets/login/bg.png") no-repeat;
  background-size: cover;
  .login-center {
    height: 100%;
    .login-left {
      width: 60%;
      height: 100%;
      float: left;
      display: flex;
      justify-content: center;
      align-items: center;
      .loginImg {
        width: 80%;
        /*height: 62px;*/
      }
    }
  }
  .login-form {
    width: 40%;
    height: 100%;
    float: left;
    padding: 60px 35px 0 35px;
    background-color: #fff;
    .el-form-item {
      background-color: #fff;
      border-bottom: 1px solid #ccc;
      margin-bottom: 30px;
      &:last-of-type {
        position: relative;
        margin-bottom: 90px;
        .rememberUser {
          position: absolute;
          top: 60px;
          left: 10px;
        }
      }
      .el-input__inner {
        color: #333;
      }
    }
    .el-button {
      width: 440px;
      height: 60px;
      background-color: #366ed4;
      font-size: 22px;
      font-weight: 500;
    }
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 20px 0 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 30px;
      color: #447ed9;
      margin: 0px auto 30px auto;
      text-align: center;
      font-weight: 900;
      font-family: STXihei, "华文细黑";
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>
