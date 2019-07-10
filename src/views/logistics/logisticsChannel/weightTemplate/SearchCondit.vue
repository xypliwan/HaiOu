
<template>
  <div>
    <div class="search-box">
      <el-row>
        <el-col :span="7" class="flxed">
          <div class="input-label">名称</div>
          <el-input @keyup.enter.native="search" size="mini" class="item" v-model="params.wt_name" clearable placeholder="模糊搜索"></el-input>
        </el-col>
        <el-col :span="5" class="flxed">
          <el-button size="mini" type="primary" @click="search">查询</el-button>
          <el-button size="mini" @click="reset">重置</el-button>
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
        wt_name: '', //重量段模板名称
      }
    };
  },
  methods: {
    search() {
      this.$emit('search', this.params);
    },
    reset() {
      for (let i in this.params) {
        this.params[i] = '';
      }
      this.$emit('reset', this.params);
    }
  }
};
</script>

<style lang="scss" scoped>
.search-box {
  width: 1000px;
  .input-label {
    color: #666;
    font-size: 13px;
    height: 100%;
    line-height: 30px;
    text-align: right;
    padding-right: 10px;
    float: left;
  }
}
.flxed {
  display: flex;
  margin-right: 20px;
  padding: 0 10px;
  .item {
    flex: 1;
  }
}
.times {
  min-width: 250px;
  max-width: 330px;
}
</style>



