<template>
  <div>
    <div class="statistics-box sta-box" v-loading="statisticsLoading">
      <div class="title">
        <span class="line"></span>
        近期统计
        <span class="fr item" :class="{'active':currentIndex == index}" v-for="(item,index) in weekType" :key="index" @click="getWeekData(item.type,index)">{{item.title}}</span>
      </div>
      <div class="data-box">
        <div class="item" @click="toPage('/client/customer/list')">
          <p class="title">新增客户</p>
          <p class="num">
            <count-to :startVal="0" :endVal="company_qty" :duration="2000"></count-to>
          </p>
        </div>
        <div class="item" @click="toPage('/logistics/waybill/waybill-list')">
          <p class="title">运单量</p>
          <p class="num">
            <count-to :startVal="0" :endVal="way_bill_qty" :duration="2000"></count-to>
          </p>
        </div>
      </div>
      <div class="data-box">
        <div class="item" @click="toPage('/demand/demand/list')">
          <p class="title">需求数量</p>
          <p class="num">
            <count-to :startVal="0" :endVal="demand_qty" :duration="2000"></count-to>
          </p>
        </div>
        <div class="item" @click="toPage('/logistics/logistics-channel/logistics-channel-list')">
          <p class="title">新增渠道</p>
          <p class="num">
            <count-to :startVal="0" :endVal="channel_qty" :duration="2000"></count-to>
          </p>
        </div>
      </div>
    </div>

    <div class="statistics-box todo-box" v-loading="todoLoading">
      <div class="title">
        <span class="line"></span>代办事项
      </div>
      <div class="data-box">
        <div class="item" @click="toPage('/client/customer/list')">
          <p class="title">待审客户</p>
          <p class="num">
            <count-to :startVal="0" :endVal="company_qty_todo" :duration="2000"></count-to>
          </p>
        </div>
        <div class="item" @click="toPage('/demand/demand/list')">
          <p class="title">待处理需求</p>
          <p class="num">
            <count-to :startVal="0" :endVal="demand_qty_todo" :duration="2000"></count-to>
          </p>
        </div>
        <div class="item" @click="toPage('/logistics/waybill/waybill-await')">
          <p class="title">待同步订单</p>
          <p class="num">
            <count-to :startVal="0" :endVal="way_bill_qty_todo" :duration="2000"></count-to>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPanelWeek, getToDO } from '@/api/controlPanel';
import CountTo from 'vue-count-to';
export default {
  data() {
    return {
      currentIndex: 0,
      weekType: [{ type: '1', title: '本周' }, { type: '0', title: '上周' }],
      statisticsLoading: false,
      todoLoading: false,
      company_qty: 0, //新增客户数量
      way_bill_qty: 0, //新增运单数量
      demand_qty: 0, //新增需求数量
      channel_qty: 0, //新增渠道数量
      company_qty_todo: 0, //待审核客户助理
      demand_qty_todo: 0, //待处理需求数量
      way_bill_qty_todo: 0 //待同步运单数量
    };
  },
  created() {
    this.getPanelWeek('1');
    this.getToDO();
  },
  mounted() {},
  methods: {
    toPage(path) {
      this.$router.push(path);
    },
    async getToDO() {
      this.todoLoading = true;
      try {
        let { data } = await getToDO();
        this.company_qty_todo = Number(data.company_qty);
        this.demand_qty_todo = Number(data.demand_qty);
        this.way_bill_qty_todo = Number(data.way_bill_qty);
      } catch (error) {
        this._message(error);
      }
      this.todoLoading = false;
    },
    getWeekData(type, index) {
      this.currentIndex = index;
      this.getPanelWeek(type);
    },
    async getPanelWeek(type) {
      this.statisticsLoading = true;
      try {
        let { data } = await getPanelWeek({ week_type: type });
        this.$nextTick(() => {
          this.company_qty = Number(data.company_qty);
          this.way_bill_qty = Number(data.way_bill_qty);
          this.demand_qty = Number(data.demand_qty);
          this.channel_qty = Number(data.channel_qty);
        });
      } catch (error) {
        this._message(error);
      }
      this.statisticsLoading = false;
    }
  },
  components: {
    CountTo
  }
};
</script>

<style lang="scss" scoped>
.statistics-box {
  margin-bottom: 20px;
  border-bottom: 1px solid #f1f1f1;
  padding-bottom: 20px;
  .title {
    font-size: 14px;
    overflow: hidden;
    font-weight: 400;
    color: #333;
    .line {
      float: left;
      display: inline-block;
      width: 3px;
      background: #13a468;
      height: 14px;
      margin-right: 7px;
    }
    .item {
      margin-left: 15px;
      color: #ccc;
      cursor: pointer;
      font-size: 15px;
      &.active {
        color: #13a468;
      }
    }
  }
  .data-box {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;

    .item {
      flex: 1;
      border-radius: 3px;
      padding: 10px 10px;
      background: #f1f1f1;
      margin-bottom: 20px;
      cursor: pointer;
      margin: 0 5px;
      .title {
        font-size: 14px;
        color: #666;
      }
      .num {
        font-size: 25px;
        color: #13a468;
        font-weight: bold;
        margin-top: 5px;
        height: 30px;
        line-height: 30px;
      }
    }
  }
}
.todo-box {
  border-bottom: none;
  .data-box {
    .item {
      min-width: 95px;
      margin-bottom: 10px;
    }
  }
}
</style>
