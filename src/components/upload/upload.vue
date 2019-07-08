<template>
  <div>
    <el-upload
      :disabled="newImgList.length >= limits || !isDisabled"
      ref="uploadDom"
      :action="baseUrl"
      accept="image/png, image/jpeg, image/jpg"
      name="file"
      :headers="tokens"
      :limit="limits"
      :auto-upload="isAutoUpload"
      :multiple="isMultiple"
      :file-list="newImgList"
      :before-upload="beforeUpload"
      :on-success="handleOk"
      :on-error="handleError"
      :show-file-list="false"
    >
      <!-- :disabled="readonly" -->
      <el-button size="mini" v-loading="loading" :disabled="newImgList.length >= limits || !isDisabled" type="primary" class="el-icon-circle-plus-outline" v-show="isShow">上传</el-button>
      <span slot="tip" class="el-upload__tip upload-tip" v-show="newImgList.length==0">{{tipDes}}</span>
    </el-upload>
    <viewer @inited="inited" ref="viewer" v-show="isShowView">
      <div v-for="(src,index) in newImgList" :key="index" class="img-box">
        <img class="imgs" width="148" height="148" :src="src.url" ref="imgTest">
        <div class="operat-box" @click.stop="show(index)">
          <i class="el-icon-zoom-in look"></i>
          <i class="el-icon-delete delete" v-show="isDisabled" @click.stop="deletes(index)"></i>
        </div>
      </div>
    </viewer>
    <div class="tip-des" v-show="newImgList.length>0">{{tipDes}}</div>
    <slot></slot>
  </div>
</template>

<script>
import { getToken } from '_u/tool';
import baseURL from '@/config/baseUrl';

export default {
  /**
   * imgList 只接收['xxx.png']格式， 渲染前处理成[{url:'xxx.png'}]格式，发送给外部时xxx.png
   */
  props: {
    url: [String], //上传地址
    tipDes: {
      type: String
    },
    imgList: {
      //源图片列表
      type: Array,
      default: () => []
    },
    isAutoUpload: {
      //是否自动上传
      type: Boolean,
      default: true
    },
    limits: {
      //最大上传张数
      type: Number,
      default: 5
    },
    isMultiple: {
      //是否同时多张上传
      type: Boolean,
      default: false
    },
    imgType: {
      //图片类型
      type: Array,
      default: () => ['image/jpeg', 'image/png', 'image/jpg']
    },
    isDisabled: {
      //是否禁用上传
      type: Boolean,
      default: true
    },
    isShow: {
      //是否显示上传按钮
      type: Boolean,
      default: true
    },
    showDelete: {
      //是否显示删除按钮
      type: Boolean,
      default: true
    },
    isShowView: {
      //是否显示预览div
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      $viewer: null
      // newisDisabled:this.isDisabled
    };
  },
  created() {},
  computed: {
    newImgList() {
      let arrs = [];
      this.imgList.forEach(el => {
        arrs.push({ url: el });
      });
      return arrs;
    },
    tokens() {
      return getToken();
    },
    baseUrl() {
      return `${baseURL}${this.url}`;
    }
  },
  activated() {},
  watch: {},
  methods: {
    clearImg() {
      this.$refs.uploadDom.clearFiles();
      this.$emit('getImgUrl', []);
    },
    beforeUpload(file) {
      //上传之前
      if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg') {
        this._message('只能上传png,jpg,jpeg格式的图片');
        return false;
      } else if (file.size / 1024 / 1024 > 2) {
        this._message('上传的图片2大小不能超过2MB');
        return false;
      }
      this.loading = true;
    },
    handleOk(res) {
      //上传成功时
      if (res.code == 200 && res.error == 0) {
        this.newImgList.push(res.data.file_url);
        this.$emit('uploadImgSuccess', res.data.file_url);
        this.loading = false;
      } else {
        this._message(res.message);
        this.loading = false;
      }
    },
    handleError(res) {
      this.loading = false;
    },
    deletes(i) {
      this.$confirm('确定删除此图片吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$emit('deleteImg', i);
        })
        .catch(() => {});
    },
    inited(viewer) {
      this.$viewer = viewer;
    },
    show(i) {
      this.$viewer.update();
      this.$viewer.view(i); //默认0开头
      this.$viewer.show();
    },
    hide() {
      this.$viewer.hide();
    }
  }
};
</script>

<style lang="scss" scoped>
@import '_a/styles/global.scss';
.img-box {
  margin-top: 10px;
  width: 148px;
  height: 148px;
  border-radius: 3px;
  margin-right: 25px;
  display: inline-block;
  position: relative;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .operat-box {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-items: center;
    align-items: center;
    justify-content: center;
    background: rgba($color: #000000, $alpha: 0.5);
    z-index: 99;
    transform: translateY(100%);
    opacity: 0;
    @include transitons(0.15s);
    i {
      color: #fff;
      font-size: 20px;
      margin: 0 5px;
    }
  }
  &:hover {
    .operat-box {
      transform: translateY(0%);
      opacity: 1;
    }
  }
}
.upload-tip {
  font-size: 14px;
  color: red;
  margin-top: 10px;
  margin-left: 10px;
  margin-bottom: 20px;
}
.tip-des {
  margin-top: 5px;
}
</style>
