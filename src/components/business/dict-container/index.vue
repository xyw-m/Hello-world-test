<template>
  <div class="dict-container" :id="id">
    <div class="header">
      <p>{{ title }}</p>
      <el-button
        type="primary"
        size="mini"
        class="func-btn edit"
        v-show="allDisabled && !disabled"
        @click="allDisabled = false"
        round
      >
        <i class="el-icon-edit" style="margin-right: 3px" />编辑
      </el-button>
      <el-button
        type="primary"
        v-show="!allDisabled && !disabled"
        class="func-btn save"
        @click="save"
        size="mini"
        round
      >
        <i class="el-icon-document-checked" style="margin-right: 3px" />保存
      </el-button>
      <span class="dropdown">
        <i
          class="el-icon-arrow-down"
          :class="{ up: visible }"
          @click="visible = !visible"
        ></i>
      </span>
    </div>
    <div class="content" v-show="visible">
      <div
        class="select"
        :id="'select' + index"
        v-for="(item, index) in selectedList"
        :key="index"
      >
        <!-- 一级选择器 单选 -->
        <el-select
          v-model="item[valueProps.firstLevel]"
          :placeholder="placeholder"
          :value-key="dictProps.value"
          :disabled="allDisabled || disabledSelect[0] || disabled"
          class="first-level"
          :class="{ 'hide-border': level !== 1 }"
          @change="handleChange($event, index, valueProps.firstLevel)"
          @clear="handleClear(index)"
          filterable
          clearable
        >
          <el-option
            v-for="op in data"
            :key="op[dictProps.value]"
            :label="op[dictProps.label]"
            :value="op"
            :disabled="noRepeat && disabledFirst(op)"
          ></el-option>
        </el-select>
        <!-- 二级选择器 多选 -->
        <el-select
          v-if="level == '2' || level == '3'"
          v-model="item[valueProps.secondLevel]"
          :value-key="childProps.value"
          :placeholder="placeholder"
          :disabled="allDisabled || disabledSelect[1] || disabled"
          @change="handleChange($event, index, valueProps.secondLevel)"
          multiple
          class="second-level"
          :class="{ 'hide-border': level == 3 }"
          filterable
          clearable
        >
          <el-option
            v-for="op in item[valueProps.firstLevel][dictProps.children]"
            :key="op[childProps.value]"
            :label="op[childProps.label]"
            :value="op"
          ></el-option>
        </el-select>
        <!-- 三级选择器 单选 -->
        <el-select
          v-if="level == '3'"
          v-model="item[valueProps.thirdLevel]"
          :placeholder="placeholder"
          :value-key="childProps.value"
          :disabled="allDisabled || disabledSelect[2] || disabled"
          class="third-level"
          @change="handleChange($event, index, valueProps.thirdLevel)"
          filterable
          clearable
        >
          <el-option
            v-for="op in item[valueProps.secondLevel]"
            :key="op[childProps.value]"
            :label="op[childProps.label]"
            :value="op"
          ></el-option>
        </el-select>
        <i
          class="el-icon-error close"
          v-show="!allDisabled"
          @click="remove(index)"
        ></i>
      </div>
      <el-button
        type="primary"
        icon="el-icon-plus"
        class="add-btn"
        v-show="!allDisabled && allowAdd"
        :class="{ 'second-btn': level == 2 || level == 3 }"
        @click="appendItem"
        >新增
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Model, Watch } from 'vue-property-decorator';

interface dictProps {
  label?: string;
  value?: string;
  children?: string;
  childLabel?: string;
  childValue?: string;
}

interface valuedictProps {
  firstLevel?: string;
  secondLevel?: string;
  thirdLevel?: string;
}

@Component({
  name: 'dictContainer',
})
export default class dictContainer extends Vue {
  @Prop({ default: '技术特征' }) private title!: string;
  @Prop({ default: 1 }) private level!: number | string;
  @Prop({ default: () => [] }) private data!: Array<Record<string, unknown>>;
  @Prop({ default: '请选择' }) private placeholder!: string;
  @Prop({}) private dictConfig?: dictProps;
  @Prop({}) private valuedictProps?: valuedictProps;
  @Prop({ default: 200 }) private width?: number;
  @Prop({ default: false }) private disabled?: boolean;
  @Prop({ default: () => [false, false, false] })
  private disabledSelect?: Array<boolean>;
  @Prop({ default: false }) private noRepeat?: boolean;
  @Prop({ default: true }) private allowAdd?: boolean;

  @Model('change', { type: Array }) value!: Array<Record<string, unknown>>;

  @Watch('value', { deep: true, immediate: true })
  onValueChange(newValue: Array<Record<string, unknown>>) {
    this.selectedList = newValue;
    this.$nextTick(() => {
      this.resetWidth();
    });
  }

  @Watch('allDisabled')
  onAllDisabledChange() {
    this.$nextTick(() => {
      this.resetWidth();
    });
  }

  get dictProps() {
    return {
      label: 'label',
      value: 'value',
      children: 'children',
      childLabel: '',
      childValue: '',
      ...this.dictConfig,
    };
  }

  get childProps() {
    return {
      label: this.dictProps.childLabel || this.dictProps.label,
      value: this.dictProps.childValue || this.dictProps.value,
    };
  }

  get valueProps() {
    return {
      firstLevel: 'first',
      secondLevel: 'second',
      thirdLevel: 'third',
      ...this.valuedictProps,
    };
  }

  get defaultSelectWidth() {
    return this.width || 300;
  }

  selectedList: Array<Record<string, unknown>> = [];
  allDisabled = true;
  visible = true;
  id = `dict-container${Math.floor(
    (Math.random() + Math.floor(Math.random() * 9 + 1)) * Math.pow(10, 9)
  )}`;

  created() {
    this.appendItem();
  }

  appendItem() {
    let item;
    if (this.level == 2) {
      item = {
        [this.valueProps.firstLevel]: '',
        [this.valueProps.secondLevel]: [],
      };
    } else if (this.level == 3) {
      item = {
        [this.valueProps.firstLevel]: '',
        [this.valueProps.secondLevel]: [],
        [this.valueProps.thirdLevel]: '',
      };
    } else {
      item = { [this.valueProps.firstLevel]: '' };
    }

    this.selectedList.push(item);
  }

  save() {
    // 删除first为空的选择器
    const filter = this.selectedList.filter((item: any) => {
      const first = item[this.valueProps.firstLevel];
      return first !== '';
    });

    this.selectedList = filter;
    if (this.selectedList.length === 0) {
      this.appendItem();
    }

    this.$emit('change', this.selectedList);
    this.allDisabled = true;
  }

  handleChange(value: any, index: number, propName: string) {
    if (propName === this.valueProps.secondLevel) {
      this.$nextTick(() => {
        this.setWidth(index);
      });
    }
    this.$emit('select', value, index, propName);
  }

  handleClear(index: number) {
    const second = this.selectedList[index][this.valueProps.secondLevel];
    const third = this.selectedList[index][this.valueProps.thirdLevel];

    if (Array.isArray(second) && second.length > 0) {
      this.selectedList[index][this.valueProps.secondLevel] = [];
    }

    if (third && third !== '') {
      this.selectedList[index][this.valueProps.thirdLevel] = '';
    }
  }

  disabledFirst(option: Record<string, unknown>) {
    const id = this.dictProps.value;
    const first = this.getLevelData(this.valueProps.firstLevel);
    return first.findIndex((item: any) => item[id] === option[id]) > -1;
  }

  remove(index: number) {
    if (this.selectedList.length === 1) {
      this.$message.warning('最后一项不允许删除！');
      return;
    }
    this.selectedList.splice(index, 1);
  }

  setWidth(index: number) {
    const content = document.querySelector(`#${this.id} .content`);
    if (!content) return;
    let selectWidth;
    const contentxWidth = Number.parseInt(getComputedStyle(content).width);
    const contentPadding = Number.parseInt(
      getComputedStyle(content).paddingLeft
    );
    const maxWidth = contentxWidth - contentPadding * 2;

    const tagListSelector = `#${this.id} .content #select${index} .second-level .el-select__tags .el-tag:not(.v-leave)`;
    const tagsList = document.querySelectorAll(tagListSelector);

    const select = document.querySelector(`#select${index}`) as HTMLElement;
    const defaultWidth = this.defaultSelectWidth;

    const iconSelector = `#${this.id} .content #select${index} .second-level .el-input .el-input__suffix`;
    const icon = document.querySelector(iconSelector) as HTMLElement;
    let iconWidth = 30;

    // 禁用时icon不显示

    if (icon && !isNaN(Number.parseInt(getComputedStyle(icon).width))) {
      iconWidth +=
        Number.parseInt(getComputedStyle(icon).width) +
        Number.parseInt(getComputedStyle(icon).right);
    }

    /* 计算tags总宽度 */
    let tagsWidth = iconWidth + 30;
    for (let i = 0; i < tagsList.length; i++) {
      const tagStyle = getComputedStyle(tagsList[i]);
      const width = Number.parseInt(tagStyle.width) || 0;
      const borderWidth = Number.parseInt(tagStyle.borderWidth) || 0;
      const margin = Number.parseInt(tagStyle.marginLeft) || 0;
      const tagWidth = width + 2 * borderWidth + margin;
      tagsWidth += tagWidth;

      selectWidth = tagsWidth > defaultWidth ? tagsWidth : defaultWidth;
      if (tagsWidth >= maxWidth) {
        selectWidth = maxWidth;
        break;
      }
    }

    if (select) {
      select.style.width = `${selectWidth}px`;
    }
  }

  getLevelData(level: string) {
    const data = this.selectedList.map((item: Record<string, unknown>) => {
      return item[level];
    });
    return data;
  }

  resetWidth() {
    this.selectedList.forEach(
      (select: Record<string, unknown>, index: number) => {
        const second = select[this.valueProps.secondLevel];
        if (Array.isArray(second) && second.length > 0) {
          this.$nextTick(() => {
            this.setWidth(index);
          });
        }
      }
    );
  }
}
</script>

<style lang="scss" scoped>
.dict-container {
  width: 100%;
  border: 1px solid #e2e5ec;
  border-radius: 4px;

  .header {
    height: 32px;
    display: flex;
    background-color: #f6f7fb;
    justify-content: space-around;
    align-items: center;
    padding: 0 10px 0 16px;

    p {
      font-size: 14px;
      font-weight: 500;
      color: #222222;
      line-height: 32px;
      flex-grow: 1;
    }

    .func-btn {
      font-size: 12px;
      height: 20px;
      width: 58px;
      padding: 0 10px;
      border-color: transparent !important;

      &.edit {
        background-color: rgba(#0492ff, 12%) !important;
        color: #ffffff;
      }

      &.save {
        background-color: #0492ff !important;
        color: #ffffff;
      }
    }

    .dropdown {
      line-height: 32px;
      margin: 0 10px;

      i {
        color: #999999;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s;
      }

      .up {
        transform: rotateZ(-180deg);
      }
    }
  }

  .content {
    width: 100%;
    padding: 12px 4px 0 16px;
    display: flex;
    flex-wrap: wrap;

    .select {
      width: 200px;
      position: relative;
      margin-right: 12px;
      margin-bottom: 12px;

      ::v-deep .el-select {
        .el-input {
          & > input {
            font-size: 12px;
            line-height: 18px;
            min-height: 32px !important;
          }

          &.is-disabled {
            & > span.el-input__suffix {
              display: none;
            }

            & > input {
              color: #222222;
            }
          }
        }

        .el-select__tags {
          .el-tag {
            color: #222222;
            background-color: #f2f7fd;

            & .el-tag__close.el-icon-close {
              margin-right: 3px;
              background-color: #cccccc;
              color: #ffffff;
            }
          }
        }
      }

      .hide-border:not(:hover) {
        ::v-deep .el-input:not(.is-focus) input {
          border-bottom-color: transparent;
        }
      }

      .first-level {
        ::v-deep .el-input {
          &::before {
            content: "";
            position: absolute;
            width: 4px;
            height: 20px;
            border-radius: 2px;
            background-color: #0492ff;
            top: 6px;
            left: 4px;
          }

          &.is-disabled {
            & > input {
              background-color: #f2f7fd;
              font-weight: 500;
            }
          }
        }
      }

      .second-level {
        ::v-deep .el-input {
          &.is-disabled > input {
            background-color: #ffffff;
          }
        }
      }

      .third-level {
        ::v-deep .el-input {
          &.is-disabled > input {
            background-color: #f2f7fd;
            font-weight: 400;
          }
        }
      }
    }

    .close {
      position: absolute;
      left: calc(100% - 8px);
      bottom: calc(100% - 8px);
      background-color: #ffffff;

      &::before {
        color: #cccccc;
        cursor: pointer;
      }

      &:hover::before {
        color: #ff5757;
      }
    }

    .add-btn {
      background-color: #f3f7fe !important;
      border-radius: 2px;
      border: 1px dotted #0492ff;
      color: #0492ff;
      margin-bottom: 12px;
    }

    .second-btn {
      width: 64px;
      height: 64px;

      ::v-deep i.el-icon-plus {
        display: block;
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 8px;

        & ~ span {
          margin-left: 0;
        }
      }
    }
  }
}
</style>
