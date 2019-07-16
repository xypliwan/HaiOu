<template>
  <div class="page-card">
    <div class="card-wrapper">
      <el-tabs :value="$route.meta.name" type="border-card" closable @tab-remove="removeTab" @tab-click="tabClick">
        <el-tab-pane v-for="(item,index) in tabList" :key="item.name" :label="$t(item.title)" :name="item.name"></el-tab-pane>
      </el-tabs>
    </div>

    <div class="close-label">
      <el-dropdown trigger="click" @command="handleClickItem">
        <span class="el-dropdown-link">
          <i class="iconfont icon-caozuo"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="0">关闭当前页</el-dropdown-item>
          <el-dropdown-item command="1">关闭其他页</el-dropdown-item>
          <el-dropdown-item command="2">关闭全部页</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  data() {
    return {
      curentIndex: 0
    };
  },
  created() {},
  computed: {
    ...mapGetters(['tabList'])
  },
  methods: {
    ...mapActions(['addTablist', 'deleteTablist', 'deleteAllTablist']),
    handleClickItem(num) {
      //0当前  1其他  2全部
      let indexs = null;
      let item = {};
      this.tabList.forEach((el, i) => {
        if (el.name == this.$route.meta.name) {
          indexs = i;
          item = el;
        }
      });
      switch (num) {
        case '0': //0关闭当前
          if (this.$route.meta.name == 'home') return;
          this.removeTab(item.name);
          break;
        case '1': //1关闭其他
          this.deleteAllTablist();
          this.addTablist(item);
          break;
        case '2': //关闭全部
          this.deleteAllTablist();
          this.$router.push({
            name: this.tabList[0].name
          });
          break;
      }
    },
    tabClick(tab, event) {
      this.$router.push({
        name: tab.name
      });
    },
    removeTab(targetName) {
      if (this.tabList.length <= 1) return;
      this.tabList.forEach((el, i) => {
        if (el.name == targetName) {
          if (i !== 0 && this.$route.meta.name == targetName) {
            this.deleteTablist({ start: i, end: 1 });
            this.$router.push({
              name: this.tabList[i - 1].name
            });
          } else if (i == 0 && this.$route.meta.name == targetName) {
            this.deleteTablist({ start: i, end: 1 });
            if (this.tabList.length > 2) {
              this.$router.push({
                name: this.tabList[i + 1].name
              });
            } else {
              this.$router.push({
                name: this.tabList[i].name
              });
            }
          } else {
            this.deleteTablist({ start: i, end: 1 });
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.page-card {
  display: flex;
  .card-wrapper {
    flex: 1;
    overflow: hidden;
    /deep/ .el-tabs__nav-prev {
      line-height: 38px;
      padding: 0 5px;
    }
    /deep/ .el-tabs__nav-next {
      line-height: 38px;
      padding: 0 5px;
    }
  }
  /deep/ #tab-home .el-icon-close {
    display: none;
  }
  .close-label {
    float: right;
    padding: 0 20px;
    .icon-caozuo {
      cursor: pointer;
      line-height: 39px;
      font-size: 16px;
    }
  }
}
</style>
<style>
.el-tabs--border-card {
  border: none !important;
}
</style>
