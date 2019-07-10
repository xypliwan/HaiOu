<template>
  <div class="search-box">
    <el-row>
      <el-col :span="7" class="flxed">
        <div class="input-label">合同标题</div>
        <el-input @keyup.enter.native="search" clearable size="mini" class="item" placeholder="模糊搜索" v-model="params.doc_title"></el-input>
      </el-col>
      <el-col :span="7" class="flxed">
        <div class="input-label">合同编码</div>
        <el-input @keyup.enter.native="search" clearable size="mini" class="item" placeholder="模糊搜索" v-model="params.doc_number"></el-input>
      </el-col>
    </el-row>
    <el-row style="margin-top:15px;">
      <el-col class="flxed" :span="10">
        <div class="input-label">签约时间</div>
        <el-date-picker
          @keyup.enter.native="search"
          size="mini"
          @change="changeTime"
          class="item times"
          v-model="times"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          type="datetimerange"
          range-separator="-"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-col>
      <el-col style="width:225px;margin-left:32px;">
        <el-button size="mini" type="primary" @click="search">查询</el-button>
        <el-button size="mini" @click="reset">重置</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      times: [],
      params: {
        doc_title: '', //合同标题
        doc_number: '', //合同编码
        sign_start: '', //创建开始时间
        sign_end: '' //创建结束时间
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
      this.times = [];
      this.$emit('reset', this.params);
    },
    changeTime(e) {
      if (e == null) {
        this.params.sign_start = '';
        this.params.sign_end = '';
      } else {
        this.params.sign_start = e[0];
        this.params.sign_end = e[1];
      }
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

