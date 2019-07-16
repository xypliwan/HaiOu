<template>
  <div>
    <serach-condit :clientGroupList="clientGroupList" :waybillType="waybillType" @search="search" @reset="reset"></serach-condit>
    <div class="operat-box">
      <el-button size="mini" class="fr" @click="exportOrder" type="primary">导出</el-button>
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
        <el-table-column type="selection" width="55"></el-table-column>
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
            <div>VAT编号: {{scope.row.vat_number}}</div>
          </template>
        </el-table-column>
        <el-table-column label="运单类型" width="150" fixed>
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
        <el-table-column label="货物类型" width="200">
          <template slot-scope="scope">
            <div>货物类型: {{getMappingVal(goodsStyleList,'type_index',scope.row.goods_type,'type_name') }}</div>
            <div>申报类型: {{getMappingVal(declaredTypeList,'type_index',scope.row.declared_type,'type_name') }}</div>
            <div>申报币种: {{getMappingVal(currencyList,'key',scope.row.declared_currency,'label')}}</div>
          </template>
        </el-table-column>
        <el-table-column label="货物数量" width="200">
          <template slot-scope="scope">
            <div>总重量(KG): {{scope.row.total_weight}}</div>
            <div>总箱数: {{scope.row.total_box_qty}}</div>
            <div>总件数: {{scope.row.total_sku_qty}}</div>
          </template>
        </el-table-column>
        <el-table-column label="客户编码" prop="company_code" width="200"></el-table-column>
        <el-table-column label="费用" width="200">
          <template slot-scope="scope">
            <div>预计费用: {{scope.row.calc_charge}}</div>
            <div>实际费用: {{scope.row.real_charge}}</div>
            <div>费用币种: {{scope.row.cost_currency}}</div>
          </template>
        </el-table-column>
        <el-table-column label="时间" width="220">
          <template slot-scope="scope">
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
              <el-link type="primary" @click="seaDetail(scope.row.group_code,scope.row.way_bill_number)">查看</el-link>
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

    <common-dialog :show.sync="detailDialog" title="运单详情" width="1000px">
      <detail-waybill
        :groupCode="groupCode"
        :waybillNumber="waybillNumber"
        :statusList="statusList"
        :waybillType="waybillType"
        :channelList="channelList"
        :countryList="countryList"
        :goodsStyleList="goodsStyleList"
        :declaredTypeList="declaredTypeList"
        :currencyList="currencyList"
      ></detail-waybill>
    </common-dialog>
  </div>
</template>

<script>
import { getCustomerGroup } from '@/api/client';
import { getStatus, getTypes, getChannelList, getCounrty, getDict } from '@/api/common';
import { getWaybillList, exportXxcel } from '@/api/logistics';

import SerachCondit from './SearchCondit';
import OperatType from '_c/common/OperatType';
import CustomizePage from '_c/CustomizePage';
import DetailWaybill from './DetailWaybill';
import CommonDialog from '_c/common/Dialog';
import axios from '@/utils/downloadRequest';
export default {
  name:'waybillList',
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
      params: {
        group_code: '', //客户分组
        way_bill_number: '', //运单号
        customer_number: '', //客户单号
        company_code: '', //客户编码
        way_bill_type: '', //运单类型
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
      enterPageX: null,
      exportOrderList: []
    };
  },
  created() {
    this.getCustomerGroup();
    this.getStatus();
    this.getTypes('way_bill_type');
    this.getTypes('goods_style');
    this.getTypes('declared_type');
    this.getChannelList();
    this.getCounrty();
    this.getDict('currency');
  },
  mounted() {},
  methods: {
    selectChange(selection) {
      //勾选的选项发生变化时
      this.exportOrderList = selection.map(el => el.way_bill_id);
    },
    async exportOrder() {
      //导出运单
      if (this.exportOrderList.length <= 0) {
        this._message('请先勾选运单', 'warning');
        return;
      }
      axios({
        method: 'post',
        url: '/tms/transport/export-excel', // 请求地址
        data: { way_bill_id_arr: this.exportOrderList, group_code: this.params.group_code }, // 参数
        responseType: 'blob' //  表明返回服务器返回的数据类型  这里注意要加上responseType
      })
        .then(res => {
          // 处理返回的文件流
          // 注意 返回的res 无需做任何处理，有时在用框架封装的请求之后会出现返回response.text() 等情况导致文件流下载失败。
          const content = res;
          const blob = new Blob([content]);
          const fileName = 'waybill.xls';
          const alink = document.createElement('a');
          alink.download = fileName;
          alink.style.display = 'none';
          alink.href = URL.createObjectURL(blob); // 这里是将文件流转化为一个文件地址
          document.body.appendChild(alink);
          alink.click();
          URL.revokeObjectURL(alink.href); // 释放URL 对象
          document.body.removeChild(alink);
        })
        .catch(error => {
          this._message(error);
        });
    },
    seaDetail(groupCode, number) {
      this.groupCode = groupCode;
      this.waybillNumber = number;
      this.detailDialog = true;
    },
    async getWaybillList() {
      this.tableLoading = true;
      try {
        let { data, paginator } = await getWaybillList(this.params);
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
      this.params.way_bill_status = index;
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
    async getStatus() {
      //获取状态
      try {
        let { data } = await getStatus({ status_code: 'way_bill_status' });
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
    CustomizePage,
    DetailWaybill,
    CommonDialog
  }
};
</script>

<style lang="scss" scoped>
</style>
