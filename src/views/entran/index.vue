
<template>
  <div class="login-box">

      <div class="left-box">
      </div>
      <div class="right-box">
        
        <user-login></user-login>
      </div>
    </div>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';
import UserLogin from './Login'

export default {
  created() {
    this.deleteAllTablist();

  },

  methods: {
    ...mapActions(['deleteAllTablist']),
    goHome() {
      this.$router.push('/');
    }
  },
  components: {
    UserLogin
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
.login-box {
  text-align: center;
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 99;
  display: flex;
  .right-box{
    flex: 1;
    height: 100vh;
    background: url('./../../assets/images/loginbgor.png') no-repeat center center;
    background-size: contain;
    display: flex;
    align-items: center;
  }
  .left-box{
    float: left;
    width: 400px;
    height: 100vh;
    background: url('./../../assets/images/loginleftbgor.png') no-repeat center center;
        background-size: 100% 100%;
  }
 
}
</style>
