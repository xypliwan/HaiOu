<template>
  <div class="home">
    <!-- <button @click="websocketsay">测试</button> -->
    <div class="left">
      <div class="fast-box">
        <div class="fast-item">
          <fast-entry></fast-entry>
        </div>
        <div class="fast-item statistics">
          <data-statistics></data-statistics>
        </div>
      </div>
      <div class="data-chart">
        <chart-data></chart-data>
      </div>
    </div>
    <div class="right waybill-trajectory">
      <trajectory></trajectory>
    </div>
  </div>
</template>

<script>
import FastEntry from './FastEntry';
import DataStatistics from './DataStatistics';
import ChartData from './ChartData';
import Trajectory from './Trajectory';
export default {
  name: 'home',
  data() {
    return {
      websock: null,
      wsId: null
    };
  },
  created() {
    // this.initWebSocket();
    // console.log(this)
  },
  destroyed: function() {
    //页面销毁时关闭长连接
    // this.websocketclose();
  },
  mounted() {},
  methods: {
    initWebSocket() {
      //初始化weosocket
      const wsuri = 'ws://172.16.1.33:9501'; //ws地址
      this.websock = new WebSocket(wsuri);
      // console.log(this.websock);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      //this.websock.onclose = this.websocketclose;
    },
    websocketonopen() {
      // console.log('WebSocket连接成功');
      let login_data = { type: 'login', nickname: 'liwan', room_id: 10001 };
      this.websocketsend(login_data);
    },
    websocketonerror(e) {
      //错误
      // console.log('WebSocket连接发生错误');
      this.initWebSocket(); ////连接建立失败重连
    },
    websocketonmessage(e) {
      // console.log(e, '收到的数据');
      //数据接收
      const redata = JSON.parse(e.data);
      // console.log(redata);
      this.wsId = redata.from_client_id;
    },

    websocketsend(Data) {
      this.websock.send(JSON.stringify(Data));
    },
    websocketsay() {
      //数据发送
      let msg = {
        type: 'say',
        to_client_id: this.wsId,
        content: 'HELLO'
      };
      // console.log(msg);
      this.websock.send(JSON.stringify(msg));
    },
    websocketclose(e) {
      //关闭
      this.websock.close();
      // console.log('connection closed (' + e.code + ')');
    }
  },
  components: {
    FastEntry,
    DataStatistics,
    ChartData,
    Trajectory
  }
};
</script>

<style lang="scss" scoped>
.home {
  padding: 0px 20px;
  display: flex;
  .left {
    flex: 1;
    .fast-box {
      display: flex;
      .fast-item {
        flex: 1;
        margin-right: 15px;
        border: 1px solid #f1f1f1;
        border-radius: 3px;
        padding: 10px 10px;
      }
      .statistics {
        margin-right: 0;
      }
    }
    .data-chart {
      padding: 10px 10px;
      border: 1px solid #f1f1f1;
      border-radius: 3px;
      margin-top: 20px;
    }
  }
  .waybill-trajectory {
    width: 350px;
    float: right;
    margin-left: 15px;
    border: 1px solid #f1f1f1;
    padding: 10px 10px;
  }
}
</style>


