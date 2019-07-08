<template>
  <div class="header-nav">
    <div class="logo-box">
      <img src="./../../assets/images/logo2.png" alt>
    </div>
    <ul>
      <li
        :style="themeType.style.topTextColor,selectIndex == index ? themeType.style.topActiveBackground : ''"
        v-for="(item,index) in menuNav"
        :key="index"
        @click="handeleChangeNav(item.name,index)"
      >{{$t(item.menu_alias)}}</li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
  data() {
    return {};
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(['themeType', 'menuNav', 'selectIndex'])
  },
  methods: {
    ...mapActions(['setDefaultName', 'setSelectNav', 'setSelectIndex']),
    handeleChangeNav(name, index) {
      this.setDefaultName(name);
      this.menuNav.forEach(el => {
        if (el.name == name) {
          if (el.children) {
            this.setSelectNav(el.children);
          }
        }
      });
      this.setSelectIndex(index);
    }
  }
};
</script>

<style lang="scss" scoped>
.header-nav {
  height: 58px;
  overflow: hidden;
  .logo-box {
    width: 200px;
    height: 100%;
    line-height: 60px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    float: left;
    .iconfont {
      font-size: 30px;
    }
  }
  ul {
    li {
      display: inline-block;
      float: left;
      height: 100%;
      padding: 0 35px;
      font-size: 16px;
      line-height: 60px;
      color: #fff;
      cursor: pointer;
      &.active {
        background: #000 !important;
      }
    }
  }
}
</style>
