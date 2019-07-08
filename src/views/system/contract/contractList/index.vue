<template>
  <div>
    <search-condit @search="search" @reset="reset"></search-condit>

    <div class="operat-box">
      <el-button plain size="mini" v-show="false" :disabled="params.doc_status !== '1'" @click="submitReviewContract">审核合同</el-button>
      <el-button type="primary" size="mini" class="fr" @click="lookDetail('','1')">新增合同</el-button>
    </div>
    <operat-type :operatType="contractStatus" @getStatus="getTypeIndex"></operat-type>
    <div class="table-box">
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        style="width: 100%"
        :row-style="this.$root.tableContentStyle"
        :header-cell-style="this.$root.tableTitileStyle"
        stripe
        @selection-change="selectChange"
      >
        <el-table-column type="selection" width="55" v-if="params.doc_status == '1'"></el-table-column>
        <el-table-column header-align="center" align="center" label="NO" width="50" fixed>
          <template slot-scope="scope">
            <div>{{(scope.$index + 1) + (params.page-1)*params.pageSize}}</div>
          </template>
        </el-table-column>
        <el-table-column label="合同编码" prop="doc_number" width="200" fixed></el-table-column>
        <el-table-column label="合同标题" prop="doc_title" width="200" fixed></el-table-column>
        <el-table-column label="文档类型" width="180">
          <template slot-scope="scope">
            <div>{{ getMappingVal(documentType, 'type_index',scope.row.doc_type,'type_name' ) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="签约公司" show-overflow-tooltip prop="company_code"></el-table-column>
        <el-table-column label="时间" width="250">
          <template slot-scope="scope">
            <div>
              <p>签约时间: {{scope.row.signing_time}}</p>
              <p>开始时间: {{scope.row.start_time}}</p>
              <p>结束时间: {{scope.row.end_time}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="更新人" prop="updated_user" width="180"></el-table-column>
        <el-table-column label="更新时间" prop="updated_time" width="200"></el-table-column>
        <el-table-column label="合同状态" width="200">
          <template slot-scope="scope">
            <div>
              <span
                class="status-point"
                :class="{ 'status10': scope.row.doc_status === '1', 
                        'status3': scope.row.doc_status === '2', 
                        'status1': scope.row.doc_status === '3',
                        'status6': scope.row.doc_status === '0' }"
              ></span>
              {{ getMappingVal(contractStatus, 'status_index',scope.row.doc_status,'status_name' ) }}
              <i
                v-show="scope.row.sign_status == '2' || scope.row.sign_status == '3' "
                class="iconfont icon-chakan"
                style="font-size:15px;cursor:pointer;"
                @click="lookViewUrl(scope.row.view_url)"
              ></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" header-align="center" align="center" fixed="right">
          <template slot-scope="scope">
            <div class="cz-box">
              <el-link type="primary" @click="lookDetail(scope.row.doc_number,'2')">查看</el-link>
              <span v-show="scope.row.doc_status !== '3'">
                <el-divider direction="vertical"></el-divider>
              </span>
              <el-link type="primary" v-show="scope.row.doc_status !== '3'" @click="lookDetail(scope.row.doc_number,'3')">编辑</el-link>
              <span v-show="scope.row.doc_status == '2' && scope.row.sign_status == '2'">
                <el-divider direction="vertical"></el-divider>
              </span>
              <el-link type="primary" v-show="scope.row.doc_status == '2' && scope.row.sign_status == '2'" @click="submitSign(scope.row.company_code,scope.row.doc_number,scope.row.doc_title)">签署</el-link>
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
    <edit-contract :contractVisible.sync="contractVisible" :templateList="templateList" :documentType="documentType" :flg="flg" @addOk="getContractList" :docNumber="doc_number"></edit-contract>

    <look-contract-url :url="viewUrl" :urlViewVisible.sync="urlViewVisible"></look-contract-url>

    <review-contract :reviewVisible.sync="reviewVisible" :selectTemplate="selectContract" @reviewOk="getContractList"></review-contract>
  </div>
</template>

<script>
import EditContract from './EditContract';
import SearchCondit from './SearchCondit';
import CustomizePage from '_c/CustomizePage';
import OperatType from '_c/common/OperatType';
import LookContractUrl from './LookContractUrl';
import ReviewContract from './ReviewContract';
import { searchTemplateList, getContractList, reportContract, signContract } from '@/api/system';
import { getTypes, getStatus } from '@/api/common';
export default {
  data() {
    return {
      pageSizeArr: [10, 20, 30, 40],
      total: null,
      contractVisible: false,
      params: {
        doc_number: '', //合同编码
        doc_title: '', //合同标题
        doc_status: '', //合同状态:0作废，1待审核，2未通过，3已通过
        sign_start: '', //签约开始时间
        sign_end: '', //签约结束时间
        page: 1,
        pageSize: 10
      },
      flg: '', // 1新增  2查看   3编辑
      doc_number: '', //合同编码
      templateList: [], //模板列表
      documentType: [], //文档类型
      contractStatus: [], //合同状态
      tableLoading: false,
      tableData: [],
      viewUrl: '',
      urlViewVisible: false,
      selectContract: [],
      reviewVisible: false
    };
  },
  created() {
    this.searchTemplateList();
    this.getTypes();
    this.getStatus();
    this.getContractList();
  },
  methods: {
    submitSign(code, number, title) {
      this.$confirm(`签约公司: ${code}, <br/>合同编码: ${number}, <br/>合同标题: ${title}`, '确定签署该合同吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          this.signContract(number);
        })
        .catch(() => {});
    },
    async signContract(number) {
      //签署合同
      try {
        let { message } = await signContract({ doc_number: number });
        this._message(message, 'success');
        this.getContractList();
      } catch (error) {
        this._message(error);
      }
    },
    selectChange(selection) {
      this.selectContract = selection.map(el => el.doc_number);
    },
    submitReviewContract() {
      //审核合同
      if (this.selectContract.length <= 0) {
        this._message('请先选择需要审核的合同', 'warning');
        return;
      }
      this.reviewVisible = true;
    },

    lookViewUrl(url) {
      //查看
      this.viewUrl = url;
      this.urlViewVisible = true;
    },
    async submitReportContract(id) {
      //上报合同
      const loading = this.$loading({
        lock: true,
        text: 'loading...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      });
      try {
        let { data } = await reportContract({ doc_number: id });
        this.getContractList();
      } catch (error) {
        this._message(error);
      }
      loading.close();
    },
    getTypeIndex(index) {
      this.params.doc_status = index;
      this.params.page = 1;
      this.getContractList();
    },
    async getContractList() {
      this.tableLoading = true;
      try {
        let { data, paginator } = await getContractList(this.params);
        this.tableData = data;
        this.total = paginator.totalCount;
      } catch (error) {
        this._message(error);
      }
      this.tableLoading = false;
    },
    lookDetail(number, flg) {
      this.flg = flg;
      this.doc_number = number;
      this.contractVisible = true;
    },
    search(params) {
      Object.assign(this.params, params);
      this.getContractList();
    },
    reset(params) {
      Object.assign(this.params, params);
    },
    customizePage(pageSize) {
      this.pageSizeArr[4] = pageSize;
      this.params.pageSize = pageSize;
      this.getContractList();
    },
    handleSizeChange(e) {
      //设置显示一页展示多少条数
      this.params.pageSize = e;
      this.getContractList();
    },
    handleCurrentChange(e) {
      //点击第几页
      this.params.page = e;
      this.getContractList();
    },
    async searchTemplateList() {
      //获取模板列表
      try {
        let { data } = await searchTemplateList({ template_name: '', pageSize: 500 });
        this.templateList = data;
      } catch (error) {
        this._message(error);
      }
    },
    async getTypes() {
      try {
        let { data } = await getTypes({ type_code: 'document_type' });
        this.documentType = data;
      } catch (error) {
        this._message(error);
      }
    },
    async getStatus() {
      //合同状态
      try {
        let { data } = await getStatus({ status_code: 'contract_status' });
        data.forEach(el => {
          el.index = el.status_index;
          el.name = el.status_name;
          el.count = '';
        });
        this.contractStatus = data;
      } catch (error) {
        this._message(error);
      }
    }
  },
  components: {
    EditContract,
    SearchCondit,
    CustomizePage,
    OperatType,
    LookContractUrl,
    ReviewContract
  }
};
</script>

<style lang="scss" scoped>
</style>
