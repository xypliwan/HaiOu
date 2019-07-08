
<template>
  <div class="account-login">
    <div class="img-wrapper">
      <img src="./../../assets/images/logintitle.png" alt />
    </div>
    <div class="item">
      <div class="icon-box">
        <i class="iconfont icon-user"></i>
      </div>
      <div class="ipt">
        <input type="text" @keyup.enter="goLogin" v-model="params.account" placeholder="请输入账号" />
      </div>
    </div>
    <div class="item">
      <div class="icon-box">
        <i class="iconfont icon-mima"></i>
      </div>
      <div class="ipt">
        <input type="password" @keyup.enter="goLogin" v-model="params.password" placeholder="请输入密码" />
      </div>
    </div>
    <div class="item remember-item">
      <div class="fl remember">
        <el-checkbox v-model="params.rememberMe">记住密码</el-checkbox>
      </div>
      <div class="ipt"></div>
    </div>
    <div class="login-btn">
      <el-button class="login-btn" @click="goLogin" :loading="loginLoading">{{loginText}}</el-button>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user';
import { setLocalStorage } from '@/utils/localStorage';
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      params: {
        account: '',
        password: '',
        rememberMe: true //是否记住
      },
      loginLoading: false,
      loginText: '登录'
    };
  },
  created() {
  },
  mounted() {},
  methods: {
    ...mapActions(['setUserInfo', 'setSelectIndex']),
    async goLogin() {
      if (!this.params.account.length) {
        this._message('请输入账号', 'warning');
        return;
      } else if (!this.params.password.length) {
        this._message('请输入密码', 'warning');
        return;
      } else {
        this.loginLoading = true;
        this.loginText = '登陆中...';
        try {
          let { message, data } = await login(this.params);
          this._message(message, 'success');
          this.setUserInfo(data);
          setLocalStorage('userinfo', data);
          this.setSelectIndex(0);

          setTimeout(() => {
            this.$router.push('/');
          }, 500);
        } catch (error) {
          this._message(error);
        }
        this.loginLoading = false;
        this.loginText = '登陆';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
.account-login {
  width: 350px;
  margin: 0 auto;
  padding: 20px 0;
  .img-wrapper {
    margin-bottom: 20px;
  }
  .item {
    width: 100%;
    margin-bottom: 20px;
    height: 50px;
    padding: 10px 0;
    border-bottom: 1px solid #f1f1f1;
    display: flex;
    .icon-box {
      width: 30px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      .iconfont {
        width: 20px;
        height: 20px;
        color: #007947;
      }
    }
    .ipt {
      flex: 1;
      padding-left: 10px;
      input {
        width: 100%;
        height: 100%;
        border: none;
        outline: none;
        font-size: 16px;
      }
    }
    .remember {
      display: inline-block;
      font-size: 14px;
      color: #666;
      input {
        position: relative;
        top: 2px;
      }
    }
  }
  .remember-item {
    border: none;
  }
  .login-btn {
    width: 100%;
    .login-btn {
      background: #007947;
      width: 100%;
      color: #fff;
    }
  }
}
input::-webkit-input-placeholder {
  font-size: 14px;
  color: #999;
} /* 使用webkit内核的浏览器 */
input::-moz-placeholder {
  font-size: 14px;
  color: #999;
} /* Firefox版本4-18 */
input::-moz-placeholder {
  font-size: 14px;
  color: #999;
} /* Firefox版本19+ */
input::-ms-input-placeholder {
  font-size: 14px;
  color: #999;
} /* IE浏览器 */
</style>
<style>
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  border-color: #007947;
  background: #007947;
}
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #007947;
}
</style>



