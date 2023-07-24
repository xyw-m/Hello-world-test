<template>
  <div class="staff-select" :id="id" v-popover:popover>
    <!-- 复杂模式 -->
    <div v-if="type == 'complex'">
      <el-select
        v-model="echoValue"
        :popper-class="panelVisible ? 'staff-popper' : ''"
        :popper-append-to-body="true"
        :value-key="staffProps.key"
        :remote-method="getStaffData"
        :disabled="disabled"
        :loading="loading"
        remote
        filterable
        @remove-tag="handleRemove"
        @change="updateSelected"
        @visible-change="handleVisibleChange"
        collapse-tags
        multiple
      >
        <el-option
          v-for="op in complexOptions"
          :key="op[staffProps.key]"
          :label="op[staffProps.label]"
          :value="op"
        >
          {{
            `${op[staffProps.label]}（${op[staffProps["sub-label"]]}） ${op[
              staffProps.content
            ]
              .split("/")
              .pop()}`
          }}
        </el-option>
      </el-select>
      <i
        class="el-icon-search show-panel"
        @click="panelVisible = true"
        v-show="!disabled"
      ></i>
      <el-popover
        ref="popover"
        :disabled="disabled"
        popper-class="staff-select-popover"
        trigger="manual"
        v-model="panelVisible"
        placement="bottom-start"
        :width="panelWidth"
        @hide="handleHide"
      >
        <staff-panel
          ref="panel"
          :data="treeData"
          :title="title"
          :treeConfig="treeProps"
          :staff-config="staffProps"
          :staff-query-func="staffQueryFunc"
          :staff-custom-search="staffCustomSearch"
          :multiple="multiple"
          @update="handleUpdateEcho"
          @confirm="handleConfirm"
          @cancel="handleCancel"
          v-clickoutside="handleHide"
        ></staff-panel>
      </el-popover>
    </div>
    <!-- 简单模式 -->
    <el-select
      v-else
      v-model="echoValue"
      :multiple="multiple"
      :remote-method="getStaffData"
      @change="handleConfirm"
      reserve-keyword
      filterable
      remote
      clearable
      collapse-tags
      :disabled="disabled"
      :loading="loading"
      :value-key="staffProps['sub-label']"
      :label-key="staffProps.label"
    >
      <el-option
        v-for="staff in staffData"
        :key="staff[staffProps['sub-label']]"
        :value="staff"
        :label="staff[staffProps.label]"
        :title="staff[staffProps.content]"
      >
        {{
          `${staff[staffProps.label]}（${
            staff[staffProps["sub-label"]]
          }） ${staff[staffProps.content].split("/").pop()}`
        }}
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { getTreeData, getSingleStaffData } from './api';
import staffPanel from './components/staff-panel.vue';
import Clickoutside from 'element-ui/src/utils/clickoutside';
// import staffData from '../../../src/tempData/staffData.json'
export default {
  name: 'staffSelect',
  components: { staffPanel },
  directives: { Clickoutside },
  props: {
    value: {
      type: [Array, String],
      default: () => [],
    },
    orgCode: {
      type: String,
      default: '0',
    },
    type: {
      type: String,
      default: 'complex',
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '人员选择',
    },
    // 'filter-method': Function, // 自定义筛选逻辑，仅简单模式可用
    'org-query-func': Function, // 自定义组织机构查询接口
    'staff-query-func': Function, // 自定义人员查询接口
    'staff-config': {
      // 人员数据prop配置
      type: Object,
      // default: () => {
      //   return {
      //     label: 'userName',
      //     'sub-label': 'employeeNo',
      //     key: 'userId',
      //     content: 'orgPathStr'
      //   }
      // }
    },
    'staff-custom-search': {
      type: [Array, String],
      default: () => [],
    },
    'tree-config': {
      type: Object,
      // default: () => {
      //   return {
      //     children: 'children',
      //     label: 'orgName',
      //     'node-key': 'orgCode'
      //   }
      // }
    },
    tenantAccess: {
      // 租户权限控制
      type: Boolean,
      default: false,
    },
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  data() {
    return {
      id: `staff-${new Date().getTime()}${Math.floor(
        Math.random() * Math.pow(10, 4)
      )}`, // 生成随机16位数id
      echoValue: [], // el-select 多选时 v-model绑定值
      panelWidth: 864,
      panelVisible: false,
      treeData: [],
      staffData: [],
      queryStaffData: [],
      filterText: '',
      defaultStaffProps: {
        label: 'userName',
        'sub-label': 'employeeNo',
        key: 'employeeNo',
        content: 'orgPathStr',
      },
      defaultTreeProps: {
        children: 'children',
        label: 'orgName',
        'node-key': 'orgCode',
      },
      loading: false,
      singleLoaded: false,
    };
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      async handler(newValue) {
        if (this.type === 'complex') {
          this.updateSelected(newValue);
        } else {
          if (!this.singleLoaded) {
            await this.getStaffData('');
          }
          this.$nextTick(() => {
            this.handleUpdateEcho(newValue);
            this.updateSingle(newValue);
          });
        }
      },
    },
    type() {
      this.init();
    },
  },
  computed: {
    staffProps() {
      return {
        ...this.defaultStaffProps,
        ...this.staffConfig,
      };
    },
    treeProps() {
      return {
        ...this.defaultTreeProps,
        ...this.treeConfig,
      };
    },
    complexOptions() {
      const array = [];
      this.echoValue.forEach((ele) => {
        const index = this.queryStaffData.findIndex(
          (staff) => ele[this.staffProps.key] === staff[this.staffProps.key]
        );
        if (index === -1) {
          array.push(ele);
        }
      });
      const res = [].concat(array, this.queryStaffData);
      return res;
    },
  },
  methods: {
    init() {
      if (this.type === 'complex') {
        this.getOrgData();
      } else {
        // this.getStaffData('')
      }
    },
    getOrgData() {
      const params = {
        orgCode: this.orgCode,
        tenantAccess: this.tenantAccess,
      };
      const orgQueryFunc =
        typeof this.orgQueryFunc === 'function'
          ? this.orgQueryFunc
          : getTreeData;
      orgQueryFunc(params).then((res) => {
        this.treeData = res.data;
      });
    },
    handleHide() {
      if (this.panelVisible) {
        this.$refs.panel && this.$refs.panel.cancel();
        this.handleCancel();
      }
    },
    handleUpdateEcho(value) {
      this.echoValue = value;
    },
    handleConfirm(selected) {
      this.$emit('change', selected);
      if (this.type === 'complex') {
        this.setRecentSelected(selected);
      }
      this.handleCancel();
    },
    handleCancel() {
      this.panelVisible = false;
      this.$refs.panel && this.$refs.panel.resetTab();
    },
    handleRemove(value) {
      this.$refs.panel && this.$refs.panel.remove(value, true);
    },
    handleVisibleChange(visible) {
      if (!visible) {
        this.queryStaffData = [];
      }
    },
    async getStaffData(query) {
      if (query === '' && this.type === 'complex') {
        this.queryStaffData = [];
        return;
      }
      const search =
        typeof this.staffCustomSearch === 'string' &&
        this.staffCustomSearch !== ''
          ? this.staffCustomSearch
          : this.staffProps.label;
      const params = {
        orgCode: this.orgCode,
        [search]: query,
      };
      const queryMethods =
        typeof this.staffQueryFunc === 'function'
          ? this.staffQueryFunc
          : getSingleStaffData;
      this.loading = true;
      const res = await queryMethods(params);
      if (this.type === 'complex') {
        this.queryStaffData = res.data;
      } else {
        this.staffData = res.data;
      }
      this.loading = false;
      this.singleLoaded = true;
    },
    isEqualArray(arr1, arr2) {
      if (arr1.length !== arr2.length) return false;
      return arr1.every((key) => arr2.includes(key));
    },
    updateSingle(newValue) {
      if (this.multiple) {
        !this.isEqualArray(this.value, newValue) &&
          this.handleConfirm(newValue);
      } else if (this.value !== newValue) this.handleConfirm(newValue);
    },
    updateSelected(newValue) {
      this.$nextTick(() => {
        this.$refs.panel && this.$refs.panel.updateSelected(newValue);
      });
    },
    setRecentSelected(selected) {
      if (!Array.isArray(selected)) return;
      const oldSelected =
        JSON.parse(localStorage.getItem('recentSelected')) || [];
      let res = [];
      if (selected.length > 10) {
        res = selected.slice(selected.length - 10);
      } else {
        // 从 oldSelect 删除 newSelect 中存在的值
        selected.forEach((staff) => {
          const index = oldSelected.findIndex(
            (old) => old[this.staffProps.key] === staff[this.staffProps.key]
          );
          if (index > -1) {
            oldSelected.splice(index, 1);
          }
        });
        // oldSelect 与 newSelect合并，取前10位
        const combine = [].concat(selected, oldSelected);
        res = combine.slice(0, 10);
      }
      localStorage.setItem('recentSelected', JSON.stringify(res));
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss" scoped></style>

<style lang="scss">
body .staff-select-popover {
  padding: 0;
}
.staff-select {
  position: relative;
  .show-panel {
    position: absolute;
    right: 10px;
    top: 7px;
    cursor: pointer;
    color: #c0c4cc;
    z-index: 1;
    &:hover {
      color: #0088ff;
    }
  }
  .staff-popper {
    display: none;
  }
}
</style>
