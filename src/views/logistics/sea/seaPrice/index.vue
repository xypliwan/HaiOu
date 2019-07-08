<template>
  <div>
    <search-condit :originList="originList" :destinationList="destinationList" :serviceProviderList="serviceProviderList" @search="search" @reset="reset"></search-condit>
    <div class="operat-box">
      <el-button size="mini" class="fr" type="primary" @click="seeDetail('','1')">添加渠道价格</el-button>
    </div>

    <operat-type :operatType="statusList" @getStatus="getListStatus"></operat-type>

    <div class="table-box">
      <el-table v-loading="tableLoading" :data="tableData" style="width: 100%" :row-style="this.$root.tableContentStyle" :header-cell-style="this.$root.tableTitileStyle" stripe>
        <el-table-column header-align="center" align="center" label="NO" width="50" fixed>
          <template slot-scope="scope">
            <div>{{(scope.$index + 1) + (params.page-1)*params.pageSize}}</div>
          </template>
        </el-table-column>
        <el-table-column label="渠道代码" prop="cc_code" width="150" fixed></el-table-column>
        <el-table-column label="渠道名称" prop="cc_name" width="150" fixed></el-table-column>
        <el-table-column label="英文名称" prop="cc_name_en" width="150"></el-table-column>
        <el-table-column label="始发地">
          <template slot-scope="scope">
            <div>{{getMappingVal(originList,'id',scope.row.origin_id,'name') }}</div>
          </template>
        </el-table-column>
        <el-table-column label="目的地">
          <template slot-scope="scope">
            <div>{{ getMappingVal(destinationList,'id',scope.row.sd_id,'name') }}</div>
          </template>
        </el-table-column>
        <el-table-column label="货运时效(天)">
          <template slot-scope="scope">
            <div>{{scope.row.cc_delivery_time_min}} - {{scope.row.cc_delivery_time_max}}</div>
          </template>
        </el-table-column>

        <el-table-column label="有效日期" width="250">
          <template slot-scope="scope">
            <div>开始时间: {{scope.row.cp_begin_date}}</div>
            <div>结束时间: {{scope.row.cp_end_date}}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div>
              <span
                class="status-point"
                :class="{ 'status10': scope.row.container_status === '1', 
                        'status2': scope.row.container_status === '2', 
                        'status3': scope.row.container_status === '3',
                        'status1': scope.row.container_status === '4', 
                        }"
              ></span>
              {{ getMappingVal(statusList,'status_index',scope.row.container_status,'status_name') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="100" header-align="center" align="center">
          <template slot-scope="scope">
            <div class="cz-box">
              <el-link type="primary" @click="seeDetail(scope.row.container_id,'2')">编辑</el-link>
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

    <add-channel-price
      :priceVisible.sync="priceVisible"
      :channelList="channelList"
      :originList="originList"
      :destinationList="destinationList"
      :currencyList="currencyList"
      :channelType="channelType"
      :serviceProviderList="serviceProviderList"
      :flg="flg"
      :containerId="containerId"
      @saveOk="getChannelList"
      :statusList="statusList"
      :logisticsCarrierList="logisticsCarrierList"
    ></add-channel-price>
  </div>
</template>

<script>
import SearchCondit from './SearchCondit';
import CustomizePage from '_c/CustomizePage';
import AddChannelPrice from './AddChannelPrice';
import OperatType from '_c/common/OperatType';

import {
  getOrigins,
  getDestinations,
  getServicesList,
  getChannelList,
  getChannelAllList,
  getChannelType,
  getCarriersList
} from '@/api/logistics';
import { getDict, getStatus } from '@/api/common';

export default {
  data() {
    return {
      pageSizeArr: [10, 20, 30, 40],
      total: null,
      originList: [], //始发地
      destinationList: [], //目的地
      serviceProviderList: [], //服务商列表
      channelList: [], //渠道列表
      channelType: [], //货柜类型
      currencyList: [], //币种列表
      statusList: [], //状态列表
      logisticsCarrierList: [], //物流承运商列表
      params: {
        sea_origin_id: '', //始发地id
        sea_destination_id: '', //目的地id
        service_id: '', //服务商id
        container_status: '',
        page: 1,
        pageSize: 10
      },
      tableLoading: false,
      tableData: [],
      priceVisible: false,
      flg: '', //1新增   2编辑
      containerId: '' //渠道价格id
    };
  },
  created() {
    this.getOrigins();
    this.getDestinations();
    this.getServicesList();
    this.getChannelList();
    this.getChannelAllList();
    this.getChannelType();
    this.getDict('currency');
    this.getStatus('container_channel_status');
    this.getCarriersList();
  },
  watch: {
    priceVisible() {
      this.getChannelAllList();
      if (!this.priceVisible) {
        this.flg = '';
      }
    }
  },
  methods: {
    async getCarriersList() {
      //获取物流承运商列表
      try {
        let { data } = await getCarriersList();
        this.logisticsCarrierList = data;
      } catch (error) {
        this._message(error);
      }
    },
    seeDetail(number, flg) {
      this.containerId = number;
      this.flg = flg;
      this.priceVisible = true;
    },
    async getChannelList() {
      this.tableLoading = true;
      try {
        let { data, paginator } = await getChannelList(this.params);
        this.tableData = data;
        this.total = paginator.totalCount;
      } catch (error) {
        this._message(error);
      }
      this.tableLoading = false;
    },
    getListStatus(index) {
      this.params.container_status = index;
      this.params.page = 1;
      this.getChannelList();
    },
    search(params) {
      Object.assign(this.params, params);
      this.params.page = 1;
      this.getChannelList();
    },
    reset(params) {
      Object.assign(this.params, params);
    },
    customizePage(pageSize) {
      this.pageSizeArr[4] = pageSize;
      this.params.pageSize = pageSize;
      this.getChannelList();
    },
    handleSizeChange(e) {
      //设置显示一页展示多少条数
      this.params.pageSize = e;
      this.getChannelList();
    },
    handleCurrentChange(e) {
      //点击第几页
      this.params.page = e;
      this.getChannelList();
    },
    async getStatus(type) {
      //获取状态
      try {
        let { data } = await getStatus({ status_code: type });
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
    async getDict(type) {
      try {
        let { data } = await getDict({ dict_code: type });
        this.currencyList = data;
      } catch (error) {
        this._message(error);
      }
    },
    async getChannelType() {
      try {
        let { data } = await getChannelType();
        this.channelType = data;
      } catch (error) {
        this._message(error);
      }
    },
    async getChannelAllList() {
      try {
        let { data } = await getChannelAllList();
        this.channelList = data;
      } catch (error) {
        this._message(error);
      }
    },
    async getOrigins() {
      //始发地
      try {
        let { data } = await getOrigins();
        this.originList = data;
      } catch (error) {
        this._message(error);
      }
    },
    async getDestinations() {
      //目的地
      try {
        let { data } = await getDestinations();
        this.destinationList = data;
      } catch (error) {
        this._message(error);
      }
    },
    async getServicesList() {
      //服务商
      try {
        let { data } = await getServicesList();
        this.serviceProviderList = data;
      } catch (error) {
        this._message(error);
      }
    }
  },
  components: {
    SearchCondit,
    CustomizePage,
    AddChannelPrice,
    OperatType
  }
};
</script>

<style lang="scss" scoped>
</style>
