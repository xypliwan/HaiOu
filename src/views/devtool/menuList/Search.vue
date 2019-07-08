<template>
  <div>
    <div class="search-box">
      <el-row style="margin-top:20px;">
        <el-col style="width:335px;">
          <el-col style="width:70px;">
            <div class="input-label">菜单名称</div>
          </el-col>
          <el-col style="width:200px;">
            <el-input clearable size="mini" placeholder="模糊搜索" v-model="params.name"></el-input>
          </el-col>
        </el-col>
        <el-col style="width:335px;">
          <el-col style="width:70px;">
            <div class="input-label">菜单路径</div>
          </el-col>
          <el-col style="width:200px;">
            <el-input clearable size="mini" placeholder="模糊搜索" v-model="params.path"></el-input>
          </el-col>
        </el-col>
        <el-col style="width:225px">
          <el-button size="mini" type="primary" @click="search">查询</el-button>&nbsp;&nbsp;
          <el-button size="mini" @click="reset">重置</el-button>&nbsp;&nbsp;
          <el-button size="mini" @click="add">新增</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      params: {
        name: '', //菜单名称
        path: '' //菜单路径
      }
    };
  },
  methods: {
    search() {
      this.$emit('search', this.params);
    },
    reset() {
      this.selectTime = '';
      for (let i in this.params) {
        this.params[i] = '';
      }
      this.$emit('reset', this.params);
    },
    add() {
      this.$emit('add');
    }
  }
};
</script>


<style lang="scss" scoped>
@import '@/assets/styles/mixin.scss';
.search-box {
  .input-label {
    color: #666;
    font-size: 13px;
    height: 100%;
    line-height: 30px;
    text-align: right;
    margin-right: 10px;
  }
}
</style>
