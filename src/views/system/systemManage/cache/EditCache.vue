<template>
  <div>
    <el-dialog :title="detailTitle" :visible.sync="cacheVisible" width="800px" :before-close="handleClose">
      <div>
        <el-form :model="ruleForm" size="small" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-loading="formLoading">
          <el-row>
            <el-col :span="11">
              <el-form-item label="类型" prop="c_type">
                <el-select class="item" v-model="ruleForm.c_type" filterable placeholder="请选择">
                  <el-option v-for="(item,index) in cacheType" :key="index" :label="item.type_name" :value="item.type_index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="应用名称" prop="c_name">
                <el-input v-model="ruleForm.c_name" placeholder="请输入应用名称" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item label="应用代码" prop="c_app">
                <el-input v-model="ruleForm.c_app" placeholder="请输入应用代码" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="有效期" prop="c_validity_period">
                <el-input v-model="ruleForm.c_validity_period" placeholder type="number" clearable>
                  <template slot="append">分钟</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="是否启用" prop="c_status">
                <el-switch v-model="ruleForm.c_status" active-color="#13a468" inactive-color="#cccccc" active-value="1" inactive-value="0"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="备注" prop="c_note">
                <el-input type="textarea" placeholder="请输入内容" v-model="ruleForm.c_note" maxlength="200" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="dialog-footer">
        <el-button size="mini" @click="handleClose">关闭</el-button>
        <el-button size="mini" type="primary" @click="submitSave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { saveCache, getCacheDetail } from '@/api/system';
export default {
  props: {
    cacheVisible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    },
    flg: {
      type: String,
      default: ''
    },
    cacheType: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      options: [],
      detailTitle: '新增缓存管理',
      ruleForm: {
        c_id: '', //缓存id
        c_type: '', //类型
        c_app: '', //应用代码
        c_name: '', //应用名称
        c_status: '0', //状态 1=启用 0=停用
        c_validity_period: '', //有效期（分钟）
        c_note: '' //备注
      },
      rules: {
        c_type: [{ required: true, message: '请选择缓存类型', trigger: 'change' }],
        c_name: [{ required: true, message: '请输入应用名称', trigger: 'blur' }],
        c_app: [{ required: true, message: '请输入应用代码', trigger: 'blur' }],
        c_validity_period: [{ required: true, message: '请输入有效时间', trigger: 'blur' }]
      },
      formLoading: false
    };
  },
  watch: {
    cacheVisible() {
      switch (this.flg) {
        case '1': //新增
          this.detailTitle = '新增缓存管理';
          this.ruleForm.c_id = '';
          break;

        case '2': //查看
          break;
        case '3': //编辑
          this.detailTitle = '编辑缓存管理';
          this.getCacheDetail(this.id);
          break;
      }
    }
  },
  methods: {
    async getCacheDetail(id) {
      this.formLoading = true;
      try {
        let { data } = await getCacheDetail({ c_id: id });
        Object.assign(this.ruleForm, data);
      } catch (error) {
        this._message(error);
      }
      this.formLoading = false;
    },
    async saveCache() {
      this.formLoading = true;
      try {
        let { message } = await saveCache(this.ruleForm);
        this._message(message, 'success');
        this.handleClose();
        this.$emit('saveOk');
      } catch (error) {
        this._message(error);
      }
      this.formLoading = false;
    },
    submitSave() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          switch (this.flg) {
            case '1': //新增
              this.ruleForm.c_id = '';
              this.saveCache();
              break;

            case '2': //查看
              break;
            case '3': //编辑
              this.saveCache();
              break;
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleClose() {
      this.$refs.ruleForm.resetFields();
      this.$emit('update:cacheVisible', false);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

