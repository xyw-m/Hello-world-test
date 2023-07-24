<template>
  <div class="dict-container" :id="id">
    <div class="header">
      <p>{{ title }}</p>
      <span class="show-operation">
        <i
          class="dms-icon-bianji"
          @click="handleOperation"
          v-show="allDisabled && !disabled"
        ></i>
      </span>
      <el-button
        type="text"
        size="mini"
        v-show="!allDisabled && allowAdd"
        @click="appendItem"
        >新增</el-button
      >
      <el-button
        type="text"
        size="mini"
        v-show="!allDisabled"
        @click="removeAll"
        >清空</el-button
      >
      <el-button type="text" size="mini" v-show="!allDisabled" @click="save"
        >完成</el-button
      >
      <span class="dropdown">
        <i
          class="el-icon-arrow-down"
          :class="{ up: visible }"
          @click="visible = !visible"
        ></i>
      </span>
    </div>
    <div
      class="content"
      v-show="visible"
      :style="{
        justifyContent: selectedList.length === 0 ? 'center' : 'flex-start',
      }"
    >
      <div
        class="select"
        :id="'select' + index"
        v-for="(item, index) in selectedList"
        :key="index"
      >
        <!-- 一级选择器 单选 -->
        <div class="first-level" :style="{ background: primaryColor }">
          <el-select
            v-model="item[valueProps.firstLevel]"
            :placeholder="placeholder"
            :value-key="dictProps.value"
            :disabled="isDisabled(0)"
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
        </div>
        <div
          class="select-container"
          :class="{ 'disabled-container': isDisabled(1) }"
          v-if="level == '2' || level == '3'"
          :style="{ backgroundColor: minorColor }"
        >
          <!-- 二级选择器 多选 -->
          <el-select
            v-model="item[valueProps.secondLevel]"
            v-if="item[valueProps.secondLevel]"
            v-show="!isDisabled(1) || item[valueProps.secondLevel].length !== 0"
            :value-key="childProps.value"
            :placeholder="placeholder"
            :disabled="isDisabled(1)"
            @change="handleChange($event, index, valueProps.secondLevel)"
            :multiple="secondMultiple"
            :class="{ disabled: isDisabled(1) }"
            class="second-level"
            filterable
            clearable
          >
            <el-option
              v-for="op in getSecondOptions(
                item[valueProps.firstLevel][dictProps.value]
              )"
              :key="op[childProps.value]"
              :label="op[childProps.label]"
              :value="op"
            ></el-option>
          </el-select>
          <span
            class="custom-tag second"
            v-show="
              isDisabled(1) &&
              (!item[valueProps.secondLevel] ||
                item[valueProps.secondLevel].length === 0)
            "
          >
            <span>{{ "无" }}</span>
          </span>
          <div
            class="divider"
            :style="{ borderColor: primaryColor }"
            v-if="level == '3' && secondMultiple"
          ></div>
          <!-- 三级选择器 单选 -->
          <el-select
            v-if="level == '3' && secondMultiple"
            v-show="!isDisabled(2)"
            v-model="item[valueProps.thirdLevel]"
            :placeholder="placeholder"
            :value-key="childProps.value"
            :disabled="isDisabled(2)"
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
          <span
            class="custom-tag"
            v-if="level == '3' && secondMultiple && isDisabled(2)"
          >
            <span>{{
              getThirdLabel(
                item[valueProps.firstLevel][dictProps.value],
                item[valueProps.thirdLevel][childProps.value]
              )
            }}</span>
          </span>
        </div>
        <i class="curtain" v-show="!allDisabled"></i>
        <i
          class="dms-icon-cuowu2 close"
          v-show="!allDisabled"
          @click="remove(index)"
        ></i>
      </div>
      <div class="no-data" v-show="selectedList.length === 0">
        <el-image :src="require('./no-data.png')" fit="contain"></el-image>
      </div>
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
  private disabledSelect!: Array<boolean>;
  @Prop({ default: false }) private noRepeat?: boolean;
  @Prop({ default: true }) private allowAdd?: boolean;
  @Prop({ default: true }) private secondMultiple?: boolean;
  @Prop({ default: 'blue' }) private color!: string;

  @Model('change', { type: Array }) value!: Array<Record<string, unknown>>;

  @Watch('value', { deep: true, immediate: true })
  onValueChange(newValue: Array<Record<string, unknown>>) {
    this.selectedList = JSON.parse(JSON.stringify(newValue));
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

  @Watch('disabled')
  onDisabledChange(newValue: boolean) {
    if (newValue) {
      this.allDisabled = true;
    }
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

  get primaryColor(): string {
    const defaults: Record<string, string> = {
      blue: '#5175F4',
      green: '#21BB7E',
      orange: '#F79408',
    };
    return defaults[this.color] ? defaults[this.color] : this.color;
  }

  get minorColor() {
    const r = parseInt(this.primaryColor.substring(1, 3), 16);
    const g = parseInt(this.primaryColor.substring(3, 5), 16);
    const b = parseInt(this.primaryColor.substring(5, 7), 16);
    return `rgba(${r},${g}, ${b}, 0.2)`;
  }

  selectedList: Array<Record<string, unknown>> = [];
  allDisabled = true;
  visible = true;
  id = `dict-container${Math.floor(
    (Math.random() + Math.floor(Math.random() * 9 + 1)) * Math.pow(10, 9)
  )}`;

  appendItem() {
    let item;
    if (this.level == 2) {
      item = {
        [this.valueProps.firstLevel]: '',
        [this.valueProps.secondLevel]: this.secondMultiple ? [] : '',
      };
    } else if (this.level == 3 && this.secondMultiple) {
      item = {
        [this.valueProps.firstLevel]: '',
        [this.valueProps.secondLevel]: this.secondMultiple ? [] : '',
        [this.valueProps.thirdLevel]: '',
      };
    } else {
      item = { [this.valueProps.firstLevel]: '' };
    }

    this.selectedList.push(item);
  }

  save() {
    const filter = this.selectedList.filter((item: any) => {
      const first = item[this.valueProps.firstLevel];
      return first !== '';
    });

    this.selectedList = filter;

    this.$emit('change', this.selectedList);
    this.allDisabled = true;
  }

  handleChange(value: any, index: number, propName: string) {
    if (!this.secondMultiple) return;
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

  handleOperation() {
    this.allDisabled = false;
  }

  disabledFirst(option: Record<string, unknown>) {
    const id = this.dictProps.value;
    const first = this.getLevelData(this.valueProps.firstLevel);
    return first.findIndex((item: any) => item[id] === option[id]) > -1;
  }

  remove(index: number) {
    // if (this.selectedList.length === 1) {
    //   this.$message.warning('最后一项不允许删除！')
    //   return
    // }
    this.selectedList.splice(index, 1);
  }

  removeAll() {
    this.selectedList = [];
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

    const select = document.querySelector(
      `#${this.id} #select${index}`
    ) as HTMLElement;
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
    let tagsWidth = iconWidth + 60;
    for (let i = 0; i < tagsList.length; i++) {
      const tagStyle = getComputedStyle(tagsList[i]);
      const width = Number.parseInt(tagStyle.width) || 0;
      const borderWidth = Number.parseInt(tagStyle.borderWidth) || 0;
      const margin = Number.parseInt(tagStyle.marginRight) || 0;
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
      const selector = `#${this.id} .content #select${index} .second-level .el-select__tags`;
      const tagContainer = document.querySelector(selector) as HTMLElement;
      tagContainer.style.maxWidth = `${selectWidth}px`;
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

  getSecondOptions(key: string) {
    const first = this.data.find((option: any) => {
      const optionKey = option[this.dictProps.value];
      return optionKey === key;
    });
    return first ? first[this.dictProps.children] : [];
  }

  isDisabled(level: number) {
    return this.allDisabled || !!this.disabledSelect[level] || this.disabled;
  }

  getThirdLabel(firstKey: string, thirdKey: string) {
    if (!thirdKey) return '无';
    const options = this.getSecondOptions(firstKey) as any;
    const option = options.find(
      (op: Record<string, unknown>) => op[this.childProps.value] === thirdKey
    );
    return option[this.childProps.label] || '无';
  }
}
</script>

<style lang="scss" scoped>
.dict-container {
  width: 100%;
  border: 1px solid #e2e5ec;
  border-radius: 4px;

  .header {
    height: 40px;
    display: flex;
    border-radius: 0 0 2px 2px;
    background-color: #fafafa;
    justify-content: space-around;
    align-items: center;
    padding: 0 10px 0 16px;
    border-bottom: 1px solid #e9e9e9;

    p {
      font-size: 14px;
      font-weight: bold;
      color: #222222;
      line-height: 50px;
      flex-grow: 1;
      margin-bottom: 0;
    }

    .show-operation {
      i {
        font-size: 13px;
        color: #555555;
        line-height: 40px;
        cursor: pointer;
      }
    }

    .dropdown {
      line-height: 40px;
      margin: 0 15px;

      i {
        color: #555555;
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

    .no-data {
      margin-bottom: 10px;
    }

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
            min-height: 28px !important;
            color: #555555;
            border-color: #adadad;
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
            color: #555555;
            background-color: #e9edfa;
            padding: 1px 5px;
            height: 22px;

            & .el-tag__close.el-icon-close {
              margin-right: 3px;
              background-color: #adadad;
              color: #ffffff;
            }
          }
        }
      }

      .first-level {
        height: 40px;
        font-size: 14px;
        background: #5175f4;
        padding: 6px 12px;
        border-radius: 2px;
        ::v-deep .el-input {
          &.is-disabled {
            & > input {
              background-color: transparent;
              font-weight: 500;
              padding-left: 2px;
              border: none;
              color: #ffffff;
              font-size: 14px;
            }
          }
        }
      }

      .select-container {
        opacity: 0.8;
        padding: 8px 12px;
        &.disabled-container {
          padding: 4px 12px;
        }
        .divider {
          border-top: 1px dotted #0492ff;
          margin: 6px 0;
        }
        .custom-tag {
          background-color: #ffffff;
          height: 28px;
          padding: 4px 10px;
          border-radius: 14px;
          display: inline-block;
          margin: 2px 0;
          line-height: 1.15;
          &.second {
            margin: 6px 0;
          }
          span {
            font-size: 12px;
            color: #555555;
            line-height: 20px;
          }
        }
      }

      .second-level {
        ::v-deep .el-input {
          &.is-disabled > input {
            border: none;
            background-color: transparent;
            padding-left: 14px !important;
          }
        }
        &.disabled ::v-deep .el-select__tags {
          .el-tag {
            background-color: #ffffff;
            height: 28px;
            padding: 4px 10px;
            border-radius: 14px;
            margin-left: 0;
            margin-right: 6px;
            margin-top: 4px;
            &:first-child {
              margin-left: 0;
            }
          }
          input {
            display: none;
          }
        }
      }

      .third-level {
        ::v-deep .el-input {
          &.is-disabled > input {
            background-color: #f2f7fd !important;
            font-weight: 400;
          }
        }
      }
    }

    .close {
      position: absolute;
      left: calc(100% - 8px);
      bottom: calc(100% - 8px);
      font-size: 13px;

      &::before {
        color: #ff5757;
        cursor: pointer;
      }
    }

    .curtain {
      position: absolute;
      left: calc(100% - 5px);
      bottom: calc(100% - 5px);
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #ffffff;
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
