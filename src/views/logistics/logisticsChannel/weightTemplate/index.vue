<template>
  <div>
    <search-condit @search="search" @reset="reset"></search-condit>
    <div class="operat-box">
      <el-button size="mini" class="fr" type="primary" @click="seeDetail('','1')">新增模板</el-button>
    </div>

    <div class="table-box table-wrapper">
      <el-table v-loading="tableLoading" :data="tableData" style="width: 100%" :row-style="this.$root.tableContentStyle" :header-cell-style="this.$root.tableTitileStyle" stripe>
        <el-table-column header-align="center" align="center" label="NO" width="50" fixed>
          <template slot-scope="scope">
            <div>{{(scope.$index + 1) + (params.page-1)*params.pageSize}}</div>
          </template>
        </el-table-column>
        <el-table-column label="模板ID" prop="wt_id"></el-table-column>
        <el-table-column label="名称" prop="wt_name"></el-table-column>
        <el-table-column label="英文名称" prop="wt_name_en"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div>
              <span class="status-point" :class="{ 'status10': scope.row.wt_status === '0', 
                        'status1': scope.row.wt_status === '1'
                         }"></span>
              {{ scope.row.wt_status == '1' ? '已生效' : '草稿'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="是否公共模块">
          <template slot-scope="scope">
            <div>{{scope.row.is_default == '1' ? '是' : '否'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="wt_note" show-overflow-tooltip></el-table-column>
        <el-table-column label="更新时间" prop="wt_update_time" width="150"></el-table-column>
        <el-table-column label="操作" fixed="right" width="100" header-align="center" align="center">
          <template slot-scope="scope">
            <div class="cz-box">
              <el-link type="primary" @click="seeDetail(scope.row.wt_id,'3')">编辑</el-link>
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

    <add-template :templateVisible.sync="templateVisible" :templateId="templateId" :flg="flg" :weightType="weightType" @saveOk="getWeightTemplateListData"></add-template>
  </div>
</template>

<script>
import AddTemplate from './AddTemplate';
import SearchCondit from './SearchCondit';
import CustomizePage from '_c/CustomizePage';
import { getWeightType, getWeightTemplateListData } from '@/api/logistics';
export default {
  name:'weightTemplate',
  data() {
    return {
      templateVisible: false,
      flg: '', //1增加  2查看   3编辑
      templateId: '',
      weightType: [], //计费类型
      params: {
        wt_name: '', //重量段模板名称
        page: 1,
        pageSize: 10
      },
      tableLoading: false,
      tableData: [],
      pageSizeArr: [10, 20, 30, 40],
      total: null
    };
  },
  created() {
    this.getWeightType();
    this.getWeightTemplateListData();
  },
  watch: {
    templateVisible(newVal) {
      if (!newVal) {
        this.flg = '';
      }
    }
  },
  methods: {
    async getWeightTemplateListData() {
      this.tableLoading = true;
      try {
        let { data, paginator } = await getWeightTemplateListData(this.params);
        this.tableData = data;
        this.total = paginator.totalCount;
      } catch (error) {
        this._message(error);
      }
      this.tableLoading = false;
    },
    async getWeightType() {
      try {
        let { data } = await getWeightType();
        this.weightType = data;
      } catch (error) {
        this._message(error);
      }
    },
    search(params) {
      Object.assign(this.params, params);
      this.getWeightTemplateListData();
    },
    reset(params) {
      Object.assign(this.params, params);
    },
    seeDetail(id, flg) {
      this.templateId = id;
      this.flg = flg;
      this.templateVisible = true;
    },
    customizePage(pageSize) {
      this.pageSizeArr[4] = pageSize;
      this.params.pageSize = pageSize;
      this.getWeightTemplateListData();
    },
    handleSizeChange(e) {
      //设置显示一页展示多少条数
      this.params.pageSize = e;
      this.getWeightTemplateListData();
    },
    handleCurrentChange(e) {
      //点击第几页
      this.params.page = e;
      this.getWeightTemplateListData();
    }
  },
  components: {
    AddTemplate,
    SearchCondit,
    CustomizePage
  }
};
</script>

<style lang="scss" scoped>
.table-wrapper {
  margin-top: 10px;
}
</style>
