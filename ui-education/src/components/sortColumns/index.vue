<template>
  <span>
    <span @click="innerVisible = true"><slot></slot></span>
    <el-drawer
      :visible="innerVisible"
      :withHeader="false"
      size="270px"
      :append-to-body="true"
      @close="handleClosedDrawer"
    >
      <!-- 标题栏 -->
      <div :style="titleStyle">显示/隐藏列</div>
      <!-- 排序列表 -->
      <sort-table ref="sortTable" v-model="sortColumns" :selection="value"></sort-table>
      <!-- 底部操作栏 -->
      <div style="display: flex; justify-content: center; margin-top: 20px">
        <el-button @click="handleResetSort">重置排序</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </div>
    </el-drawer>
  </span>
</template>

<script>
import { isEqual } from 'lodash';
import { getCache, pickIndex, removeCache, setCache } from './utils';
import SortTable from './sortTable';

/** 升序排列 */
const ascending = (n1, n2) => n1.sortindex - n2.sortindex;

export default {
  name: 'SortColumns',
  components: { SortTable },
  props: {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
    /** 显示列变化时触发 */
    change: Function,
    // 外部空值显示隐藏
    visible: Boolean,
  },
  data() {
    return {
      innerVisible: false,
      /** 排序列表数据 */
      sortColumns: [],
      /** 列排序缓存 */
      sortKeys: {},
      /** 只触发一次data加载 */
      dataMount: false,
    };
  },
  watch: {
    data: {
      handler(newValue, oldValue) {
        if (!this.dataMount && newValue.length > 0 && !isEqual(newValue, oldValue)) {
          this.sortColumns = this.initSortColumns(newValue);
          const showColumnList = this.initShowColumns(this.sortColumns);
          this.dataMount = true;
          this.$emit('change', showColumnList);
          this.$emit('input', showColumnList);
        }
      },
      immediate: true,
    },
    visible: {
      handler(value) {
        this.innerVisible = value;
      },
      immediate: true,
    },
  },
  computed: {
    /** title style */
    titleStyle() {
      return {
        padding: '16px',
        userSelect: 'none',
        color: '#979797',
        width: '270px',
      };
    },
    /** 显示列缓存名 */
    showCacheName() {
      const name = this.name;
      return `${name}_showColumnList`;
    },
    /** 排序列缓存名 */
    sortCacheName() {
      const name = this.name;
      return `${name}_sortColumns`;
    },
  },
  methods: {
    /**
     * 初始化列排序
     */
    initSortColumns(columns) {
      // 获取排序缓存
      const sortColumnsValue = getCache(this.sortCacheName, {});
      this.sortKeys = sortColumnsValue;
      return columns
        .filter(item => item.showList)
        .map((item, index) => {
          // 更新排序字段
          const sortindex = pickIndex(sortColumnsValue[item.prop], index);
          const originIndex = index;
          return { ...item, sortindex, originIndex };
        })
        .sort(ascending);
    },
    /**
     * 初始化显示列
     */
    initShowColumns(columns) {
      // 默认全部显示
      const defaultAll = columns.map(item => item.prop);
      // 获取本地显示列字段
      const showColumnsValue = getCache(this.showCacheName, defaultAll);
      return columns.filter(item => showColumnsValue.includes(item.prop));
    },
    /**
     * 确认显示列
     */
    handleSubmit() {
      // 获取选择的列数据
      const selection = this.$refs.sortTable.getSelection().sort(ascending);
      // 勾选验证
      if (selection.length === 0) {
        this.$notify({
          type: 'warning',
          title: '表格显示列为空',
          message: '请至少选择一列数据',
        });
        return false;
      }
      // 缓存列排序
      const sortColumnsValue = this.sortColumns.reduce((sortObject, item) => {
        sortObject[item.prop] = item.sortindex;
        return sortObject;
      }, {});
      this.sortKeys = sortColumnsValue;
      setCache(this.sortCacheName, sortColumnsValue);
      // 缓存显示列
      const showColumnsValue = selection.map(item => item.prop);
      setCache(this.showCacheName, showColumnsValue);
      // 关闭面板
      this.innerVisible = false;
      // TODO 更新的列表过多时，可能引起视图更新后再次弹出闪现面板，待优化
      // 等待面板关闭视图更新后触发更新操作
      setTimeout(() => {
        this.$nextTick(() => {
          // 更新数据
          this.$emit('change', selection);
          this.$emit('input', selection);
        });
      }, 10);
    },
    /**
     * 关闭抽屉面板
     */
    handleClosedDrawer() {
      // 还原列排序
      const sortColumnsValue = this.sortKeys;
      this.sortColumns = this.sortColumns
        .map((item, index) => {
          const sortindex = pickIndex(sortColumnsValue[item.prop], index);
          return { ...item, sortindex };
        })
        .sort(ascending);
      // 还原显示列
      this.$nextTick(() => {
        const selectionKeys = this.value.map(item => item.prop);
        this.$refs.sortTable.setSelection(selectionKeys);
        // 关闭操作面板
        this.innerVisible = false;
        this.$emit('update:visible', false);
      });
    },
    /**
     * 重置排序
     */
    handleResetSort() {
      // 移除排序缓存
      removeCache(this.sortCacheName);
      // 重置列排序
      this.sortColumns = this.sortColumns
        .map(item => ({ ...item, sortindex: item.originIndex }))
        .sort(ascending);
      // 还原显示列
      this.$nextTick(() => {
        const selectionKeys = this.value.map(item => item.prop);
        this.$refs.sortTable.setSelection(selectionKeys);
      });
    },
  },
};
</script>
