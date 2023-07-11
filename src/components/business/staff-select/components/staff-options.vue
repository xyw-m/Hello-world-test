<template>
  <div class="staff-options">
    <el-tabs v-model="activeTab" @tab-click="handleSwitch" class="menu">
      <el-tab-pane label="最近" name="RECENT" class="menu-item"></el-tab-pane>
      <el-tab-pane
        label="同部门"
        name="DEPARTMENT"
        class="menu-item"
      ></el-tab-pane>
      <el-tab-pane
        label="组织结构"
        name="ORGANIZATION"
        class="menu-item"
      ></el-tab-pane>
    </el-tabs>
    <div class="search-form">
      <el-input
        placeholder="请输入姓名/工号/手机号"
        v-model="filterText"
        suffix-icon="el-icon-search"
        size="small"
        clearable
      ></el-input>
    </div>
    <!-- 人员查询表单 -->
    <!-- <el-form ref="form" :model="form" :inline="true" class="search-form" size="mini">
      <el-form-item prop="userName" label="姓名" v-if="customFormItem.length < 2" class="form-item">
        <el-input v-model="form.userName" placeholder="请输入" clearable @input="handleSearch"></el-input>
      </el-form-item>
      <el-form-item prop="employeeNo" v-if="customFormItem.length < 3" label="工号" class="form-item">
        <el-input v-model="form.employeeNo" placeholder="请输入" clearable @input="handleSearch"></el-input>
      </el-form-item>
      <el-form-item
        v-for="(item, index) in customFormItem"
        :key="index"
        class="form-item"
        :label="item.label"
        :class="{ 'custom-label ': item.label.length > 2}">
        <el-input
          v-if="item.type === 'input'"
          v-model="form[item.prop]"
          :placeholder="item.placeholder || '请输入'"
          @input="handleSearch"
          clearable>
        </el-input>
        <el-select
          v-if="item.type === 'select'"
          v-model="form[item.prop]"
          :placeholder="item.placeholder || '请输入'"
          @change="handleSearch"
          clearable>
          <el-option
            v-for="op in item.dict"
            :key="op.itemValue"
            :label="op.itemName"
            :value="op.itemValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="reset-btn" :class="{'right': customFormItem.length === 0}">
        <el-button type="text" @click="resetForm(true)">重置</el-button>
      </el-form-item>
    </el-form> -->
    <!-- 可选列表 -->
    <div class="option" v-sinotruk-loading="loading">
      <div class="all-checked">
        <span
          >共
          <span style="color: #0088ff">{{ filterStaff.length }}</span>
          人：</span
        >
        <el-checkbox
          :value="allChecked"
          :indeterminate="isIndeterminate"
          @change="handleSelectAll"
          >全选</el-checkbox
        >
      </div>
      <el-scrollbar
        tag="div"
        wrapClass="option-wrap"
        viewClass="option-view"
        v-if="filterStaff.length > 0"
      >
        <el-card
          v-for="staff in filterStaff"
          :key="staff[config.key]"
          class="card"
          @dblclick.native="handleSelect(staff)"
        >
          <div class="main">
            <span>
              <strong>{{ staff[config.label] }}</strong>
              {{ `（${staff[config["sub-label"]]}）` }}
            </span>
            <i
              class="el-icon-remove-outline"
              v-if="staff.selected"
              @click="handleRemove(staff)"
            ></i>
            <i
              class="el-icon-circle-plus"
              v-else
              @click="handleSelect(staff)"
            ></i>
          </div>
          <div class="sub">
            <el-tooltip
              popper-class="staff-tooltip"
              effect="dark"
              placement="top"
              :open-delay="500"
            >
              <template #content>
                <p>{{ staff[config.content] }}</p>
              </template>
              <p>{{ staff[config.content] }}</p>
            </el-tooltip>
          </div>
        </el-card>
      </el-scrollbar>
      <div class="empty" v-else>
        {{ this.orgId == "" ? "— 请在左侧选择组织机构 —" : "— 暂无数据 —" }}
      </div>
    </div>
  </div>
</template>

<script>
import ElTabs from 'element-ui/packages/tabs/index';

export default {
  name: 'staffOptions',
  components: { ElTabs },
  props: {
    'staff-custom-search': Array,
    staffs: Array,
    selected: Array,
    config: Object,
    orgId: String,
    loading: Boolean,
  },
  data() {
    return {
      // form: {
      //   userName: '',
      //   employeeNo: ''
      // }
      // allChecked: false
      filterText: '',
      activeTab: 'RECENT',
    };
  },
  // created() {
  //   this.customForm()
  // },
  watch: {
    // staffCustomSearch: {
    //   deep: true,
    //   handler() {
    //     this.customForm()
    //   }
    // },
    filterText(value) {
      if (this.activeTab !== 'RECENT') {
        const currentCode =
          JSON.parse(sessionStorage.getItem('userInfo')).orgCode ||
          '3820001000';
        const orgCode = this.activeTab === 'DEPARTMENT' ? currentCode : '';
        this.$emit('search', value, orgCode);
      }
    },
  },
  computed: {
    // customFormItem() {
    //   if (!Array.isArray(this.staffCustomSearch)) return []
    //   return this.staffCustomSearch.length > 3
    //     ? this.staffCustomSearch.slice(0, 3)
    //     : this.staffCustomSearch
    // },
    filterStaff() {
      let options = this.staffs;
      if (this.activeTab === 'RECENT') {
        options = JSON.parse(localStorage.getItem('recentSelected')) || [];
        if (this.filterText) {
          options = options.filter((staff) => {
            return (
              staff[this.config.key].includes(this.filterText) ||
              staff[this.config.label].includes(this.filterText)
            );
          });
        }
      }
      const staffs = options.map((staff) => {
        const selected =
          this.selected.findIndex(
            (_selected) => _selected[this.config.key] === staff[this.config.key]
          ) > -1;
        return {
          ...staff,
          selected,
        };
      });
      return staffs;
    },
    allChecked() {
      let flag = false;
      if (
        this.selected.length > 0 &&
        this.filterStaff.length > 0 &&
        this.selected.length >= this.filterStaff.length
      ) {
        flag = this.filterStaff.findIndex((staff) => !staff.selected) === -1;
      }
      return flag;
    },
    isIndeterminate() {
      if (this.selected.length === 0 || this.allChecked) return false;
      const selectedKeys = this.selected.map((staff) => staff[this.config.key]);
      const staffKeys = this.filterStaff.map((staff) => staff[this.config.key]);
      const isIndeterminate =
        selectedKeys.length + staffKeys.length !==
        new Set([...selectedKeys, ...staffKeys]).size;
      return isIndeterminate;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.setTabStyle();
    });
  },
  methods: {
    /* 自定义表单项 */
    // customForm() {
    //   if (this.customFormItem.length > 0) {
    //     const props = this.customFormItem.map(item => item.prop)
    //     this.form = { userName: '', employeeNo: '' }
    //     props.forEach(prop => {
    //       this.$set(this.form, prop, '')
    //     })
    //   }
    // },
    handleSelect(staff) {
      staff.selected = true;
      this.$emit('select', staff);
    },
    handleRemove(staff) {
      staff.selected = false;
      this.$emit('remove', staff);
    },
    handleSelectAll(selected) {
      if (selected) {
        this.$emit('selectAll', this.filterStaff);
      } else {
        this.$emit('removeAll');
      }
    },
    handleSearch() {
      this.$emit('search', this.form);
    },
    handleSwitch() {
      if (this.activeTab === 'DEPARTMENT') {
        const orgCode =
          JSON.parse(sessionStorage.getItem('userInfo')).orgCode ||
          '3820001000';
        this.$emit('set-current', { orgCode });
      } else {
        this.$emit('clear-current');
      }
    },
    defaultFilterFunc(value, staff, prop) {
      return staff[prop].indexOf(value) > -1;
    },
    resetForm(search = false) {
      // const props = Object.getOwnPropertyNames(this.form)
      // props.forEach(prop => {
      //   if (typeof this.form[prop] !== 'object') {
      //     this.form[prop] = ''
      //   }
      // })
      // search && this.$emit('search', this.form)
      this.filterText = '';
    },
    updateTab(orgCode) {
      const userOrgCode =
        JSON.parse(sessionStorage.getItem('userInfo')).orgCode || '3820001000';
      this.activeTab = orgCode === userOrgCode ? 'DEPARTMENT' : 'ORGANIZATION';
    },
    setTabStyle() {
      const bar = document.querySelector(
        `#${this.$parent.id} .el-tabs__active-bar `
      );
      if (bar) {
        bar.style.width = '32px';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.staff-options {
  width: 100%;
  height: 100%;
  // padding: 16px 20px;
  .menu ::v-deep {
    .el-tabs__header {
      margin: 0;
    }
    .el-tabs__nav-scroll {
      padding-left: 20px;
    }
    .el-tabs__item {
      font-size: 16px;
      margin: 5px 0;
    }
  }
  .search-form {
    padding: 16px 20px 0 20px;
    margin-bottom: 14px;
    .form-item {
      width: calc((100% - 10px) / 2);
      margin-bottom: 10px;
      &:nth-child(even) {
        margin-right: 0 !important;
      }
      ::v-deep {
        label {
          padding-right: 5px !important;
          max-width: 30px;
          height: 32px;
        }
        .el-form-item__content {
          width: calc(100% - 30px);
        }
        .el-input__inner:focus {
          border-color: #0088ff;
        }
      }
    }
    .custom-label {
      ::v-deep label {
        line-height: 16px;
      }
    }
    .reset-btn {
      margin-bottom: 10px;
      height: 32px;
      ::v-deep .el-button--text {
        color: #0088ff;
      }
    }
    .right {
      width: 100%;
      text-align: right;
    }
  }
  .option {
    width: 315px;
    position: relative;
    .all-checked {
      padding: 0 20px;
      margin-bottom: 11px;
      display: flex;
      color: #222222;
      justify-content: space-between;
      ::v-deep .el-checkbox {
        .el-checkbox__inner {
          width: 13.6px;
          height: 14.6px;
        }
        .el-checkbox__label {
          color: #222222;
          font-size: 12px;
          padding-left: 9px;
        }
        &.is-checked {
          .el-checkbox__inner {
            border-color: #0088ff;
            background-color: #0088ff;
          }
          .el-checkbox__label {
            color: #0088ff;
          }
        }
        .el-checkbox__input.is-focus .el-checkbox__inner {
          border-color: #0088ff;
        }
        .el-checkbox__input.is-indeterminate .el-checkbox__inner {
          border-color: #0088ff;
          background-color: #0088ff;
        }
        .el-checkbox__inner:hover {
          border-color: #0088ff;
        }
      }
    }
    .card {
      padding: 8px 10px 5px 10px;
      margin-bottom: 8px;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
      border-radius: 2px;
      ::v-deep .el-card__body {
        padding: 0;
      }
      .main {
        display: flex;
        justify-content: space-between;
        margin-bottom: 3px;
        span {
          font-size: 14px;
          line-height: 19px;
          color: #999999;
          strong {
            color: #0088ff;
          }
        }
        i {
          color: #0088ff;
          cursor: pointer;
          font-size: 16px;
        }
      }
      .sub p {
        font-size: 12px;
        line-height: 16px;
        color: #222222;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .empty {
    height: 300px;
    text-align: center;
    line-height: 24px;
    color: #999999;
    padding: 135px 0;
  }
}
</style>

<style lang="scss">
.staff-options {
  .option-wrap {
    height: 300px;
    padding: 0 9px 0 20px;
    .option-view {
      padding-right: 10px;
    }
  }
  /* 滚动条样式修改 */
  .el-scrollbar__bar.is-vertical {
    margin-right: 6px;
    .el-scrollbar__thumb {
      background-color: #999999;
    }
  }
}

body .staff-tooltip {
  font-size: 12px;
  line-height: 20px;
  padding: 9px 15px;
  white-space: normal;
  max-width: 220px;
}
</style>
