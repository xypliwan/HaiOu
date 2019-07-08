<template>
  <div class="header-wrapper">
    <div class="userinfo">
      <el-dropdown @command="clickItem">
        <span class="el-dropdown-link" :style="themeType.style.topTextColor">
          {{$t('common.welcome')}} {{ userInfo.user_account}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="0">
            <!-- <i class="iconfont icon-yonghu"></i>
            {{$t('userCommon.userInfo')}}-->
          </el-dropdown-item>
          <el-dropdown-item command="1">
            <i class="iconfont icon-tuichu1"></i>
            {{$t('common.dropOut')}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="userinfo" v-show="false">
      <el-dropdown @command="clickLangItem">
        <span class="el-dropdown-link" :style="themeType.style.topTextColor">
          {{selectLang}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="zh">
            <i class="iconfont icon-zhongwen"></i> 中文
          </el-dropdown-item>
          <el-dropdown-item command="en">
            <i class="iconfont icon-yingwenyuyan-l"></i> English
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <div class="theme-picker">
      <i class="iconfont icon-yansexuanze" @click="themeDialog = true" :style="themeType.style.topTextColor"></i>
    </div>

    <div>
      <header-nav></header-nav>
    </div>

    <common-dialog :show.sync="themeDialog" title="主题风格选择" width="500px">
      <theme-type></theme-type>
    </common-dialog>
  </div>
</template>

<script>
import ThemeType from '_c/ThemeType';
import CommonDialog from '_c/common/Dialog';
import { mapGetters, mapActions } from 'vuex';
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '_u/localStorage';
import { logout } from '@/api/user';
import HeaderNav from './HeaderNav';

export default {
  data() {
    return {
      themeDialog: false,
      selectLang: getLocalStorage('lang') == 'en' ? 'English' : '中文'
    };
  },
  computed: {
    ...mapGetters(['userInfo', 'themeType', ''])
  },
  methods: {
    ...mapActions(['setUserInfo', 'deleteAllTablist']),
    clickLangItem(e) {
      if (e == 'zh') {
        this.selectLang = '中文';
        setLocalStorage('lang', e);
      } else if (e == 'en') {
        this.selectLang = 'English';
        setLocalStorage('lang', e);
      }
      this.$i18n.locale = e;
    },
    clickItem(e) {
      if (e === '0') {
        this.$router.push('/account-info');
      } else if (e === '1') {
        this.comfirmLoginout();
      }
    },
    async comfirmLoginout() {
      this.$confirm('确认退出吗?将会清除登录信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          logout({ account: this.userInfo.user_account })
            .then(res => {
              this._message(res.message, 'success');
              this.deleteAllTablist();
              this.$root.viewShow = false;
              removeLocalStorage('userinfo');
              this.$root.viewShow = true;
              this.$router.push('/entran');
            })
            .catch(error => {
              this._message(error);
            });
        })
        .catch(() => {});
    }
  },
  components: {
    ThemeType,
    CommonDialog,
    HeaderNav
  }
};
</script>

<style lang="scss" scoped>
.header-wrapper {
  height: 100%;
  .userinfo {
    float: right;
    height: 100%;
    line-height: 60px;
    margin: 0 22px;
  }
  .theme-picker {
    width: 60px;
    float: right;
    height: 100%;
    line-height: 60px;
    text-align: center;
    i {
      font-size: 18px;
      color: #666;
      cursor: pointer;
    }
  }
}
</style>
