<template>
  <div class="search-box">
    <el-row>
      <el-col :span="7" class="flxed">
        <div class="input-label">客户分组</div>
        <el-select @keyup.enter.native="search" filterable clearable class="item" size="mini" v-model="params.group_code" filterable clearable placeholder="全部">
          <el-option v-for="item in clentGroup" :key="item.group_code" :label="item.group_name" :value="item.group_code"></el-option>
        </el-select>
      </el-col>
      <el-col :span="7" class="flxed">
        <div class="input-label">公司名称</div>
        <el-input clearable size="mini" class="item" placeholder="模糊搜索" v-model="params.company_name" @keyup.enter.native="search"></el-input>
      </el-col>
      <el-col :span="7" class="flxed">
        <div class="input-label">公司代码</div>
        <el-input clearable size="mini" @keyup.enter.native="search" class="item" placeholder="模糊搜索" v-model="params.company_code"></el-input>
      </el-col>
    </el-row>

    <el-row style="margin-top:15px;">
      <el-col class="flxed" :span="10">
        <div class="input-label">添加时间</div>
        <el-date-picker
          @keyup.enter.native="search"
          size="mini"
          @change="changeTime"
          class="item times"
          v-model="times"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
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
  props:{
    clentGroup:[Array]
  },
  data() {
    return {
      times: [],
      params: {
        company_name: '', //名称
        company_code: '', //公司代码
        created_start: '',
        created_end: '',
        group_code:'',    //客户分组

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
    },
    changeTime(e) {
      if (e == null) {
        this.params.created_start = '';
        this.params.created_end = '';
      } else {
        this.params.created_start = e[0];
        this.params.created_end = e[1];
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
