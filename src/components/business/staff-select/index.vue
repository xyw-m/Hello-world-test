<template>
  <div class="staff-select" :id="id">
    <!-- 复杂模式 -->
    <div v-if="type == 'complex'">
      <el-select
        v-model="echoValue"
        v-popover:popover
        popper-class="staff-popper"
        :popper-append-to-body="false"
        :value-key="staffProps.key"
        @remove-tag="handleRemove"
        collapse-tags
        multiple
        :disabled="disabled"
      >
        <el-option
          v-for="op in echoValue"
          :key="op[staffProps.key]"
          :label="op[staffProps.label]"
          :value="op"
        ></el-option>
      </el-select>
      <el-popover
        ref="popover"
        :disabled="disabled"
        popper-class="staff-select-popover"
        trigger="click"
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
    >
      <el-option
        v-for="staff in staffData"
        :key="staff[staffProps.key]"
        :value="staff[staffProps.key]"
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
// import staffData from '../../../src/tempData/staffData.json'
export default {
  name: 'staffSelect',
  components: { staffPanel },
  props: {
    value: {
      type: [Array, String],
      default: () => [],
    },
    orgCode: {
      type: String,
      default: '',
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
      filterText: '',
      defaultStaffProps: {
        label: 'userName',
        'sub-label': 'employeeNo',
        key: 'userId',
        content: 'orgPathStr',
      },
      defaultTreeProps: {
        children: 'children',
        label: 'orgName',
        'node-key': 'orgCode',
      },
    };
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(newValue) {
        if (this.type === 'complex') {
          this.$nextTick(() => {
            this.$refs.panel && this.$refs.panel.updateSelected(newValue);
          });
        } else {
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
  },
  methods: {
    init() {
      if (this.type === 'complex') {
        this.getOrgData();
      } else {
        this.getStaffData('');
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
      this.$refs.panel && this.$refs.panel.cancel();
    },
    handleUpdateEcho(value) {
      this.echoValue = value;
    },
    handleConfirm(selected) {
      this.$emit('change', selected);
      this.panelVisible = false;
    },
    handleCancel() {
      this.panelVisible = false;
    },
    handleRemove(value) {
      this.$refs.panel && this.$refs.panel.remove(value, true);
    },
    getStaffData(query) {
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
      queryMethods(params).then((res) => {
        this.staffData = res.data;
      });
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
  .staff-popper {
    display: none;
  }
}
</style>
