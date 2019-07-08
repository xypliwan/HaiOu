<template>
  <div class="wrapper-box">
    <el-form ref="form" size="small" :model="form" label-width="100px">
      <el-form-item label="收款方式">
        <el-radio v-model="form.isLine" label="1" @change="getAccountExtends('1')">线上</el-radio>
        <el-radio v-model="form.isLine" label="2" @change="getAccountExtends('2')">线下</el-radio>
      </el-form-item>
      <el-row v-loading="fromLoading">
        <div class="item-wrapper" v-if="form.receipt_id">
          <el-tabs v-model="form.receipt_id" @tab-click="handleClick" type="card">
            <el-tab-pane :label="ev.receipt_short" :name="ev.receipt_id" v-for="(ev,i) in chargeDetail" :key="i"></el-tab-pane>
          </el-tabs>
        </div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="收款名称">
              <el-input v-model="form.receipt_name" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="1">
            <el-form-item label="收款简称">
              <el-input v-model="form.receipt_short" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="是否启用">
              <el-switch v-model="form.is_enable" active-color="#13a468" inactive-color="#ccc" active-value="1" inactive-value="0"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="银行名称">
              <el-input v-model="form.bank_name" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="1">
            <el-form-item label="开户人">
              <el-input v-model="form.receipt_user" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="17">
            <el-form-item label="银行卡号">
              <el-input v-model="form.receipt_account" clearable type="number"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="账户类型">
              <el-radio v-model="form.receipt_tag" label="0">公账</el-radio>
              <el-radio v-model="form.receipt_tag" label="1">私账</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="1">
            <el-form-item label="收款链接">
              <el-input v-model="form.receipt_url" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="账户图标">
              <upload url="upload/image" @deleteImg="deleteImgIcon" :limits="1" :imgList="iconUrl" @uploadImgSuccess="uploadSuccess"></upload>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="1">
            <el-form-item label="收款图片">
              <upload url="upload/image" :limits="1" @deleteImg="deleteImgCost" :imgList="costUrl" @uploadImgSuccess="uploadSuccesscost"></upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-row>
    </el-form>

    <config-table ref="configTable" v-show="form.account_extend.length" :tableData="form.account_extend"></config-table>

    <div class="btn-oppeary">
      <el-button type="primary" size="small" @click="saveAccountEdit">保存</el-button>
      <el-button size="small" @click="reset">重置</el-button>
    </div>
  </div>
</template>

<script>
import { getAccountExtends, saveAccountEdit } from '@/api/system';
import Upload from '_c/upload/upload';
import ConfigTable from './ConfigTable';
export default {
  data() {
    return {
      fromLoading: false,
      form: {
        isLine: '1',
        receipt_id: '', //收款设置id
        receipt_name: '', //收款名称
        receipt_short: '', //收款简称
        bank_name: '', //银行名称
        receipt_user: '', //开户人
        receipt_account: '', //银行卡号
        receipt_tag: '', //账户类型
        receipt_icon: '', //收款图标
        receipt_url: '', //收款链接
        receipt_img: '', //收款图片
        is_enable: '0', //是否启用
        account_extend: []
      },
      chargeDetail: [],
      iconUrl: [],
      costUrl: []
    };
  },
  created() {
    this.getAccountExtends('1');
  },
  methods: {
    async saveAccountEdit() {
      let datas = this.$refs.configTable.getData();
      this.fromLoading = true;
      try {
        let { message } = await saveAccountEdit(this.form);
        let item = this.chargeDetail.filter(el => el.receipt_id == this.form.receipt_id);
        this.form.account_extend = item[0].extends;
        this._message(message, 'success');
        this.getAccountExtends(this.form.isLine, 'isSave');
      } catch (error) {
        this._message(error);
      }
      this.fromLoading = false;
    },
    reset() {
      this.handleChangeRadio(this.form.receipt_id);
    },
    handleClick(tab, event) {
      this.handleChangeRadio(tab.name);
    },
    handleChangeRadio(id) {
      let item = this.chargeDetail.filter(el => el.receipt_id == id);
      Object.assign(this.form, item[0]);
      this.form.account_extend = item[0].extends;
      this.iconUrl = [];
      this.costUrl = [];
      if (this.form.receipt_icon.length) {
        this.iconUrl.push(this.form.receipt_icon);
      }
      if (this.form.receipt_img) {
        this.costUrl.push(this.form.receipt_img);
      }
    },
    deleteImgIcon(i) {
      this.iconUrl.splice(i, 1);
      this.form.receipt_icon = '';
    },
    deleteImgCost(i) {
      this.costUrl.splice(i, 1);
      this.form.receipt_img = '';
    },
    uploadSuccess(url) {
      this.iconUrl.push(url);
      this.form.receipt_icon = url;
    },
    uploadSuccesscost(url) {
      this.costUrl.push(url);
      this.form.receipt_img = url;
    },
    async getAccountExtends(type, isSave) {
      //获取收费详情
      this.fromLoading = true;
      try {
        let { data } = await getAccountExtends({ type: type });
        if (isSave) {
          this.chargeDetail = data;
        } else {
          this.chargeDetail = data;
          this.form.receipt_id = data[0].receipt_id;
        }
        this.handleChangeRadio(this.form.receipt_id);
      } catch (error) {
        this._message(error);
      }
      this.fromLoading = false;
    }
  },
  components: {
    Upload,
    ConfigTable
  }
};
</script>

<style lang="scss" scoped>
.wrapper-box {
  width: 1000px;
}
.btn-oppeary {
  padding: 30px 30px;
}
.item-wrapper {
  padding: 10px 0;
  margin-bottom: 20px;
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
}
</style>
