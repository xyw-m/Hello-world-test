<template>
  <div class="org-detail">
    <div class="header">
      <span
        >{{ `已选机构（${checkedNodes.length}）： `
        }}<i class="el-icon-close" @click="clearChecked" v-if="false"></i
      ></span>
      <span v-if="false">
        按XX排序
        <el-switch v-model="isSort" />
      </span>
    </div>
    <!-- 已选内容展示 -->
    <el-scrollbar
      tag="div"
      wrapClass="detail-wrap"
      viewClass="detail-view"
      role="content"
    >
      <div class="checked" v-if="checkedNodes.length > 0">
        <el-card
          v-for="(node, index) in checkedNodes"
          :key="index"
          class="card"
        >
          <div class="main">
            <span>{{ node[treeProps["label"]] }}</span>
            <i
              class="el-icon-remove-outline"
              @click="removeNode(node)"
              v-if="!disabledKeys.includes(node[treeProps['node-key']])"
            ></i>
          </div>
          <div class="sub" v-if="node[treeProps['path-Label']]">
            <el-tooltip
              popper-class="sub-tooltip"
              effect="dark"
              placement="top"
              :open-delay="500"
            >
              <template #content>
                <p>{{ node[treeProps["path-Label"]].join("/") }}</p>
              </template>
              <p>{{ node[treeProps["path-Label"]].join("/") }}</p>
            </el-tooltip>
          </div>
        </el-card>
      </div>
      <div class="none-checked" v-else>— 请在左侧选择组织机构 —</div>
    </el-scrollbar>

    <!-- footer -->
    <div class="footer">
      <div class="recent" v-if="recentCheckedNodes.length > 0">
        <span>最近选择：</span>
        <span
          v-for="(node, index) in recentCheckedNodes"
          :key="index"
          @click="checkRecent(node)"
        >
          <el-tooltip
            :content="node[treeProps['label']]"
            placement="bottom-start"
          >
            <span class="recent-node">{{
              node[treeProps["label"]].replace("中国重汽集团", "")
            }}</span>
          </el-tooltip>
        </span>
      </div>
      <div class="btn">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'orgDetail',
  props: {
    checkedNodes: {
      type: Array,
      default: () => [],
    },
    treeProps: {
      type: Object,
    },
    recentCheckedNodes: {
      type: Array,
    },
    disabledKeys: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isSort: false,
    };
  },
  methods: {
    removeNode(node) {
      this.$emit('remove', node);
    },
    cancel() {
      this.$emit('cancel');
    },
    confirm() {
      this.$emit('confirm');
    },
    checkRecent(node) {
      this.$emit('check-recent', node);
    },
    clearChecked() {
      this.$emit('clear');
    },
  },
};
</script>

<style lang="scss" scoped>
.org-detail {
  width: 100%;
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding-right: 16px;
    span {
      font-size: 14px;
      color: #222222;
    }
    i {
      cursor: pointer;
      &:hover {
        color: #0a7cff;
      }
    }
  }

  .checked {
    // padding: 10px;
    background-color: #f8f8f8;
    min-height: 260px;
    // border: 1px solid #E1E1E1;
    // margin-right: 5px;
    // z-index: 10;
    // min-height: 275px;
    .card {
      margin-bottom: 3px;
      padding: 5px;
      ::v-deep .el-card__body {
        padding: 5px;
      }
    }
    .main {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
      span {
        max-width: 260px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-weight: bold;
        color: #0a7cff;
        line-height: 19px;
      }
      i {
        cursor: pointer;
        font-size: 16px;
      }
    }
    .sub {
      p {
        max-width: 280px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        cursor: pointer;
        font-size: 12px;
        color: #222222;
      }
    }
  }

  .none-checked {
    padding: 10px;
    margin-right: 5px;
    min-height: 260px;
    line-height: 240px;
    text-align: center;
    color: #999999;
  }

  .footer {
    margin-top: 15px;
    .btn {
      text-align: right;
      padding: 16px;
      ::v-deep .el-button {
        font-size: 14px;
        line-height: 26px;
        height: 40px;
        border-radius: 4px;
        padding: 8px 24px;
      }
    }

    .recent {
      display: flex;
      justify-content: flex-start;
      padding-right: 16px;
      font-size: 12px;
      color: #999999;
      .recent-node {
        max-width: 60px;
        overflow: hidden;
        white-space: nowrap;
        margin-right: 4px;
        text-overflow: ellipsis;
        cursor: pointer;
        display: inline-block;
      }
    }
  }
}
</style>

<style lang="scss">
.sub-tooltip {
  opacity: 0.8;
  p {
    max-width: 250px;
    line-height: 1.5;
    font-size: 12px;
  }
}
.org-detail {
  .detail-wrap {
    height: 300px;
    padding-right: 11px;
  }

  .detail-view {
    background: #f8f8f8;
    border: 1px solid #e1e1e1;
    padding: 10px;
    margin-right: 5px;
  }
}
</style>
