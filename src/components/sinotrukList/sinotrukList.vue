<template>
  <ul class="list-container">
    <li
      v-for="(item, index) in dataSource"
      :key="index"
      class="list-item"
      :class="`${type} ${size}`"
    >
      <slot name="prefix" :item="item"></slot>
      <div class="item-content">
        <slot name="content" :item="item">
          <span class="content-text"
            ><a>{{
              isPropertyExist(item, "content") ? item.content : item
            }}</a></span
          >
        </slot>
      </div>
      <slot name="suffix" :item="item"></slot>
    </li>
  </ul>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'sinotrukList',
})
export default class sinotrukList extends Vue {
  @Prop({ default: () => [] }) private data!: Array<unknown>;
  @Prop({ default: 'common' }) private type!: string;
  @Prop({ default: 'middle' }) private size!: string;

  get dataSource() {
    if (this.data.includes(null) || this.data.includes(undefined)) {
      console.log(
        'sinotruk-list: Null or Undefined Value found in the data, Please check the data prop.',
      );
    }
    return this.data;
  }

  isPropertyExist(obj: any, property: string): boolean {
    if (!obj) {
      return false;
    }
    if (
      typeof obj !== 'object' ||
      !Object.prototype.hasOwnProperty.call(obj, property)
    ) {
      return false;
    } else {
      if (obj[property] == null || obj[property] == undefined) {
        console.log(
          `sinotruk-list: Null or Undefined Value found in the Property[${property}], Please check the Property.`,
        );
      }
      return true;
    }
  }
}
</script>
<style lang="scss" scoped>
@mixin border {
  border-bottom: 1px solid #e1e1e1;
  margin: 0 16px;
  &:first-child {
    border-top: 1px solid #e1e1e1;
  }
}
.list-container {
  width: 100%;
  list-style-type: none;
  padding-inline-start: 0;
  .list-item {
    position: relative;
    text-align: left;
    .item-content {
      // max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      a {
        color: #000000;
      }
      a:hover {
        color: #0a7cff;
        text-decoration: underline;
      }
    }
  }
}
.small {
  line-height: 32px;
  font-size: 12px;
}
.middle {
  line-height: 48px;
  font-size: 14px;
}
.large {
  line-height: 56px;
  font-size: 16px;
}
.noBorder {
  .item-content {
    padding: 0 16px 0 32px;
    .content-text {
      position: relative;
      &::before {
        content: "";
        position: absolute;
        width: 4px;
        height: 4px;
        background-color: #000000;
        border-radius: 50%;
        top: 0.4em;
        left: -16px;
      }
      &:hover::before {
        background-color: #0a7cff;
      }
    }
  }
}
.common {
  @include border;
  padding: 0 8px;
}
.zebra {
  @include border;
  padding: 0 16px;
  &:nth-child(odd) {
    background-color: #f8f8f8;
  }
}
.card {
  background-color: #f8f8f8;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  margin: 0 16px 8px 16px;
  padding: 0 16px;
  font-weight: bold;
  &:last-child {
    margin-bottom: 0;
  }
  &:hover {
    border-color: #0a7cff;
    cursor: pointer;
    .item-content {
      a {
        color: #0a7cff;
      }
    }
  }
  .item-content {
    a:hover {
      text-decoration: none !important;
    }
  }
}
</style>
