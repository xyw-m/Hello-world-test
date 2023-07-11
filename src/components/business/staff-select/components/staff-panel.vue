<template>
  <div class="staff-panel" :id="id">
    <div class="header">
      <p>{{ title }}</p>
    </div>
    <div class="content">
      <!-- 组织树 -->
      <div class="left">
        <org-tree ref="orgTree" v-bind="$attrs" @click="orgClick"></org-tree>
      </div>
      <!-- 人员选项 -->
      <div class="middle">
        <staff-options
          ref="options"
          v-bind="$attrs"
          :staffs="staffData"
          :selected="selected"
          :config="staffConfig"
          :orgId="currentOrgCode"
          :loading="loading"
          @search="search"
          @select="select"
          @remove="remove"
          @set-current="setCurrent"
          @clear-current="clearCurrent"
          @selectAll="selectAll"
          @removeAll="removeAll"
        ></staff-options>
      </div>
      <!-- 当前已选 -->
      <div class="right">
        <staff-selected
          :selected="selected"
          :config="staffConfig"
          @remove="remove"
          @removeAll="removeAll"
          @confirm="confirm"
          @cancel="cancel"
        ></staff-selected>
      </div>
    </div>
  </div>
</template>
<script>
import orgTree from './org-tree.vue';
import staffOptions from './staff-options.vue';
import staffSelected from './staff-selected.vue';
import { getComplexStaffData, getInfoByUserCode } from '../api';
import { recursionExpand } from '../utils';

export default {
  name: 'staffPanel',
  components: { orgTree, staffOptions, staffSelected },
  props: {
    title: String,
    'staff-query-func': Function,
    'staff-config': Object,
    multiple: Boolean,
  },
  data() {
    return {
      staffData: [],
      selected: [],
      oldSelected: [],
      currentOrgCode: '',
      loading: false,
      id: `panel-${new Date().getTime()}${Math.floor(
        Math.random() * Math.pow(10, 4)
      )}`, // 生成随机16位数id
    };
  },
  watch: {
    selected: {
      deep: true,
      handler(val) {
        this.$emit('update', val);
      },
    },
  },
  methods: {
    orgClick(data) {
      this.currentOrgCode = data.orgCode;
      const params = {
        orgCode: data.orgCode,
      };
      if (this.$refs.options) {
        this.$refs.options.resetForm();
        this.$refs.options.updateTab(data.orgCode);
      }
      this.getStaffData(params);
    },
    setCurrent({ orgCode }) {
      // 选中并展开节点
      const { tree } = this.$refs.orgTree;
      if (tree) {
        tree.setCurrentKey(orgCode); // 不会触发click事件
        const { nodesMap } = tree.store;
        const node = nodesMap[orgCode];
        // 递归展开本身以及上级
        recursionExpand(node);
        this.$nextTick(() => {
          const current = document.querySelector(
            `#${this.id} .el-tree-node.is-current`
          );
          setTimeout(() => {
            current &&
              current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest',
              });
          }, 100);
          this.orgClick({ orgCode });
        });
      }
    },
    clearCurrent() {
      const { tree } = this.$refs.orgTree;
      tree && tree.setCurrentKey();
      this.staffData = [];
      this.currentOrgCode = '';
    },
    select(staff) {
      if (this.multiple) {
        this.selected.push(staff);
      } else {
        this.selected = [staff];
      }
    },
    search(value, orgCode) {
      const params = {
        orgCode: orgCode || this.currentOrgCode,
        userName: value,
      };
      this.getStaffData(params);
    },
    getStaffData(params) {
      this.loading = true;
      const staffQueryFunc =
        typeof this.staffQueryFunc === 'function'
          ? this.staffQueryFunc
          : getComplexStaffData;
      staffQueryFunc(params).then((res) => {
        this.staffData = res.data;
        this.loading = false;
      });
    },
    remove(staff, confirm = false) {
      const index = this.selected.findIndex(
        (item) => staff.userId === item.userId
      );
      if (index > -1) {
        this.selected.splice(index, 1);
      }
      if (confirm) {
        this.confirm();
      }
    },
    removeAll(removeAll = false) {
      if (removeAll) {
        this.selected = [];
      } else {
        const { key } = this.staffConfig;
        const selected = this.selected.filter((staff) => {
          return (
            this.staffData.findIndex((item) => item[key] === staff[key]) === -1
          );
        });
        this.selected = selected;
      }
      // this.$refs.options.allChecked = false
    },
    selectAll(filterStaff) {
      const selected = filterStaff.filter((staff) => !staff.selected);
      this.selected = selected.concat(this.selected);
    },
    confirm() {
      this.oldSelected = JSON.parse(JSON.stringify(this.selected));
      const selected = JSON.parse(JSON.stringify(this.selected));
      this.$emit('confirm', selected);
    },
    cancel() {
      this.selected = JSON.parse(JSON.stringify(this.oldSelected));
      this.$emit('cancel');
    },
    updateSelected(newValue) {
      if (!this.isEqual(this.selected, newValue)) {
        const index = newValue.findIndex(
          (staff) => !staff[this.staffConfig.content]
        );
        if (index > -1) {
          // 反显值中没有部门信息
          const codeArray = newValue.map(
            (staff) => staff[this.staffConfig.key]
          );
          getInfoByUserCode(codeArray).then((res) => {
            this.selected = res.data;
            this.confirm();
          });
        } else {
          this.selected = newValue;
          this.confirm();
        }
      }
    },
    isEqual(arr1, arr2) {
      if (arr1.length !== arr2.length) return false;

      const { key } = this.staffConfig;
      const arr1Keys = arr1.map((item) => item[key]);
      const arr2Keys = arr2.map((item) => item[key]);
      return arr1Keys.every((_key) => arr2Keys.includes(_key));
    },
    resetTab() {
      setTimeout(() => {
        this.clearCurrent();
        if (this.$refs.options) {
          this.$refs.options.activeTab = 'RECENT';
        }
      }, 200);
    },
  },
};
</script>

<style lang="scss" scoped>
.staff-panel {
  .header {
    width: 100%;
    height: 48px;
    text-align: center;
    background-color: #f2f2f2;
    padding: 10px 0;
    p {
      font-size: 16px;
      line-height: 28px;
      font-weight: bold;
      color: #222222;
      font-family: "MicrosoftYaHei-Bold, MicrosoftYaHei";
    }
  }
  .content {
    height: 432px;
    display: flex;
    .left {
      width: 288px;
      height: calc(100% - 32px);
      margin: 16px 0;
      border-right: 1px solid #dddddd;
    }
    .middle {
      width: 315px;
      height: 100%;
      border-right: 1px solid #dddddd;
    }
    .right {
      height: 100%;
      width: 279px;
    }
  }
}
</style>
