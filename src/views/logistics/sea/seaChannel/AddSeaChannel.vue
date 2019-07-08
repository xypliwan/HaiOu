<template>
  <div>
    <el-dialog :title="channelTitle" :visible.sync="channelVisible" width="850px" :before-close="handleClose">
      <div>
        <el-form size="small" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-loading="formLoading">
          <el-row>
            <el-col :span="11">
              <el-form-item label="渠道代码" prop="cc_code">
                <el-input v-model="ruleForm.cc_code" placeholder="请输入渠道代码" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-col :span="12">
                <el-form-item label="是否可用" prop="cc_status" required>
                  <el-switch v-model="ruleForm.cc_status" active-color="#13a468" inactive-color="#cccccc" active-value="1" inactive-value="2"></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="官网显示" prop="is_web_show" required>
                  <el-switch v-model="ruleForm.is_web_show" active-color="#13a468" inactive-color="#cccccc" active-value="1" inactive-value="0"></el-switch>
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item label="中文名称" prop="cc_name">
                <el-input v-model="ruleForm.cc_name" placeholder="请输入中文名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="英文名称" prop="cc_name_en">
                <el-input v-model="ruleForm.cc_name_en" placeholder="请输入英文名称" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item label="时效" required>
                <el-col :span="8">
                  <el-form-item prop="cc_delivery_time_min">
                    <el-input v-model="ruleForm.cc_delivery_time_min" placeholder="开始时效"></el-input>
                  </el-form-item>
                </el-col>
                <el-col class="line" :span="4">至</el-col>
                <el-col :span="8">
                  <el-form-item prop="cc_delivery_time_max">
                    <el-input v-model="ruleForm.cc_delivery_time_max" placeholder="结束时效"></el-input>
                  </el-form-item>
                </el-col>
                <el-col class="line" :span="4">天</el-col>
              </el-form-item>
            </el-col>

            <el-col :span="11" :offset="1">
              <el-form-item label="计算单位" prop="cc_weight_unit">
                <el-select v-model="ruleForm.cc_weight_unit" placeholder="请选择计算单位">
                  <el-option :label="item.label" :value="item.key" v-for="(item,index) in unitList" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item label="是否可跟踪" prop="cc_track_status">
                <el-switch v-model="ruleForm.cc_track_status" active-color="#13a468" inactive-color="#cccccc" active-value="N" inactive-value="Y"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="排序">
                <el-input v-model="ruleForm.cc_sort" placeholder="请输入排序关键词"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="23">
              <el-form-item label="备注">
                <el-input type="textarea" v-model="ruleForm.cc_note"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="dialog-footer">
        <el-button size="mini" @click="handleClose">关闭</el-button>
        <el-button size="mini" type="primary" @click="saveSubmit">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { editSeaChannel, getContainerChannelDetail } from '@/api/logistics';
export default {
  props: {
    channelVisible: {
      type: Boolean,
      default: false
    },
    unitList: {
      type: Array,
      default: () => []
    },
    flg: {
      //1新增   2编辑
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      channelTitle: '新增海运渠道',
      ruleForm: {
        cc_id: '', //渠道ID（编辑必填）
        cc_code: '', //渠道代码
        cc_name: '', //渠道名称
        cc_name_en: '', //渠道英文名称
        cc_short_name: '', //渠道简称
        cc_track_status: '', //是否可跟踪（N：否，Y：是）
        cc_status: '', //状态：1=可用 2=停用
        cc_delivery_time_min: '', //货运时效（小）
        cc_delivery_time_max: '', //货运时效（大）
        is_web_show: '', //是否官网显示 0=否 1=是
        cc_weight_unit: '', //计算单位：w(重量 KG),v(体积 立方米)
        cc_sort: '', //排序序号
        cc_note: '' //备注
      },
      rules: {
        cc_code: [{ required: true, message: '请输入渠道代码', trigger: 'blur' }],
        cc_name: [{ required: true, message: '请输入中文名称', trigger: 'blur' }],
        cc_name_en: [{ required: true, message: '请输入英文名称', trigger: 'blur' }],
        cc_delivery_time_min: [{ required: true, message: '请输入开始时效', trigger: 'blur' }],
        cc_delivery_time_max: [{ required: true, message: '请输入结束时效', trigger: 'blur' }],
        cc_weight_unit: [{ required: true, message: '请选择计算单位', trigger: 'change' }]
      },
      formLoading: false
    };
  },
  watch: {
    flg(newVal) {
      switch (newVal) {
        case '1':
          this.ruleForm.cc_id = '';
          break;

        case '2':
          this.getContainerChannelDetail(this.id);
          break;
      }
    }
  },
  methods: {
    async getContainerChannelDetail(id) {
      this.formLoading = true;
      try {
        let { data } = await getContainerChannelDetail({ cc_id: id });
        Object.assign(this.ruleForm, data);
      } catch (error) {
        this._message(error);
      }
      this.formLoading = false;
    },
    saveSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          switch (this.flg) {
            case '1': //新增
              this.ruleForm.cc_id = '';
              this.editSeaChannel();
              break;

            case '2': //编辑
              this.editSeaChannel();
              break;
          }
        } else {
          return false;
        }
      });
    },
    async editSeaChannel() {
      this.formLoading = true;
      try {
        let { message } = await editSeaChannel(this.ruleForm);
        this._message(message, 'success');
        this.$emit('saveOk');
        this.handleClose();
      } catch (error) {
        this._message(error);
      }
      this.formLoading = false;
    },
    handleClose() {
      this.ruleForm.cc_note = '';
      this.ruleForm.cc_sort = '';
      this.$refs.ruleForm.resetFields();
      this.$emit('update:channelVisible', false);
    }
  }
};
</script>

<style lang="scss" scoped>
.line {
  text-align: center;
}
</style>
