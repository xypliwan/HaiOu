<template>
  <div>
    <search-condit @search="search" @reset="reset"></search-condit>
    <div class="operat-box">
      <el-button size="mini" plain :disabled="params.company_status !== '3'" @click="distributionCompany">分配客服</el-button>
    </div>
    <operat-type :operatType="statusList" @getStatus="getOperatStatus"></operat-type>

    <div class="table table-box">
      <el-table
        :data="tableData"
        style="width: 100%"
        :row-style="this.$root.tableContentStyle"
        :header-cell-style="this.$root.tableTitileStyle"
        v-loading="tableLoading"
        stripe
        @selection-change="selectChange"
      >
        <el-table-column type="selection" width="55" v-if="params.company_status == '3'"></el-table-column>
        <el-table-column label="NO" width="55" fixed>
          <template slot-scope="scope">
            <div>{{(scope.$index + 1) + (params.page-1)*params.pageSize}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="company_name" label="公司名称" width="150" fixed></el-table-column>
        <el-table-column prop="company_code" label="公司代码" width="150" fixed></el-table-column>
        <el-table-column label="公司类型" width="150">
          <template slot-scope="scope">
            <div>{{ getMappingVal(companyType,'type_index',scope.row.company_type,'type_name')}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="company_status" label="公司状态" width="100">
          <template slot-scope="scope">
            <div>
              <span
                class="status-point"
                :class="{'status10':scope.row.company_status === '1', 'status5':scope.row.company_status === '2','status1':scope.row.company_status === '3','status6':scope.row.company_status === '0'}"
              ></span>
              {{ getMappingVal(statusList,'status_index',scope.row.company_status,'status_name') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="认证状态" width="150">
          <template slot-scope="scope">
            <div>{{ getMappingVal(verifiedStatus,'status_index',scope.row.verified_status,'status_name')}}</div>
          </template>
        </el-table-column>
        <el-table-column label="客户标签" width="200">
          <template slot-scope="scope">
            <div>
              <span v-for="(item,index) in scope.row.company_label" :key="index">{{getMappingVal(lableList,'company_label_id',item,'company_label_name')}} &nbsp;</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="company_contacts" label="联系人" width="150"></el-table-column>
        <el-table-column prop="company_telephone" label="联系方式" width="200"></el-table-column>
        <el-table-column prop="updated_time" label="更新时间" width="200"></el-table-column>
        <el-table-column prop="company_profile" label="描述信息" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="150" header-align="center" align="center" fixed="right">
          <template slot-scope="scope">
            <div>
              <el-link type="primary" @click="editData(scope.row.company_id)">编辑</el-link>
              <el-divider direction="vertical"></el-divider>
              <!-- <el-link type="primary" @click="seeSubAccount(scope.row.company_code)">子账户</el-link> -->
              <el-link type="primary" @click="seeDetail(scope.row.company_id)">查看</el-link>
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
    <!-- //编辑资料 -->
    <edit-data :lableList="lableList" :editDialog.sync="editDialog" :id="companyId" :statusList="statusList" @editOk="getCustomerList"></edit-data>
    <!-- 分配客服 -->
    <distribution-company :companyVisible.sync="companyVisible" :customerService="customerService" :companyList="companyList" @assignStaffOk="getCustomerList"></distribution-company>

    <!-- 查看子账户 -->
    <!-- <sub-account :subVisible.sync="subVisible" :companyCode="companyCode"></sub-account> -->

    <common-dialog :show.sync="detailDialog" title="详情" width="1000px">
      <detail ref="detailRef" :id="companyDetailId" :statusList="statusList" :verifiedStatus="verifiedStatus" :settlementType="settlementType" :currencyList="currencyList"></detail>
    </common-dialog>
  </div>
</template>

<script>
import SearchCondit from './SearchCondit';
import OperatType from '_c/common/OperatType';
import CustomizePage from '_c/CustomizePage';
import EditData from './EditData';
import DistributionCompany from './DistributionCompany';
import { getStatus, getTypes, getDict } from '@/api/common';
import { getCustomerList, selectCompanyLabel } from '@/api/client';
import { userSearch } from '@/api/user';
import SubAccount from './SubAccount';
import CommonDialog from '_c/common/Dialog';
import Detail from './Detail';

export default {
  data() {
    return {
      statusList: [],
      pageSizeArr: [10, 20, 30, 40],
      params: {
        company_code: '',
        company_name: '',
        company_status: '',
        created_start: '',
        created_end: '',
        page: 1,
        pageSize: 10
      },
      tableData: [],
      total: null,
      editDialog: false,
      companyId: '',
      tableLoading: false,
      tableListVisible: false,
      companyList: [], //选中的待分配的公司
      customerService: [], //客服列表
      lableList: [], //客户标签
      companyVisible: false,
      companyDetailId: '',
      companyType: [], //客户类型
      verifiedStatus: [], //认证状态
      detailDialog: false,
      settlementType: [], //结算模式
      currencyList: [] //币种列表
    };
  },
  created() {
    this.getStatus('company_status');
    this.getStatus('verified_status');
    this.getCustomerList();
    this.userSearch();
    this.selectCompanyLabel();
    this.getTypes('company_type');
    this.getTypes('settlement_type_code');
    this.getDict('currency');
  },
  watch: {
    detailDialog(newVal) {
      if(!newVal){
        this.companyDetailId = ''
      }
      this.$refs.detailRef.$refs.appRef.visibleApp = false;
    }
  },
  methods: {
    async getDict(dict) {
      try {
        let { data } = await getDict({ dict_code: dict });
        switch (dict) {
          case 'currency': //币种
            this.currencyList = data;
            break;

          default:
            break;
        }
      } catch (error) {
        this._message(error);
      }
    },
    async getTypes(type) {
      try {
        let { data } = await getTypes({ type_code: type });
        switch (type) {
          case 'company_type': //客户类型
            this.companyType = data;
            break;
          case 'settlement_type_code': //结算模式
            this.settlementType = data;
            break;
        }
      } catch (error) {
        this._message(error);
      }
    },
    seeDetail(id) {
      this.companyDetailId = id;
      this.detailDialog = true;
    },
    async selectCompanyLabel() {
      //客户标签
      try {
        let { data } = await selectCompanyLabel();
        this.lableList = data;
      } catch (error) {
        this._message(error);
      }
    },
    async userSearch() {
      //获取客服
      try {
        let { data } = await userSearch();
        this.customerService = data;
      } catch (error) {
        this._message(error);
      }
    },
    distributionCompany() {
      if (this.companyList.length <= 0) {
        this._message('请先选择需要分配的公司', 'warning');
        return;
      }
      this.companyVisible = true;
    },

    selectChange(selection) {
      //勾选的选项发生变化时
      this.companyList = selection;
    },
    editData(id) {
      this.companyId = id;
      this.editDialog = true;
    },
    customizePage(pageSize) {
      this.pageSizeArr[4] = pageSize;
      this.params.pageSize = pageSize;
      this.getCustomerList();
    },
    async getCustomerList() {
      this.tableLoading = true;
      try {
        let { data, paginator } = await getCustomerList(this.params);
        this.tableData = data;
        this.total = paginator.totalCount;
      } catch (error) {
        this._message(error);
      }
      this.tableLoading = false;
    },
    async getStatus(status) {
      //获取状态
      try {
        let { data } = await getStatus({ status_code: status });
        switch (status) {
          case 'company_status': //公司状态
            data.forEach(el => {
              el.index = el.status_index;
              el.name = el.status_name;
              el.count = '';
            });
            this.statusList = data;
            break;

          case 'verified_status': //认证状态
            this.verifiedStatus = data;
            break;
        }
      } catch (error) {
        this._message(error);
      }
    },
    getOperatStatus(status) {
      this.params.company_status = status;
      this.params.page = 1;
      this.getCustomerList();
    },
    search(params) {
      this.params = Object.assign(this.params, params);
      this.params.page = 1;
      this.getCustomerList();
    },
    reset() {
      this.params = Object.assign(this.params, params);
    },
    handleSizeChange(e) {
      //设置显示一页展示多少条数
      this.params.pageSize = e;
      this.getCustomerList();
    },
    handleCurrentChange(e) {
      //点击第几页
      this.params.page = e;
      this.getCustomerList();
    }
  },
  components: {
    SearchCondit,
    OperatType,
    CustomizePage,
    EditData,
    DistributionCompany,
    SubAccount,
    CommonDialog,
    Detail
  }
};
</script>

<style lang="scss" scoped>
.diveld {
  border-top: 10px solid #f0f4f3;
}
</style>
