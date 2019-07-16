<template>
  <div>
    <div id="container"></div>
  </div>
</template>


<script>
import CustomLabel from '@/utils/label/js/jquery.custom-label.js';
import group from '@/utils/label/js/group/index.js';
import { saveTemplate, getLableDetail } from '@/api/develop';

export default {
  name:'labelManagement',
  data() {
    return {
      customLabel: null,
      params: {}
    };
  },
  activated() {},
  created() {},
  mounted() {
    if (this.$route.query.template_height) {
      this.params = this.$route.query;
      let item = {
        size: [this.$route.query.template_width, this.$route.query.template_height],
        type: this.$route.query.template_type,
        code: this.$route.query.template_code,
        name: this.$route.query.template_name
      };

      this.initLabel(item);
    }

    if (this.$route.query.code) {
      this.getLableDetail(this.$route.query.code);
    }
  },
  methods: {
    async getLableDetail(code) {
      try {
        let { data } = await getLableDetail({ template_code: code });
        const { template_widget, ...other } = data;
        const config = {
          name: other.template_name,
          type: other.template_type,
          size: [other.template_width, other.template_height],
          code: other.template_code
        };
        this.initLabel(config, template_widget ? JSON.parse(template_widget) : []);
      } catch (error) {
        this._message(error);
      }
    },
    async saveTemplate(params) {
      try {
        let { message } = await saveTemplate(params);
        this._message(message, 'success');
        this.$router.push('/system/label/label-management');
      } catch (error) {
        this._message(error);
      }
    },
    initLabel(config, widgets = []) {
      this.initComponents();
      this.customLabel = new CustomLabel(config);

      if (widgets.length) {
        this.customLabel.addPageWidgets(widgets);
      } else {
        this.customLabel.addPage();
      }

      $('#container').html(this.customLabel.getElem());
      this.customLabel.onSave = data => {
        let params = {
          template_code: data.config.code,
          template_name: data.config.name,
          template_widget: JSON.stringify(data.widgets),
          template_html: this.customLabel.getHtml()
        };
        this.saveTemplate(params);
      };
    },
    initComponents() {
      // if (!group.length) {
      //   CustomLabel.addComponents(group);
      // }
      CustomLabel.addComponents(group);
    }
  }
};
</script>

<style lang="scss" scoped>
// @import '@/assets/labelcss/iconfontx.css';
// @import '@/assets/labelcss/preview.css';
// @import '@/assets/labelcss/jquery.custom-label.css';
// @import '@/assets/labelcss/jquery.modal.css';

@import './../../../../assets/labelcss/iconfontx.css';
@import './../../../../assets/labelcss/preview.css';
@import './../../../../assets/labelcss/jquery.custom-label.css';
// @import './../../../../assets/labelcss/jquery.modal.css';

#initForm {
  padding: 0;
}
.test-menu {
  padding: 15px;
  background-color: rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  overflow: hidden;
  position: absolute;
  z-index: 1;
  bottom: 0;
  right: 0;
}
.test-menu button {
  margin-right: 10px;
  float: left;
}
.test-menu button:last-child {
  margin-right: 0;
}
</style>

