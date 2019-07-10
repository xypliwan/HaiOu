<template>
  <div class="details">
    <titles titles="客户基本信息"></titles>
    <el-form ref="form" :model="detail" label-width="120px" size="small" v-loading="detailLoading">
      <el-row>
        <el-col :span="11">
          <el-form-item label="客户代码">
            <div class="cont">{{detail.company.company_code}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="简称">
            <div class="cont">{{detail.company.company_short}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="中文名称">
            <div class="cont">{{detail.company_info.company_full_name}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="英文名称">
            <div class="cont">{{detail.company_info.company_full_name_en}}</div>
          </el-form-item>
        </el-col>

        <el-col :span="11">
          <el-form-item label="公司主页">
            <div class="cont">{{detail.company_info.company_web}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="公司简介">
            <div class="cont">{{detail.company_info.company_profile}}</div>
          </el-form-item>
        </el-col>

        <el-col :span="11">
          <el-form-item label="客户名称">
            <div class="cont">{{detail.company.company_name}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="客户状态">
            <div class="cont">{{getMappingVal(statusList,'status_index',detail.company.company_status,'status_name') }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="认证状态">
            <div class="cont">{{getMappingVal(verifiedStatus,'status_index',detail.company.verified_status,'status_name') }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="更新时间">
            <div class="cont">{{detail.company.updated_time}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="结算类型">
            <div class="cont">{{ detail.company_info.company_cash_type == '1' ? '预付' : '到付' }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="币种">
            <div class="cont">{{getMappingVal(currencyList,'key',detail.company_info.company_currency,'label' )}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="结算模式">
            <div class="cont">{{getMappingVal(settlementType,'type_index',detail.company_info.settlement_type_code,'type_name') }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="联系人">
            <div class="cont">{{detail.company_info.company_contacts}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="电话">
            <div class="cont">{{detail.company_info.company_telephone}}</div>
          </el-form-item>
        </el-col>

        <el-col :span="11" :offset="1">
          <el-form-item label="传真">
            <div class="cont">{{detail.company_info.company_fax }}</div>
          </el-form-item>
        </el-col>

        <el-col :span="11">
          <el-form-item label="企业联系邮箱">
            <div class="cont">{{detail.company_info.company_email}}</div>
          </el-form-item>
        </el-col>

        <el-col :span="11" :offset="1">
          <el-form-item label="公司QQ号码">
            <div class="cont">{{detail.company_info.company_qq }}</div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="outher-info"></div>
    <titles titles="其它信息"></titles>
    <el-tabs v-model="activeName">
      <el-tab-pane label="客户账号" name="user">
        <user-table :tableData="detail.company_user"></user-table>
      </el-tab-pane>
      <el-tab-pane label="公司应用" name="app">
        <app-table ref="appRef" :tableData="detail.company_app" :company_code="detail.company.company_code"></app-table>
      </el-tab-pane>
      <el-tab-pane label="公司标签" name="label">
        <lable-table :tableData="detail.company_labels"></lable-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getCompanyDetail } from '@/api/client';
import Titles from '_c/common/Titles';
import AppTable from './DetailTable/App';
import LableTable from './DetailTable/Lable';
import UserTable from './DetailTable/User';
export default {
  props: {
    id: String,
    statusList: [Array], //客户状态
    verifiedStatus: [Array], //认证状态
    settlementType: [Array], //结算模式
    currencyList: [Array] //币种列表
  },
  data() {
    return {
      detailLoading: false,
      detail: {
        company: {},
        company_info: {},
        company_app: [],
        company_labels: [],
        company_user: []
      },
      activeName: 'user'
    };
  },
  watch: {
    id(newVal) {
      if (newVal.length) {
        this.getCompanyDetail();
      }
    }
  },
  methods: {
    async getCompanyDetail() {
      this.detailLoading = true;
      try {
        let { data } = await getCompanyDetail({ id: this.id });
        Object.assign(this.detail, data);
      } catch (error) {
        this._message(error);
      }
      this.detailLoading = false;
    }
  },
  components: {
    Titles,
    AppTable,
    LableTable,
    UserTable
  }
};
</script>

<style lang="scss" scoped>
.details {
  padding: 0 20px;
  .cont {
    background: #f0f4f3;
    color: #333;
    padding: 0 10px;
    border-radius: 3px;
    min-height: 32px;
  }
  .outher-info {
    margin-top: 30px;
  }
}
</style>
