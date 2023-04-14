<template>
  <div class="login">
    <div class="el-login-lang"></div>
    <div class="el-login-content">
      <!-- <div class="login-top">
        <div class="login-header">
          <div class="logo-img" style="width: 60px">
            <img src="../assets/image/logo.png"  />
          </div>
          <div class="logo-img" style="width: 175px">
            <img src="../assets/image/logo-title.png"  />
          </div>
        </div>
        <div class="login-desc">{{ title }}</div>
      </div> -->
      <div class="login-main">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
          <h3 class="title">{{ title }}</h3>
          <el-form-item prop="userCode">
            <el-input
              v-model="loginForm.userCode"
              type="text"
              auto-complete="off"
              placeholder="账号"
              class="el-input--100"
              prefix-icon="el-icon-user"
            >
              <!-- <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" /> -->
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              auto-complete="off"
              placeholder="密码"
              @keyup.enter.native="handleLogin"
              show-password
              class="el-input--100"
              prefix-icon="el-icon-lock"
            >
              <!-- <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" /> -->
            </el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input
              v-model="loginForm.code"
              auto-complete="off"
              placeholder="验证码"
              style="width: 63%"
              @keyup.enter.native="handleLogin"
              class="el-input--100"
              prefix-icon="el-icon-key"
            >
              <!-- <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" /> -->
            </el-input>
            <div class="login-code">
              <img :src="codeUrl" @click="getCode" />
            </div>
          </el-form-item>
          <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;"
            >记住密码</el-checkbox
          >
          <el-form-item style="width:100%;">
            <el-button
              :loading="loading"
              size="medium"
              type="primary"
              style="width:100%;"
              @click.native.prevent="handleLogin"
            >
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>{{ longinFooter }}</span>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from '@/api/login';
import Cookies from 'js-cookie';
import { encrypt, decrypt, md5 } from '@/utils/jsencrypt';
import { title, longinFooter } from '@/settings.js';
import { deleteIndexedDB } from '@/components/refmodel/utils'

export default {
  name: 'Login',
  data() {
    return {
      title: title,
      longinFooter: longinFooter,
      codeUrl: '',
      cookiePassword: '',
      loginForm: {
        userCode: '',
        password: '',
        rememberMe: false,
        code: '',
        uuid: '',
      },
      loginRules: {
        userCode: [{ required: true, trigger: 'change', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'change', message: '密码不能为空' }],
        code: [{ required: true, trigger: 'change', message: '验证码不能为空' }],
      },
      loading: false,
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    this.getCode();
    this.getCookie();
    deleteIndexedDB();
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.codeUrl = 'data:image/gif;base64,' + res.img;
        this.loginForm.uuid = res.uuid;
      });
    },
    getCookie() {
      const userCode = Cookies.get('userCode');
      const password = Cookies.get('password');
      const rememberMe = Cookies.get('rememberMe');
      this.loginForm = {
        userCode: userCode === undefined ? this.loginForm.userCode : userCode,
        password: password === undefined ? this.loginForm.password : password,
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set('userCode', this.loginForm.userCode, { expires: 30 });

            if (this.loginForm.password && this.loginForm.password.indexOf('CPF_Cxx~丨') < 0) {
              Cookies.set('password', encrypt(this.loginForm.password), { expires: 30 });
            } else {
              Cookies.set('password', this.loginForm.password, { expires: 30 });
            }

            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove('userCode');
            Cookies.remove('password');
            Cookies.remove('rememberMe');
          }
          this.$store
            .dispatch('Login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' });
            })
            .catch(() => {
              this.loading = false;
              this.getCode();
            });
        }
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f0f2f5;
  background-image: url('../assets/image/login-background.svg');
  background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%;
  overflow: auto;
}
.el-login {
  &-lang {
    display: block;
    height: 40px;
    flex: 0 0 40px;
  }

  &-content {
    flex: 1 1 0%;
    padding: 32px 0px;

    .login-top {
      text-align: center;
    }

    .login-header {
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      .logo-img {
        height: 60px;
        overflow: hidden;
        display: inline-block;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: 0%;
        }
      }
      h1 {
        color: #606266;
      }
      span {
        display: block;
        margin-left: 8px;
        font-size: 34px;
        color: #0f2289;
        font-weight: 600;
      }
    }

    .login-desc {
      margin-top: 12px;
      margin-bottom: 40px;
      color: #00000073;
      font-size: 14px;
    }

    .login-main {
      display: flex;
      justify-content: center;
      margin-top: 32px;
      /*ie*/
      input::-ms-reveal {
        display: none;
      }
      input::-ms-clear {
        display: none;
      }
      /*edge*/
      input::-o-clear {
        display: none;
      }
    }
  }
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  width: 328px;

  .el-input,
  .el-input input {
    height: 38px;
  }
  .el-input--mini .el-input__icon {
    line-height: 38px;
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
  .el-input__inner,
  .el-button--medium {
    border-radius: 2px;
  }
  .el-input__prefix .el-input__icon {
    font-size: 14px;
    color: #1789ff;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  flex: 0 0 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #707070;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
</style>
