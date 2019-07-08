<template>
  <div>
    <div class="add-box">
      重量区间 ( 单位: kg )
      <el-button type="primary" class="fr" size="mini" @click="addItem">新增</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" :row-style="this.$root.tableContentStyle" :header-cell-style="this.$root.tableTitileStyle" stripe>
      <el-table-column type="index" width="50" header-align="center" align="center"></el-table-column>
      <el-table-column label="名称">
        <template slot-scope="scope">
          <div>
            <el-input size="mini" clearable v-model="scope.row.wtd_title"></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="计费类型">
        <template slot-scope="scope">
          <div>
            <el-select size="mini" v-model="scope.row.wk_code" placeholder="请选择">
              <el-option v-for="(item,index) in weightType" :key="index" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="开始值">
        <template slot-scope="scope">
          <div>
            <el-input size="mini" clearable v-model="scope.row.wtd_start_weight"></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="截止值">
        <template slot-scope="scope">
          <div>
            <el-input size="mini" clearable v-model="scope.row.wtd_end_weight"></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="计费单重">
        <template slot-scope="scope">
          <div>
            <el-input size="mini" clearable v-model="scope.row.fk_unit_weight" type="number"></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" width="100" header-align="center" align="center">
        <template slot-scope="scope">
          <div class="cz-box">
            <el-link type="primary" @click="deleteItem(scope.$index)">删除</el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    weightType: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      options: []
    };
  },
  methods: {
    deleteItem(index) {
      this.$emit('deleteItem', index);
    },
    addItem() {
      this.$parent.$parent.addTableItem();
    }
  }
};
</script>

<style lang="scss" scoped>
.add-box {
  margin-top: 30px;
  font-size: 14px;
  color: #666;
  overflow: hidden;
  margin-bottom: 10px;
}
</style>
