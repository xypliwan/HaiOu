<template>
  <div>
    <el-dialog title="下载语言包文件" :visible.sync="downloadVisible" width="700px" :before-close="handleClose">
      <div>
        <el-form :model="ruleForm" size="mini" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-col :span="11">
            <el-form-item label="文件类型" prop="group_ext">
              <el-radio v-model="ruleForm.group_ext" label="js" @change="handleGroupExt">JS</el-radio>
              <el-radio v-model="ruleForm.group_ext" label="php" @change="handleGroupExt">PHP</el-radio>
            </el-form-item>
          </el-col>

          <el-col :span="11" :offset="1">
            <el-form-item label="所属模块">
              <el-select v-model="ruleForm.group_name" clearable filterable :disabled="ruleForm.group_ext == 'js'" placeholder="请选择所属模块">
                <el-option :label="item.value" :value="item.key" v-for="(item,index) in langGroupList" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <div class="download-footer">
        <el-button size="mini" @click="handleClose">关 闭</el-button>
        <el-button size="mini" @click="submitForm" type="primary">下 载</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { downLang } from '@/api/develop';
export default {
  props: {
    downloadVisible: {
      type: Boolean,
      default: false
    },
    langGroupList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      ruleForm: {
        group_ext: '',
        group_name: ''
      },
      rules: {
        group_ext: [{ required: true, message: '请选择文件类型', trigger: 'change' }]
      }
    };
  },
  methods: {
    async downloadGenerate() {
      try {
        let datas = await downLang(this.ruleForm);
        if (this.ruleForm.group_ext == 'js') {
          window.open(datas.down_url, '_blank');
        } else if (this.ruleForm.group_ext == 'php') {
          this._message(`${datas.length}条数据: ${datas.join('、')} 保存成功`, 'success');
        }
      } catch (error) {
        this._message(error);
      }
    },
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.ruleForm.group_ext == 'php' && (this.ruleForm.group_name == '' || this.ruleForm.group_name == null)) {
            this._message('请选择所属模块', 'warning');
            return;
          }
          this.downloadGenerate();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleGroupExt(e) {
      if (e == 'js') {
        this.ruleForm.group_name = '';
      }
    },
    handleClose() {
      this.$emit('update:downloadVisible', false);
    }
  }
};
</script>

<style lang="scss" scoped>
.download-footer {
  text-align: center;
  margin-top: 50px;
}
</style>

