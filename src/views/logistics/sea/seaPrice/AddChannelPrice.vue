<template>
  <div>
    <el-dialog title="添加渠道价格" :visible.sync="priceVisible" width="850px" :before-close="handleClose">
      <div>
        <el-form size="small" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-loading="formLoading">
          <el-row>
            <el-col :span="11">
              <el-form-item label="派送渠道" prop="cc_id">
                <el-select v-model="ruleForm.cc_id" filterable clearable placeholder="请选择渠道">
                  <el-option :label="`[ ${item.cc_code} ] ${item.cc_name}`" :value="item.cc_id" v-for="(item,index) in channelList" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="服务商" prop="sp_id">
                <el-select v-model="ruleForm.sp_id" placeholder="请选择服务商">
                  <el-option :label="item.sp_name" :value="item.sp_id" v-for="(item,index) in serviceProviderList" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="班期" prop="schedule_arr">
            <el-checkbox-group v-model="ruleForm.schedule_arr">
              <el-checkbox :label="item.key" v-for="(item,index) in scheduleList" :key="index">{{item.value}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-row>
            <el-col :span="11">
              <el-form-item label="始发地" prop="origin_id">
                <el-select v-model="ruleForm.origin_id" placeholder="请选择始发地">
                  <el-option :label="item.name" :value="item.id" v-for="(item,index) in originList" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="目的地" prop="sd_id">
                <el-select v-model="ruleForm.sd_id" placeholder="请选择目的地">
                  <el-option :label="item.name" :value="item.id" v-for="(item,index) in destinationList" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item label="有效期" prop="time">
                <el-date-picker
                  size="mini"
                  class="item"
                  @change="handeleChangeTime"
                  v-model="ruleForm.time"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  type="daterange"
                  range-separator="-"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="币种" prop="currency_code">
                <el-select v-model="ruleForm.currency_code" placeholder="请选择币种">
                  <el-option :label="item.label" :value="item.key" v-for="(item,index) in currencyList" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="货柜价格">
            <el-row>
              <el-col>
                <template v-for="(item,index) in ruleForm.container_value_arr">
                  <el-col :span="11" :key="index" :offset="index % 2 == 0 ? 0 : 1">
                    <el-input placeholder="请输入价格" v-model="item.val" style="margin-bottom:15px;">
                      <template slot="prepend">{{item.name}}</template>
                    </el-input>
                  </el-col>
                </template>
              </el-col>
              <el-col>
                <p class="tip" v-show="priceShow">请把货柜价格填写完整</p>
              </el-col>
            </el-row>
          </el-form-item>
          <el-row>
            <el-col :span="11">
              <el-form-item label="状态" prop="container_status">
                <el-select v-model="ruleForm.container_status" placeholder="请选择状态">
                  <el-option v-if="index !== 0" :label="item.status_name" :value="item.status_index" v-for="(item,index) in statusList" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="物流承运商">
                <el-select v-model="ruleForm.carrier_id" placeholder="请选择目的地">
                  <el-option :label="item.name" :value="item.id" v-for="(item,index) in logisticsCarrierList" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="备注">
                <el-input type="textarea" v-model="ruleForm.container_note"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="dialog-footer">
        <el-button size="mini" @click="handleClose">关闭</el-button>
        <el-button size="mini" type="primary" @click="submit">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { saveContainerPrice, getContainerDetail } from '@/api/logistics';
export default {
  props: {
    priceVisible: {
      type: Boolean,
      default: false
    },
    channelList: {
      //渠道列表
      type: Array,
      default: () => []
    },
    originList: {
      //始发地
      type: Array,
      default: () => []
    },
    destinationList: {
      //目的地
      type: Array,
      default: () => []
    },
    currencyList: {
      //币种列表
      type: Array,
      default: () => []
    },
    channelType: {
      //货柜类型
      type: Array,
      default: () => []
    },
    serviceProviderList: {
      //服务商
      type: Array,
      default: () => []
    },
    flg: {
      type: String,
      default: ''
    },
    containerId: {
      type: String,
      default: ''
    },
    statusList: {
      //状态
      type: Array,
      default: () => []
    },
    logisticsCarrierList: {
      //物流承运商
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      scheduleList: [
        { value: '周一', key: '1' },
        { value: '周二', key: '2' },
        { value: '周三', key: '3' },
        { value: '周四', key: '4' },
        { value: '周五', key: '5' },
        { value: '周六', key: '6' },
        { value: '周日', key: '7' }
      ],
      value1: [],
      input1: '',
      ruleForm: {
        container_id: '', //渠道价格ID（编辑必填）
        cc_id: '', //渠道ID
        sp_id: '', //服务商ID
        origin_id: '', //起运地ID
        sd_id: '', //目的地ID
        cp_begin_date: '', //开始生效日期
        cp_end_date: '', //失效日期
        currency_code: '', //币种
        container_note: '', //备注
        schedule_arr: [], //排期集合(数组)
        time: [],
        container_value_arr: [], //货柜价格
        carrier_id: '', //物流承运商
        container_status: '' //状态
      },
      rules: {
        cc_id: [{ required: true, message: '请选择渠道', trigger: 'change' }],
        sp_id: [{ required: true, message: '请选择服务商', trigger: 'change' }],
        schedule_arr: [{ type: 'array', required: true, message: '至少选择一个班期', trigger: 'change' }],
        origin_id: [{ required: true, message: '请选择始发地', trigger: 'change' }],
        sd_id: [{ required: true, message: '请选择目的地', trigger: 'change' }],
        time: [{ required: true, message: '请选择有效期', trigger: 'change' }],
        currency_code: [{ required: true, message: '请选择币种', trigger: 'change' }],
        container_value_arr: [{ required: true, message: '请把货柜价格填写完整', trigger: 'blur' }],
        container_status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      formLoading: false,
      priceShow: false
    };
  },
  watch: {
    priceVisible(newVal) {
      if (newVal) {
        this.formLoading = true;
        this.ruleForm.container_value_arr = [];
        this.channelType.forEach(el => {
          this.ruleForm.container_value_arr.push({
            name: el.ct_name,
            val: ''
          });
        });
        this.formLoading = false;

        switch (this.flg) {
          case '1': //新增
            this.ruleForm.container_id = '';
            break;

          case '2': //编辑
            this.getContainerDetail(this.containerId);
            break;
        }
      }
    }
  },
  methods: {
    async getContainerDetail(id) {
      //获取详情
      this.formLoading = true;
      try {
        let { data } = await getContainerDetail({ container_id: id });
        Object.assign(this.ruleForm, data.container_price);
        this.ruleForm.container_value_arr = data.container_value_arr;
        this.ruleForm.schedule_arr = data.schedule_arr;
        this.ruleForm.time.push(data.container_price.cp_begin_date.split(' ')[0]);
        this.ruleForm.time.push(data.container_price.cp_end_date.split(' ')[0]);
      } catch (error) {
        this._message(error);
      }
      this.formLoading = false;
    },
    submit() {
      this.$refs.ruleForm.validate(valid => {
        this.priceShow = this.vilidatePrice() ? true : false;
        if (valid) {
          if (this.vilidatePrice()) {
            this.priceShow = true;
            return;
          }
          this.priceShow = false;
          switch (this.flg) {
            case '1': //新增
              this.ruleForm.container_id = '';
              this.saveContainerPrice();
              break;

            case '2': //编辑
              this.saveContainerPrice();
              break;
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    vilidatePrice() {
      let snapArr = [];
      this.ruleForm.container_value_arr.forEach(el => {
        if (el.val.length <= 0) {
          snapArr.push('false');
        }
      });
      return snapArr.includes('false');
    },
    async saveContainerPrice() {
      //新增/编辑价格
      this.formLoading = true;
      try {
        let { message } = await saveContainerPrice(this.ruleForm);
        this._message(message, 'success');
        this.$emit('saveOk');
        this.handleClose();
      } catch (error) {
        this._message(error);
      }
      this.formLoading = false;
    },
    handeleChangeTime(time) {
      if (time == null || time == '') {
        this.ruleForm.cp_begin_date = '';
        this.ruleForm.cp_end_date = '';
      } else {
        this.ruleForm.cp_begin_date = time[0];
        this.ruleForm.cp_end_date = time[1];
      }
    },
    reset() {},
    handleClose() {
      this.ruleForm.container_note = '';
      this.priceShow = false;
      this.$refs.ruleForm.resetFields();
      this.$emit('update:priceVisible', false);
    }
  }
};
</script>

<style lang="scss" scoped>
.tip {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
}
</style>
