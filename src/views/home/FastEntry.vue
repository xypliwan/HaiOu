<template>
  <div class="fast-entry" v-loading="dataLoading">
    <div class="title">
      <span class="line"></span> 快捷访问
      <i class="el-icon-plus fr" @click.stop="navVisible = true"></i>
      <div class="nav-list">
        <div class="item" @click="toPage(item.path)" v-for="(item, index) in defaultNav" :key="index">
          <p>
            <i class="iconfont" :class="item.menu_icon"></i>
            {{item.name}}
          </p>
        </div>
      </div>
    </div>
    <add-nav :navVisible.sync="navVisible" @getNav="getNav"></add-nav>
  </div>
</template>

<script>
import AddNav from './AddNav';
import Titles from '_c/common/Titles';

export default {
  data() {
    return {
      navVisible: false,
      defaultNav: [],
      dataLoading: false
    };
  },
  methods: {
    getNav(nav) {
      this.defaultNav = nav;
    },
    toPage(path) {
      this.$router.push(path);
    }
  },
  components: {
    AddNav,
    Titles
  }
};
</script>

<style lang="scss" scoped>
.fast-entry {
  .title {
    font-size: 14px;
    font-weight: 400;
    color: #333;
    .line {
      float: left;
      display: inline-block;
      width: 3px;
      background: #13a468;
      height: 14px;
      margin-right: 7px;
    }
    i {
      cursor: pointer;
    }
    .nav-list {
      margin-top: 25px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-content: flex-start;
      justify-content: space-between;
      .item {
        width: 47%;
        margin-bottom: 15px;
        border-radius: 3px;
        box-shadow: 1px 1px 3px 0px #eaeaea;
        overflow: hidden;
        cursor: pointer;
        p {
          font-size: 14px;
          color: #333;
          padding: 0px 10px;
          background: #f0f4f3;
          height: 30px;
          line-height: 30px;
          font-weight: 400;
          i {
            font-size: 15px;
            margin-right: 5px;
            color: #333;
          }
        }
        &:hover {
          p {
            color: #13a468;
            i {
              display: inline-block;
            }
          }
        }
      }
    }
  }
}
</style>
