<template>
  <div class="my-nav" :class="isCollapse?'expand-active':''" :style="themeType.style.left">
    <div class="expand" @click="isCollapse = !isCollapse" :style="themeType.style.leftExtendBorderBottom">
      <img :class=" isCollapse ? 'rotate-img' : '' " src="./../../assets/images/expand.png" alt>
    </div>
    <!-- v-if="menuData.length" -->
    <el-menu
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      :router="true"
      :default-openeds="defaultOpeneds"
      :default-active="$route.path"
      :background-color="themeType.style.left.background"
      :active-text-color="themeType.style.leftTextActiveColor.color"
      :text-color="themeType.style.leftTextLeaverColor.color"
    >
      <template v-for="item in selectNav">
        <el-menu-item v-if="!item.children" :key="item.id" :index="item.path">
          <i class="iconfont icon-chanpin" :class="item.menu_icon" :style="themeType.style.leftIcon"></i>
          <span class="bar-line" :style="themeType.style.leftBarActiveColor"></span>
          {{$t(item.menu_alias)}}
        </el-menu-item>

        <el-submenu v-else :index="item.id" :key="item.id">
          <template slot="title">
            <i class="iconfont icon-chanpin" :class="item.menu_icon" :style="themeType.style.leftIcon"></i>
            <span slot="title" :style="themeType.style.leftTextColor">{{$t(item.menu_alias)}}</span>
          </template>
          <template v-for="every in item.children">
            <el-submenu v-if="every.children" :index="every.id" :key="every.id">
              <template v-for="only in every.children">
                <template slot="title">
                  <span slot="title" :style="themeType.style.leftTextColor">{{$t(only.menu_alias)}}</span>
                </template>
                <el-menu-item :index="only.path" :key="only.id">
                  <span class="bar-line" :style="themeType.style.leftBarActiveColor"></span>
                  {{$t(only.menu_alias)}}
                </el-menu-item>
              </template>
            </el-submenu>
            <el-menu-item v-else :index="every.path" :key="every.id">
              <span class="bar-line" :style="themeType.style.leftBarActiveColor"></span>
              {{$t(every.menu_alias)}}
            </el-menu-item>
          </template>
        </el-submenu>
      </template>

      <el-submenu index="menu-list" v-if="idDev">
        <template slot="title">
          <i class="iconfont icon-gongju2" :style="themeType.style.leftIcon"></i>
          <span slot="title" :style="themeType.style.leftTextColor">研发工具</span>
        </template>
        <el-menu-item index="/menu-list">
          <span class="bar-line" :style="themeType.style.leftBarActiveColor"></span>
          菜单管理
        </el-menu-item>
        <el-menu-item index="/lang-list">
          <span class="bar-line" :style="themeType.style.leftBarActiveColor"></span>
          语言包管理
        </el-menu-item>
        <!-- <el-menu-item index="/label-management">
          <span class="bar-line" :style="themeType.style.leftBarActiveColor"></span>
          标签列表
        </el-menu-item>-->
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { getMenu } from '@/api/develop';
export default {
  data() {
    return {
      isCollapse: false,
      selectText: '',
      defaultOpeneds: []
    };
  },
  created() {
    this.getMenu();
  },

  mounted() {},
  watch: {
    isCollapse(newVal) {
      this.$emit('isCollapseActive', newVal);
    },
    selectNav(newVal) {
      newVal.forEach(el => {
        this.defaultOpeneds.push(el.id);
      });
    }
  },
  computed: {
    ...mapGetters(['themeType', 'userInfo', 'menuNav', 'selectNav', 'defaultName'])
  },
  methods: {
    ...mapActions(['getMenuList', 'setSelectNav', 'setSelectIndex']),
    async getMenu() {
      this.$root.globalLoading = true;
      try {
        let { data } = await getMenu();
        this.getMenuList(data);
        this.initData();
      } catch (error) {
        this._message(error);
      }
      this.$root.globalLoading = false;
    },
    initData() {
      let hrefs = window.location.href.split('#/')[1];
      let itemName = hrefs.split('/')[0];
      
      if (itemName == 'client') {
        //客户管理
        this.selectText = '客户';
      } else if (itemName == 'system') {
        this.selectText = '系统';
      } else if (itemName == 'demand') {
        this.selectText = '需求';
      } else if (itemName == 'logistics') {
        this.selectText = '物流';
      } else {
        this.setSelectNav(this.menuNav[0].children);
      }
      this.menuNav.forEach((el, index) => {
        if (el.name == this.selectText) {
          this.setSelectIndex(index);
          if (el.children) {
            this.setSelectNav(el.children);
          }
        }
      });
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
.my-nav {
  width: 200px;
  position: fixed;
  top: 61px;
  left: 0;
  bottom: 0;
  z-index: 95;
  overflow-y: auto;
  overflow-x: hidden;
  border-right: 1px solid #e7eaef;
  @include transitons(0.35s);
  &.expand-active {
    width: 64px;
  }
  .expand {
    width: 100%;
    height: 45px;
    line-height: 45px;
    text-align: center;
    img {
      width: 18px;
      @include transitons(0.4s);
      transform: rotateY(180deg);
      -moz-transform: rotateY(180deg);
      -webkit-transform: rotateY(180deg);
      -o-transform: rotateY(180deg);
      &.rotate-img {
        transform: rotateY(360deg);
        -moz-transform: rotateY(360deg);
        -webkit-transform: rotateY(360deg);
        -o-transform: rotateY(360deg);
      }
    }
  }
  /deep/ .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  /deep/ .el-submenu__title {
    background: transparent !important;
  }

  /deep/ .el-menu-item {
    height: 40px !important;
    line-height: 40px !important;
    font-size: 14px;
    background: transparent !important;
    &.is-active {
      background: #f1f1f1 !important;
      .bar-line {
        position: absolute;
        right: 0;
        top: 0;
        display: inline-block;
        height: 100%;
        width: 3px;
      }
    }
  }

  /deep/ .el-menu--vertical {
    .el-menu {
      .el-menu-item {
        line-height: 56px;
      }
    }
  }
  /deep/ .el-menu--popup .el-menu-item {
    color: inherit !important;
    background-color: initial !important;
  }
}
.iconfont {
  font-size: 17px;
  margin-right: 8px;
  position: relative;
  top: 1px;
}
</style>
<style>
.my-nav::-webkit-scrollbar {
  width: 10px;
  height: 8px;
}
.my-nav::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(153, 153, 153);
  background: #f1f1f1;
}
.my-nav::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(153, 153, 153);
  border-radius: 0;
  background: #fff;
}
</style>
