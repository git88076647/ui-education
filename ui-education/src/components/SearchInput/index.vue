<template>
  <div class="search-input" ref="searchInput">
    <input
      ref="input"
      v-show="!collapsed"
      type="text"
      class="search-input__inner"
      :placeholder="placeholder"
      v-model="value"
      @keypress.enter="searchEvents"
    />
    <span
      v-if="collapsed"
      class="search-input__btn"
      style="border-radius: 3px"
      @click="openSearchPanel"
    >
      {{ btnText }}
    </span>
    <span v-else class="search-input__btn el-icon-search" @click="searchEvents"></span>
  </div>
</template>

<script>
export default {
  name: 'search-input',
  props: {
    placeholder: {
      type: String,
      default: '请输入内容',
    },
    btnText: {
      type: String,
      default: '搜索',
    },
  },
  data() {
    return {
      value: undefined,
      collapsed: true,
    };
  },
  methods: {
    /** 监听点击事件，折叠搜索面板 */
    closeSearchPanel(e) {
      if (this.$refs.searchInput && !this.$refs.searchInput.contains(e.target)) {
        this.collapsed = true;
        this.value = undefined;
      }
    },
    /** 搜索事件 */
    searchEvents() {
      this.$emit('search', this.value);
    },
    /** 打开搜索面板 */
    openSearchPanel() {
      this.collapsed = false;
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
  },
  mounted() {
    document.addEventListener('click', this.closeSearchPanel);
  },
  destroyed() {
    document.removeEventListener('click', this.closeSearchPanel);
  },
};
</script>

<style lang="scss" scoped>
.search-input {
  display: inline-block;
  border: 1px solid #dedede;
  border-radius: 4px;
  color: #6e6e6e;
  font-size: 12px;

  &:hover {
    border: 1px solid #ccc;
  }

  &__btn {
    display: inline-block;
    height: 26px;
    line-height: 26px;
    font-size: 14px;
    background-color: #efefef;
    padding: 0px 12px;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    cursor: pointer;
  }

  &__inner {
    box-sizing: border-box;
    border: 0px;
    outline: none;
    padding: 0px 8px;
    height: 26px;
    line-height: 26px;
    font-size: inherit;
    border-radius: 4px;
  }
}
</style>
