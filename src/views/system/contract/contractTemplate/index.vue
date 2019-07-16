<template>
  <div>
    <search-condit @search="search" @reset="reset"></search-condit>

    <div class="operat-box">
      <el-button plain size="mini" :disabled="params.template_status !== '1'" @click="reviewTemplate">审核模板</el-button>
      <el-button type="primary" size="mini" class="fr" @click="lookDetail('','1')">新增合同模板</el-button>
    </div>
    <operat-type :operatType="templateStatus" @getStatus="getTypeIndex"></operat-type>
    <div class="table-box">
      <el-table
        v-loading="tableDataLoading"
        :data="tableData"
        style="width: 100%"
        :row-style="this.$root.tableContentStyle"
        :header-cell-style="this.$root.tableTitileStyle"
        stripe
        @selection-change="selectChange"
      >
        <el-table-column type="selection" width="55" v-if="params.template_status == '1'"></el-table-column>
        <el-table-column header-align="center" align="center" label="NO" width="50" fixed>
          <template slot-scope="scope">
            <div>{{(scope.$index + 1) + (params.page-1)*params.pageSize}}</div>
          </template>
        </el-table-column>
        <el-table-column label="模板编号" prop="template_no" width="200" fixed></el-table-column>
        <el-table-column label="模板名称" prop="template_name" width="200" fixed></el-table-column>
        <el-table-column label="模板类型" width="100">
          <template slot-scope="scope">
            <div>{{ getMappingVal(templateType, 'type_index',scope.row.template_type,'type_name' ) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="模板等级" prop="template_level" width="80" align="center"></el-table-column>
        <el-table-column label="文件地址" show-overflow-tooltip prop="doc_url"></el-table-column>
        <el-table-column label="文件类型" prop="doc_type" width="100"></el-table-column>
        <el-table-column label="有效天数" prop="effect_days" width="100"></el-table-column>
        <el-table-column label="模板状态" prop="template_status" width="150">
          <template slot-scope="scope">
            <div>
              <span
                class="status-point"
                :class="{ 'status10': scope.row.template_status === '1', 
                        'status5': scope.row.template_status === '2', 
                        'status1': scope.row.template_status === '3',
                        'status6': scope.row.template_status === '0' }"
              ></span>
              {{ getMappingVal(templateStatus, 'status_index',scope.row.template_status,'status_name' ) }}
              <i
                v-show="scope.row.upload_status == '1'"
                class="iconfont icon-ok"
                style="font-size:13px"
              ></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="更新人" prop="updated_user" width="150"></el-table-column>
        <el-table-column label="更新时间" prop="updated_time" width="180"></el-table-column>
        <el-table-column label="操作" header-align="center" align="center" width="150" fixed="right">
          <template slot-scope="scope">
            <div class="cz-box">
              <el-link type="primary" @click="lookDetail(scope.row.template_no,'2')">查看</el-link>
              <span v-show="scope.row.template_status !== '3'">
                <el-divider direction="vertical"></el-divider>
              </span>
              <el-link type="primary" v-show="scope.row.template_status !== '3'" @click="lookDetail(scope.row.template_no,'3')">编辑</el-link>
              <span v-show="scope.row.template_status == '3' && scope.row.upload_status == '0'">
                <el-divider direction="vertical"></el-divider>
                <el-link type="primary" v-show="scope.row.template_status == '3' && scope.row.upload_status == '0'" @click="submitReportTemplate(scope.row.template_no)">上报</el-link>
              </span>
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

    <edit-contract
      @saveOk="contractTemplateList"
      :contractVisible.sync="contractVisible"
      :templateList="templateType"
      :fileList="documentType"
      :flg="flg"
      :templateNumber="templateNumber"
      :templateLevel="templateLevel"
    ></edit-contract>

    <review-dialog :reviewVisible.sync="reviewVisible" :selectTemplate="selectTemplate" @reviewOk="contractTemplateList"></review-dialog>
  </div>
</template>

<script>
import EditContract from './EditContract';
import SearchCondit from './SearchCondit';
import OperatType from '_c/common/OperatType';
import CustomizePage from '_c/CustomizePage';
import ReviewDialog from './ReviewDialog';
import { getTypes, getStatus, getDict } from '@/api/common';
import { contractTemplateList, contractReportTemplate } from '@/api/system';
export default {
  name:'contractTemplate',
  data() {
    return {
      contractVisible: false,
      templateType: [], //模板类型
      templateStatus: [], //模板状态
      documentType: [], //文档类型
      selectTemplate: [], //选中的待审核的模板
      templateLevel: [], //模板等级
      params: {
        template_no: '', //模板编号
        template_name: '', //模板名称
        template_status: '', //模板状态
        created_start: '', //创建开始时间
        created_end: '', //创建结束时间
        page: 1,
        pageSize: 10
      },
      tableData: [],
      total: null,
      tableDataLoading: false,
      pageSizeArr: [10, 20, 30, 40],
      templateNumber: '', //模板编号
      flg: '', // 1新增  2查看   3编辑
      reviewVisible: false
    };
  },
  created() {
    this.getTypes();
    this.contractTemplateList();
    this.getStatus();
    this.getDocumentTypes();
    this.getDict('template_level');
  },
  methods: {
    async getDict(type) {
      //获取模板等级
      try {
        let { data } = await getDict({ dict_code: type });
        this.templateLevel = data;
      } catch (error) {
        this._message(error);
      }
    },
    async submitReportTemplate(id) {
      //上报模板
      const loading = this.$loading({
        lock: true,
        text: 'loading...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      });
      try {
        let { message } = await contractReportTemplate({ template_no: id });
        this._message(message, 'success');
        this.contractTemplateList();
      } catch (error) {
        this._message(error);
      }
      loading.close();
    },
    selectChange(selection) {
      this.selectTemplate = selection.map(el => el.template_no);
    },
    reviewTemplate() {
      //审核模板
      if (this.selectTemplate.length <= 0) {
        this._message('请先选择需要审核的模板', 'warning');
        return;
      }
      this.reviewVisible = true;
    },

    lookDetail(number, flg) {
      this.templateNumber = number;
      this.flg = flg;
      this.contractVisible = true;
    },
    customizePage(pageSize) {
      this.pageSizeArr[4] = pageSize;
      this.params.pageSize = pageSize;
      this.contractTemplateList();
    },
    getTypeIndex(index) {
      this.params.template_status = index;
      this.params.page = 1;
      this.contractTemplateList();
    },
    search(params) {
      Object.assign(this.params, params);
      this.contractTemplateList();
    },
    reset(params) {
      Object.assign(this.params, params);
    },
    handleSizeChange(e) {
      //设置显示一页展示多少条数
      this.params.pageSize = e;
      this.contractTemplateList();
    },
    handleCurrentChange(e) {
      //点击第几页
      this.params.page = e;
      this.contractTemplateList();
    },
    async contractTemplateList() {
      //获取合同模板列表
      this.tableDataLoading = true;
      try {
        let { data, paginator } = await contractTemplateList(this.params);
        this.tableData = data;
        this.total = paginator.totalCount;
      } catch (error) {
        this._message(error);
      }
      this.tableDataLoading = false;
    },
    async getStatus() {
      //获取合同状态
      try {
        let { data } = await getStatus({ status_code: 'template_status' });
        data.forEach(el => {
          el.index = el.status_index;
          el.name = el.status_name;
          el.count = '';
        });
        this.templateStatus = data;
      } catch (error) {
        this._message(error);
      }
    },
    async getDocumentTypes() {
      //获取文档类型
      try {
        let { data } = await getTypes({ type_code: 'document_type' });
        this.documentType = data;
      } catch (error) {
        this._message(error);
      }
    },
    async getTypes() {
      //获取模板类型
      try {
        let { data } = await getTypes({ type_code: 'template_type' });
        this.templateType = data;
      } catch (error) {
        this._message(error);
      }
    }
  },
  components: {
    EditContract,
    SearchCondit,
    OperatType,
    CustomizePage,
    ReviewDialog
  }
};
</script>

<style lang="scss" scoped>
</style>
