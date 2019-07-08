<template>
  <div>
    <el-dialog title="添加菜单 ( 拖拽添加 / 删除菜单 )" :visible.sync="navVisible" width="600px" :before-close="handleClose" v-loading="navLoading">
      <div class="box">
        <div class="item fl">
          <div class="title">已添加菜单</div>
          <draggable style="min-height:200px;" v-model="defaultNav" :options="{group:'people'}">
            <div class="nav" v-for="item in defaultNav" :key="item.menu_alias">
              <i class="iconfont" :class="item.menu_icon"></i>
              {{item.name}}
            </div>
          </draggable>
        </div>
        <div class="item fr">
          <div class="title">待添加菜单</div>
          <draggable style="min-height:200px" v-model="waitNav" :options="{group:'people'}">
            <div class="nav" v-for="item in waitNav" :key="item.menu_alias">
              <i class="iconfont" :class="item.menu_icon"></i>
              {{item.name}}
            </div>
          </draggable>
        </div>
      </div>
      <div class="dialog-footer">
        <el-button size="mini" @click="handleClose">关闭</el-button>
        <el-button size="mini" type="primary" @click="saveNav">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { getShortcut, saveShortcut } from '@/api/controlPanel';
import { mapGetters } from 'vuex';
import { setTimeout } from 'timers';
export default {
  props: {
    navVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      defaultNav: [],
      allNav: [],
      waitNav: [],
      navLoading: false
    };
  },
  created() {
    this.getShortcut();
  },
  computed: {
    ...mapGetters(['menuNav'])
  },
  methods: {
    async saveNav() {
      this.defaultNav.forEach((el, i) => {
        el.shortcut_sort = i + 1;
      });
      this.navLoading = true;
      try {
        let { message } = await saveShortcut({ menu_alias_arr: this.defaultNav });
        this.$emit('getNav', this.defaultNav);
        this._message(message, 'success');
        this.handleClose();
      } catch (error) {
        this._message(error);
      }
      this.navLoading = false;
    },
    async getShortcut() {
      this.$parent.dataLoading = true;
      try {
        let { data } = await getShortcut();
        this.defaultNav = data;
        this.$emit('getNav', this.defaultNav);
        setTimeout(() => {
          this.formatData(this.defaultNav);
        }, 800);
      } catch (error) {
        this._message(error);
      }
      this.$parent.dataLoading = false;
    },
    formatData(defaultNav) {
      this.menuNav.forEach(el => {
        el.children.forEach(ev => {
          ev.children.forEach(ec => {
            this.allNav.push(ec);
          });
        });
      });

      for (var i = 0; i < this.allNav.length; i++) {
        var obj = this.allNav[i];
        var num = obj.menu_alias;
        var isExist = false;
        for (var j = 0; j < this.defaultNav.length; j++) {
          var aj = this.defaultNav[j];
          var n = aj.menu_alias;
          if (n == num) {
            isExist = true;
            break;
          }
        }
        if (!isExist) {
          this.waitNav.push(obj);
        }
      }
    },

    handleClose() {
      this.$emit('update:navVisible', false);
    }
  },
  components: {
    draggable
  }
};
</script>

<style lang="scss" scoped>
.box {
  overflow: hidden;
  .item {
    width: 250px;
    padding: 20px 10px;
    .title {
      margin-bottom: 15px;
      font-size: 16px;
      color: #007947;
    }
    .nav {
      height: 30px;
      border: 1px solid #f1f1f1;
      line-height: 30px;
      padding: 0 10px;
      cursor: move;
      margin-bottom: 5px;
      border-radius: 3px;
      overflow: hidden;
      font-size: 15px;
    }
  }
}
</style>
