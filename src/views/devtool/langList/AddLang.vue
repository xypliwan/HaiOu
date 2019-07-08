<template>
  <div>
    <el-dialog title="新增 / 编辑语言" :visible.sync="langVisible" width="700px" :before-close="handleClose">
      <div>
        <el-form :model="ruleForm" size="mini" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-loading="langLoading">
          <el-row>
            <el-col :span="11">
              <el-form-item label="编码" prop="lang_code">
                <el-input v-model="ruleForm.lang_code" :disabled="langId !== ''" clearable placeholder="请输入语言代码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="文件类型" prop="file_ext">
                <el-radio v-model="ruleForm.file_ext" label="js" :disabled="langId !== ''" @change="changeGroupExt('js')">JS</el-radio>
                <el-radio v-model="ruleForm.file_ext" label="php" :disabled="langId !== ''" @change="changeGroupExt('php')">PHP</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="中文名称" prop="lang_cn">
                <el-input v-model="ruleForm.lang_cn" clearable placeholder="请输入中文名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="所属模块" prop="file_name">
                <el-select v-model="ruleForm.file_name" :disabled="langId !== ''" filterable placeholder="请选择所属模块">
                  <el-option :label="item.value" :value="item.key" v-for="(item,index) in langGroupList" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="英文名称" prop="lang_en">
                <el-input v-model="ruleForm.lang_en" clearable placeholder="请输入中文名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="是否立即生效">
                <el-switch v-model="ruleForm.is_generate" active-color="#409EFF" inactive-color="#bfbaba" active-value="1" inactive-value="0"></el-switch>
                <!-- <span style="margin-left:8px;">{{ ruleForm.is_generate ? '是' : '否' }}</span> -->
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="dialog-footer">
        <el-button @click="handleClose" size="mini">取 消</el-button>
        <el-button type="primary" size="mini" @click="submitForm">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { saveLang } from '@/api/develop';
export default {
  props: {
    langVisible: {
      type: Boolean,
      default: false
    },
    langGroupList: {
      type: Array,
      default: []
    },
    langId: {
      type: [Number, String],
      default: ''
    },
    langDetail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      ruleForm: {
        lang_code: '', //语言编码
        lang_cn: '', //中文语言
        lang_en: '', //英文语言
        file_name: '', //模块名称
        file_ext: '', //文件类型
        id: '', //语言ID，编辑时必填
        is_generate: ''
      },
      rules: {
        lang_code: [{ required: true, message: '请输入语言代码', trigger: 'blur' }],
        file_name: [{ required: true, message: '请选择所属模块', trigger: 'change' }],
        lang_cn: [{ required: true, message: '请输入中文名称', trigger: 'blur' }],
        lang_en: [{ required: true, message: '请输入英文名称', trigger: 'blur' }],
        file_ext: [{ required: true, message: '请选择文件类型', trigger: 'change' }]
      },
      parentCode: [],
      langLoading: false
    };
  },
  watch: {
    langId(newVal) {
      if (newVal !== '') {
        this.ruleForm = Object.assign(this.ruleForm, this.langDetail);
        this.ruleForm.id = newVal;
      } else {
        this.ruleForm.id = '';
      }
    }
  },
  methods: {
    changeGroupExt(e) {
      this.$emit('changeGroupExt', e);
    },
    async saveLang() {
      this.langLoading = true;
      try {
        let { message } = await saveLang(this.ruleForm);
        this._message(message, 'success');
        this.$refs.ruleForm.resetFields();
        this.$emit('addOk');
        this.handleClose();
      } catch (error) {
        this._message(error);
      }
      this.langLoading = false;
    },
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.saveLang();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleClose() {
      for (let i in this.ruleForm) {
        this.ruleForm[i] = '';
      }
      this.$refs.ruleForm.resetFields();
      this.$emit('closeVisible', false);
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
  margin-top: 50px;
}
</style>
