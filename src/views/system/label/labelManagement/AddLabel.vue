<template>
  <div>
    <el-dialog title="新增标签模板" :visible.sync="labelVisible" width="600px" :before-close="handleClose">
      <div>
        <el-form :model="ruleForm" size="small" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-loading="formLoading">
          <el-form-item label="模板编码" prop="template_code">
            <el-input v-model="ruleForm.template_code"></el-input>
          </el-form-item>
          <el-form-item label="模板名称" prop="template_name">
            <el-input v-model="ruleForm.template_name"></el-input>
          </el-form-item>
          <el-form-item label="模板类型" prop="template_type">
            <el-select v-model="ruleForm.template_type" placeholder="请选择">
              <el-option v-for="(item,index) in lableTypeList" :key="index" :label="item.type_name" :value="item.type_index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="规格尺寸" prop="name">
            <div>
              <el-radio v-model="selectTem" label="1">标准模板</el-radio>
              <el-radio v-model="selectTem" label="2">自定义</el-radio>
            </div>
            <div v-show="selectTem == '1'">
              <el-radio-group v-model="iptVal" @change="handlechangeIpt" v-for="(item,index) in specificationList" :key="index">
                <el-radio :label="item.id">{{item.type}} {{item.wight}}{{item.unit}}*{{item.height}}{{item.unit}}</el-radio>
              </el-radio-group>&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <div v-show="selectTem == '2'">
              <el-row>
                <el-col :span="11">
                  <el-input v-model="ruleForm.template_width">
                    <template slot="prepend">长度</template>
                    <el-button slot="append">mm</el-button>
                  </el-input>
                </el-col>
                <el-col :span="11" :offset="1">
                  <el-input v-model="ruleForm.template_height">
                    <template slot="prepend">宽度</template>
                    <el-button slot="append">mm</el-button>
                  </el-input>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-footer">
        <el-button size="mini" @click="handleClose">关闭</el-button>
        <el-button size="mini" type="primary" @click="toLabelSet">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addTemplate } from '@/api/develop';
export default {
  props: {
    labelVisible: {
      type: Boolean,
      default: false
    },
    lableTypeList: [Array]
  },
  data() {
    return {
      selectTem: '1',
      iptVal: '',
      ruleForm: {
        template_code: '', //模板编码
        template_name: '', //模板名称
        template_type: '', //模板类型
        template_width: '', //模板宽度
        template_height: '' //模板高度
      },
      rules: {
        template_code: [{ required: true, message: '请填写模板编码', trigger: 'blur' }],
        template_name: [{ required: true, message: '请填写模板名称', trigger: 'blur' }],
        template_type: [{ required: true, message: '请选择模板类型', trigger: 'change' }]
      },
      specificationList: [
        {
          id: '1',
          wight: '100',
          height: '100',
          unit: 'mm',
          type: ''
        },
        {
          id: '2',
          wight: '100',
          height: '150',
          unit: 'mm',
          type: ''
        },
        {
          id: '3',
          wight: '70',
          height: '30',
          unit: 'mm',
          type: ''
        },
        {
          id: '4',
          wight: '50',
          height: '30',
          unit: 'mm',
          type: ''
        },
        {
          id: '5',
          wight: '210',
          height: '297',
          unit: 'mm',
          type: 'A4'
        }
      ],
      formLoading: false
    };
  },
  watch: {
    selectTem(newVal) {
      if (newVal == '1') {
        this.ruleForm.template_width = '';
        this.ruleForm.template_height = '';
      } else if (newVal == '2') {
        this.iptVal = '';
      }
    }
  },
  methods: {
    toLabelSet() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.ruleForm.template_width == '' || this.ruleForm.template_height == '') {
            this._message('请填写宽高', 'warning');
            return;
          }
          this.addTemplate();
        } else {
          return false;
        }
      });
    },
    async addTemplate() {
      this.formLoading = true;
      try {
        let { data } = await addTemplate(this.ruleForm);
        this.$router.push({
          path: '/system/label/label-list',
          query: this.ruleForm
        });
        this.handleClose();
      } catch (error) {
        this._message(error);
      }
      this.formLoading = false;
    },

    handlechangeIpt(e) {
      let item = this.specificationList.filter(el => el.id == e);
      this.ruleForm.template_width = item[0].wight;
      this.ruleForm.template_height = item[0].height;
    },
    handleClose() {
      this.$refs.ruleForm.resetFields();
      this.$emit('update:labelVisible', false);
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-radio-group {
  margin-right: 30px;
}
</style>
