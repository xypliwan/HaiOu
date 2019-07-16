
<template>
  <div>
    <search-condit @search="search" :channelList="channelList" @initSearch="initSearch"></search-condit>
    <div class="operat-box">
      <el-button size="mini" plain :disabled="params.demand_status !== '1'" @click="distributionService">分配客服</el-button>
    </div>
    <operat-type :operatType="statusList" @getStatus="getListStatus"></operat-type>

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
        <el-table-column type="selection" width="55" v-if="params.demand_status == '1'"></el-table-column>
        <el-table-column header-align="center" align="center" label="NO" width="50" fixed>
          <template slot-scope="scope">
            <div>{{(scope.$index + 1) + (params.page-1)*params.pageSize}}</div>
          </template>
        </el-table-column>
        <el-table-column label="需求编号" width="200" fixed>
          <template slot-scope="scope">
            <div>{{scope.row.demand_number}}</div>
          </template>
        </el-table-column>
        <el-table-column label="公司" width="200" fixed>
          <template slot-scope="scope">
            <div>客户代码: {{scope.row.company_code}}</div>
            <div>目的国家: {{getMappingVal(countryList,'country_code',scope.row.country_code,'country_name')}}</div>
            <div>邮编: {{scope.row.zip_code}}</div>
          </template>
        </el-table-column>

        <el-table-column label="货物" width="200">
          <template slot-scope="scope">
            <div>货物类型: {{getMappingVal(goodsStyleTypeList,'type_index',scope.row.goods_style,'type_name')}}</div>
            <div>货物重量: {{scope.row.goods_weight}} KG</div>
            <div>货物体积: {{scope.row.goods_volume}} CBM</div>
          </template>
        </el-table-column>
        <el-table-column label="发货周期">
          <template slot-scope="scope">
            <div>{{ getMappingVal(deliveryCycleList,'key',scope.row.demand_cycle,'label') }}</div>
          </template>
        </el-table-column>
        <el-table-column label="其他要求" prop="demand_note" width="250px" show-overflow-tooltip></el-table-column>
        <el-table-column label="跟进客服" prop="service_user" width="200px" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作人" width="200">
          <template slot-scope="scope">
            <div>创建人: {{scope.row.created_user}}</div>
            <div>更新人: {{scope.row.updated_user}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" width="220">
          <template slot-scope="scope">
            <div>创建时间: {{scope.row.created_time}}</div>
            <div>更新时间: {{scope.row.updated_time}}</div>
          </template>
        </el-table-column>
        <el-table-column label="需求状态" width="150">
          <template slot-scope="scope">
            <div>
              <span
                class="status-point"
                :class="{ 'status10': scope.row.demand_status === '1', 
                        'status3': scope.row.demand_status === '2', 
                        'status4': scope.row.demand_status === '3',
                        'status5': scope.row.demand_status === '0' }"
              ></span>
              {{ getMappingVal(statusList, 'status_index',scope.row.demand_status,'status_name' ) }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" header-align="center" align="center" width="100" fixed="right">
          <template slot-scope="scope">
            <div class="cz-box">
              <el-link type="primary" @click="lookDetail(scope.row)">查看</el-link>
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

    <!-- 分配客服 -->
    <distribution-service :distributionListVisible.sync="distributionListVisible" :distributionList="distributionList" :customerService="customerService" @demandAssignOk="getDemandList"></distribution-service>

    <!-- 需求详情 -->
    <common-dialog :show.sync="detailDialog" :title="demandTitle" width="1200px">
      <detail-demand
        :companyCode="companyCode"
        :demandNumber="demandNumber"
        :statusList="statusList"
        :channelList="channelList"
        :countryList="countryList"
        :goodsStyleTypeList="goodsStyleTypeList"
        :deliveryCycleList="deliveryCycleList"
      ></detail-demand>
    </common-dialog>
  </div>
</template>

<script>
import SearchCondit from './SearchCondit';
import OperatType from '_c/common/OperatType';
import CustomizePage from '_c/CustomizePage';
import DistributionService from './Distribution';
import DetailDemand from './Detail';
import CommonDialog from '_c/common/Dialog';
import { getDemandList } from '@/api/demand';
import { userSearch } from '@/api/user';
import { getStatus, getChannelList, getCounrty, getTypes, getDict } from '@/api/common';

export default {
  name:'orderManage',
  data() {
    return {
      statusList: [], //状态统计
      channelList: [], //销售产品
      countryList: [], //国家列表
      goodsStyleTypeList: [], //货物类型
      deliveryCycleList: [], //发货周期
      pageSizeArr: [10, 20, 30, 40],
      params: {
        company_code: '', //客户编码
        sc_code: '', //销售产品
        created_start: '', //发布开始时间
        created_end: '', //发布截止时间
        demand_status: '',
        page: 1,
        pageSize: 10
      },
      total: null,
      tableData: [],
      tableLoading: false,
      distributionList: [], //待分配的需求列表
      customerService: [], //客服列表
      distributionListVisible: false,
      detailDialog: false,
      demandTitle: '需求详情',
      companyCode: '', //公司编码
      demandNumber: '' //需求编号
    };
  },
  created() {
    this.getStatus();
    this.getCounrty();
    this.getTypes('demand_delivery_type');
    this.getChannelList();
    this.getDemandList();
    this.getDict();
    this.userSearch();
  },
  watch: {
    detailDialog(newVal) {
      if (!newVal) {
        this.companyCode = '';
        this.demandNumber = '';
      }
    }
  },
  methods: {
    lookDetail(item) {
      console.log(item)
      //查看详情
      this.companyCode = item.company_code;
      this.demandNumber = item.demand_number;
      this.demandTitle = `需求详情--编号${item.demand_number}`;
      this.detailDialog = true;
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
    distributionService() {
      if (this.distributionList.length <= 0) {
        this._message('请先选择需要分配的需求', 'warning');
        return;
      }
      this.distributionListVisible = true;
    },
    selectChange(selection) {
      //勾选的选项发生变化时
      this.distributionList = selection.map(el => el.demand_number);
    },
    initSearch(params) {
      this.params = Object.assign(this.params, params);
      this.params.page = 1;
    },

    getListStatus(status) {
      this.params.demand_status = status;
      this.params.page = 1;
      this.getDemandList();
    },
    search(params) {
      this.params = Object.assign(this.params, params);
      this.params.page = 1;
      this.getDemandList();
    },
    async getDemandList() {
      //获取需求列表
      this.tableLoading = true;
      try {
        let { data, paginator } = await getDemandList(this.params);
        this.tableData = data;
        this.total = paginator.totalCount;
      } catch (error) {
        this._message(error);
      }
      this.tableLoading = false;
    },
    async getChannelList() {
      //获取销售产品列表
      try {
        let { data } = await getChannelList();
        this.channelList = data;
      } catch (error) {
        this._message(error);
      }
    },
    async getCounrty() {
      //获取国家
      try {
        let { data } = await getCounrty();
        this.countryList = data;
      } catch (error) {
        this._message(error);
      }
    },
    async getDict() {
      //获取发货周期
      try {
        let { data } = await getDict({ dict_code: 'delivery_cycle' });
        this.deliveryCycleList = data;
      } catch (error) {
        this._message(error);
      }
    },
    async getTypes(types) {
      try {
        let { data } = await getTypes({ type_code: types });
        switch (types) {
          case 'demand_delivery_type': //货物类型
            this.goodsStyleTypeList = data;
            break;
          default:
            break;
        }
      } catch (error) {
        this._message(error);
      }
    },
    async getStatus() {
      //获取状态
      try {
        let { data } = await getStatus({ status_code: 'demand_status' });
        data.forEach(el => {
          el.name = el.status_name;
          el.index = el.status_index;
          el.count = '';
        });
        this.statusList = data;
      } catch (error) {
        this._message(error);
      }
    },
    customizePage(pageSize) {
      this.pageSizeArr[4] = pageSize;
      this.params.pageSize = pageSize;
      this.getDemandList();
    },
    handleSizeChange(e) {
      //设置显示一页展示多少条数
      this.params.pageSize = e;
      this.getDemandList();
    },
    handleCurrentChange(e) {
      //点击第几页
      this.params.page = e;
      this.getDemandList();
    }
  },

  components: {
    SearchCondit,
    OperatType,
    CustomizePage,
    DistributionService,
    DetailDemand,
    CommonDialog
  }
};
</script>

<style lang="scss" scoped>
</style>
