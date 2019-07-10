<template>
  <div class="search-box">
    <el-row>
      <el-col :span="7" class="flxed">
        <div class="input-label">类型</div>
        <el-select @keyup.enter.native="search" size="mini" class="item" filterable clearable v-model="params.c_type" placeholder="请选择">
          <el-option v-for="(item,index) in cacheType" :key="index" :label="item.type_name" :value="item.type_index"></el-option>
        </el-select>
      </el-col>
      <el-col :span="7" class="flxed">
        <div class="input-label">名称</div>
        <el-input @keyup.enter.native="search" clearable size="mini" class="item" placeholder="模糊搜索" v-model="params.c_name"></el-input>
      </el-col>
    </el-row>
    <el-row style="margin-top:15px;">
      <el-col style="width:225px;margin-left:45px;">
        <el-button size="mini" type="primary" @click="search">查询</el-button>
        <el-button size="mini" @click="reset">重置</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    cacheType: [Array]
  },
  data() {
    return {
      params: {
        c_type: '', //类型
        c_name: '' //名称
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
</style>

