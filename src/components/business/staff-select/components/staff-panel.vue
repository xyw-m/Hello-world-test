<template>
  <div class="staff-panel">
    <div class="header">
      <p>{{ title }}</p>
    </div>
    <div class="content">
      <!-- 组织树 -->
      <div class="left">
        <org-tree v-bind="$attrs" @click="orgClick"></org-tree>
      </div>
      <!-- 人员选项 -->
      <div class="middle">
        <staff-options
          ref="options"
          v-bind="$attrs"
          :staffs="staffData"
          :selected="selected"
          :config="staffConfig"
          :orgId="currentOrgId"
          :loading="loading"
          @search="search"
          @select="select"
          @remove="remove"
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
import { getComplexStaffData } from '../api';

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
      currentOrgId: '',
      loading: false,
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
      this.currentOrgId = data.orgId;
      const params = {
        orgId: data.orgId,
      };
      this.$refs.options && this.$refs.options.resetForm();
      this.getStaffData(params);
    },
    select(staff) {
      if (this.multiple) {
        this.selected.push(staff);
      } else {
        this.selected = [staff];
      }
    },
    search(value) {
      const params = {
        orgId: this.currentOrgId,
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
      this.oldSelected = [].concat(this.selected);
      this.$emit('confirm', this.selected);
    },
    cancel() {
      this.selected = this.oldSelected;
      this.$emit('cancel');
    },
    updateSelected(newValue) {
      if (!this.isEqual(this.selected, newValue)) {
        this.selected = newValue;
        this.confirm();
      }
    },
    isEqual(arr1, arr2) {
      if (arr1.length !== arr2.length) return false;

      const { key } = this.staffConfig;
      const arr1Keys = arr1.map((item) => item[key]);
      const arr2Keys = arr2.map((item) => item[key]);
      return arr1Keys.every((_key) => arr2Keys.includes(_key));
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
