<template>
  <div class="org-select" :id="id">
    <el-select
      :disabled="disabled"
      v-popover:popover
      v-bind="$attrs"
      popper-class="select-popper"
      :value="multiple ? echoValue : echoStr"
      :popper-append-to-body="false"
      :multiple="multiple"
      :value-key="treeProps['node-key']"
      collapse-tags
      @remove-tag="removeNode"
    >
      <!-- <el-option 
        v-if="echoValue.length > 0"
        :label="echoValue[0][treeProps.label]" 
        :value="multiple ? echoValue[0] : echoValue[0][treeProps['node-key']]"> -->
      <el-option
        v-for="op in echoValue"
        :key="op[treeProps['node-key']]"
        :label="op[treeProps.label]"
        :value="multiple ? op : op[treeProps['node-key']]"
      ></el-option>
    </el-select>
    <el-popover
      ref="popover"
      :disabled="disabled"
      popper-class="org-select-popover"
      trigger="click"
      v-model="panelVisible"
      :width="panelWidth"
      :placement="placement"
      @hide="handleHide"
    >
      <org-panel
        ref="panel"
        :data="data"
        :treeProps="treeProps"
        :title="title"
        :type="type"
        :value="value"
        :onlyLeaf="onlyLeaf"
        :disabled="disabledNode"
        :multiple="multiple"
        :parentCode="parentCode"
        :filterSearch="filterSearch"
        :defaultKeys="defaultCheckedKeys"
        @close="closePanel"
        @confirm="confirm"
        @update="update"
      ></org-panel>
    </el-popover>
  </div>
</template>

<script>
import orgPanel from './components/org-panel.vue';

export default {
  components: { orgPanel },
  props: {
    value: {
      type: [Object, Array],
      default: () => [],
    },
    parentCode: {
      type: String,
      default: '0',
    },
    type: {
      type: String,
      default: 'complex',
    },
    width: {
      type: [Number, String],
    },
    placement: {
      type: String,
      default: 'bottom-start',
    },
    data: {
      // 自定义treedata
      type: Array,
      default: () => [],
    },
    treeConfig: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    disabledNode: {
      type: [Array, Function],
      default: () => [],
    },
    title: {
      type: String,
      default: '组织机构选择',
    },
    'default-checked-keys': {
      type: Array,
      default: () => [],
    },
    // 只能选择叶子节点
    onlyLeaf: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    filterSearch: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      id: `org-${new Date().getTime()}${Math.floor(
        Math.random() * Math.pow(10, 4)
      )}`, // 生成随机16位数id
      echoValue: [], // select选择器绑定值
      panelWidth: 640,
      panelVisible: false,
      defaultTreeProps: {
        children: 'children',
        label: 'orgName',
        'node-key': 'orgId',
        'check-strictly': false,
        'path-id': 'orgPath',
        'path-Label': 'pathLabels',
      },
    };
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  provide() {
    return {
      data: this.data,
    };
  },
  computed: {
    treeProps() {
      // 默认配置 + 用户自定义配置
      return {
        ...this.defaultTreeProps,
        ...this.treeConfig,
      };
    },
    echoStr() {
      return this.echoValue.length > 0
        ? this.echoValue[0][this.treeProps['node-key']]
        : '';
    },
  },
  watch: {
    panelVisible(val) {
      if (val) {
        if (this.type == 'complex') {
          this.panelWidth = this.width || 640;
        } else {
          // 用户设定的width > 选择器width > 300
          const select = document.querySelector(`#${this.id}`);
          const selectWidth = select ? getComputedStyle(select).width : 640;
          this.panelWidth = this.width || selectWidth.replace('px', '');
        }

        // padding 设为0
        const popover = document.querySelector('.org-select-popover');
        popover.style.padding = 0;
      }
    },
    value: {
      deep: true,
      handler(val) {
        this.$refs.panel && this.$refs.panel.updateCheckedNodes(val);
      },
    },
  },
  methods: {
    closePanel() {
      this.panelVisible = false;
    },

    confirm(checkedNodes, close) {
      // 更新value属性
      this.$emit('change', checkedNodes);
      close && this.closePanel();
    },

    update(checkedNodes) {
      // 更新echoValue
      this.echoValue = checkedNodes;
    },

    removeNode(node) {
      this.$refs.panel.removeNode(node, true);
    },

    handleHide() {
      this.$refs.panel && this.$refs.panel.updateCheckedNodes(this.value);
    },
  },
};
</script>

<style lang="scss" scoped>
.org-select {
  ::v-deep.select-popper {
    display: none !important;
  }

  ::v-deep .el-select__tags > span .el-tag:first-child {
    display: flex;
    max-width: 75%;
    overflow: hidden;
    text-overflow: ellipsis;
    span {
      max-width: 90%;
    }
    i {
      margin-top: 1px;
    }
  }
}
</style>

<style lang="scss">
body .org-select-popover {
  padding: 0;
}
</style>
