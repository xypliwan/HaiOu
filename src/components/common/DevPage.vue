<template>
  <div class="no-page">
    <div class="page-info">
      <div class="cont">
        <div class="left">
          <img src="./../../assets/images/jianshezhong.png" alt>
        </div>
        <div class="right">
          <h2>功能规划中，敬请期待!</h2>
          <p>程序猿小哥哥正玩命开发ing!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
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
        text-align: right;
        padding-right: 25px;
      }
      .right {
        flex: 1;
        h2 {
          color: #007947;
          font-size: 25px;
          font-weight: 200;
          margin-top: 35px;
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

