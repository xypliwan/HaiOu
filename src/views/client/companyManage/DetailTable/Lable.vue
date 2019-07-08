<template>
  <div>
    <el-table :data="tableData" style="width: 100%" :row-style="this.$root.tableContentStyle" :header-cell-style="this.$root.tableTitileStyle">
      <el-table-column type="index" width="50" fixed></el-table-column>
      <el-table-column prop="company_label_name" label="标签名" fixed></el-table-column>
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

