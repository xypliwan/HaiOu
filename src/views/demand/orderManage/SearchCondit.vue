
<template>
  <div>
    <div class="search-box">
      <el-row>
        <el-col :span="7" class="flxed">
          <div class="input-label">客户代码</div>
          <el-input clearable size="mini" @keyup.enter.native="search" class="item" placeholder="模糊搜索" v-model="params.company_code"></el-input>
        </el-col>

        <el-col :span="8" class="flxed">
          <div class="input-label">派送渠道</div>
          <el-select @keyup.enter.native="search" class="item" size="mini" v-model="params.sc_code" filterable clearable placeholder="请选择">
            <el-option v-for="item in channelList" :key="item.sc_code" :label="`[ ${item.sc_code} ] ${item.sc_name}`" :value="item.sc_code"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-top:15px;">
        <el-col :span="10" class="flxed">
          <div class="input-label">发布时间</div>
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
        <el-col style="width:225px;margin-left:71px">
          <el-button size="mini" type="primary" @click="search">查询</el-button>
          <el-button size="mini" @click="reset">重置</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    productList: {
      type: Array,
      default: () => []
    },
    channelList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      times: [],
      params: {
        company_code: '', //客户编码
        sc_code: '', //销售产品
        created_start: '', //发布开始时间
        created_end: '' //发布截止时间
      }
    };
  },
  created() {
    // let start = new Date();
    // let end = new Date();
    // start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
    // this.times[0] = new Date(start);
    // this.times[1] = new Date(end);
    // this.params.created_start = this.times[0];
    // this.params.created_end = this.times[1];
    // console.log(this.params.created_start)
    // console.log(this.params.created_end)
  },
  mounted() {
    this.$emit('initSearch', this.params);
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
.times {
  min-width: 250px;
  max-width: 330px;
}
</style>

