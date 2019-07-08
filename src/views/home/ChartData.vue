<template>
  <div>
    <div class="title">
      <span class="line"></span> 本月运单趋势
    </div>
    <div class="item-wrapper">
      <span class="item" :class="{'active':currentIndex == index}" v-for="(item,index) in weekType" :key="index" @click="changeMonth(item.type,index)">{{item.title}}</span>
    </div>
    <ve-line :data="chartData" :settings="chartSettings" :loading="chartLoading" :extend="extend"></ve-line>
  </div>
</template>

<script>
import { getChartWay } from '@/api/controlPanel';
export default {
  data() {
    this.extend = {
      legend: {
        selectedMode: false
      },
      tooltip: {
        confine: true,
        formatter: value => {
          return `${value[0].axisValue} 订单量 (单)
                  <br/>${value[0].marker} ${value[0].seriesName}: ${value[0].value[1]}
                  <br/>${value[1].marker} ${value[1].seriesName}: ${value[1].value[1]}
                  <br/>${value[2].marker} ${value[2].seriesName}: ${value[2].value[1]}
                `;
        }
      },
      yAxis: {
        splitLine: {
          lineStyle: {
            color: '#f1f1f1'
          }
        },
        minInterval:1
      },
      xAxis: {
        axisLabel: {
          rotate: '-70'
        }
      }
    };
    this.chartSettings = {
      yAxisName: ['订单量'],
      labelMap: {
        K: '国际快件',
        E: '物流小包',
        F: 'FBA'
      },
      area: true
    };
    return {
      chartData: {
        columns: [],
        rows: [
          //   { 日期: '1/1', 访问用户: 1393, 下单用户: 1093, 下单率: 0.32 },
        ]
      },
      chartLoading: false,
      currentIndex: 0,
      weekType: [{ type: '1', title: '本月' }, { type: '0', title: '上月' }]
    };
  },
  created() {
    this.getChartWay('1');
  },
  methods: {
    changeMonth(type, i) {
      this.currentIndex = i;
      this.getChartWay(type);
    },
    async getChartWay(type) {
      this.chartLoading = true;
      try {
        let { data } = await getChartWay({ month_type: type });
        this.chartData.columns = data.columns;
        this.chartData.rows = data.rows;
        
      } catch (error) {
        this._message(error);
      }
      this.chartLoading = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.title {
  font-size: 14px;
  margin-bottom: 20px;
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
}
.item-wrapper {
  text-align: right;
  margin-bottom: 20px;
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
</style>

