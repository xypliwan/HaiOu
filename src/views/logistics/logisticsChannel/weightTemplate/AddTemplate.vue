<template>
  <div>
    <el-dialog :title="detailTitle" :visible.sync="templateVisible" width="900px" :before-close="handleClose">
      <div v-loading="formLoading">
        <el-form :model="ruleForm" size="small" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
              <el-form-item label="中文名称" prop="wt_name">
                <el-input v-model="ruleForm.wt_name" clearable placeholder="请输入中文名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="英文名称" prop="wt_name_en">
                <el-input v-model="ruleForm.wt_name_en" clearable placeholder="请输入英文名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="是否生效" prop="wt_status">
                <el-switch v-model="ruleForm.wt_status" active-color="#13a468" inactive-color="#cccccc" active-value="1" inactive-value="0"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="公共模板" prop="is_default">
                <el-switch v-model="ruleForm.is_default" active-color="#13a468" inactive-color="#cccccc" active-value="1" inactive-value="0"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input type="textarea" placeholder="请输入内容" v-model="ruleForm.wt_note" maxlength="200" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <table-weight-interval :weightType="weightType" :tableData="ruleForm.template_detail_arr" @deleteItem="deleteItem"></table-weight-interval>
        <div class="error-tip" v-show="tableVidete">{{errorText}}</div>
      </div>
      <div class="dialog-footer">
        <el-button size="mini" @click="handleClose">关闭</el-button>
        <el-button size="mini" type="primary" @click="submitSave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TableWeightInterval from './TableWeightInterval';
import { saveWeightTemplate, getWeightTemplateDetail } from '@/api/logistics';
import { arrDeWeight } from '_u/utils';
export default {
  props: {
    templateVisible: {
      type: Boolean,
      default: false
    },
    templateId: {
      type: String,
      default: ''
    },
    flg: {
      //1增加  2查看   3编辑
      type: String,
      default: ''
    },
    weightType: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      detailTitle: '新增重量模板',
      ruleForm: {
        wt_id: '', //重量段模板ID（编辑必填）
        wt_name: '', //中文名称
        wt_name_en: '', //英文名称
        wt_status: '0', //状态：0:草稿、1:生效
        is_default: '0', //是否公共模块：0否，1是
        wt_note: '', //模板备注
        template_detail_arr: [
          {
            wtd_id: '', //模板详情ID
            wtd_title: '', //名称
            wk_code: '', //计费类型
            wtd_start_weight: '', //开始值
            wtd_end_weight: '', //结束值
            fk_unit_weight: '1' //计费单重
          }
        ]
      },
      rules: {
        wt_name: [{ required: true, message: '请输入中文名称', trigger: 'blur' }],
        wt_name_en: [{ required: true, message: '请输入英文名称', trigger: 'blur' }]
      },
      tableVidete: false,
      errorText: '',
      formLoading: false
    };
  },
  watch: {
    templateVisible(newVal) {
      switch (this.flg) {
        case '1': //增加
          this.detailTitle = '新增重量模板';
          this.ruleForm.wt_id = '';
          break;

        case '2': //查看
          this.detailTitle = '重量模板详情';
          break;
        case '3': //编辑
          this.detailTitle = '编辑重量模板';
          this.getWeightTemplateDetail(this.templateId);
          break;
      }
    }
  },
  methods: {
    async getWeightTemplateDetail(id) {
      this.formLoading = true;
      try {
        let { data } = await getWeightTemplateDetail({ wt_id: id });
        Object.assign(this.ruleForm, data);
        this.ruleForm.template_detail_arr = data.detail_arr;
        console.log(this.ruleForm);
      } catch (error) {
        this._message(error);
      }
      this.formLoading = false;
    },
    async saveWeightTemplate() {
      this.formLoading = true;
      try {
        let { message } = await saveWeightTemplate(this.ruleForm);
        this._message(message, 'success');
        this.handleClose();
        this.$emit('saveOk');
      } catch (error) {
        this._message(error);
      }
      this.formLoading = false;
    },
    vilidetaTableData() {
      //验证数据
      let spnaArr = [];
      let text = '';
      this.ruleForm.template_detail_arr.forEach((el, index) => {
        for (let i in el) {
          if (el[i] == '' && i !== 'wtd_id') {
            spnaArr.push({
              flg: 'false',
              index: index
            });
          }
        }
      });
      let res = arrDeWeight(spnaArr, 'index');
      if (res.length > 0) {
        res.forEach(el => {
          text += el.index + 1 + ' ';
        });
        this.tableVidete = true;
        this.errorText = `请把第${text} 行数据填写完整`;
        return false;
      } else {
        this.tableVidete = false;
        return true;
      }
    },
    deleteItem(index) {
      //删除item
      this.ruleForm.template_detail_arr.splice(index, 1);
    },
    submitSave() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.vilidetaTableData()) {
            switch (this.flg) {
              case '1': //增加
                this.ruleForm.wt_id = '';
                this.saveWeightTemplate();
                break;

              case '2': //查看
                break;
              case '3': //编辑
                this.saveWeightTemplate();
                break;
            }
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    addTableItem() {
      let item = {
        wtd_id: '', //模板详情ID
        wtd_title: '', //名称
        wk_code: '', //计费类型
        wtd_start_weight: '', //开始值
        wtd_end_weight: '', //结束值
        fk_unit_weight: '1' //计费单重
      };
      this.ruleForm.template_detail_arr.push(item);
    },
    reset() {
      this.$refs.ruleForm.resetFields();
      this.ruleForm.wt_note = '';

      this.ruleForm.template_detail_arr = [];
      this.addTableItem();
    },
    handleClose() {
      this.reset();
      this.$emit('update:templateVisible', false);
    }
  },
  components: {
    TableWeightInterval
  }
};
</script>

<style lang="scss" scoped>
.error-tip {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding: 20px 10px;
}
</style>
