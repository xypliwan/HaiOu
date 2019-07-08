<template>
  <div class="config-box">
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="config_item" label="配置项" width="200"></el-table-column>
      <el-table-column prop="config_field" label="配置Key" width="150"></el-table-column>
      <el-table-column prop="config_value" label="配置value">
        <template slot-scope="scope">
          <div>
            <el-input size="mini" v-model="scope.row.config_value" clearable></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="config_note" label="备注"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    tableData: [Array]
  },
  data() {
    return {};
  },
  methods: {
    getData() {
      return this.tableData;
    }
  }
};
</script>


<style lang="scss" scoped>
.config-box {
  margin-left: 30px;
  margin-top: 30px;
}
</style>

