<template>
  <div class="ref-tool-bar">
    <!-- 搜索字段选择 -->
    <el-select v-model="currentField">
      <template v-for="(item, index) in options">
        <el-option :key="index" :label="item.label" :value="item.value || item.prop"></el-option>
      </template>
    </el-select>
    <!-- 搜索框 -->
    <el-input v-model="innerSearchValue" @keypress.native.enter="handleSearch" clearable></el-input>
    <!-- 搜索按钮 -->
    <el-button type="primary" @click="handleSearch">搜索</el-button>
    <!-- 显示停用数据 -->
    <el-checkbox v-if="showStopData" v-model="filterStopData" @change="handleChangeFilterData"
      >显示停用数据</el-checkbox
    >
    <!-- 查看选择数据时，工具栏蒙层 -->
    <div v-show="tableType === 'check'" class="disabled-mask"></div>
  </div>
</template>

<script>
export default {
  name: 'RefToolBar',
  props: {
    options: {
      type: Array,
      default: () => [{ value: 'searchValue', label: '模糊搜索' }],
    },
    defaultField: {
      type: String,
      default: 'searchValue',
    },
    showStopData: {
      type: Boolean,
      default: false,
    },
    searchValue: String,
    tableType: String,
  },
  watch: {
    searchValue: {
      handler(content) {
        this.innerSearchValue = content;
      },
      immediate: true,
    },
  },
  data() {
    return {
      innerSearchValue: undefined,
      currentField: this.defaultField,
      filterStopData: false,
    };
  },
  methods: {
    handleChangeFilterData(checked) {
      const searchParam = {
        [this.currentField]: this.innerSearchValue,
        status: checked || this.currentField === 'id' ? undefined : '0',
      };
      this.$emit('search', searchParam);
    },
    handleSearch() {
      const searchParam = {
        [this.currentField]: this.innerSearchValue,
        status: this.filterStopData || this.currentField === 'id' ? undefined : '0',
      };
      this.$emit('search', searchParam);
    },
  },
};
</script>

<style lang="scss">
.ref-tool-bar {
  min-height: 29px;
  margin-bottom: 16px;
  position: relative;

  & > * + * {
    margin-left: 8px;
  }

  .disabled-mask {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.5);
  }
}
</style>
