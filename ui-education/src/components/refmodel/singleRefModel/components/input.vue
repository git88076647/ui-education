<template>
  <div class="ref-input-auto-complete">
    <el-input
      v-if="mode === 'edit'"
      :value="innerInputValue"
      :placeholder="placeholder"
      @input="handleChangeInput"
      @focus="handleFocus"
      @blur="handleBlur"
      clearable
    >
      <i slot="suffix" class="el-icon-search" @click="handleClickSearch"></i>
    </el-input>
    <span v-if="showTags" class="ref-input-tags">
      <template v-for="(item, index) in translateItems">
        <span :key="index">
          <el-tag type="info" size="mini" closable @close="removeSelect(item)">
            {{ item[labelName] }}
          </el-tag>
        </span>
      </template>
    </span>
    <template v-if="mode === 'read'">
      <span class="read-only-wrapper" v-if="innerInputValue && innerInputValueWidth > 145">
        <el-tooltip :content="innerInputValue">
          <span class="read-only-content">{{ innerInputValue }}</span>
        </el-tooltip>
        <i class="el-icon-document-copy" :data-clipboard-text="innerInputValue" @click="copy"></i>
      </span>
      <span v-else class="read-only-wrapper">
        <span class="read-only-content">{{ innerInputValue }}</span>
        <i class="el-icon-document-copy" :data-clipboard-text="innerInputValue" @click="copy"></i>
      </span>
    </template>
    <transition name="fade">
      <div class="ref-input-suggest" v-show="showSuggestList">
        <ul class="ref-input-suggest__wrapper">
          <template v-if="loading">
            <div class="loading-data">
              <i class="el-icon-loading"></i>
            </div>
          </template>
          <template v-else-if="options.length === 0">
            <div class="none-data">
              <i class="el-icon-receiving"></i>
              <div>没有数据</div>
            </div>
          </template>
          <el-scrollbar v-else>
            <template v-for="(item, index) in options">
              <li class="ref-input-suggest__item" :key="index" @click="handleSelectItem(item)">
                {{ item[config.label] }}
              </li>
            </template>
          </el-scrollbar>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import { unionBy, remove } from 'lodash';
import ClipboardJS from 'clipboard';
import { showRefName } from '../../utils';
import { getTextWidth } from '../utils';

export default {
  name: 'RefInput',
  props: {
    value: String,
    itemId: Array,
    fetchData: Function,
    config: Object,
    mode: {
      type: String,
      default: 'edit',
    },
    options: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '请输入搜索内容',
    },
    showTags: Boolean,
  },
  watch: {
    value: {
      handler(value) {
        this.innerInputValue = value;
      },
      immediate: true,
    },
    itemId: {
      handler(itemIds) {
        const valueName = this.config.value;
        const labelName = this.config.label;
        Promise.all(itemIds.map(id => showRefName(id, this.fetchData, valueName))).then(items => {
          const validItems = items.filter(item => item !== undefined);
          this.translateItems = validItems;
          this.innerInputValue = validItems.map(item => item[labelName]).join(';');
          this.$emit('update-selected', validItems);
        });
      },
      immediate: true,
    },
  },
  computed: {
    innerInputValueWidth() {
      return getTextWidth(this.innerInputValue);
    },
    valueName() {
      return this.config.value;
    },
    labelName() {
      return this.config.label;
    },
  },
  data() {
    return {
      innerInputValue: undefined,
      showSuggestList: false,
      translateItems: [],
      clipboard: undefined,
    };
  },
  methods: {
    handleChangeInput(value) {
      this.innerInputValue = value;
      this.$emit('input', value);
      this.$emit('change', value);
      if (value === undefined || value === '') {
        this.$emit('clear', void 0);
      }
    },
    handleClickSearch() {
      this.$emit('detail', void 0);
    },
    /** input 聚焦事件 */
    handleFocus() {
      this.showSuggestList = true;
    },
    /** input 失焦事件 */
    handleBlur() {
      this.showSuggestList = false;
      const valueName = this.config.value;
      const labelName = this.config.label;
      const currentLabels = (this.innerInputValue || '').split(';');
      const currentValues = this.itemId;
      // 过滤非法选择项的文本显示
      const matchItems = unionBy(this.options, this.translateItems, valueName).filter(item => {
        const labelEqual = currentLabels.includes(item[labelName]);
        const valueEqual =
          currentValues.length === 0 ? true : currentValues.includes(item[valueName]);
        return labelEqual && valueEqual;
      });
      this.$emit('select', matchItems);
    },
    /** 选择建议项 */
    handleSelectItem(item) {
      this.innerInputValue = item[this.config.label];
      this.$emit('select', [item]);
    },
    /** 复制内容 */
    copy() {
      const clipboard = new ClipboardJS('.el-icon-document-copy');
      clipboard.on('success', e => {
        this.$message.success('复制成功');
        clipboard.destroy();
      });
      clipboard.on('error', e => {
        this.$message.error('复制失败');
        clipboard.destroy();
      });
    },
    /** 移除 tag */
    removeSelect(removeItem) {
      const valueName = this.config.value;
      const labelName = this.config.label;
      const currentLabels = (this.innerInputValue || '').split(';');
      const removeValue = removeItem[valueName];
      const currentValues = remove(this.itemId, id => removeValue !== id);
      console.log(currentValues, this.itemId, removeItem[valueName]);
      // 过滤非法选择项的文本显示
      const matchItems = unionBy(this.options, this.translateItems, valueName).filter(item => {
        const labelEqual = currentLabels.includes(item[labelName]);
        const valueEqual = currentValues.includes(item[valueName]);
        return labelEqual && valueEqual;
      });
      console.log(matchItems);
      this.$emit('select', matchItems);
    },
  },
};
</script>

<style lang="scss">
.ref-input-auto-complete {
  display: inline-block;
  position: relative;

  // 修改 el-input 样式
  .el-input--suffix .el-input__inner {
    padding-right: 20px;
  }
  .el-input--suffix:hover .el-input__inner {
    padding-right: 36px;
  }
  .el-input__suffix-inner {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 12px;
    height: 100%;
    .el-icon-search {
      position: absolute;
    }
    .el-input__clear {
      position: absolute;
      transform: translate3d(-16px, 0px, 0);
    }
  }
  .ref-input-tags {
    position: absolute;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    top: 1px;
    left: 3px;
    padding-left: 5px;
    height: 25px;
    max-width: 140px;
    overflow-y: hidden;
    // 兼容火狐的滚动条样式
    scrollbar-color: rgba(0, 0, 0, 0.2) rgba(255, 255, 255, 0.15);
    scrollbar-width: none;

    & > span {
      background-color: #fff;
      padding-right: 5px;
    }

    &::-webkit-scrollbar {
      width: 3px;
      height: 3px;
    }

    /** 滚动条轨道 */
    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.15);
      border-radius: 13px;
      box-shadow: inset 0 0 5px rgba(37, 37, 37, 0.05);
    }

    /** 滚动条滑块 */
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 1px;
      box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.05);
    }
  }
  // 只读显示
  .read-only {
    &-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      padding: 0px 8px;
      color: #606266;
      background-color: #f2f3f7;
      height: 28px;
      width: 163.33px;
      user-select: none;
      .el-icon-document-copy {
        cursor: pointer;
        color: #0000005b;
      }
    }
    &-content {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  // 搜索建议列表
  .ref-input-suggest {
    position: absolute;
    padding: 12px 0px;
    min-width: 100%;
    background-color: white;
    border-radius: 4px;
    overflow: hidden;
    z-index: 10;
    margin-top: 8px;
    box-shadow: 0 2px 12px 0 #0000003d;

    &__wrapper {
      margin: 0;
      padding: 0;
      max-height: 200px;
      // 滚动条
      .el-scrollbar {
        height: 100%;
      }
      .el-scrollbar__wrap {
        margin-bottom: 0 !important;
        max-height: 168px;
        overflow-x: hidden;
      }
    }
    &__item {
      padding: 0px 8px;
      color: #3f3f3fe5;
      padding: 0px 16px;
      white-space: nowrap;
      cursor: pointer;
      &:hover {
        background-color: #e2e4eb;
      }
    }

    .loading-data,
    .none-data {
      padding-top: 12px;
      text-align: center;
      color: #4a4a4a9c;

      [class^='el-icon'] {
        font-size: 22px;
      }
    }
  }
  // 建议列表动画
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
}
</style>
