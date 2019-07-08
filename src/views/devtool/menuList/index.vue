<template>
  <div>
    <search-box @add="menuVisible = true" @search="search" @reset="reset"></search-box>

    <div class="table-box">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" :row-style="this.$root.tableContentStyle" :header-cell-style="this.$root.tableTitileStyle">
        <el-table-column label="NO" width="55">
          <template slot-scope="scope">
            <div>{{(scope.$index + 1) + (params.page-1)*params.pageSize}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="菜单中文名称"></el-table-column>
        <el-table-column prop="name_en" label="菜单英文名称"></el-table-column>
        <el-table-column prop="path" label="菜单路径"></el-table-column>
        <el-table-column prop="menu_alias" label="菜单编码"></el-table-column>
        <el-table-column label="父级名称">
          <template slot-scope="scope">
            <p>中文名称: {{ scope.row.parent_name }}</p>
            <p>英文名称: {{ scope.row.parent_name_en }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="menu_icon" label="一级图标">
          <template slot-scope="scope">
            <i class="iconfont" :class="scope.row.menu_icon"></i>
            {{scope.row.menu_icon}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="editDetail(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-wrapper">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <add-menu :menuVisible="menuVisible" @addOk="getMenuList" :menuId="menuId" @closeVisible="closeVisible"></add-menu>
  </div>
</template>

<script>
import SearchBox from './Search';
import AddMenu from './AddMenu';
import { getMenuList } from '@/api/develop';

export default {
  data() {
    return {
      menuVisible: false,
      params: {
        name: '', //菜单名称
        path: '', //菜单路径
        page: 1,
        pageSize: 10
      },
      tableData: [],
      total: null,
      menuId: ''
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    closeVisible() {
      this.menuVisible = false;
      this.menuId = '';
    },
    editDetail(id) {
      this.menuId = id;
      this.menuVisible = true;
    },
    handleSizeChange(e) {
      //设置显示一页展示多少条数
      this.params.pageSize = e;
      this.getMenuList();
    },
    handleCurrentChange(e) {
      //点击第几页
      this.params.page = e;
      this.getMenuList();
    },
    async getMenuList() {
      try {
        let { data, paginator } = await getMenuList(this.params);
        this.tableData = data;
        this.total = paginator.totalCount;
      } catch (error) {
        this._message(error);
      }
    },
    search(params) {
      //搜索
      this.params = Object.assign(this.params, params);
      this.params.page = 1;
      this.getMenuList();
    },

    reset(params) {
      //重置
      this.params = Object.assign(this.params, params);
    }
  },
  components: {
    SearchBox,
    AddMenu
  }
};
</script>



<style lang="scss" scoped>
.table-box {
  margin: 50px 0;
}
.pagination-wrapper {
  text-align: right;
  margin-top: 20px;
}
</style>
