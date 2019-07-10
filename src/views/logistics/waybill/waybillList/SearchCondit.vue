
<template>
  <div>
    <div class="search-box">
      <el-row>
        <el-col :span="7" class="flxed">
          <div class="input-label">客户分组</div>
          <el-select @keyup.enter.native="search" size="mini" class="item" v-model="params.group_code" filterable placeholder="请选择">
            <el-option v-for="item in clientGroupList" :key="item.group_code" :label="item.group_name" :value="item.group_code"></el-option>
          </el-select>
        </el-col>

        <el-col :span="7" class="flxed">
          <div class="input-label">运单号</div>
          <el-input class="item" @keyup.enter.native="search" size="mini" v-model="params.way_bill_number" clearable placeholder="请输入运单号"></el-input>
        </el-col>
        <el-col :span="7" class="flxed">
          <div class="input-label">客户单号</div>
          <el-input class="item" @keyup.enter.native="search" size="mini" v-model="params.customer_number" clearable placeholder="请输入客户单号"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top:15px;">
        <el-col :span="7" class="flxed">
          <div class="input-label">运单类型</div>
          <el-select size="mini" @keyup.enter.native="search" class="item" v-model="params.way_bill_type" filterable placeholder="请选择">
            <el-option v-for="item in waybillType" :key="item.type_index" :label="item.type_name" :value="item.type_index"></el-option>
          </el-select>
        </el-col>

        <el-col :span="7" class="flxed">
          <div class="input-label">客户编码</div>
          <el-input size="mini" @keyup.enter.native="search" class="item" v-model="params.company_code" clearable placeholder="请输入客户编码"></el-input>
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
        <el-col style="width:225px;margin-left:32px;">
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
    waybillType: {
      //运单类型
      type: Array,
      default: () => []
    },
    clientGroupList: {
      //客户分组
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      times: [],
      params: {
        group_code: '', //客户分组
        way_bill_number: '', //运单号
        customer_number: '', //客户单号
        company_code: '', //客户编码
        way_bill_type: '', //运单类型
        created_start: '',
        created_end: ''
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
  mounted() {},
  watch: {
    clientGroupList(newVal) {
      this.params.group_code = newVal[0].group_code;
    }
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


