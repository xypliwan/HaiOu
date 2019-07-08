<template>
  <div>
    <el-table :data="tableData" style="width: 100%" :row-style="this.$root.tableContentStyle" :header-cell-style="this.$root.tableTitileStyle">
      <el-table-column type="index" width="50" fixed></el-table-column>
      <el-table-column prop="username" label="用户账户" width="100" fixed></el-table-column>
      <el-table-column prop="is_admin" label="是否主账户" width="120" fixed>
        <template slot-scope="scope">
          <div>{{ scope.row.is_admin == '1' ? '是' : '否' }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="用户邮箱" width="180"></el-table-column>
      <el-table-column prop="phone" label="手机号码" width="120"></el-table-column>
      <el-table-column label="用户状态" width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.status == '0' ? '已注销' : ( scope.row.status == '9' ? '待激活' : '已激活' ) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="company_code" label="客户代码" width="120"></el-table-column>
      <el-table-column prop="qq_number" label="QQ号码" width="120"></el-table-column>
      <el-table-column prop="wechat_id" label="微信OpenID" width="120"></el-table-column>
      <el-table-column label="时间" width="250">
        <template slot-scope="scope">
          <div>注册时间: {{scope.row.created_time}}</div>
          <div>更新时间: {{scope.row.updated_time}}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    tableData: [Array]
  }
};
</script>

<style lang="scss" scoped>
</style>
