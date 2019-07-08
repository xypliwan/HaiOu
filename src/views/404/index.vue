<template>
  <div class="no-page">
    <div class="page-info">
      <div class="cont">
        <div class="left">
          <img src="./../../assets/images/404.png" alt>
        </div>
        <div class="right">
          <h2>Error 404</h2>
          <p>抱歉！您所访问的页面不存在，请重新加载！</p>
          <el-button @click="goProductList" type="primary" size="mini">前往首页看看新发现 ></el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goProductList() {
      this.$router.push('/');
    }
  }
};
</script>

<style lang="scss" scoped>
.no-page {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  .page-info {
    width: 100%;
    display: block;
    .cont {
      width: 720px;
      margin: 0 auto;
      display: flex;
      .left {
        flex: 1;
      }
      .right {
        flex: 1;
        h2 {
          color: #cabeb2;
          font-size: 30px;
          font-weight: 200;
          margin-top: 70px;
        }
        p {
          font-size: 15px;
          color: #999;
          margin: 30px 0;
        }
      }
    }
  }
}
</style>
