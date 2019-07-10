<template>
  <div class="theme-box">
    <div class="item-wrapper" @click="selectTheme(index)" v-for="(item, index) in themeStyles" :key="index">
      <div class="theme-title">{{ $t(item.title) }}</div>
      <div class="item" :class="{'active-theme':currentIndex == index}">
        <div class="right-top" :style="item.style.top"></div>
        <div class="item-right">
          <div class="item-left" :style="item.style.left"></div>
          <div class="right-bottom"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { themeStyle } from '@/config/theme.js';
import { mapActions, mapMutations } from 'vuex';
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '_u/localStorage';
export default {
  data() {
    return {
      themeStyles: [],
      currentIndex: getLocalStorage('themeindex') - 1 || 0
    };
  },
  created() {
    this.themeStyles = themeStyle;
  },
  mounted() {},
  methods: {
    ...mapActions(['setTheme']),
    ...mapMutations(['SET_THEME']),
    selectTheme(i) {
      this.currentIndex = i;
      setLocalStorage('themeindex', i + 1);
      this.setTheme();
    }
  }
};
</script>

<style lang="scss" scoped>
.theme-box {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .item-wrapper {
    margin: 8px;
    .theme-title {
      height: 30px;
      text-align: center;
      font-size: 13px;
      line-height: 30px;
      color: #999;
    }
    .item {
      width: 200px;
      height: 120px;
      padding: 10px 10px;
      border: 1px solid #f1f1f1;
      border-radius: 3px;
      background: #f1f1f1;
      &.active-theme {
        border: 2px solid #409eff;
      }
      .right-top {
        height: 30px;
      }
      .item-right {
        display: flex;
        .item-left {
          width: 40px;
          margin-right: 10px;
          float: left;
          margin-top: 10px;
        }
        .right-bottom {
          flex: 1;
          height: 56px;
          margin-top: 10px;
          background: #fff;
        }
      }
    }
    &:hover {
      .item {
        border: 2px solid #409eff;
      }
    }
  }
}
</style>
