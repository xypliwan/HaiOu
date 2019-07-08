<template>
  <div class="detail-box">
    <titles titles="基本信息"></titles>
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="140px" v-loading="formLoading">
      <el-row>
        <el-col :span="11">
          <el-form-item label="渠道代码">
            <div class="label-val">{{form.sc_code}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="中文名称">
            <div class="label-val">{{form.sc_name}}</div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="英文名称">
            <div class="label-val">{{form.sc_name_en}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="显示简码">
            <div class="label-val">{{form.sc_short_name}}</div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="服务商">
            <div class="label-val">{{getMappingVal(serviceProviderList,'sp_id',form.sp_id,'sp_name')}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="API服务商产品代码">
            <div class="label-val">{{form.api_channel_code}}</div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="运输类型">
            <div class="label-val">{{form.channel_type}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="是否开启API同步">
            <div class="label-val">{{form.sc_is_api_sync == '0' ? '不开启' : '开启'}}</div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="计算单位">
            <div class="label-val">{{getMappingVal(calUnitList,'key',form.sc_weight_unit,'label')}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="是否可跟踪">
            <div class="label-val">{{form.sc_track_status == 'N' ? '否' : '是'}}</div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="产品组">
            <div class="label-val">{{getMappingVal(channelGroupList,'scg_code',form.sc_group_code,'scg_name')}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="平均时效(天)">
            <div class="label-val">{{form.sc_delivery_time_avg}}</div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="状态">
            <div class="label-val">{{getMappingVal(statusList, 'status_index',form.sc_status,'status_name') }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="物流承运商">
            <div class="label-val">{{getMappingVal(serviceCarrierList,'carrier_id',form.carrier_id,'carrier_name')}}</div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="货运最佳时效(天)">
            <div class="label-val">{{form.sc_delivery_time_min}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="货运最低时效(天)">
            <div class="label-val">{{form.sc_delivery_time_max}}</div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row style="margin-bottom:50px;">
        <el-col :span="11">
          <el-form-item label="是否官网显示">
            <div class="label-val">{{form.is_web_show == '0' ? '不显示' : '显示'}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="备注">
            <div class="label-val">{{form.sc_note}}</div>
          </el-form-item>
        </el-col>
      </el-row>

      <titles titles="其它信息(可编辑)"></titles>
      <el-row>
        <el-col :span="11">
          <el-form-item label="排序序号" prop="sc_sort">
            <el-input v-if="isEdit" v-model="form.sc_sort" type="number" clearable></el-input>
            <div v-else class="label-val">{{form.sc_sort}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="累计订单成交量" prop="sca_order_total">
            <el-input v-if="isEdit" v-model="form.sca_order_total" type="number" clearable></el-input>
            <div v-else class="label-val">{{form.sca_order_total}}</div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="排名" prop="sca_ranking">
            <el-input v-if="isEdit" v-model="form.sca_ranking" type="number" clearable></el-input>
            <div v-else class="label-val">{{form.sca_ranking}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="上线日期" prop="sca_online_date">
            <el-date-picker v-if="isEdit" v-model="form.sca_online_date" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
            <div v-else class="label-val">{{form.sca_online_date}}</div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="平均准点率" prop="sca_avg_punctuality_rate">
            <el-input v-if="isEdit" v-model="form.sca_avg_punctuality_rate" type="number" clearable></el-input>
            <div v-else class="label-val">{{form.sca_avg_punctuality_rate}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="热门推荐" prop="is_web_hot">
            <el-switch v-if="isEdit" v-model="form.is_web_hot" active-color="#13a468" inactive-color="#cccccc" active-value="1" inactive-value="0"></el-switch>
            <div v-else class="label-val">{{form.is_web_hot == '0' ? '否' : '是'}}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="23">
          <el-form-item label="描述">
            <el-input v-if="isEdit" v-model="form.sca_note" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
            <div v-else class="label-val" style="height:auto;word-wrap:break-word">{{form.sca_note}}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="班期" prop="schedule_arr">
            <el-checkbox-group :disabled="!isEdit" v-model="form.schedule_arr">
              <el-checkbox v-for="(item,index) in whichDay" :key="index" :label="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item>
            <el-button plain @click="editData">{{editText}}</el-button>
            <el-button type="primary" v-show="isEdit" @click="submitData">保存修改</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import Titles from '_c/common/Titles';
import { getLogisticsChannelDetail, saveServiceChannel } from '@/api/logistics';
export default {
  props: {
    scCode: {
      type: String,
      default: ''
    },
    logisticsCarrierList: {
      //服务商
      type: Array,
      default: () => []
    },
    statusList: {
      //状态列表
      type: Array,
      default: () => []
    },
    weightTemplateList: {
      //重量段列表
      type: Array,
      default: () => []
    },
    whichDay: {
      //班期
      type: Array,
      default: () => []
    },
    calUnitList: {
      //计算单位
      type: Array,
      default: () => []
    },
    channelGroupList: {
      //产品组
      type: Array,
      default: () => []
    },
    serviceProviderList: [Array], //服务商列表
    serviceCarrierList: [Array] //物流承运商列表
  },
  data() {
    return {
      form: {
        wt_id: '', //重量段
        sc_vol_rate: '', //体积系数
        schedule_arr: [], //班期
        sc_sort: '', //排序序号
        sca_ranking: '', //排名
        sca_order_total: '', //累计订单成交量
        sca_avg_punctuality_rate: '', //平均准点率
        is_web_hot: '0', //热门推荐
        sca_online_date: '', //上线日期
        sca_note: '' //描述
      },
      formLoading: false,
      isEdit: false,
      editText: '修改',
      rules: {
        wt_id: [{ required: true, message: '请选择重量段', trigger: 'change' }],
        schedule_arr: [{ type: 'array', required: true, message: '请选择班期', trigger: 'change' }],
        sc_vol_rate: [{ required: true, message: '请输入体积系数', trigger: 'blur' }],
        sc_sort: [{ required: true, message: '请输入排序序号', trigger: 'blur' }],
        sca_order_total: [{ required: true, message: '请输入排序序号', trigger: 'blur' }],
        sca_avg_punctuality_rate: [{ required: true, message: '请输入平均准点率', trigger: 'blur' }],
        sca_online_date: [{ required: true, message: '请输入上线日期', trigger: 'change' }],
        sca_ranking: [{ required: true, message: '请输入排名', trigger: 'blur' }]
      }
    };
  },
  watch: {
    scCode(newVal) {
      this.isEdit = false;
      this.editText = this.isEdit ? '取消修改' : '修改';
      this.getLogisticsChannelDetail(newVal);
    }
  },
  methods: {
    submitData() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.saveServiceChannel();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    async saveServiceChannel() {
      this.formLoading = true;
      let params = {
        sc_code: this.form.sc_code,
        wt_id: this.form.wt_id,
        sc_vol_rate: this.form.sc_vol_rate,
        sc_sort: this.form.sc_sort,
        schedule_arr: this.form.schedule_arr,
        sca_ranking: this.form.sca_ranking,
        sca_order_total: this.form.sca_order_total,
        sca_avg_punctuality_rate: this.form.sca_avg_punctuality_rate,
        is_web_hot: this.form.is_web_hot,
        sca_online_date: this.form.sca_online_date,
        sca_note: this.form.sca_note
      };
      try {
        let { message } = await saveServiceChannel(params);
        this._message(message, 'success');
        this.getLogisticsChannelDetail(this.scCode);
        this.$emit('saveOk');
      } catch (error) {
        this._message(error);
      }
      this.formLoading = false;
    },
    editData() {
      this.isEdit = !this.isEdit;
      this.editText = this.isEdit ? '取消修改' : '修改';
    },
    async getLogisticsChannelDetail(code) {
      this.formLoading = true;
      try {
        let { data } = await getLogisticsChannelDetail({ sc_code: code });
        this.form.schedule_arr = [];
        Object.assign(this.form, data);
      } catch (error) {
        this._message(error);
      }
      this.formLoading = false;
    }
  },
  components: {
    Titles
  }
};
</script>

<style lang="scss" scoped>
.label-val {
  background: #f0f4f3;
  color: #333;
  padding: 0 10px;
  border-radius: 3px;
  min-height: 32px;
}
.detail-box {
  padding: 0 20px;
}
</style>
