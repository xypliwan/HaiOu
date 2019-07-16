<template>
  <div>
    <search-condit @search="search" @reset="reset" :channelGroupList="channelGroupList"></search-condit>

    <div class="table-box">
      <el-table v-loading="tableLoading" :data="tableData" style="width: 100%" :row-style="this.$root.tableContentStyle" :header-cell-style="this.$root.tableTitileStyle" stripe>
        <el-table-column header-align="center" align="center" label="NO" width="50" fixed>
          <template slot-scope="scope">
            <div>{{(scope.$index + 1) + (params.page-1)*params.pageSize}}</div>
          </template>
        </el-table-column>
        <el-table-column label="渠道代码" prop="sc_code" width="150" fixed></el-table-column>
        <el-table-column label="名称" prop="sc_name" width="200">
          <template slot-scope="scope">
            <div>中文名称: {{scope.row.sc_name}}</div>
            <div>英文名称: {{scope.row.sc_name_en}}</div>
          </template>
        </el-table-column>
        <el-table-column label="渠道组" prop="sc_short_name" width="150">
          <template slot-scope="scope">
            <div>{{ getMappingVal(channelGroupList,'scg_code',scope.row.sc_group_code,'scg_name') }}</div>
          </template>
        </el-table-column>
        <el-table-column label="服务商" width="200">
          <template slot-scope="scope">
            <div>服务商: {{ getMappingVal(serviceProviderList,'sp_id',scope.row.sp_id,'sp_name') }}</div>
            <div>API服务商产品代码: {{scope.row.api_channel_code}}</div>
          </template>
        </el-table-column>
        <el-table-column label="计费规则" width="200">
          <template slot-scope="scope">
            <div>分区方案: {{ scope.row.zs_name}}</div>
            <div>重量段模板: {{scope.row.wt_name}}</div>
          </template>
        </el-table-column>
        <el-table-column label="是否开启API同步" width="200">
          <template slot-scope="scope">
            <div>{{scope.row.sc_is_api_sync == '0' ? '不开启' : '开启'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="计算单位" width="200">
          <template slot-scope="scope">
            <div>{{getMappingVal(calUnitList,'key',scope.row.sc_weight_unit,'label')}}</div>
          </template>
        </el-table-column>
        <el-table-column label="是否可跟踪" width="200">
          <template slot-scope="scope">
            <div>{{scope.row.sc_track_status == 'N' ? '否' : '是'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="产品组" width="200">
          <template slot-scope="scope">
            <div>{{getMappingVal(channelGroupList,'scg_code',scope.row.sc_group_code,'scg_name')}}</div>
          </template>
        </el-table-column>
        <el-table-column label="体积系数" width="200">
          <template slot-scope="scope">
            <div>{{scope.row.sc_vol_rate}}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="200">
          <template slot-scope="scope">
            <div>
              <span class="status-point" :class="{ 'status1': scope.row.sc_status === '1', 
                        'status5': scope.row.sc_status === '2', 
                        }"></span>
              {{ getMappingVal(statusList, 'status_index',scope.row.sc_status,'status_name') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="物流承运商" width="200">
          <template slot-scope="scope">
            <div>{{getMappingVal(serviceCarrierList,'carrier_id',scope.row.carrier_id,'carrier_name')}}</div>
          </template>
        </el-table-column>
        <el-table-column label="时效" width="200">
          <template slot-scope="scope">
            <div>货运时效: {{scope.row.sc_delivery_time_min}} - {{scope.row.sc_delivery_time_max}} 天</div>
            <div>平均时效: {{scope.row.sc_delivery_time_avg}} 天</div>
          </template>
        </el-table-column>
        <el-table-column label="是否官网显示" width="150">
          <template slot-scope="scope">
            <div>{{scope.row.is_web_show == '0' ? '不显示' : '显示'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="排序序号" width="200">
          <template slot-scope="scope">
            <div>{{scope.row.sc_sort}}</div>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="200">
          <template slot-scope="scope">
            <div>{{scope.row.sc_note}}</div>
          </template>
        </el-table-column>
        <el-table-column label="时间" width="220">
          <template slot-scope="scope">
            <div>添加时间: {{scope.row.sc_created_time}}</div>
            <div>修改时间: {{scope.row.sc_update_time}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="100" header-align="center" align="center">
          <template slot-scope="scope">
            <div class="cz-box">
              <el-link type="primary" @click="seeDetail(scope.row.sc_code)">查看</el-link>
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

    <!-- 详情 -->
    <common-dialog :show.sync="detailDialog" title="物流渠道详情" width="1000px">
      <detail-channel
        :scCode="scCode"
        :logisticsCarrierList="logisticsCarrierList"
        :statusList="statusList"
        :weightTemplateList="weightTemplateList"
        :whichDay="whichDay"
        :calUnitList="calUnitList"
        :channelGroupList="channelGroupList"
        @saveOk="getLogisticsChannelList"
        :serviceProviderList="serviceProviderList"
        :serviceCarrierList="serviceCarrierList"
      ></detail-channel>
    </common-dialog>
  </div>
</template>

<script>
import SearchCondit from './SearchCondit';
import CustomizePage from '_c/CustomizePage';
import CommonDialog from '_c/common/Dialog';
import DetailChannel from './DetailChannel';
import {
  getLogisticsChannelList,
  getCarriersList,
  getWeightTemplateList,
  getServiceChannelGroupList,
  getServiceProvider,
  getServiceCarrier
} from '@/api/logistics';
import { getStatus, getDict } from '@/api/common';

export default {
  name:'logisticsChannelList',
  data() {
    return {
      pageSizeArr: [10, 20, 30, 40],
      total: null,
      params: {
        sc_status:'1',
        group:'',     //分组
        sc_code: '', //服务渠道代码
        sc_name: '', //中文名称
        page: 1,
        pageSize: 10
      },
      tableLoading: false,
      tableData: [],
      logisticsCarrierList: [], //物流服务商
      statusList: [], //列表状态
      weightTemplateList: [], //重量端列表
      channelGroupList: [], //渠道组列表（产品组）
      calUnitList: [], //计算单位列表
      serviceProviderList: [], //服务商列表
      serviceCarrierList: [], //物流承运商列表
      whichDay: [
        //班期
        { id: '1', name: '周一' },
        { id: '2', name: '周二' },
        { id: '3', name: '周三' },
        { id: '4', name: '周四' },
        { id: '5', name: '周五' },
        { id: '6', name: '周六' },
        { id: '7', name: '周日' }
      ],
      detailDialog: false,
      scCode: ''
    };
  },
  created() {
    this.getLogisticsChannelList();
    this.getCarriersList();
    this.getStatus('sc_status');
    this.getWeightTemplateList();
    this.getServiceChannelGroupList();
    this.getDict('cal_unit');
    this.getServiceProvider();
    this.getServiceCarrier();
  },
  methods: {
    async getServiceCarrier() {
      //获取物流承运商列表
      try {
        let { data } = await getServiceCarrier();
        this.serviceCarrierList = data;
      } catch (error) {
        this._message(error);
      }
    },
    async getServiceProvider() {
      //获取服务商列表
      try {
        let { data } = await getServiceProvider();
        this.serviceProviderList = data;
      } catch (error) {
       this._message(error);
      }
    },
    async getServiceChannelGroupList() {
      //获取渠道组列表
      try {
        let { data } = await getServiceChannelGroupList();
        this.channelGroupList = data;
      } catch (error) {
        this._message(error);
      }
    },
    async getWeightTemplateList() {
      //获取重量锻列表
      try {
        let { data } = await getWeightTemplateList();
        this.weightTemplateList = data;
      } catch (error) {
        this._message(error);
      }
    },
    seeDetail(code) {
      this.scCode = code;
      this.detailDialog = true;
    },
    async getStatus(status) {
      //物流渠道状态
      try {
        let { data } = await getStatus({ status_code: status });
        this.statusList = data;
      } catch (error) {
        this._message(error);
      }
    },
    async getDict(type) {
      //获取计算单位
      try {
        let { data } = await getDict({ dict_code: type });
        this.calUnitList = data;
      } catch (error) {
        this._message(error);
      }
    },
    async getCarriersList() {
      //获取物流承运商列表
      try {
        let { data } = await getCarriersList();
        this.logisticsCarrierList = data;
      } catch (error) {
        this._message(error);
      }
    },
    async getLogisticsChannelList() {
      this.tableLoading = true;
      try {
        let { data, paginator } = await getLogisticsChannelList(this.params);
        this.tableData = data;
        this.total = paginator.totalCount;
      } catch (error) {
        this._message(error);
      }
      this.tableLoading = false;
    },
    search(params) {
      Object.assign(this.params, params);
      this.params.page = 1;
      this.getLogisticsChannelList();
    },
    reset(params) {
      Object.assign(this.params, params);
    },
    customizePage(pageSize) {
      this.pageSizeArr[4] = pageSize;
      this.params.pageSize = pageSize;
      this.getLogisticsChannelList();
    },
    handleSizeChange(e) {
      //设置显示一页展示多少条数
      this.params.pageSize = e;
      this.getLogisticsChannelList();
    },
    handleCurrentChange(e) {
      //点击第几页
      this.params.page = e;
      this.getLogisticsChannelList();
    }
  },
  components: {
    SearchCondit,
    CustomizePage,
    CommonDialog,
    DetailChannel
  }
};
</script>

<style lang="scss" scoped>
</style>
