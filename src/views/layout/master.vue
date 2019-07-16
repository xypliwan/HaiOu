<template>
  <div id="app" v-cloak>
    <el-container
      v-loading="$root.globalLoading"
      element-loading-text="loading..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.7)"
      style="height: 100vh;overflow: hidden;"
    >
      <el-header v-if="$route.meta.authentication" class="header-wrapper" :style="themeType.style.top">
        <div class="user-tab" :style="themeType.style.top">
          <top-box></top-box>
        </div>
      </el-header>

      <el-container class="container-wrapper">
        <el-aside v-if="$route.meta.authentication" class="aside-wrapper" :class="isCollapse?'aside-active':''">
          <left-nav @isCollapseActive="isCollapseActive"></left-nav>
        </el-aside>

        <el-main class="main-wrapper" :class="isCollapse ? 'left-active' : '' ">
          <div class="header-tab">
            <page-card></page-card>
          </div>
          <div class="page-wrapper">
            <transition name="oms" mode="out-in">
              <keep-alive :include="cachedViews">
                <router-view></router-view>
              </keep-alive>
            </transition>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import LeftNav from '_c/menu/Nav';
import PageCard from '_c/menu/PageCard';
import TopBox from '_c/menu/TopBox';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { setLocalStorage, getLocalStorage } from '_u/localStorage';
import { setTimeout } from 'timers';
import { constants } from 'crypto';

export default {
  data() {
    return {
      isCollapse: false
    };
  },
  computed: {
    ...mapGetters(['themeType', 'cachedViews'])
  },
  mounted() {
    let themeIndex = getLocalStorage('themeindex');
    if (!themeIndex) {
      setLocalStorage('themeindex', 1);
    }
  },
  methods: {
    isCollapseActive(e) {
      this.isCollapse = e;
    }
  },
  components: {
    LeftNav,
    PageCard,
    TopBox
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/global.scss';
html,
body {
  background: #f0f4f3;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  .header-wrapper {
    position: absolute;
    top: 0px;
    left: 0;
    right: 0;
    height: 61px !important;
    border-bottom: 3px solid #f1f1f1;

    .user-tab {
      height: 100%;
      margin-bottom: 4px;
      width: 100%;
      min-width: 900px;
      box-shadow: 0 2px 4px 0 rgba(0, 121, 71, 0.12), 0 0 6px 0 rgba(0, 121, 71, 0.04);
    }
  }
  .container-wrapper {
    position: relative;
    left: 0;
    right: 0;
    bottom: 0;
    top: 61px;
    min-height: calc(100vh - 61px);
    min-width: 1000px;
    .main-wrapper {
      background: #fff;
      min-width: 900px;
      position: absolute;
      top: 0px;
      left: 200px;
      right: 0;
      padding: 0;
      margin: 0 15px;
      padding: 0;
      overflow: hidden;
      @include transitons(0.4s);
      &.left-active {
        left: 64px;
      }
      .header-tab {
        height: 55px;
        overflow: hidden;
        background: #fff;
      }
    }
    .aside-wrapper {
      width: 200px !important;
      overflow: hidden;
      @include transitons(0.4s);
      &.aside-active {
        width: 64px !important;
      }
    }
    .page-wrapper {
      height: calc(100vh - 25px - 60px - 50px);
      overflow-y: auto;
      padding: 10px 0px;
      padding-bottom: 54px;
      @include scrollBar;
    }
  }
}
[v-cloak] {
  display: none !important;
}
</style>
<style>
.el-select,
.el-date-editor,
.el-cascader {
  width: 100% !important;
  display: block !important;
}
.el-menu {
  border-right: none !important;
}
.el-range-editor--mini {
  line-height: 0 !important;
}
</style>


