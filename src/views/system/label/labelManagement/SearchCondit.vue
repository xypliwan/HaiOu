<template>
  <div class="search-box">
    <el-row>
      <el-col :span="5" class="flxed">
        <div class="input-label">模板编码</div>
        <el-input @keyup.enter.native="search" clearable size="mini" class="item" placeholder="模糊搜索" v-model="params.template_code"></el-input>
      </el-col>
      <el-col :span="5" class="flxed">
        <div class="input-label">模板名称</div>
        <el-input @keyup.enter.native="search" clearable size="mini" class="item" placeholder="模糊搜索" v-model="params.template_name"></el-input>
      </el-col>
    </el-row>
    <el-row style="margin-top:15px;">
      <el-col :span="5" class="flxed">
        <div class="input-label">模板类型</div>
        <el-select @keyup.enter.native="search" size="mini" class="item" v-model="params.template_type" placeholder="请选择">
          <el-option v-for="(item,index) in lableTypeList" :key="index" :label="item.type_name" :value="item.type_index"></el-option>
        </el-select>
      </el-col>
      <el-col :span="5" class="flxed">
        <div class="input-label">是否启用</div>
        <el-select @keyup.enter.native="search" size="mini" class="item" v-model="params.is_enable" placeholder="请选择">
          <el-option v-for="(item,index) in isEnable" :key="index" :label="item.title" :value="item.index"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row style="margin-top:20px;">
      <el-col style="width:225px;margin-left:71px;">
        <el-button size="mini" type="primary" @click="search">查询</el-button>
        <el-button size="mini" @click="reset">重置</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    lableTypeList: [Array]
  },
  data() {
    return {
      isEnable: [{ title: '已启用', index: '1' }, { title: '未启用', index: '0' }],
      params: {
        template_code: '', //模板编码
        template_name: '', //模板名称
        template_type: '', //模板类型
        is_enable: '' //是否启用  0未启用  1启用
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


