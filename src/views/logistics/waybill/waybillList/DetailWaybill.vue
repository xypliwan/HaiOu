<template>
  <div class="detail">
    <titles titles="基本信息"></titles>
    <div class="tables">
      <el-form ref="form" :model="form" size="small" label-width="130px" v-loading="formLoading">
        <el-row>
          <el-col :span="11">
            <el-form-item label="运单号">
              <div class="label-val">{{form.bill.way_bill_number}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="申报币种">
              <div class="label-val">{{ getMappingVal(currencyList,'key',form.bill.declared_currency,'label') }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="客户单号">
              <div class="label-val">{{form.bill.customer_number}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="运单类型">
              <div class="label-val">{{getMappingVal(waybillType,'type_index',form.bill.way_bill_type,'type_name') }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="运单状态">
              <div class="label-val">{{ getMappingVal(statusList,'status_index',form.bill.way_bill_status,'status_name') }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="运输方式">
              <div class="label-val">{{form.bill.ship_code}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="运输渠道">
              <div class="label-val">{{form.bill.channel_code}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="运输服务商">
              <div class="label-val">{{form.bill.provider_code}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="目的国家">
              <div class="label-val">{{getMappingVal(countryList,'country_code',form.bill.country_code,'country_name') }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="目的仓编码">
              <div class="label-val">{{form.bill.warehouse_code}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="货物类型">
              <div class="label-val">{{getMappingVal(goodsStyleList,'type_index',form.bill.goods_type,'type_name')}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="申报类型">
              <div class="label-val">{{getMappingVal(declaredTypeList,'type_index',form.bill.declared_type,'type_name') }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="VA&GST">
              <div class="label-val">{{form.bill.vat_number}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="总重量">
              <div class="label-val">{{form.bill.total_weight}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="总箱数">
              <div class="label-val">{{form.bill.total_box_qty}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="产品总数量">
              <div class="label-val">{{form.bill.total_sku_qty}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="预计费用">
              <div class="label-val">{{form.bill.calc_charge}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="实收费用">
              <div class="label-val">{{form.bill.real_charge}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="费用币种">
              <div class="label-val">{{getMappingVal(currencyList,'key',form.bill.cost_currency,'label')}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="所属公司">
              <div class="label-val">{{form.bill.company_code}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="计费时间">
              <div class="label-val">{{form.bill.calc_time}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="付款时间">
              <div class="label-val">{{form.bill.pay_time}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="ReferenceID">
              <div class="label-val">{{form.bill.reference_id}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="ShipmentID">
              <div class="label-val">{{form.bill.shipment_id}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="POA Nubmer">
              <div class="label-val">{{form.bill.poa_number}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="创建人">
              <div class="label-val">{{form.bill.created_user}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="更新人">
              <div class="label-val">{{form.bill.updated_user}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="创建时间">
              <div class="label-val">{{form.bill.created_time}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="更新时间">
              <div class="label-val">{{form.bill.updated_time}}</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <titles titles="其它信息"></titles>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="箱子信息" name="product">
        <div class="tables">
          <el-table :data="form.bill_box" style="width: 100%">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="box_number" label="包裹号码" width="150"></el-table-column>
            <el-table-column prop="tracking_number" label="跟踪号码" width="150"></el-table-column>
            <el-table-column prop="way_bill_number" label="当前挂载运单号" width="150"></el-table-column>
            <el-table-column prop="box_reference" label="客户子单号" width="150"></el-table-column>
            <el-table-column prop="box_sort" label="包裹排序" width="150"></el-table-column>
            <el-table-column prop="box_code" label="箱号" width="150"></el-table-column>
            <el-table-column label="货物类型" width="150">
              <template slot-scope="scope">
                <div>{{getMappingVal(goodsStyleList,'type_index',scope.row.goods_type,'type_name')}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="box_length" label="长度" width="150"></el-table-column>
            <el-table-column prop="box_width" label="宽度" width="100"></el-table-column>
            <el-table-column prop="box_height" label="高度" width="100"></el-table-column>
            <el-table-column prop="box_weight" label="重量" width="150"></el-table-column>
            <el-table-column prop="box_inner_qty" label="内件数" width="150"></el-table-column>
            <el-table-column prop="box_position" label="包裹定位" width="150"></el-table-column>
            <el-table-column prop="item_position_type" label="定位类型" width="150"></el-table-column>
            <el-table-column prop="box_status" label="状态" width="150"></el-table-column>
            <el-table-column prop="box_type" label="类型" width="150"></el-table-column>
            <el-table-column prop="destination_code" label="目的地编码" width="150"></el-table-column>
            <el-table-column prop="box_note" label="备注" width="200" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="箱子详情" name="box">
        <div class="tables">
          <el-table :data="form.bill_detail" style="width: 100%">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="box_number" label="包裹号码" width="150"></el-table-column>
            <el-table-column prop="way_bill_number" label="运单ID" width="150"></el-table-column>
            <el-table-column prop="product_sku" label="产品SKU" width="150"></el-table-column>
            <el-table-column prop="customer_sku" label="客户SKU" width="150"></el-table-column>
            <el-table-column prop="hs_code" label="海关编码" width="150"></el-table-column>
            <el-table-column prop="company_code" label="产品所有者" width="150"></el-table-column>
            <el-table-column prop="product_name_zh" label="中文名称" width="150"></el-table-column>
            <el-table-column prop="product_name_en" label="英文名称" width="150"></el-table-column>
            <el-table-column prop="product_length" label="长度" width="150"></el-table-column>
            <el-table-column prop="product_width" label="宽度" width="100"></el-table-column>
            <el-table-column prop="product_height" label="高度" width="100"></el-table-column>
            <el-table-column prop="product_weight" label="重量" width="150"></el-table-column>
            <el-table-column prop="product_brand" label="产品品牌" width="150"></el-table-column>
            <el-table-column prop="product_model" label="产品型号" width="150"></el-table-column>
            <el-table-column prop="product_material_zh" label="中文材质" width="150"></el-table-column>
            <el-table-column prop="product_material_en" label="英文材质" width="150"></el-table-column>
            <el-table-column prop="product_category" label="产品品类" width="150"></el-table-column>
            <el-table-column prop="product_unit" label="申报单位" width="150"></el-table-column>
            <el-table-column prop="product_qty" label="数量" width="150"></el-table-column>
            <el-table-column prop="declared_price" label="申报价格" width="150"></el-table-column>
            <el-table-column label="申报币种" width="150">
              <template slot-scope="scope">
                <div>{{ getMappingVal(currencyList,'key',scope.row.declared_currency,'label') }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="挂载运单" name="cost">
        <div class="tables">
          <el-table :data="form.box_ln" style="width: 100%">
            <el-table-column type="index" width="50" fixed></el-table-column>
            <el-table-column prop="box_number" label="包裹号码" width="150" fixed></el-table-column>
            <el-table-column prop="way_bill_number" label="挂载运单号" width="150" fixed></el-table-column>
            <el-table-column prop="destination_code" label="目的地编码"></el-table-column>
            <el-table-column prop="is_mount" label="挂载状态"></el-table-column>
            <el-table-column prop="mount_time" label="挂载时间"></el-table-column>
            <el-table-column prop="unmount_time" label="卸载时间"></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="物流运单费用" name="note">
        <div class="tables">
          <el-table :data="form.bill_cost" style="width: 100%">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="way_bill_number" label="运单ID" width="150"></el-table-column>
            <el-table-column prop="cost_name" label="费用名称" width="150"></el-table-column>
            <el-table-column prop="cost_code" label="费用代码" width="200"></el-table-column>
            <el-table-column prop="unit_price" label="费用单价" width="150"></el-table-column>
            <el-table-column prop="cost_qty" label="费用数量"></el-table-column>
            <el-table-column label="付款状态">
              <template slot-scope="scope">
                <div>{{scope.row.is_pay == '1' ? '已付款' : '未付款'}}</div>
              </template>
            </el-table-column>
            <el-table-column label="是否有效">
              <template slot-scope="scope">
                <div>{{scope.row.is_enable == '1' ? '有效' : '无效'}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="sub_total" label="费用小计"></el-table-column>
            <el-table-column label="添加人" width="250">
              <template slot-scope="scope">
                <div>添加人: {{scope.row.created_user}}</div>
                <div>添加时间: {{scope.row.created_time}}</div>
              </template>
            </el-table-column>
            <el-table-column label="更新人" width="250">
              <template slot-scope="scope">
                <div>更新人: {{scope.row.updated_user}}</div>
                <div>更新时间: {{scope.row.updated_time}}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getWaybillDetail } from '@/api/logistics';
import Titles from '_c/common/Titles';
export default {
  props: {
    groupCode: {
      type: String,
      default: ''
    },
    waybillNumber: {
      type: String,
      default: ''
    },
    statusList: [Array], //运单状态
    waybillType: [Array], //运单类型
    channelList: [Array], //物流渠道
    countryList: [Array], //目的国家
    goodsStyleList: [Array], //货物类型
    declaredTypeList: [Array], //申报类型
    currencyList: [Array] //申报币种
  },
  data() {
    return {
      form: {
        bill: {},
        bill_box: [], //箱子信息
        bill_detail: [], //箱子详情
        box_ln: [], //挂载运单
        bill_cost: [] //物流运单费用
      },
      formLoading: false,
      activeName: 'product'
    };
  },
  watch: {
    waybillNumber(newVal) {
      let params = {
        group_code: this.groupCode,
        way_bill_number: this.waybillNumber
      };
      this.getWaybillDetail(params);
    }
  },
  methods: {
    handleClick(tab, event) {},
    async getWaybillDetail(params) {
      this.formLoading = true;
      try {
        let { data } = await getWaybillDetail(params);
        this.form = data;
      } catch (error) {
        this._message(error);
      }
      this.formLoading = false;
    }
  },
  components: {
    Titles
  }
};
</script>

<style lang="scss" scoped>
.detail {
  padding: 0px 20px;
  .label-val {
    background: #f0f4f3;
    color: #333;
    padding: 0 10px;
    border-radius: 3px;
    height: 32px;
  }
}
.tables {
  margin-top: 10px;
  margin-bottom: 80px;
}
</style>
