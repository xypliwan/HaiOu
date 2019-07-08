<template>
  <div>
    <search-condit :lableTypeList="lableTypeList" @search="search" @reset="reset"></search-condit>
    <div class="operat-box">
      <el-button size="mini" class="fr" @click="labelVisible = true" plain>新增</el-button>
    </div>
    <div class="table-box tables">
      <el-table :data="tableData" stripe style="width: 100%" v-loading="tableLoading" :row-style="this.$root.tableContentStyle" :header-cell-style="this.$root.tableTitileStyle">
        <el-table-column header-align="center" align="center" label="NO" width="50" fixed>
          <template slot-scope="scope">
            <div>{{(scope.$index + 1) + (params.page-1)*params.pageSize}}</div>
          </template>
        </el-table-column>

        <el-table-column prop="template_code" label="模板编号" width="220" fixed></el-table-column>
        <el-table-column prop="template_name" label="模板名称"></el-table-column>
        <el-table-column label="模板类型">
          <template slot-scope="scope">
            <div>{{getMappingVal(lableTypeList,'type_index',scope.row.template_type,'type_name')}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="template_width" label="模板宽度"></el-table-column>
        <el-table-column prop="template_height" label="模板高度"></el-table-column>
        <el-table-column label="是否启用">
          <template slot-scope="scope">
            <div>{{scope.row.is_enable == '0' ? '未启用' :'已启用'}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="updated_time" label="更新时间"></el-table-column>
        <el-table-column label="操作" fixed="right" width="100" header-align="center" align="center">
          <template slot-scope="scope">
            <div>
              <el-link @click="goLabel(scope.row.template_code)">编辑</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-box">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.page"
        :page-sizes="pageSizeArr"
        :page-size="params.pageSize"
        layout="total, sizes,slot, prev, pager, next, jumper"
        :total="total"
      >
        <customize-page @customizePage="customizePage"></customize-page>
      </el-pagination>
    </div>

    <add-lable :labelVisible.sync="labelVisible" :lableTypeList="lableTypeList"></add-lable>
  </div>
</template>

<script>
import AddLable from './AddLabel';
import SearchCondit from './SearchCondit';
import CustomizePage from '_c/CustomizePage';
import { getTypes } from '@/api/common';
import { getTemplateList } from '@/api/develop';
export default {
  data() {
    return {
      labelVisible: false,
      lableTypeList: [],
      pageSizeArr: [10, 20, 30, 40],
      params: {
        template_code: '', //模板编码
        template_name: '', //模板名称
        template_type: '', //模板类型
        is_enable: '', //是否启用  0未启用  1启用
        page: 1,
        pageSize: 10
      },
      tableData: [],
      tableLoading: false,
      total: null
    };
  },
  created() {
    this.baseData();
    this.getTemplateList();
  },
  methods: {
    goLabel(code) {
      this.$router.push({
        path: '/system/label/label-list',
        query: {
          code
        }
      });
    },
    async getTemplateList() {
      this.tableLoading = true;
      try {
        let { data, paginator } = await getTemplateList(this.params);
        this.tableData = data;
        this.total = paginator.totalCount;
      } catch (error) {
        this._message(error);
      }
      this.tableLoading = false;
    },
    customizePage(pageSize) {
      this.pageSizeArr[4] = pageSize;
      this.params.pageSize = pageSize;
      this.getTemplateList();
    },
    handleSizeChange(e) {
      //设置显示一页展示多少条数
      this.params.pageSize = e;
      this.getTemplateList();
    },
    handleCurrentChange(e) {
      //点击第几页
      this.params.page = e;
      this.getTemplateList();
    },
    search(params) {
      Object.assign(this.params, params);
      this.getTemplateList();
    },
    reset(params) {
      Object.assign(this.params, params);
    },
    async baseData() {
      try {
        let res1 = await getTypes({ type_code: 'label_template_type' }); //模板类型
        this.lableTypeList = res1.data;
      } catch (error) {
        this._message(error);
      }
    }
  },
  components: {
    AddLable,
    SearchCondit,
    CustomizePage
  }
};
</script>

<style lang="scss" scoped>
.tables {
  margin-top: 10px;
}
</style>

