
<template>
  <div>
    <div class="search-box">
      <el-row>
        <el-col :span="7" class="flxed">
          <div class="input-label">状态</div>
          <el-select @keyup.enter.native="search" size="mini" class="item" v-model="params.sc_status" filterable placeholder="请选择">
            <el-option v-for="(item,index) in statusList" :key="index" :label="item.val" :value="item.key"></el-option>
          </el-select>
        </el-col>
        <el-col :span="7" class="flxed">
          <div class="input-label">渠道组</div>
          <el-select @keyup.enter.native="search" size="mini" class="item" v-model="params.group" clearable filterable placeholder="请选择">
            <el-option v-for="(item,index) in channelGroupList" :key="index" :label="item.scg_name" :value="item.scg_code"></el-option>
          </el-select>
        </el-col>
        
      </el-row>

      <el-row style="margin-top:20px;">
        <el-col :span="7" class="flxed">
          <div class="input-label">渠道名称</div>
          <el-input @keyup.enter.native="search" size="mini" class="item" v-model="params.sc_name" clearable placeholder="请输入中文名称"></el-input>
        </el-col>
        <el-col :span="7" class="flxed">
          <div class="input-label">渠道代码</div>
          <el-input @keyup.enter.native="search" size="mini" class="item" v-model="params.sc_code" clearable placeholder="请输入渠道代码"></el-input>
        </el-col>
        
      </el-row>
      <el-row style="margin-top:20px;">
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
  props: {
    channelGroupList:[Array]
  },
  data() {
    return {
      statusList:[
        {val:'可用',key:'1'},
        {val:'禁用',key:'2'},
      ],
      params: {
        sc_status:'1',
        group:'',     //分组
        sc_code: '', //服务渠道代码
        sc_name: '' //中文名称
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
      this.params.sc_status = '1',
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



