<template>
  <div class="staff-selected">
    <div class="header">
      <span
        >已选 <span style="color: #0088ff">{{ selected.length }}</span> 人</span
      >
      <el-button type="text" @click="handleRemoveAll" class="btn"
        >清空</el-button
      >
    </div>
    <!-- 已选内容展示 -->
    <el-scrollbar tag="div" wrapClass="selected-wrap" viewClass="selected-view">
      <div class="selected" v-if="selected.length > 0">
        <el-tooltip
          v-for="item in selected"
          :key="item.userId"
          popper-class="tag-tooltip"
          effect="dark"
          placement="top"
          :open-delay="500"
        >
          <template #content>
            {{
              `${item[config.label]}（${item[config["sub-label"]]}）/${
                item[config.content]
              }`
            }}
          </template>
          <el-tag
            size="medium"
            class="staff-tag"
            closable
            :disable-transitions="true"
            @close="handleRemove(item)"
            >{{ item[config.label] }}</el-tag
          >
        </el-tooltip>
      </div>
      <div class="none-selected" v-else>— 请在左侧选择人员 —</div>
    </el-scrollbar>
    <div class="func">
      <el-button class="btn" size="large" @click="handleCancel">取消</el-button>
      <el-button class="btn" type="primary" size="large" @click="handleConfirm"
        >确认</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'staffSelected',
  props: {
    selected: Array,
    config: Object,
  },
  methods: {
    handleRemove(staff) {
      this.$emit('remove', staff);
    },
    handleRemoveAll() {
      this.$emit('removeAll', true);
    },
    handleConfirm() {
      this.$emit('confirm');
    },
    handleCancel() {
      this.$emit('cancel');
    },
  },
};
</script>

<style lang="scss" scoped>
.staff-selected {
  padding-top: 15px;
  padding-bottom: 8px;
  width: 100%;
  .header {
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    span {
      font-size: 14px;
      line-height: 26px;
      color: #222222;
    }
    .btn {
      color: #0088ff;
      line-height: 20px;
    }
  }
  .none-selected {
    font-size: 12px;
    line-height: 24px;
    color: #999999;
    height: 302px;
    text-align: center;
    padding: 130px 0;
  }
  .selected {
    padding: 18px;
    .staff-tag {
      border: 1px solid #0088ff;
      background-color: #ffffff;
      border-radius: 4px;
      height: 32px;
      font-size: 14px;
      line-height: 26px;
      color: #0088ff;
      padding: 2px 10px;
      margin-bottom: 10px;
      &:nth-child(odd) {
        margin-right: 10px;
      }
      &:nth-last-child(2) {
        margin-bottom: 0;
      }
      ::v-deep {
        .el-tag__close {
          color: #0088ff;
          &:hover {
            color: #ffffff;
            background-color: #0088ff;
          }
        }
      }
    }
  }
  .func {
    padding: 0 20px;
    text-align: right;
    margin-top: 18px;
    .btn {
      font-size: 14px;
      line-height: 26px;
      padding: 6px 24px 8px 24px !important;
      height: auto;
    }
  }
}
</style>

<style lang="scss">
.staff-selected {
  .selected-wrap {
    height: 324px;
    padding: 0 20px;
    .selected-view {
      background: #f8f8f8;
      border: 1px solid #e1e1e1;
      min-height: 302px;
    }
  }
}
body .tag-tooltip {
  font-size: 12px;
  line-height: 20px;
  padding: 9px 15px;
  white-space: normal;
  max-width: 220px;
}
</style>
