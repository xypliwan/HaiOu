<template>
  <div>
    <el-dialog :title="templateTitle" :visible.sync="contractVisible" width="600px" :before-close="handleClose">
      <div>
        <el-form :disabled="flg == '2'" :model="ruleForm" size="small" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm" v-loading="formLoading">
          <el-form-item label="模板名称" prop="template_name">
            <el-input v-if="flg !== '2'" v-model="ruleForm.template_name" placeholder="请输入模板名称" clearable></el-input>
            <span v-else>{{ruleForm.template_name}}</span>
          </el-form-item>
          <el-form-item label="模板类型" prop="template_type">
            <el-select v-if="flg !== '2'" v-model="ruleForm.template_type" placeholder="请选择模板类型" clearable filterable>
              <el-option :label="item.type_name" :value="item.type_index" v-for="(item,index) in templateList" :key="index"></el-option>
            </el-select>
            <span v-else>{{getMappingVal(templateList,'type_index',ruleForm.template_type,'type_name')}}</span>
          </el-form-item>

          <el-form-item label="负责人" prop="principal_name">
            <el-input v-if="flg !== '2'" v-model="ruleForm.principal_name" placeholder="请输入负责人名称" clearable></el-input>
            <span v-else>{{ruleForm.principal_name}}</span>
          </el-form-item>

          <el-form-item label="负责人手机号" prop="principal_mobile">
            <el-input v-if="flg !== '2'" v-model="ruleForm.principal_mobile" placeholder="请输入负责人名称" clearable></el-input>
            <span v-else>{{ruleForm.principal_mobile}}</span>
          </el-form-item>

          <el-form-item label="文档类型" prop="doc_type">
            <el-select v-if="flg !== '2'" v-model="ruleForm.doc_type" placeholder="请选择文档类型" clearable filterable>
              <el-option :label="item.type_name" :value="item.type_index" v-for="(item,index) in fileList" :key="index"></el-option>
            </el-select>
            <span v-else>{{getMappingVal(fileList,'type_index',ruleForm.doc_type,'type_name')}}</span>
          </el-form-item>

          <el-form-item label="模板等级" prop="template_level">
            <el-select v-if="flg !== '2'" v-model="ruleForm.template_level" placeholder="请选择模板等级" clearable filterable>
              <el-option :label="item.label" :value="item.key" v-for="(item,index) in templateLevel" :key="index"></el-option>
            </el-select>
            <span v-else>{{getMappingVal(templateLevel,'key',ruleForm.template_level,'label')}}</span>
          </el-form-item>

          <el-form-item label="上传模板" prop="doc_url_show">
            <upload-pdf title="上传模板" url="/upload/pdf" @uploadOk="uploadOk" v-show="flg !== '2'"></upload-pdf>
            {{ruleForm.doc_url_show}}
          </el-form-item>

          <el-form-item label="有效天数" prop="effect_days">
            <el-input v-if="flg !== '2'" v-model="ruleForm.effect_days" placeholder="请输入有效天数" clearable>
              <template slot="append">天</template>
            </el-input>
            <span v-else>{{ruleForm.effect_days}}天</span>
          </el-form-item>

          <el-form-item label="模板说明" prop="template_note">
            <el-input v-if="flg !== '2'" type="textarea" placeholder="请输入模板说明" v-model="ruleForm.template_note" maxlength="300" show-word-limit></el-input>
            <span v-else>{{ruleForm.template_note}}</span>
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
import uploadPdf from '_c/upload/pdf';
import { addTemplate, getTemplateDetail, editTemplateDetail } from '@/api/system';

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
    fileList: {
      type: Array,
      default: () => []
    },
    flg: {
      //打开组件类型  // 1新增  2查看   3编辑
      type: String,
      default: ''
    },
    templateNumber: {
      //模板编号
      type: String,
      default: ''
    },
    templateLevel: {
      //模板等级
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      templateTitle: '新增合同模板',
      formLoading: false,
      ruleForm: {
        template_no: '', //模板编号
        template_name: '', //模板名称
        template_type: '', //模板类型
        principal_name: '', //负责人
        principal_mobile: '', //负责人手机号
        doc_url: '', //文档地址
        doc_url_show: '', //文档地址
        doc_type: '', //文档类型
        effect_days: '365', //有效天数
        template_level: '', //合同等级  12345
        template_note: '' //合同模板说明
      },
      rules: {
        template_name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
        template_type: [{ required: true, message: '请选择模板类型', trigger: 'change' }],
        doc_type: [{ required: true, message: '请选择文档类型', trigger: 'change' }],
        doc_url_show: [{ required: true, message: '请上传模板文件', trigger: 'blur' }],
        effect_days: [{ required: true, message: '请输入有效天数', trigger: 'blur' }],
        principal_name: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
        principal_mobile: [{ required: true, message: '请输入负责人手机号', trigger: 'blur' }],
        template_level: [{ required: true, message: '请选择模板等级', trigger: 'change' }],
        template_note: [{ required: true, message: '请输入模板说明', trigger: 'blur' }]
      }
    };
  },
  watch: {
    contractVisible(newVal) {
      if (newVal) {
        switch (this.flg) {
          case '1': //新增
            this.templateTitle = '新增合同模板';
            for (let i in this.ruleForm) {
              this.ruleForm[i] = '';
            }
            this.ruleForm.effect_days = '365';
            break;
          case '2': //2查看
            this.templateTitle = '查看合同模板';
            this.getTemplateDetail();
            break;
          case '3': //2编辑
            this.templateTitle = '编辑合同模板';
            this.getTemplateDetail();
            break;
        }
      }
    }
  },
  methods: {
    async editTemplateDetail() {
      this.formLoading = true;
      try {
        let { data, message } = await editTemplateDetail(this.ruleForm);
        this._message(message, 'success');
        this.resetForm();
        this.handleClose();
        this.$emit('saveOk');
      } catch (error) {
        this._message(error);
      }
      this.formLoading = false;
    },
    async getTemplateDetail() {
      this.formLoading = true;
      try {
        let { data } = await getTemplateDetail({ template_no: this.templateNumber });
        Object.assign(this.ruleForm, data);
        this.ruleForm.doc_url_show = data.doc_url;
      } catch (error) {
        this._message(error);
      }
      this.formLoading = false;
    },
    async addTemplate() {
      this.formLoading = true;
      try {
        let { message } = await addTemplate(this.ruleForm);
        this._message(message, 'success');
        this.resetForm();
        this.handleClose();
        this.$emit('saveOk');
      } catch (error) {
        this._message(error);
      }
      this.formLoading = false;
    },
    uploadOk(fileUrl) {
      this.ruleForm.doc_url = fileUrl.file_url;
      this.ruleForm.doc_url_show = fileUrl.file_name;
    },
    sumbitSave() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          switch (this.flg) {
            case '1': //新增
              this.ruleForm.template_no = '';
              this.addTemplate();
              break;
            case '3':
              this.editTemplateDetail();
              break;
          }
        } else {
          console.log('error submit!!');
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
  components: {
    uploadPdf
  }
};
</script>

<style lang="scss" scoped>
</style>
