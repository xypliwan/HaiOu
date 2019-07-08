<template>
  <div v-loading="wayLoading">
    <div class="title">
      <span class="line"></span>物流轨迹
    </div>
    <div class="search-ipt">
      <el-input size="mini" placeholder="请输入单号" clearable v-model="params.code" @keyup.enter.native="getHomeTrajectorySearch">
        <el-button slot="append" @click="getHomeTrajectorySearch">搜索</el-button>
      </el-input>
    </div>
    <div class="data-wrapper" v-show="hasData">
      <div class="way-detail">
        <i class="iconfont icon--danhao"></i>
        {{wayDetail.TrackingNumber}}
      </div>
      <div class="way-detail">
        <el-row>
          <el-col :span="11">{{wayDetail.Channel_name}}</el-col>
          <el-col :span="2">
            <i class="iconfont icon-zhi"></i>
          </el-col>
          <el-col :span="3">{{wayDetail.Country_name}}</el-col>
        </el-row>
      </div>

      <div class="time-line">
        <el-timeline>
          <el-timeline-item placement="top" v-for="(every, i) in wayList.Detail" :key="i" :timestamp="every.Occur_date" :type="every.type" :color="every.color" :size="every.size">
            <p class="area-info">{{every.track_area}}</p>

            <p class="comment-info">{{every.Comment}}</p>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
    <div class="no-data" v-show="!hasData">
      <i class="iconfont icon-zanwushuju"></i>
    </div>
  </div>
</template>

<script>
import { getHomeTrajectorySearch } from '@/api/controlPanel';
export default {
  data() {
    return {
      wayLoading: false,
      hasData: false,
      params: {
        code: '' //单号
      },
      tableData: [],
      wayList: {},
      wayDetail: {
        TrackingNumber: '',
        Channel_name: '',
        Country_name: ''
      }
    };
  },
  created() {},
  methods: {
    async getHomeTrajectorySearch() {
      this.wayLoading = true;
      try {
        //   HOAC9041600027
        let { data } = await getHomeTrajectorySearch({ code: 'HOAC9041600027' });
        this.hasData = data.length > 0 ? true : false;
        if (data.length > 0) {
          data.forEach((el, i) => {
            el.Detail.forEach((ev, j) => {
              if (j == 0) {
                ev.type = 'success';
                ev.color = '#0bbd87';
                ev.size = 'large';
              } else {
                ev.type = 'info';
                ev.color = '#dad9d9';
                ev.size = 'normal';
              }
            });
          });
          this.wayDetail.TrackingNumber = data[0].TrackingNumber;
          this.wayDetail.Channel_name = data[0].Channel_name;
          this.wayDetail.Country_name = data[0].Country_name;
          this.wayList = data[0];
        }
      } catch (error) {
        this._message(error);
      }
      this.wayLoading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 14px;
  width: 100%;
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
.search-ipt {
  margin-bottom: 40px;
}
.no-data {
  margin-top: 100px;
  text-align: center;
  i {
    font-size: 100px;
    color: #007947;
  }
}
.way-detail {
  margin: 15px 0;
  font-size: 15px;
  i {
    color: #007947;
  }
}
.area-info {
  font-size: 15px;
  color: #13a468;
  margin-bottom: 10px;
}
.comment-info {
  color: #666;
  font-size: 14px;
  line-height: 22px;
}
</style>
