<template>
  <div>
    <el-upload
      :disabled="disabled"
      class="upload-demo"
      :action="uploadUrl"
      :before-upload="beforeUpload"
      :on-success="handleOk"
      :on-error="handleError"
      multiple
      :limit="limit"
      :file-list="fileList"
      :headers="myHeader"
      :name="name"
      :show-file-list="false"
    >
      <el-button size="mini" :disabled="disabled" plain icon="el-icon-upload">{{ title }}</el-button>
      <div slot="tip" class="el-upload__tip">{{ tip }}</div>
    </el-upload>
    <div v-show="fileNameShow">
      <!-- <div class="file-name" v-show="fileNameBoxVisible">{{ fileName }}</div> -->
    </div>
  </div>
</template>

<script>
import { getLocalStorage } from '_u/localStorage';
import baseURL from '@/config/baseUrl';
import { formatMessage } from '_u/utils';
export default {
  props: {
    title: {
      //上传按钮文字
      type: String,
      default: ''
    },
    tip: {
      //提示
      type: String,
      default: ''
    },
    name: {
      //file  name
      type: String,
      default: 'file'
    },
    url: {
      //请求url
      type: String,
      default: ''
    },
    limit: {
      //最大上传数
      type: Number,
      default: 100
    },
    fileNameShow: {
      type: Boolean,
      default: true
    },
    importText: {
      type: String,
      default: '模板数据导入成功'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileList: [],
      myHeader: {
        Authorization: `Bearer ${getLocalStorage('userinfo').access_token}`
      },
      fileName: '',
      fileNameBoxVisible: false,
      requestLoading: null
    };
  },
  created() {},
  activated() {
    if (getLocalStorage('userinfo')) {
      this.myHeader = {
        Authorization: `Bearer ${getLocalStorage('userinfo').access_token}`
      };
    } else {
      this._message('登录失效，重新登录');
      setTimeout(() => {
        this.$router.push('/entran/login');
      }, 1000);
    }
  },
  computed: {
    uploadUrl() {
      return baseURL + this.url;
    }
  },
  methods: {
    beforeUpload(file) {
      this.fileName = file.name;
      this.requestLoading = this.$loading({
        lock: true,
        text: '上传中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      });
    },
    handleOk(res) {
      this.requestLoading.close();
      if (res.code === 200 && res.error === 0) {
        this._message(res.message, 'success');
        this.fileNameBoxVisible = true;
        this.$emit('uploadOk', res.data);
      } else {
        let error = formatMessage(res.message);
        this._message(error);
      }
    },

    handleError(err) {
      console.log(err);
    }
  }
};
</script>

<style lang="scss" scoped>
.file-name {
  font-size: 13px;
  color: #666;
}
</style>
