<template>
  <div class="login-container">
    <div class="login-header">
      <img src="../../assets/log_images/logo.png" alt="logo">
    </div>

    <div class="login-forms">
      <div class="login-form-content">
        <div class="login-form-content__sidebox login-form-contetn__sidebox-left" />
        <div class="login-form-content__sidebox">
          <h2 style="margin: 0 0 40px;">登录</h2>
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
            <el-form-item prop="username">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                ref="username"
                v-model="loginForm.username"
                placeholder="Username"
                name="username"
                type="text"
                tabindex="1"
                auto-complete="on"
              />
            </el-form-item>

            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="Password"
                name="password"
                tabindex="2"
                auto-complete="on"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
            <div class="login-way">
              <div class="remember-pwd">
                <el-checkbox v-model="loginForm.isRememberPwd">记住密码</el-checkbox>
              </div>
              <div class="login__toggle-btn">
                <a href="javascript:void(0);">短信验证登录</a>
              </div>
            </div>
            <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;background: #fe7300;border-color: #fe7300;" @click.native.prevent="handleLogin">Login</el-button>
            <div class="tips">
              <span style="margin-right:20px;">username: admin</span>
              <span> password: any</span>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '111111',
        isRememberPwd: true
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#000;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 40px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 40px;
      // caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #fe7300;
    border-color: #fe7300;
  }

  .el-checkbox__input.is-checked+.el-checkbox__label {
    color: rgba(0,0,0,0.8);
  }

  .el-form-item {
    margin-bottom: 14px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgb(232, 240, 254) !important;
    border-radius: 5px;
    color: #000;
  }
}
</style>

<style lang="scss" scoped>
$bg:#fff;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  padding-top: 40px;
  padding-bottom: 40px;
  position: relative;

  .login-header {
    text-align: center;
  }

  .login-forms {
    width:1024px;
    padding: 0 20px;
    margin: 0 auto;

    .login-form-content {
      display: flex;
      margin: auto;
      margin-top: 50px;
      position: relative;
      box-shadow: 0px 20px 80px 0px rgba(0,0,0,0.3);
    }

    .login-form-content__sidebox {
      width: 500px;
      position: relative;
      padding: 80px 80px 48px;
      height: 572px;
      padding: 64px 75px 48px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }

    .login-form-contetn__sidebox-left {
      background: linear-gradient(0deg, #3a485a 0%, #607089 100%);
    }

    .login-form-contetn__sidebox-left::after{
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: url(https://assets.gitee.com/assets/sessions/left-1.png) no-repeat 0 0
    }
    .login-way {
      display: flex;
      padding-bottom: 14px;

      .remember-pwd {
        flex: 1;
      }

      .login__toggle-btn {
        flex: 1;
        text-align: right;

        a {
          text-decoration: none;
          cursor: pointer;
          color: #005980;
          font-size: 14px;
        }
      }
    }
  }
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    margin: 0 auto;
    overflow: hidden;
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
    padding: 0 5px 0 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
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
}
</style>
