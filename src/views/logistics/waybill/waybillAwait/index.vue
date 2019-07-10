<template>
  <div>
    <serach-condit :clientGroupList="clientGroupList" :waybillType="waybillType" @search="search" @reset="reset" :statusList="statusList"></serach-condit>
    <div class="operat-box"></div>
    <operat-type :operatType="asyncStatus" @getStatus="getListStatus"></operat-type>

    <div class="table-box">
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        style="width: 100%"
        :row-style="this.$root.tableContentStyle"
        :header-cell-style="this.$root.tableTitileStyle"
        stripe
        default-expand-all
        :row-class-name="getRowClassName"
      >
        <el-table-column type="expand" fixed>
          <template slot-scope="scope">
            <div class="sync-msg" v-show="scope.row.sync_api_msg.length">{{scope.row.sync_api_msg}}</div>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="NO" width="50" fixed>
          <template slot-scope="scope">
            <div>{{(scope.$index + 1) + (params.page-1)*params.pageSize}}</div>
          </template>
        </el-table-column>
        <el-table-column label="编号" width="200" fixed>
          <template slot-scope="scope">
            <div>运单编号: {{scope.row.way_bill_number}}</div>
            <div>客户编号: {{scope.row.customer_number}}</div>
            <div>参考编号: {{scope.row.reference_number}}</div>
          </template>
        </el-table-column>
        <el-table-column label="运单类型" width="150">
          <template slot-scope="scope">
            <div>{{getMappingVal(waybillType,'type_index',scope.row.way_bill_type,'type_name')}}</div>
          </template>
        </el-table-column>

        <el-table-column label="方式" width="200">
          <template slot-scope="scope">
            <div>派送渠道: {{getMappingVal(channelList,'sc_code',scope.row.ship_code,'sc_name')}}</div>
            <div>目的国家: {{getMappingVal(countryList,'country_code',scope.row.country_code,'country_name')}}</div>
          </template>
        </el-table-column>
        <el-table-column label="货物数量" width="200">
          <template slot-scope="scope">
            <div>总重量(KG): {{scope.row.total_weight}}</div>
            <div>总箱数: {{scope.row.total_box_qty}}</div>
            <div>总件数: {{scope.row.total_sku_qty}}</div>
          </template>
        </el-table-column>
        <el-table-column label="客户编码" prop="company_code"></el-table-column>
        <el-table-column label="时间" width="220">
          <template slot-scope="scope">
            <div>同步时间: {{scope.row.sync_api_time}}</div>
            <div>创建时间: {{scope.row.created_time}}</div>
            <div>更新时间: {{scope.row.updated_time}}</div>
          </template>
        </el-table-column>
        <el-table-column label="运单状态" width="150">
          <template slot-scope="scope">
            <div>
              <span
                class="status-point"
                :class="{ 'status10': scope.row.way_bill_status === '1', 
                        'status2': scope.row.way_bill_status === '2', 
                        'status3': scope.row.way_bill_status === '3',
                        'status4': scope.row.way_bill_status === '4', 
                        'status7': scope.row.way_bill_status === '5', 
                        'status1': scope.row.way_bill_status === '6', 
                        'status5': scope.row.way_bill_status === '0', 
                        }"
              ></span>
              {{ getMappingVal(statusList,'status_index',scope.row.way_bill_status,'status_name') }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="100" fixed="right" header-align="center" align="center">
          <template slot-scope="scope">
            <div class="cz-box">
              <el-link type="primary" @click="seaDetail(scope.row.way_bill_number,scope.row.company_code)">同步</el-link>
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
  </div>
</template>

<script>
import { getCustomerGroup } from '@/api/client';
import { getStatus, getTypes, getChannelList, getCounrty, getDict } from '@/api/common';
import { getWaybillSyncList, getWaybillSyncTms } from '@/api/logistics';

import SerachCondit from './SearchCondit';
import OperatType from '_c/common/OperatType';
import CustomizePage from '_c/CustomizePage';
export default {
  data() {
    return {
      clientGroupList: [], //客户分组
      statusList: [], //运单状态
      waybillType: [], //获取运单类型
      channelList: [], //物流渠道
      countryList: [], //目的国家
      goodsStyleList: [], //货物类型
      declaredTypeList: [], //申报类型
      currencyList: [], //申报币种
      asyncStatus: [], //同步状态
      params: {
        group_code: '', //客户分组
        way_bill_number: '', //运单号
        customer_number: '', //客户单号
        company_code: '', //客户编码
        way_bill_type: '', //运单类型
        sync_api_status: '', //同步状态
        created_start: '',
        created_end: '',
        way_bill_status: '', //运单状态
        page: 1,
        pageSize: 10
      },
      pageSizeArr: [10, 20, 30, 40],
      total: null,
      tableLoading: false,
      tableData: [],
      detailDialog: false,
      groupCode: '',
      waybillNumber: '',
      isEnter: false,
      enterPageX: null
    };
  },
  created() {
    this.getCustomerGroup();
    this.getStatus('way_bill_status'); //运单状态
    this.getStatus('sync_api_status'); //同步状态
    this.getTypes('way_bill_type');
    this.getTypes('goods_style');
    this.getTypes('declared_type');
    this.getChannelList();
    this.getCounrty();
    this.getDict('currency');
  },
  mounted() {},
  methods: {
    getRowClassName({ row, rowIndex }) {
      if (row.sync_api_msg.length == 0) {
        return 'row-xyp-cover';
      }
    },
    async seaDetail(number, code) {
      const loading = this.$loading({
        lock: true,
        text: '同步中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.3)'
      });
      let params = {
        way_bill_number: number,
        company_code: code
      };

      try {
        let { message } = await getWaybillSyncTms(params);
        this._message(message, 'success');
        this.getWaybillList();
      } catch (error) {
        this._message(error);
      }
      loading.close();
    },
    async getWaybillList() {
      this.tableLoading = true;
      try {
        let { data, paginator } = await getWaybillSyncList(this.params);
        this.tableData = data;
        this.total = paginator.totalCount;
        this.tableData.forEach((el, index) => {
          el.indexs = (this.params.page - 1) * this.params.pageSize + index + 1;
        });
      } catch (error) {
        this._message(error);
      }
      this.tableLoading = false;
    },
    customizePage(pageSize) {
      this.pageSizeArr[4] = pageSize;
      this.params.pageSize = pageSize;
      this.getWaybillList();
    },
    handleSizeChange(e) {
      //设置显示一页展示多少条数
      this.params.pageSize = e;
      this.getWaybillList();
    },
    handleCurrentChange(e) {
      //点击第几页
      this.params.page = e;
      this.getWaybillList();
    },
    getListStatus(index) {
      this.params.sync_api_status = index;
      this.params.page = 1;
      this.getWaybillList();
    },
    search(params) {
      Object.assign(this.params, params);
      this.getWaybillList();
    },
    reset(params) {
      Object.assign(this.params, params);
    },

    async getTypes(type) {
      //获取类型
      try {
        let { data } = await getTypes({ type_code: type });
        switch (type) {
          case 'way_bill_type':
            this.waybillType = data;
            break;
          case 'goods_style':
            this.goodsStyleList = data;
            break;
          case 'declared_type':
            this.declaredTypeList = data;
            break;
        }
      } catch (error) {
        this._message(error);
      }
    },
    async getStatus(status) {
      //获取状态
      try {
        let { data } = await getStatus({ status_code: status });
        data.forEach(el => {
          el.name = el.status_name;
          el.index = el.status_index;
          el.count = '';
        });
        switch (status) {
          case 'way_bill_status': //运单状态
            this.statusList = data;
            break;

          case 'sync_api_status':
            this.asyncStatus = data; //同步状态
            break;
        }
      } catch (error) {
        this._message(error);
      }
    },
    async getCustomerGroup() {
      //获取分组
      try {
        let { data } = await getCustomerGroup();
        this.clientGroupList = data;
        this.params.group_code = this.clientGroupList[0].group_code;
        this.getWaybillList();
      } catch (error) {
        this._message(error);
      }
    },
    async getChannelList() {
      //获取物流渠道
      try {
        let { data } = await getChannelList();
        this.channelList = data;
      } catch (error) {
        this._message(error);
      }
    },
    async getCounrty() {
      //获取目的国家
      try {
        let { data } = await getCounrty();
        this.countryList = data;
      } catch (error) {
        this._message(error);
      }
    },
    async getDict(type) {
      //获取币种
      try {
        let { data } = await getDict({ dict_code: type });
        this.currencyList = data;
      } catch (error) {
        this._message(error);
      }
    }
  },
  components: {
    SerachCondit,
    OperatType,
    CustomizePage
  }
};
</script>

<style lang="scss" scoped>
.sync-msg {
  font-size: 15px;
  color: #ef3602;
  padding: 20px 20px;
  line-height: 24px;
}

/deep/ .row-xyp-cover {
  .el-table__expand-icon {
    visibility: hidden !important;
  }
}
/deep/ .el-table__expanded-cell {
  padding: 0;
}
</style>
