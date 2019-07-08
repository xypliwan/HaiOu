<template>
  <div>
    <el-table :data="tableData" style="width: 100%" :row-style="this.$root.tableContentStyle" :header-cell-style="this.$root.tableTitileStyle">
      <el-table-column type="index" width="50" fixed></el-table-column>
      <el-table-column prop="application_code" label="应用代码" width="100" fixed></el-table-column>
      <el-table-column prop="company_code" label="客户代码" width="100" fixed></el-table-column>
      <el-table-column prop="customer_code" label="应用客户编码" width="180"></el-table-column>
      <el-table-column prop="app_account" label="API账号" width="120"></el-table-column>
      <el-table-column prop="app_expires_time" label="有效时间" width="200"></el-table-column>

      <el-table-column prop="company_app_status" label="绑定状态" width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.company_app_status == '1' ? '已绑定' : (scope.row.company_app_status == '0' ? '已解除' : '已禁用') }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="company_code" label="操作" width="80" header-align="center" align="center" fixed="right">
        <template slot-scope="scope">
          <div>
            <span v-if="!scope.row.customer_code.length">
                <el-link type="primary" @click="openApp(scope.row)">开通</el-link>
            </span>
            
          </div>
        </template>
      </el-table-column>
    </el-table>

    <open-app ref="openRef" :company_code="company_code" :application_code="application_code" :visibleApp.sync="visibleApp"></open-app>
  </div>
</template>

<script>
import OpenApp from './OpenApp';

export default {
  props: {
    tableData: [Array],
    company_code: String
  },
  data() {
    return {
      application_code: '',
      visibleApp: false
    };
  },

  methods: {
    openApp(row) {
      this.application_code = row.application_code;
      this.visibleApp = true;
    }
  },
  components: {
    OpenApp
  }
};
</script>

<style lang="scss" scoped>
</style>

