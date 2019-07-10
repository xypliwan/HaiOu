
<template>
  <div>
    <div class="search-box">
      <el-row>
        <el-col :span="7" class="flxed">
          <div class="input-label">起始地</div>
          <el-select @keyup.enter.native="search" clearable size="mini" class="item" v-model="params.sea_origin_id" filterable placeholder="请选择">
            <el-option v-for="item in originList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-col>

        <el-col :span="7" class="flxed">
          <div class="input-label">目的地</div>
          <el-select @keyup.enter.native="search" clearable size="mini" class="item" v-model="params.sea_destination_id" filterable placeholder="请选择">
            <el-option v-for="item in destinationList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row style="margin-top:15px;">
        <el-col :span="7" class="flxed">
          <div class="input-label">服务商</div>
          <el-select @keyup.enter.native="search" clearable size="mini" class="item" v-model="params.service_id" filterable placeholder="请选择">
            <el-option v-for="item in serviceProviderList" :key="item.sp_id" :label="item.sp_name" :value="item.sp_id"></el-option>
          </el-select>
        </el-col>
        <el-col style="width:225px;margin-left:60px;">
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
    originList: {
      //始发地
      type: Array,
      default: () => []
    },
    destinationList: {
      //目的地
      type: Array,
      default: () => []
    },
    serviceProviderList: {
      //服务商列表
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      times: [],
      params: {
        sea_origin_id: '', //始发地id
        sea_destination_id: '', //目的地id
        service_id: '' //服务商id
      }
    };
  },
  created() {},
  mounted() {},
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


