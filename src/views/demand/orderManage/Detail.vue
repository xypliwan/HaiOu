<template>
  <div>
    <div class="detail-box" v-loading="detailLoading" element-loading-text="loading" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255,255,255,0)">
      <div class="item">
        <div class="demand-title">派送渠道</div>
        <div class="answer">
          <span>渠道代码 {{params.sc_code}}</span>
          <span class="fr">渠道名称 {{getMappingVal(channelList,'sc_code',params.sc_code,'sc_name')}}</span>
        </div>
        <div class="demand-title">更新时间</div>
        <div class="answer">{{params.updated_time}}</div>
        <div class="demand-title">跟进客服</div>
        <div class="answer">{{params.service_user || '暂无'}}</div>
        <div class="demand-title">目的国家 / 邮编</div>
        <div class="answer">国家 {{getMappingVal(countryList,'country_code',params.country_code,'country_name')}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 邮编 {{params.zip_code}}</div>
        <div class="demand-title">货物类型</div>
        <div class="answer">{{getMappingVal(goodsStyleTypeList,'type_index',params.goods_style,'type_name') }}</div>
        <div class="demand-title">货物重量(KG) / 货物体积(CBM)</div>
        <div class="answer">重量 {{params.goods_weight}} KG &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 体积 {{params.goods_volume}} CBM</div>
        <div class="demand-title">发货周期</div>
        <div class="answer">{{getMappingVal(deliveryCycleList,'key',params.demand_cycle,'label') }}</div>
        <div class="demand-title">其他要求</div>
        <div class="answer">{{params.demand_note}}</div>
      </div>
      <div class="item">
        <div class="item-title">
          <el-steps :active="activeStatus" :finish-status="finishStatus" simple>
            <el-step title="等待处理"></el-step>
            <el-step title="正在处理"></el-step>
            <el-step title="待您反馈"></el-step>
            <el-step title="已完成"></el-step>
            <el-step title="作废" :status="zfStatus"></el-step>
          </el-steps>
        </div>

        <div class="history-cont" ref="historyContBox">
          <div v-for="(item,index) in demandLog" :key="index" class="cont-wrapper">
            <div class="block-wrapper" :class="{'left':item.operate_site == '1','right':item.operate_site == '2'}">
              <p class="cont-name">
                {{item.operate_user}} &nbsp;&nbsp;
                {{item.operate_time}}
              </p>

              <p class="cont-text">{{item.operate_content}}</p>
            </div>
          </div>
        </div>
        <div class="reply" v-show="params.demand_status == '1' || params.demand_status == '2' || params.demand_status == '3'">
          <div class="reply-ipt">
            <el-input type="textarea" @keyup.enter.native="demandReply" :autosize="{ minRows: 2, maxRows:4}" placeholder="请输入您想说的话" v-model="replyContent"></el-input>
          </div>
          <div class="send-btn">
            <el-button type="primary" size="small" :disabled="replyContent.length<=0" @click="demandReply">发送</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { demandDetail, demandReply } from '@/api/demand';
export default {
  props: {
    companyCode: {
      type: String,
      default: ''
    },
    demandNumber: {
      type: String,
      default: ''
    },
    statusList: {
      //状态统计
      type: Array,
      default: () => []
    },
    channelList: {
      //销售产品
      type: Array,
      default: () => []
    },
    countryList: {
      //国家列表
      type: Array,
      default: () => []
    },
    goodsStyleTypeList: {
      //货物类型
      type: Array,
      default: () => []
    },
    deliveryCycleList: {
      //发货周期
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      detailLoading: false,

      finishStatus: 'process',
      zfStatus: '',

      replyContent: '',

      demandLog: [], //沟通日志
      activeStatus: null,
      params: {
        demand_id: '', //需求id
        demand_number: '', //需求编号
        company_code: '', //所属公司
        sc_code: '', //销售产品
        country_code: '', //目的国家
        zip_code: '', //邮编
        demand_status: '', //需求状态
        goods_style: '', //货物类型
        goods_weight: '', //货物重量
        goods_volume: '', //货物体积
        demand_cycle: '', //发货周期
        demand_note: '', //其他要求
        service_user: '', //跟进客服
        updated_user: '', //更新人
        created_time: '', //创建时间
        updated_time: '' //更新时间
      }
    };
  },
  created() {},
  watch: {
    demandNumber(newVal) {
      if (newVal) {
        let params = {
          company_code: this.companyCode,
          demand_number: this.demandNumber
        };
        this.demandDetail(params);
      }
    }
  },
  methods: {
    async demandReply() {
      this.detailLoading = true;
      let parasm = {
        demand_number: this.params.demand_number,
        reply_content: this.replyContent
      };
      try {
        let { message } = await demandReply(parasm);
        this._message(message, 'success');
        this.replyContent = '';
        this.demandDetail({ company_code: this.companyCode, demand_number: this.demandNumber });
      } catch (error) {
        this._message(error);
      }
      this.detailLoading = false;
    },
    async demandDetail(params) {
      //获取详情
      this.detailLoading = true;
      try {
        let { data } = await demandDetail(params);
        Object.assign(this.params, data.demand);
        this.demandLog = data.demand_log;
        this.activeStatus = Number(this.params.demand_status);
        if (this.params.demand_status == '0') {
          this.activeStatus = 5;
          this.finishStatus = 'success';
          this.zfStatus = 'error';
        } else {
          this.finishStatus = 'success';
          this.zfStatus = '';
        }
        this.$nextTick(() => {
          this.$refs.historyContBox.scrollTop = this.$refs.historyContBox.scrollHeight;
        });
      } catch (error) {
        this._message(error);
      }
      this.detailLoading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '_a/styles/global.scss';
.detail-box {
  display: flex;
  min-width: 1000px;
  .item {
    flex: 1;
    height: calc(100vh - 105px);
    overflow-y: auto;
    @include scrollBar;
    padding: 0 20px;
    .item-title {
      margin-bottom: 10px;
      /deep/ .el-step__title {
        font-size: 12px;
      }
      /deep/ .el-steps--simple {
        padding: 10px 10px;
      }
    }
    .demand-title {
      color: #666;
      font-size: 15px;
    }
    .answer {
      color: #333;
      font-size: 17px;
      margin-top: 15px;
      margin-bottom: 30px;
      padding: 10px 0;
      border-bottom: 1px solid #f0f4f3;
    }
    .history-cont {
      height: calc(100vh - 105px - 120px - 25px - 10px);
      overflow-y: auto;
      padding: 20px 10px;
      @include scrollBar;
      background: #f0f4f3;
      border-radius: 4px;
      .cont-wrapper {
        overflow: hidden;
        margin-bottom: 20px;
        .block-wrapper {
          display: inline-block;
          width: auto;
          overflow: hidden;
          padding: 10px 10px;
          border-radius: 3px;
          overflow: hidden;
          .cont-name {
            font-size: 13px;
            margin-bottom: 10px;
          }
          .cont-text {
            font-size: 14px;
            line-height: 20px;
          }
        }
      }
    }
    .reply {
      padding-top: 10px;
      border-top: 2px solid #f0f4f3;
      display: flex;
      .reply-ipt {
        overflow-y: auto;
        flex: 1;
        margin-right: 10px;
      }
      .send-btn {
        float: right;
        margin-top: 15px;
      }
    }
  }
  .item + .item {
    border-left: 2px solid #e7eaef;
  }
}
.left {
  text-align: left;
  padding: 6px 10px;
  background: #fff;
  color: #333333;
  float: left;
}
.right {
  text-align: right;
  padding: 6px 10px;
  background: #13a468;
  color: #fff;
  float: right;
}
.status-xq {
  background: #007947;
  color: #fff;
  font-size: 12px;
  padding: 2px 5px;
  margin-left: 10px;
}
</style>
