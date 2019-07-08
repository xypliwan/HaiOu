<template>
  <div>
    <el-dialog :title="templateTitle" :visible.sync="contractVisible" width="600px" :before-close="handleClose">
      <div>
        <el-form :disabled="flg == '2'" :model="ruleForm" size="small" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm" v-loading="formLoading">
          <el-form-item label="合同标题" prop="doc_title">
            <el-input v-if="flg !== '2'" v-model="ruleForm.doc_title" placeholder="请输入合同标题" clearable></el-input>
            <span v-else>{{ruleForm.doc_title}}</span>
          </el-form-item>

          <el-form-item label="签约公司" prop="company_code">
            <el-select
              v-if="flg !== '2'"
              v-model="ruleForm.company_code"
              filterable
              clearable
              remote
              reserve-keyword
              placeholder="请输入签约公司关键词(模糊搜索)"
              :remote-method="remoteMethod"
              :loading="countryLoading"
            >
              <el-option v-for="item in signingCountryList" :key="item.company_code" :label="item.company_name" :value="item.company_code">
                <span>{{ item.company_name }}</span> &nbsp;
                <span style="color: #8492a6; font-size: 13px">{{ item.company_code }}</span>
              </el-option>
            </el-select>
            <span v-else>{{getMappingVal(signingCountryList,'company_code',ruleForm.company_code,'company_name')}}</span>
          </el-form-item>
          <el-form-item label="选择模板" prop="template_id">
            <el-select v-if="flg !== '2'" v-model="ruleForm.template_id" filterable placeholder="请选择模板">
              <el-option v-for="item in templateList" :key="item.template_id" :label="item.template_name" :value="item.template_id">
                <span>{{ item.template_name }}</span> &nbsp;
                <span style="color: #8492a6; font-size: 13px;float:right">有效期 {{ item.effect_days }}天</span>
              </el-option>
            </el-select>
            <span v-else>
              {{getMappingVal(templateList,'template_id',ruleForm.template_id,'template_name')}}
              (有效期{{getMappingVal(templateList,'template_id',ruleForm.template_id,'effect_days')}}天)
            </span>
          </el-form-item>
          <el-form-item label="开始时间" prop="start_time">
            <el-date-picker
              v-if="flg !== '2'"
              size="mini"
              @change="changeTime"
              class="item"
              v-model="ruleForm.start_time"
              placeholder="选择开始时间"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptionsStart"
            ></el-date-picker>
            <span v-else>{{ruleForm.start_time}}</span>
            <!-- <p class="tip" v-show="flg !== '2'">最小开始时间为当天</p> -->
          </el-form-item>
          <el-form-item label="结束时间" prop="end_time">
            <el-date-picker
              v-if="flg !== '2'"
              :disabled="ruleForm.template_id.length==0 || (ruleForm.start_time == '' || ruleForm.start_time ==null)"
              size="mini"
              class="item"
              v-model="ruleForm.end_time"
              placeholder="选择结束时间"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptionsEnd"
            ></el-date-picker>
            <span v-else>{{ruleForm.end_time}}</span>
          </el-form-item>

          <el-form-item label="文档类型" prop="doc_type">
            <el-select v-if="flg !== '2'" v-model="ruleForm.doc_type" clearable filterable placeholder="请选择文档类型">
              <el-option v-for="item in documentType" :key="item.type_index" :label="item.type_name" :value="item.type_index"></el-option>
            </el-select>
            <span v-else>{{getMappingVal(documentType,'type_index',ruleForm.doc_type,'type_name')}}</span>
          </el-form-item>
          <el-form-item label="合同文件地址">
            <el-input v-if="flg !== '2'" v-model="ruleForm.doc_url" placeholder="请输入合同文件地址" clearable></el-input>
            <span v-else>{{ruleForm.doc_url}}</span>
          </el-form-item>
          <el-form-item label="签约时间">
            <el-date-picker v-if="flg !== '2'" v-model="ruleForm.signing_time" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择签约时间"></el-date-picker>
            <span v-else>{{ruleForm.signing_time}}</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-footer">
        <el-button size="mini" @click="handleClose">关闭</el-button>
        <el-button size="mini" v-show="flg !== '2'" type="primary" @click="sumbitSave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { searchCustomerList } from '@/api/client';
import { addContract, getContractDetail, editContractDetail } from '@/api/system';

export default {
  props: {
    contractVisible: {
      type: Boolean,
      default: false
    },
    templateList: {
      type: Array,
      default: () => []
    },
    documentType: {
      type: Array,
      default: () => []
    },
    flg: {
      type: String,
      default: ''
    },
    docNumber: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      templateTitle: '新增合同模板',
      formLoading: false,
      ruleForm: {
        doc_number: '', //合同编码
        doc_title: '', //合同标题
        company_code: '', //签约公司
        template_id: '', //模板id
        start_time: '', //开始时间
        end_time: '', //结束时间
        signing_time: '', //签约时间
        doc_url: '', //合同文件地址
        doc_type: '' //文档类型
      },
      rules: {
        doc_title: [{ required: true, message: '请输入合同标题', trigger: 'blur' }],
        company_code: [{ required: true, message: '请选择签约公司', trigger: 'change' }],
        template_id: [{ required: true, message: '请选择模板id', trigger: 'blur' }],
        doc_type: [{ required: true, message: '请选择文档类型', trigger: 'change' }],
        // doc_url: [{ required: true, message: '请输入合同文件地址', trigger: 'blur' }],
        start_time: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
        end_time: [{ required: true, message: '请选择结束时间', trigger: 'blur' }]
      },
      countryLoading: false,
      signingCountryList: [], //签约公司
      pickerOptionsStart: {
        disabledDate: time => {
          return this.dealDisabledDateStart(time);
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          return this.dealDisabledDateEnd(time);
        }
      }
    };
  },
  mounted() {},
  watch: {
    contractVisible(newVal) {
      if (newVal) {
        switch (this.flg) {
          case '1': //新增
            this.templateTitle = '新增合同';
            for (let i in this.ruleForm) {
              this.ruleForm[i] = '';
            }
            break;
          case '2': //2查看
            this.templateTitle = '查看合同';
            this.getContractDetail();
            break;
          case '3': //3编辑
            this.templateTitle = '编辑合同';
            this.getContractDetail();
            break;
        }
      }
    }
  },
  methods: {
    changeTime(e) {
      this.ruleForm.end_time = '';
    },
    dealDisabledDateStart(time) {
      //获取需要禁用的天数
      let datys;
      if (this.ruleForm.template_id.length > 0) {
        datys = this.templateList.filter(v => v.template_id == this.ruleForm.template_id)[0].effect_days;
      }

      // let curDate = (new Date()).getTime()
      // let day = 24 * 3600 * 1000 * (Number(datys)-1)

      let curDate = new Date().getTime();
      let day = 24 * 3600 * 1000 * (Number(datys) - 1);
      let dateRegion = curDate + day;
      // return time.getTime() < Date.now() - 8.64e7 || time.getTime() > dateRegion
      return time.getTime() < Date.now() - 8.64e7;
    },
    dealDisabledDateEnd(time) {
      let datys;
      if (this.ruleForm.template_id.length > 0) {
        datys = this.templateList.filter(v => v.template_id == this.ruleForm.template_id)[0].effect_days;
      }
      let start = new Date(this.ruleForm.start_time).getTime();
      let day = 24 * 3600 * 1000 * (Number(datys) - 1);
      let dateRegion = start + day;
      // return start < Date.now() - 8.64e7 || time.getTime() > dateRegion
      return start > time.getTime() || time.getTime() > dateRegion;
    },
    async editContractDetail() {
      //编辑合同
      try {
        let { message } = await editContractDetail(this.ruleForm);
        this._message(message, 'success');
        this.resetForm();
        this.handleClose();
        this.$emit('addOk');
      } catch (error) {
        this._message(error);
      }
    },
    async getContractDetail() {
      //获取合同详情
      this.formLoading = true;
      try {
        let { data } = await getContractDetail({ doc_number: this.docNumber });
        Object.assign(this.ruleForm, data);
        this.remoteMethod(data.company_code);
      } catch (error) {
        this._message(error);
      }
      this.formLoading = false;
    },
    async addContract() {
      this.formLoading = true;
      try {
        let { message } = await addContract(this.ruleForm);
        this._message(message, 'success');
        this.handleClose();
        this.$emit('addOk');
      } catch (error) {
        this._message(error);
      }
      this.formLoading = false;
    },
    remoteMethod(query) {
      //模糊远程搜索
      if (query !== '') {
        this.searchCustomerList(query);
      } else {
        this.signingCountryList = [];
      }
    },
    async searchCustomerList(keyWord) {
      //获取模糊搜索列表
      this.countryLoading = true;
      try {
        let { data } = await searchCustomerList({ company_name: keyWord, pageSize: 500 });
        this.signingCountryList = data;
      } catch (error) {
        this._message(error);
      }
      this.countryLoading = false;
    },
    sumbitSave() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          switch (this.flg) {
            case '1': //新增
              this.ruleForm.doc_number = '';
              this.addContract();
              break;
            case '3': //编辑
              this.editContractDetail();
              break;
          }
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    handleClose() {
      this.resetForm();
      this.$emit('update:contractVisible', false);
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.tip {
  font-size: 12px;
  color: #b1adad;
}
</style>
