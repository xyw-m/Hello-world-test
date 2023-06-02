<template>
  <div
    class="org-panel"
    :class="[type == 'complex' ? 'complex-panel' : 'single-panel']"
  >
    <div class="header" v-if="type == 'complex'">
      <span>{{ title }}</span>
    </div>
    <div class="content">
      <!-- 组织树 -->
      <div class="left">
        <div class="filter" v-if="type == 'complex'">
          <el-input
            placeholder="输入关键字"
            v-model="filterText"
            suffix-icon="el-icon-search"
            clearable
          ></el-input>
        </div>
        <el-scrollbar wrapStyle="height: 350px;margin-top:10px;" tag="div">
          <el-tree
            ref="tree"
            class="tree"
            :class="{ hide: onlyLeaf }"
            :data="treeData"
            :props="props"
            :node-key="treeProps['node-key']"
            :filter-node-method="filterNode"
            show-checkbox
            :check-strictly="
              onlyLeaf || !multiple || treeProps['check-strictly']
            "
            :default-expanded-keys="checkedKeys"
            @check="nodeCheck"
          ></el-tree>
        </el-scrollbar>
      </div>
      <!-- 选择详情 -->
      <div class="right" v-if="type == 'complex'">
        <org-detail
          :checkedNodes="checkedNodes"
          :recentCheckedNodes="recentCheckedNodes"
          :treeProps="treeProps"
          :disabledKeys="defaultCheckedKeys"
          @remove="removeNode"
          @cancel="cancel"
          @confirm="confirm"
          @check-recent="checkRecent"
          @clear="clearChecked"
        />
      </div>
    </div>
  </div>
</template>

<script>
import orgDetail from './org-detail.vue';
import { getTreeData } from '../api';
import { flattening } from '../utils';

export default {
  name: 'orgPanel',
  components: { orgDetail },
  props: {
    title: {
      type: String,
    },
    parentCode: {
      type: String,
    },
    data: {
      type: Array,
      default: () => [],
    },
    treeProps: {
      type: Object,
    },
    type: {
      type: String,
    },
    value: {
      type: [Object, Array],
    },
    disabled: {
      type: [Array, Function],
    },
    onlyLeaf: {
      type: Boolean,
    },
    multiple: {
      type: Boolean,
    },
    filterSearch: {
      type: Boolean,
    },
    defaultKeys: {
      type: Array,
    },
  },
  data() {
    return {
      treeData: [],
      checkedNodes: [],
      oldCheckedNodes: [],
      recentCheckedNodes: [],
      filterText: '',
      props: {
        label: this.treeProps.label,
        children: this.treeProps.children,
      },
    };
  },
  mounted() {
    this.init(true);
  },
  watch: {
    data: {
      handler(data) {
        if (data.length > 0) {
          this.treeData = data;
        } else {
          this.getTreeData().then((res) => {
            this.treeData = res.data;
          });
        }
      },
    },
    parentCode() {
      this.init();
    },
    type() {
      this.complexInit();
    },
    filterText(input) {
      this.tree.filter(input);
    },
    checkedNodes: {
      deep: true,
      handler() {
        this.updateEchoValue();
      },
    },
    disabled: {
      deep: true,
      handler(val) {
        // 当disabled属性更新时，同步更新tree组件的disabled属性
        this.setDisabledForTree(val);
      },
    },
    defaultKeys: {
      deep: true,
      handler(val) {
        // 当默认勾选节点改变时，重置组件
        this.complexInit();
      },
    },
  },
  computed: {
    tree() {
      return this.$refs.tree;
    },
    nodeKey() {
      return this.treeProps['node-key'];
    },
    defaultCheckedKeys() {
      if (!this.isValidArray(this.defaultKeys)) return [];

      // 非多选时，忽略默认选项配置
      return this.multiple ? this.defaultKeys : [];
    },
    checkedKeys() {
      return this.checkedNodes.map((val) => val[this.nodeKey]);
    },
    checkStrictly() {
      // onlyLeaf为true时，只能选择叶子节点，父子不联动
      // multiple = false时，单选，父子不联动
      // check-strictly为true时，父子不联动
      const flag = this.onlyLeaf || !this.multiple;
      return flag ? true : this.treeProps['check-strictly'];
    },
  },
  methods: {
    async init() {
      // 初始化treeData
      if (this.isValidArray(this.data)) {
        this.treeData = this.data;
      } else {
        this.treeData = await this.getTreeData();
      }

      // 当模式为复杂多选时
      if (this.type == 'complex') {
        this.complexInit();
      }
    },

    async getTreeData() {
      const res = await getTreeData({ parentCode: this.parentCode });
      return res.data;
    },

    complexInit() {
      // 初始化recentCheck
      const recent = localStorage.getItem('recentCheck') || '[]';
      this.recentCheckedNodes = JSON.parse(recent);

      // 判断单选还是多选
      let valueNodes = [];
      if (this.isValidArray(this.value)) {
        valueNodes = this.multiple ? this.value : this.value.slice(0);
      }

      const valueKeys = valueNodes.map((val) => val[this.nodeKey]);
      const { defaultCheckedKeys } = this;

      let checkedKeys = valueKeys;

      // 初始化tree组件禁用配置
      const { disabled } = this;
      const disabledType = Array.isArray(disabled) ? 'Array' : 'Function';

      this.setDisabledForTree(disabled);

      // 从checkedKeys中移除禁用项
      if (disabledType === 'Array') {
        checkedKeys = this.removeDisabledByArray(
          checkedKeys,
          disabled,
          valueNodes
        );
      } else {
        checkedKeys = this.removeDisabledByFunc(valueNodes, disabled);
      }

      // 将checkedKeys与默认选项进行合并
      checkedKeys = this.mergeDefault(checkedKeys, defaultCheckedKeys);

      // 设置checkedNodes，更新视图
      this.$nextTick(() => {
        this.tree.setCheckedKeys(checkedKeys);
        this.checkedNodes = this.getCheckedNodes();

        // 强制更新prop:value
        this.confirm();
      });
    },

    setDisabledForTree(disabled) {
      const disabledType = Array.isArray(disabled) ? 'Array' : 'Function';
      const { defaultCheckedKeys } = this;
      let localDisabledFunc;

      // 设置禁用方法
      if (disabledType === 'Array') {
        // 获取禁用选项的keys数组
        const disabledKeys = disabled.map((item) => {
          // disabled 可能是Nodes数组，也可能是keys数组
          return typeof item === 'object' ? item[this.nodeKey] : item;
        });

        // 将禁用选项与默认选项合并
        const mergedKeys = Array.from(
          new Set([...disabledKeys, ...defaultCheckedKeys])
        );

        localDisabledFunc = (data) => {
          return mergedKeys.includes(data[this.nodeKey]);
        };
      } else {
        // 此时disabled为禁用函数
        localDisabledFunc = (data) => {
          return (
            disabled(data) || defaultCheckedKeys.includes(data[this.nodeKey])
          );
        };
      }

      if (this.onlyLeaf) {
        // 禁用非叶子节点
        this.props.disabled = (data) => {
          return (
            localDisabledFunc(data) ||
            this.isValidArray(data[this.treeProps.children])
          );
        };
      } else {
        this.props.disabled = localDisabledFunc;
      }
    },

    removeDisabledByArray(checkedKeys, disabledArr, valueNodes) {
      const noDelKeys = [];
      let disabledKeys = disabledArr.map((item) => {
        // disabledArr 可能是Nodes数组，也可能是Keys数组
        return typeof item === 'object' ? item[this.nodeKey] : item;
      });

      if (this.onlyLeaf) {
        const noLeafKeys = [];
        valueNodes.forEach((node) => {
          if (this.isValidArray(node[this.treeProps.children])) {
            noLeafKeys.push(node[this.nodeKey]);
          }
        });

        // 将非叶子节点与禁用选项的keys数组合并
        disabledKeys = Array.from(new Set([...disabledKeys, ...noLeafKeys]));
      }

      checkedKeys.forEach((key) => {
        if (!disabledKeys.includes(key)) {
          noDelKeys.push(key);
        }
      });

      // 如果checkedKeys中包含disabledKeys，提示用户，并将其删除
      if (checkedKeys.length !== noDelKeys.length) {
        this.$message.warning('数据中包含禁用选项，已为您自动删除！');
      }

      return noDelKeys;
    },

    removeDisabledByFunc(valueNodes, disabledFunc) {
      const noDelKeys = [];

      valueNodes.forEach((node) => {
        if (this.onlyLeaf) {
          if (
            !this.isValidArray(node[this.treeProps.children]) &&
            !disabledFunc(node)
          ) {
            noDelKeys.push(node[this.nodeKey]);
          }
        } else if (!disabledFunc(node)) {
          noDelKeys.push(node[this.nodeKey]);
        }
      });

      // 如果checkedKeys中包含disabledKeys，提示用户，并将其删除
      if (valueNodes.length !== noDelKeys.length) {
        this.$message.warning('数据中包含禁用选项，已为您自动删除！');
      }

      return noDelKeys;
    },

    mergeDefault(valueKeys, defaultCheckedKeys) {
      let mergedKeys = valueKeys;

      if (defaultCheckedKeys.length > 0) {
        // 如果更新的数据中未包含必选项，给出提示
        for (let i = 0; i < defaultCheckedKeys.length; i++) {
          if (!valueKeys.includes(defaultCheckedKeys[i])) {
            // this.$message.warning('数据中未包含必选项，已为您自动合并！')
            console.log('数据中未包含必选项，已为您自动合并！');
            break;
          }
        }

        // 合并
        mergedKeys = Array.from(new Set([...valueKeys, ...defaultCheckedKeys]));
      }

      return mergedKeys;
    },

    // 获取当前tree组件已选节点，并设置pathLabel
    getCheckedNodes() {
      const checkedNodes = this.tree.getCheckedNodes();
      return this.setPathLabel(checkedNodes);
    },

    updateCheckedNodes(value, closePanel = true) {
      // 判断输入值是否合法
      if (!Array.from(value)) {
        this.$message.error('数据不合法，请检查！');
        return;
      }

      const nodes = this.multiple ? value : value.slice(0, 1);

      // 判断新值与当前值是否相等
      if (this.isEqual(nodes, this.checkedNodes)) return;

      /* 更新checkedNodes */
      // 获取新值的keys

      let nodeKeys = nodes.map((val) => val[this.nodeKey]);

      // 从nodeKeys中移除禁用项
      const { disabled } = this;
      const disabledType = Array.isArray(disabled) ? 'Array' : 'Function';

      if (disabledType === 'Array') {
        nodeKeys = this.removeDisabledByArray(nodeKeys, disabled, nodes);
      } else {
        nodeKeys = this.removeDisabledByFunc(nodes, disabled);
      }

      // 将nodeKeys与默认选项合并
      nodeKeys = this.mergeDefault(nodeKeys, this.defaultCheckedKeys);

      // 更新checkedNodes，更新视图
      this.$nextTick(() => {
        this.tree.setCheckedKeys(nodeKeys);
        this.checkedNodes = this.getCheckedNodes();

        // 强制更新prop:value
        if (closePanel) {
          this.confirm();
        }
      });
    },

    filterNode(value, data) {
      if (!value) return true;
      const { label } = this.treeProps;
      return data[label].indexOf(value) !== -1;
    },

    nodeCheck(data, checked) {
      let checkedNodes;
      if (this.multiple) {
        checkedNodes = checked.checkedNodes;
      } else {
        checkedNodes = checked.checkedNodes.length === 0 ? [] : [data];
      }
      let checkedKeys = checkedNodes.map((node) => node[this.nodeKey]);

      // 过滤选中结果
      // 前置要求：onlyLeaf == false && this.treeProps['check-strictly'] == false && this.filterSearch == true
      // 当前选中节点有子节点，且过滤条件不为空
      const canFilter =
        !this.onlyLeaf &&
        !this.treeProps['check-strictly'] &&
        this.filterSearch;
      if (
        canFilter &&
        this.isValidArray(data[this.treeProps.children]) &&
        this.filterText !== ''
      ) {
        const flatData = flattening(data, this.treeProps.children);
        const flatKeys = flatData.map((node) => node[this.nodeKey]);
        const beforeKeys = checkedKeys.filter((key) => {
          return !flatKeys.includes(key);
        });
        const remainNodes = flatData.filter((node) => {
          return node[this.treeProps.label].indexOf(this.filterText) > -1;
        });
        const remainKeys = remainNodes.map((node) => node[this.nodeKey]);
        checkedKeys = Array.from(new Set([...beforeKeys, ...remainKeys]));
      }

      // 更新视图
      this.tree.setCheckedKeys(checkedKeys);
      this.$nextTick(() => {
        this.checkedNodes = this.getCheckedNodes();
        if (this.type == 'single') {
          this.confirm(false);
        }
      });
    },

    removeNode(node, flag = false) {
      const nodeKey = this.treeProps['node-key'];

      if (this.defaultCheckedKeys.includes(node[nodeKey])) {
        this.$message.warning('该选项为必选，无法删除！');
        return;
      }

      const checkStrictly = this.treeProps['check-strictly'];
      this.tree.setChecked(node[nodeKey], false, !checkStrictly);
      this.checkedNodes = this.getCheckedNodes();

      if (flag) {
        this.oldCheckedNodes = this.checkedNodes;
        this.confirm();
      }
    },

    // 更新select选择器的v-model绑定值
    updateEchoValue() {
      this.$emit('update', this.checkedNodes);
    },

    cancel() {
      this.checkedNodes = this.oldCheckedNodes;
      // 更新视图
      this.updateView(this.checkedNodes);
      this.$emit('close');
    },

    confirm(close = true) {
      if (this.defaultCheckedKeys.length > 0) {
        const mergedKeys = this.mergeDefault(
          this.checkedKeys,
          this.defaultCheckedKeys
        );
        this.tree.setCheckedKeys(mergedKeys);
        this.$nextTick(() => {
          this.checkedNodes = this.getCheckedNodes();
          this.oldCheckedNodes = this.checkedNodes;
          this.updateRecentCheck();
          this.$emit('confirm', this.checkedNodes, close);
        });
      } else {
        this.oldCheckedNodes = this.checkedNodes;
        this.updateRecentCheck();
        this.$emit('confirm', this.checkedNodes, close);
      }
    },

    clearChecked() {
      const mergedKeys = this.mergeDefault([], this.defaultCheckedKeys);
      this.tree.setCheckedKeys(mergedKeys);
      this.$nextTick(() => {
        this.checkedNodes = this.getCheckedNodes();
      });
    },

    updateView(nodes) {
      const nodeKeys = nodes.map((node) => node[this.nodeKey]);
      this.tree.setCheckedKeys(nodeKeys);
    },

    setPathLabel(checkedNodes) {
      // 为每个选中的Node抓取路径Label
      checkedNodes.forEach((node) => {
        const pathId = this.treeProps['path-id'];
        const pathLabel = this.treeProps['path-Label'];
        const pathIds = node[pathId].split('_');
        if ((node[pathLabel] && node[pathLabel].length > 0) || !pathId) {
          // 如果节点已经计算过pathLabel，或者节点无pathId
        } else {
          node[pathLabel] = pathIds.map((id) => {
            const _node = this.tree.getNode(id);
            const { label } = this.treeProps;
            return _node.data[label];
          });
        }
      });
      return checkedNodes;
    },

    updateRecentCheck() {
      let recent;
      const checkedCount = this.checkedNodes.length;

      // 如果最近选择中包含 checkedNodes中的对象，则移除
      this.recentCheckedNodes = this.recentCheckedNodes.filter(
        (node) => !this.checkedKeys.includes(node[this.nodeKey])
      );

      if (checkedCount < 4) {
        const recentCount = this.recentCheckedNodes.length;
        const total = checkedCount + recentCount;
        if (total > 4) {
          const delNum = total - 4;
          this.recentCheckedNodes.splice(0, delNum);
        }
        recent = this.recentCheckedNodes.concat(this.checkedNodes);
      } else {
        const end = checkedCount;
        const start = end - 4;
        recent = this.checkedNodes.slice(start, end);
      }

      this.recentCheckedNodes = recent;
      localStorage.setItem('recentCheck', JSON.stringify(recent));
    },

    checkRecent(node) {
      if (this.multiple && this.checkedKeys.includes(node[this.nodeKey])) return;

      const updateNodes = this.multiple
        ? this.checkedNodes.concat([node])
        : [node];
      this.updateCheckedNodes(updateNodes, false);
    },

    // 判断参数是否为有效Array
    isValidArray(param) {
      return Array.isArray(param) && param.length > 0;
    },

    // 判断两个Array是否相等
    isEqual(arr1, arr2) {
      if (arr1.length !== arr2.length) return false;

      const arr1NodeKeys = arr1.map((item) => item[this.nodeKey]);
      const arr2NodeKeys = arr2.map((item) => item[this.nodeKey]);
      return arr1NodeKeys.every((key) => arr2NodeKeys.includes(key));
    },
  },
};
</script>

<style lang="scss" scoped>
.org-panel {
  font-family: "Microsoft YaHei";
  .header {
    width: 100%;
    height: 48px;
    padding: 10px 17px;
    text-align: center;
    background-color: #f2f2f2;
    span {
      line-height: 28px;
      color: #222222;
      font-size: 16px;
      font-weight: bold;
    }
  }
  .content {
    .right {
      flex-grow: 1;
      padding: 16px 2px 16px 16px;
      max-width: 350px;
    }

    .tree {
      ::v-deep .el-tree-node__content {
        height: auto !important;
        align-items: flex-start;
        .el-checkbox {
          line-height: 23px;
          margin-right: 0px;
        }
        .label-methods-content {
          align-items: flex-start;
        }
      }

      ::v-deep .el-tree-node__label {
        font-size: 12px;
        line-height: 24px;
        white-space: normal;
        color: #222222;
      }

      /* 修改可选样式 */
      ::v-deep .el-checkbox__input {
        .el-checkbox__inner:hover {
          border-color: #0a7cff;
        }
      }

      /* 修改默认样式 */
      ::v-deep .label-methods-content:hover {
        .el-tree-node__label {
          color: #606266;
          background-color: #ffffff;
        }

        .tree-mathods {
          background-color: #ffffff;
          display: none;
        }
      }

      /* 修改focus样式*/
      ::v-deep .el-checkbox__input.is-focus {
        .el-checkbox__inner {
          border-color: #0a7cff;
        }
      }

      /* 修改禁用样式 */
      ::v-deep .el-checkbox__input.is-disabled {
        .el-checkbox__inner {
          background-color: rgb(221, 221, 221);
          border-color: rgb(175, 175, 175);
        }
      }

      /* 修改选中样式 */
      ::v-deep .el-checkbox__input.is-checked {
        .el-checkbox__inner {
          background-color: #ffffff;
          border-color: #0a7cff;
          &::after {
            border-color: #0a7cff;
          }
        }
      }

      /* 修改选中且禁用样式 */
      ::v-deep .el-checkbox__input.is-checked.is-disabled {
        .el-checkbox__inner {
          background-color: #ffffff;
          border-color: rgb(175, 175, 175);
          &::after {
            border-color: #c0c4cc;
          }
        }
      }

      /* 修改未全选样式 */
      ::v-deep .el-checkbox__input.is-indeterminate {
        .el-checkbox__inner {
          background-color: #ffffff;
          border-color: #0a7cff;
          &::before {
            background-color: #0a7cff;
          }
        }
      }
    }
  }

  /* only-leaf */
  .hide
    ::v-deep
    span:not(.is-leaf)
    ~ label
    .el-checkbox__input.is-disabled
    .el-checkbox__inner {
    display: none;
  }
}
.complex-panel {
  height: 480px;
  .content {
    display: flex;
    height: 432px;
    .left {
      width: 288px;
      padding: 16px 5px 16px 16px;
      border-right: 2px solid #f2f2f2;

      .filter {
        padding-right: 11px;
      }

      /* tree 滚动条样式 */
      ::v-deep .el-scrollbar__view {
        margin-right: 32px;
      }

      /* 过滤器样式 */
      ::v-deep .el-input__inner {
        &:focus {
          border-color: #c0c4cc;
        }
        &:focus ~ .el-input__suffix .el-input__icon {
          color: #0a7cff;
        }
      }
    }
  }
}
.single-panel {
  height: 370px;
  .content {
    .left {
      padding: 8px;
      /* tree 滚动条样式 */
      ::v-deep .el-scrollbar__view {
        margin-right: 32px;
      }
    }
  }
}
</style>

<style lang="scss">
.content {
  .el-scrollbar__thumb {
    background-color: #999999;
  }
}
</style>
